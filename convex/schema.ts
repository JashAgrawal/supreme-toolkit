import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Chat rooms
  chatRooms: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    type: v.union(v.literal("public"), v.literal("private"), v.literal("direct")),
    createdBy: v.string(),
    participants: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastMessageAt: v.optional(v.number()),
    lastMessage: v.optional(v.string()),
    isArchived: v.boolean(),
    settings: v.optional(v.object({
      maxParticipants: v.optional(v.number()),
      allowFileUploads: v.boolean(),
      allowReactions: v.boolean(),
    })),
  })
    .index("by_type", ["type"])
    .index("by_created_by", ["createdBy"])
    .index("by_last_message", ["lastMessageAt"]),

  // Chat messages
  chatMessages: defineTable({
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
    createdAt: v.number(),
    updatedAt: v.number(),
    editedAt: v.optional(v.number()),
    reactions: v.optional(v.array(v.object({
      emoji: v.string(),
      userId: v.id("users"),
    }))),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_created_at", ["createdAt"]),

  // User presence
  chatPresence: defineTable({
    roomId: v.id("chatRooms"),
    userId: v.id("users"),
    name: v.string(),
    avatar: v.optional(v.string()),
    onlineAt: v.number(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_room", ["roomId"])
    .index("by_user", ["userId"])
    .index("by_user_room", ["userId", "roomId"]),

  // Users (simplified schema, would typically be more complex)
  users: defineTable({
    name: v.string(),
    email: v.string(),
    avatar: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("online"),
      v.literal("offline"),
      v.literal("away")
    )),
    lastSeen: v.optional(v.number()),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"]),

  // Waitlist
  waitlist: defineTable({
    email: v.string(),
    name: v.string(),
    referralCode: v.optional(v.string()),
    status: v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected")),
    position: v.number(),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      utm_campaign: v.optional(v.string()),
      utm_source: v.optional(v.string()),
      utm_medium: v.optional(v.string()),
    })),
    approvedAt: v.optional(v.number()),
    approvedBy: v.optional(v.id("users")),
    rejectedBy: v.optional(v.id("users")),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_position", ["position"])
    .index("by_referral", ["referralCode"]),

  // Feedback
  feedback: defineTable({
    type: v.union(v.literal("bug"), v.literal("feature"), v.literal("improvement"), v.literal("other")),
    title: v.string(),
    description: v.string(),
    rating: v.optional(v.number()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
    status: v.union(
      v.literal("new"),
      v.literal("in_review"),
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    assignedTo: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
    screenshot: v.optional(v.string()),
    browserInfo: v.optional(v.object({
      userAgent: v.string(),
      url: v.string(),
      viewport: v.object({
        width: v.number(),
        height: v.number(),
      }),
    })),
    metadata: v.optional(v.object({
      userId: v.optional(v.string()),
      sessionId: v.optional(v.string()),
      version: v.optional(v.string()),
    })),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_at", ["createdAt"]),

  // Support Tickets
  supportTickets: defineTable({
    title: v.string(),
    description: v.string(),
    status: v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("waiting_for_customer"),
      v.literal("resolved"),
      v.literal("closed")
    ),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    category: v.string(),
    createdBy: v.id("users"),
    assignedTo: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
    resolvedAt: v.optional(v.number()),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_category", ["category"])
    .index("by_assigned_to", ["assignedTo"])
    .index("by_created_by", ["createdBy"])
    .index("by_created_at", ["createdAt"]),

  // Analytics
  analytics: defineTable({
    event: v.string(),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    properties: v.optional(v.object({})),
    metadata: v.optional(v.object({
      userAgent: v.optional(v.string()),
      ip: v.optional(v.string()),
      referrer: v.optional(v.string()),
      url: v.optional(v.string()),
    })),
    createdAt: v.number(),
  })
    .index("by_event", ["event"])
    .index("by_user", ["userId"])
    .index("by_session", ["sessionId"])
    .index("by_created_at", ["createdAt"]),

  // Support Comments
  supportComments: defineTable({
    ticketId: v.id("supportTickets"),
    content: v.string(),
    authorId: v.id("users"),
    isInternal: v.boolean(),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
    }))),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_ticket", ["ticketId"])
    .index("by_author", ["authorId"])
    .index("by_created_at", ["createdAt"]),
});