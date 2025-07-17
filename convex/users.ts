import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// USER QUERIES
// ============================================================================

export const getUser = query({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
  },
});

export const getUsers = query({
  args: {
    status: v.optional(v.union(v.literal("online"), v.literal("offline"), v.literal("away"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let users;
    if (args.status) {
      users = await ctx.db
        .query("users")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .collect();
    } else {
      users = await ctx.db.query("users").collect();
    }
    if (args.limit) {
      return users.slice(0, args.limit);
    }
    return users;
  },
});

// ============================================================================
// USER MUTATIONS
// ============================================================================

export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    status: v.optional(v.union(v.literal("online"), v.literal("offline"), v.literal("away"))),
    lastSeen: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Check if user already exists
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    if (existingUser) {
      throw new Error("User with this email already exists");
    }
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      avatar: args.avatar,
      status: args.status || "offline",
      lastSeen: args.lastSeen,
    });
  },
});

export const updateUser = mutation({
  args: {
    id: v.id("users"),
    name: v.optional(v.string()),
    avatar: v.optional(v.string()),
    status: v.optional(v.union(v.literal("online"), v.literal("offline"), v.literal("away"))),
    lastSeen: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const user = await ctx.db.get(id);
    if (!user) {
      throw new Error("User not found");
    }
    return await ctx.db.patch(id, updates);
  },
});

export const updateUserLastSeen = mutation({
  args: { id: v.id("users"), lastSeen: v.number() },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    return await ctx.db.patch(args.id, {
      lastSeen: args.lastSeen,
    });
  },
});

export const deleteUser = mutation({
  args: { id: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.id);
    if (!user) {
      throw new Error("User not found");
    }
    // Instead of deleting, we'll set status to offline
    return await ctx.db.patch(args.id, {
      status: "offline",
    });
  },
});

// ============================================================================
// USER UTILITIES
// ============================================================================

export const getUserStats = query({
  args: {},
  handler: async (ctx) => {
    const users = await ctx.db.query("users").collect();
    const stats = {
      total: users.length,
      online: users.filter(u => u.status === "online").length,
      offline: users.filter(u => u.status === "offline").length,
      away: users.filter(u => u.status === "away").length,
    };
    return stats;
  },
});

export const searchUsers = query({
  args: {
    searchTerm: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const users = await ctx.db.query("users").collect();
    const searchTerm = args.searchTerm.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.email.toLowerCase().includes(searchTerm) ||
      (user.name && user.name.toLowerCase().includes(searchTerm))
    );
    if (args.limit) {
      return filteredUsers.slice(0, args.limit);
    }
    return filteredUsers;
  },
});
