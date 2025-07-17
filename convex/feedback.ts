import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// FEEDBACK QUERIES
// ============================================================================

export const getFeedback = query({
  args: { id: v.id("feedback") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) return null;

    // Get assignee info if assigned
    const assignee = feedback.assignedTo ? await ctx.db.get(feedback.assignedTo) : null;

    return {
      ...feedback,
      assignee,
    };
  },
});

export const getFeedbackEntries = query({
  args: {
    type: v.optional(v.union(v.literal("bug"), v.literal("feature"), v.literal("improvement"), v.literal("other"))),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in_review"),
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    )),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    assignedTo: v.optional(v.id("users")),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryWithIndex;
    if (args.type !== undefined) {
      queryWithIndex = ctx.db.query("feedback").withIndex("by_type", (q) => q.eq("type", args.type as "bug" | "feature" | "improvement" | "other"));
    } else if (args.status !== undefined) {
      queryWithIndex = ctx.db.query("feedback").withIndex("by_status", (q) => q.eq("status", args.status as "new" | "in_review" | "planned" | "in_progress" | "completed" | "rejected"));
    } else if (args.priority !== undefined) {
      queryWithIndex = ctx.db.query("feedback").withIndex("by_priority", (q) => q.eq("priority", args.priority as "low" | "medium" | "high"));
    } else if (args.assignedTo !== undefined) {
      queryWithIndex = ctx.db.query("feedback").withIndex("by_assigned_to", (q) => q.eq("assignedTo", args.assignedTo));
    } else {
      queryWithIndex = ctx.db.query("feedback").withIndex("by_created_at");
    }
    let feedback = await queryWithIndex.collect();
    feedback = feedback.sort((a, b) => b.createdAt - a.createdAt);
    if (args.offset) {
      feedback = feedback.slice(args.offset);
    }
    if (args.limit) {
      feedback = feedback.slice(0, args.limit);
    }
    const enrichedFeedback = await Promise.all(
      feedback.map(async (item) => {
        const assignee = item.assignedTo ? await ctx.db.get(item.assignedTo) : null;
        return {
          ...item,
          assignee,
        };
      })
    );
    return enrichedFeedback;
  },
});

export const getFeedbackStats = query({
  args: {
    timeRange: v.optional(v.number()), // Days to look back
  },
  handler: async (ctx, args) => {
    let feedback = await ctx.db.query("feedback").collect();

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      feedback = feedback.filter(f => f.createdAt >= cutoffTime);
    }

    const stats = {
      total: feedback.length,
      byType: {
        bug: feedback.filter(f => f.type === "bug").length,
        feature: feedback.filter(f => f.type === "feature").length,
        improvement: feedback.filter(f => f.type === "improvement").length,
        other: feedback.filter(f => f.type === "other").length,
      },
      byStatus: {
        new: feedback.filter(f => f.status === "new").length,
        inReview: feedback.filter(f => f.status === "in_review").length,
        planned: feedback.filter(f => f.status === "planned").length,
        inProgress: feedback.filter(f => f.status === "in_progress").length,
        completed: feedback.filter(f => f.status === "completed").length,
        rejected: feedback.filter(f => f.status === "rejected").length,
      },
      byPriority: {
        low: feedback.filter(f => f.priority === "low").length,
        medium: feedback.filter(f => f.priority === "medium").length,
        high: feedback.filter(f => f.priority === "high").length,
      },
      averageRating: 0,
    };

    // Calculate average rating
    const ratedFeedback = feedback.filter(f => f.rating !== undefined);
    if (ratedFeedback.length > 0) {
      const totalRating = ratedFeedback.reduce((sum, f) => sum + (f.rating || 0), 0);
      stats.averageRating = Math.round((totalRating / ratedFeedback.length) * 10) / 10;
    }

    return stats;
  },
});

export const searchFeedback = query({
  args: {
    searchTerm: v.string(),
    type: v.optional(v.union(v.literal("bug"), v.literal("feature"), v.literal("improvement"), v.literal("other"))),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in_review"),
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    )),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let feedback = await ctx.db.query("feedback").collect();
    if (args.type) {
      feedback = feedback.filter(f => f.type === args.type);
    }
    if (args.status) {
      feedback = feedback.filter(f => f.status === args.status);
    }
    const searchTerm = args.searchTerm.toLowerCase();
    const filteredFeedback = feedback.filter(item => 
      item.title.toLowerCase().includes(searchTerm) ||
      item.description.toLowerCase().includes(searchTerm) ||
      (item.email && item.email.toLowerCase().includes(searchTerm)) ||
      (item.name && item.name.toLowerCase().includes(searchTerm)) ||
      (item.tags ?? []).some(tag => tag.toLowerCase().includes(searchTerm))
    );
    const sortedFeedback = filteredFeedback.sort((a, b) => b.createdAt - a.createdAt);
    const enrichedFeedback = await Promise.all(
      sortedFeedback.map(async (item) => {
        const assignee = item.assignedTo ? await ctx.db.get(item.assignedTo) : null;
        return {
          ...item,
          assignee,
        };
      })
    );
    return args.limit ? enrichedFeedback.slice(0, args.limit) : enrichedFeedback;
  },
});

// ============================================================================
// FEEDBACK MUTATIONS
// ============================================================================

export const createFeedback = mutation({
  args: {
    type: v.union(v.literal("bug"), v.literal("feature"), v.literal("improvement"), v.literal("other")),
    title: v.string(),
    description: v.string(),
    rating: v.optional(v.number()),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("feedback", {
      type: args.type,
      title: args.title.trim(),
      description: args.description.trim(),
      rating: args.rating,
      email: args.email?.toLowerCase(),
      name: args.name,
      status: "new",
      priority: "medium", // Default priority
      tags: args.tags || [],
      screenshot: args.screenshot,
      browserInfo: args.browserInfo,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateFeedback = mutation({
  args: {
    id: v.id("feedback"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("new"),
      v.literal("in_review"),
      v.literal("planned"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("rejected")
    )),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"))),
    assignedTo: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const feedback = await ctx.db.get(id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteFeedback = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});

export const assignFeedback = mutation({
  args: {
    id: v.id("feedback"),
    assignedTo: v.id("users"),
  },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    const user = await ctx.db.get(args.assignedTo);
    if (!user) {
      throw new Error("User not found");
    }

    return await ctx.db.patch(args.id, {
      assignedTo: args.assignedTo,
      status: feedback.status === "new" ? "in_review" : feedback.status,
      updatedAt: Date.now(),
    });
  },
});

export const unassignFeedback = mutation({
  args: { id: v.id("feedback") },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }

    return await ctx.db.patch(args.id, {
      assignedTo: undefined,
      updatedAt: Date.now(),
    });
  },
});

export const addFeedbackTag = mutation({
  args: {
    id: v.id("feedback"),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }
    const tag = args.tag.trim().toLowerCase();
    if (!(feedback.tags ?? []).includes(tag)) {
      return await ctx.db.patch(args.id, {
        tags: [...(feedback.tags ?? []), tag],
        updatedAt: Date.now(),
      });
    }
    return feedback;
  },
});

export const removeFeedbackTag = mutation({
  args: {
    id: v.id("feedback"),
    tag: v.string(),
  },
  handler: async (ctx, args) => {
    const feedback = await ctx.db.get(args.id);
    if (!feedback) {
      throw new Error("Feedback not found");
    }
    const tag = args.tag.trim().toLowerCase();
    return await ctx.db.patch(args.id, {
      tags: (feedback.tags ?? []).filter(t => t !== tag),
      updatedAt: Date.now(),
    });
  },
});
