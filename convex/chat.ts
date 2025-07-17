import { mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { Id } from "./_generated/dataModel";

// ============================================================================
// CHAT ROOM OPERATIONS
// ============================================================================

/**
 * Create a new chat room
 * Note: The schema defines createdBy and participants as strings, not IDs.
 * This is maintained here, but for better data integrity, consider changing
 * them to v.id("users") in the schema.
 */
export const createRoom = mutation({
  args: {
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("public"), v.literal("private"), v.literal("direct")),
    createdBy: v.string(), // As per schema
    participants: v.array(v.string()), // As per schema
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const roomId = await ctx.db.insert("chatRooms", {
      name: args.name,
      description: args.description,
      type: args.type,
      createdBy: args.createdBy,
      participants: args.participants,
      createdAt: now,
      updatedAt: now,
      lastMessageAt: now,
      isArchived: false,
      // Default settings as per schema
      settings: {
        allowFileUploads: true,
        allowReactions: true,
      }
    });

    // It's better to read the document back to ensure consistency
    const newRoom = await ctx.db.get(roomId);
    return newRoom;
  },
});

/**
 * Get a chat room by ID
 * FIX: Changed id argument from v.string() to v.id("chatRooms") to match schema.
 */
export const getRoom = query({
  args: {
    id: v.id("chatRooms"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/**
 * List all chat rooms
 * FIX: Rewrote query logic to correctly use a single index and perform filtering post-fetch.
 * The original code was chaining .withIndex() which is not valid.
 */
export const listRooms = query({
  args: {
    type: v.optional(v.union(v.literal("public"), v.literal("private"), v.literal("direct"))),
    userId: v.optional(v.string()), // userId is a string in the participants array per schema
  },
  handler: async (ctx, args) => {
    // Fetch rooms sorted by the most recent message. This is the primary index.
    const rooms = await ctx.db
      .query("chatRooms")
      .withIndex("by_last_message")
      .order("desc")
      .collect();

    // Perform filtering in code after fetching with the index.
    let filteredRooms = rooms;

    if (args.type) {
      filteredRooms = filteredRooms.filter(room => room.type === args.type);
    }

    if (args.userId) {
      filteredRooms = filteredRooms.filter(room => room.participants.includes(args.userId ?? ""));
    }

    return filteredRooms;
  },
});


/**
 * Join a chat room
 * FIX: Changed roomId from v.string() to v.id("chatRooms").
 */
export const joinRoom = mutation({
  args: {
    roomId: v.id("chatRooms"),
    userId: v.string(), // participants array stores strings
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    if (room.participants.includes(args.userId)) {
      return room; // User is already in the room
    }

    const updatedParticipants = [...room.participants, args.userId];
    
    await ctx.db.patch(args.roomId, {
      participants: updatedParticipants,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.roomId);
  },
});

/**
 * Leave a chat room
 * FIX: Changed roomId from v.string() to v.id("chatRooms").
 */
export const leaveRoom = mutation({
  args: {
    roomId: v.id("chatRooms"),
    userId: v.string(), // participants array stores strings
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");

    const updatedParticipants = room.participants.filter(id => id !== args.userId);
    
    await ctx.db.patch(args.roomId, {
      participants: updatedParticipants,
      updatedAt: Date.now(),
    });

    return await ctx.db.get(args.roomId);
  },
});

// ============================================================================
// CHAT MESSAGE OPERATIONS
// ============================================================================

/**
 * Send a new message
 * FIX: Changed argument types for roomId, userId, and replyTo to match the schema.
 * FIX: Used ctx.db.get() for more efficient user lookup.
 * FIX: Corrected participant check to compare string ID with string array.
 */
export const sendMessage = mutation({
  args: {
    roomId: v.id("chatRooms"),
    userId: v.id("users"),
    content: v.string(),
    type: v.union(
      v.literal("text"),
      v.literal("image"),
      v.literal("file"),
      v.literal("system")
    ),
    metadata: v.optional(v.any()),
    replyTo: v.optional(v.id("chatMessages")),
  },
  handler: async (ctx, args) => {
    const room = await ctx.db.get(args.roomId);
    if (!room) throw new Error("Room not found");
    
    // The `participants` array stores the string representation of user IDs.
    if (!room.participants.includes(args.userId)) {
      throw new Error("User is not a participant in this room");
    }

    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    const now = Date.now();
    const messageId = await ctx.db.insert("chatMessages", {
      roomId: args.roomId,
      userId: args.userId,
      content: args.content,
      type: args.type,
      metadata: args.metadata,
      replyTo: args.replyTo,
      createdAt: now,
      updatedAt: now,
    });

    await ctx.db.patch(args.roomId, {
      lastMessageAt: now,
      lastMessage: args.content,
      updatedAt: now,
    });
    
    const message = await ctx.db.get(messageId);

    return {
      ...message,
      user: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
    };
  },
});


/**
 * List messages for a room
 * FIX: Changed roomId argument to v.id("chatRooms").
 * FIX: Removed inefficient post-fetch filtering. Using cursors would be a further optimization.
 * FIX: Optimized user data fetching to avoid N+1 queries.
 */
export const listMessages = query({
  args: {
    roomId: v.id("chatRooms"),
    // Pagination can be improved with cursors, but this matches original logic.
    limit: v.optional(v.number()), 
  },
  handler: async (ctx, args) => {
    const messages = await ctx.db.query("chatMessages")
      .withIndex("by_room", q => q.eq("roomId", args.roomId))
      .order("desc")
      .take(args.limit || 50);

    // Fetch unique user data efficiently
    const userIds = [...new Set(messages.map(msg => msg.userId))];
    const users = await Promise.all(
      userIds.map(userId => ctx.db.get(userId))
    );
    const userMap = new Map(users.filter(Boolean).map(user => [user?._id, user]));

    const messagesWithUsers = messages.map(msg => {
      const user = userMap.get(msg.userId);
      return {
        ...msg,
        user: user ? {
          _id: user._id,
          name: user.name,
          avatar: user.avatar,
        } : undefined,
      };
    });

    return messagesWithUsers.reverse(); // chronological order
  },
});

/**
 * Edit a message
 * FIX: Changed id and userId arguments to match schema ID types.
 */
export const editMessage = mutation({
  args: {
    id: v.id("chatMessages"),
    userId: v.id("users"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    if (message.userId !== args.userId) {
      throw new Error("You can only edit your own messages");
    }

    await ctx.db.patch(args.id, {
      content: args.content,
      editedAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return await ctx.db.get(args.id);
  },
});

/**
 * Delete a message
 * FIX: Changed id and userId arguments to match schema ID types.
 */
export const deleteMessage = mutation({
  args: {
    id: v.id("chatMessages"),
    userId: v.id("users"),
  },
  handler: async (ctx, args) => {
    const message = await ctx.db.get(args.id);
    if (!message) throw new Error("Message not found");

    if (message.userId !== args.userId) {
      throw new Error("You can only delete your own messages");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ============================================================================
// USER OPERATIONS
// ============================================================================

/**
 * List all chat users
 */
export const listUsers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});

/**
 * Update user status
 * FIX: Changed userId argument to v.id("users").
 */
export const updateUserStatus = mutation({
  args: {
    userId: v.id("users"),
    status: v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away")
    ),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (!user) throw new Error("User not found");

    await ctx.db.patch(args.userId, {
      status: args.status,
      lastSeen: Date.now(),
    });

    return await ctx.db.get(args.userId);
  },
});

// ============================================================================
// PRESENCE OPERATIONS
// ============================================================================

/**
 * Track user presence in a room
 * FIX: Changed roomId and userId arguments to match schema ID types.
 */
export const trackPresence = mutation({
  args: {
    roomId: v.id("chatRooms"),
    userId: v.id("users"),
    name: v.string(),
    avatar: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (!(await ctx.db.get(args.roomId))) {
        throw new Error("Room not found");
    }

    const existingPresence = await ctx.db.query("chatPresence")
      .withIndex("by_user_room", q => 
        q.eq("userId", args.userId).eq("roomId", args.roomId)
      )
      .first();

    const now = Date.now();
    if (existingPresence) {
      await ctx.db.patch(existingPresence._id, {
        onlineAt: now,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("chatPresence", {
        roomId: args.roomId,
        userId: args.userId,
        name: args.name,
        avatar: args.avatar,
        onlineAt: now,
        createdAt: now,
        updatedAt: now,
      });
    }

    return { success: true };
  },
});

/**
 * Get online users in a room
 * FIX: Changed roomId argument to v.id("chatRooms").
 */
export const getOnlineUsers = query({
  args: {
    roomId: v.id("chatRooms"),
    timeoutSeconds: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const timeoutMs = (args.timeoutSeconds || 60) * 1000;
    const cutoffTime = Date.now() - timeoutMs;
    
    return await ctx.db.query("chatPresence")
      .withIndex("by_room", q => q.eq("roomId", args.roomId))
      .filter(q => q.gt(q.field("onlineAt"), cutoffTime))
      .collect();
  },
});