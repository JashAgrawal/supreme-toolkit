import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// SUPPORT TICKET QUERIES
// ============================================================================

export const getTicket = query({
  args: { id: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.id);
    if (!ticket) return null;

    // Get creator and assignee info
    const creator = await ctx.db.get(ticket.createdBy);
    const assignee = ticket.assignedTo ? await ctx.db.get(ticket.assignedTo) : null;

    return {
      ...ticket,
      creator,
      assignee,
    };
  },
});

export const getTickets = query({
  args: {
    status: v.optional(v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("waiting_for_customer"),
      v.literal("resolved"),
      v.literal("closed")
    )),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    category: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    createdBy: v.optional(v.id("users")),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryWithIndex;
    if (args.status !== undefined) {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_status", (q) => q.eq("status", args.status!));
    } else if (args.priority !== undefined) {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_priority", (q) => q.eq("priority", args.priority!));
    } else if (args.category !== undefined) {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_category", (q) => q.eq("category", args.category!));
    } else if (args.assignedTo !== undefined) {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_assigned_to", (q) => q.eq("assignedTo", args.assignedTo!));
    } else if (args.createdBy !== undefined) {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_created_by", (q) => q.eq("createdBy", args.createdBy!));
    } else {
      queryWithIndex = ctx.db.query("supportTickets").withIndex("by_created_at");
    }
    let tickets = await queryWithIndex.collect();
    
    // Sort by creation date (newest first)
    tickets = tickets.sort((a, b) => b.createdAt - a.createdAt);

    // Apply pagination
    if (args.offset) {
      tickets = tickets.slice(args.offset);
    }
    if (args.limit) {
      tickets = tickets.slice(0, args.limit);
    }

    // Enrich with user data
    const enrichedTickets = await Promise.all(
      tickets.map(async (ticket) => {
        const creator = await ctx.db.get(ticket.createdBy);
        const assignee = ticket.assignedTo ? await ctx.db.get(ticket.assignedTo) : null;
        return {
          ...ticket,
          creator,
          assignee,
        };
      })
    );

    return enrichedTickets;
  },
});

export const getTicketComments = query({
  args: { 
    ticketId: v.id("supportTickets"),
    includeInternal: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    let comments = await ctx.db
      .query("supportComments")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.ticketId))
      .collect();

    // Filter out internal comments if not requested
    if (!args.includeInternal) {
      comments = comments.filter(comment => !comment.isInternal);
    }

    // Sort by creation date
    comments = comments.sort((a, b) => a.createdAt - b.createdAt);

    // Enrich with author data
    const enrichedComments = await Promise.all(
      comments.map(async (comment) => {
        const author = await ctx.db.get(comment.authorId);
        return {
          ...comment,
          author,
        };
      })
    );

    return enrichedComments;
  },
});

export const getTicketStats = query({
  args: {
    userId: v.optional(v.id("users")),
    timeRange: v.optional(v.number()), // Days to look back
  },
  handler: async (ctx, args) => {
    let tickets = await ctx.db.query("supportTickets").collect();

    // Filter by user if specified
    if (args.userId) {
      tickets = tickets.filter(t => 
        t.createdBy === args.userId || t.assignedTo === args.userId
      );
    }

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      tickets = tickets.filter(t => t.createdAt >= cutoffTime);
    }

    const stats = {
      total: tickets.length,
      open: tickets.filter(t => t.status === "open").length,
      inProgress: tickets.filter(t => t.status === "in_progress").length,
      waitingForCustomer: tickets.filter(t => t.status === "waiting_for_customer").length,
      resolved: tickets.filter(t => t.status === "resolved").length,
      closed: tickets.filter(t => t.status === "closed").length,
      byPriority: {
        low: tickets.filter(t => t.priority === "low").length,
        medium: tickets.filter(t => t.priority === "medium").length,
        high: tickets.filter(t => t.priority === "high").length,
        urgent: tickets.filter(t => t.priority === "urgent").length,
      },
      averageResolutionTime: 0,
    };

    // Calculate average resolution time
    const resolvedTickets = tickets.filter(t => t.status === "resolved" && t.resolvedAt);
    if (resolvedTickets.length > 0) {
      const totalResolutionTime = resolvedTickets.reduce((sum, ticket) => {
        return sum + (ticket.resolvedAt! - ticket.createdAt);
      }, 0);
      stats.averageResolutionTime = Math.round(totalResolutionTime / resolvedTickets.length);
    }

    return stats;
  },
});

// ============================================================================
// SUPPORT TICKET MUTATIONS
// ============================================================================

export const createTicket = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    priority: v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent")),
    category: v.string(),
    createdBy: v.id("users"),
    tags: v.optional(v.array(v.string())),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("supportTickets", {
      title: args.title.trim(),
      description: args.description.trim(),
      status: "open",
      priority: args.priority,
      category: args.category,
      createdBy: args.createdBy,
      tags: args.tags || [],
      attachments: args.attachments || [],
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const updateTicket = mutation({
  args: {
    id: v.id("supportTickets"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.union(
      v.literal("open"),
      v.literal("in_progress"),
      v.literal("waiting_for_customer"),
      v.literal("resolved"),
      v.literal("closed")
    )),
    priority: v.optional(v.union(v.literal("low"), v.literal("medium"), v.literal("high"), v.literal("urgent"))),
    category: v.optional(v.string()),
    assignedTo: v.optional(v.id("users")),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const ticket = await ctx.db.get(id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const now = Date.now();
    const updateData: any = {
      ...updates,
      updatedAt: now,
    };

    // Set resolved time when status changes to resolved
    if (updates.status === "resolved" && ticket.status !== "resolved") {
      updateData.resolvedAt = now;
    }

    return await ctx.db.patch(id, updateData);
  },
});

export const deleteTicket = mutation({
  args: { id: v.id("supportTickets") },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    // Delete all comments for this ticket
    const comments = await ctx.db
      .query("supportComments")
      .withIndex("by_ticket", (q) => q.eq("ticketId", args.id))
      .collect();

    for (const comment of comments) {
      await ctx.db.delete(comment._id);
    }

    // Delete the ticket
    await ctx.db.delete(args.id);
    return { success: true };
  },
});

// ============================================================================
// SUPPORT COMMENT MUTATIONS
// ============================================================================

export const addComment = mutation({
  args: {
    ticketId: v.id("supportTickets"),
    content: v.string(),
    authorId: v.id("users"),
    isInternal: v.optional(v.boolean()),
    attachments: v.optional(v.array(v.object({
      name: v.string(),
      url: v.string(),
      size: v.number(),
      type: v.string(),
    }))),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get(args.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const now = Date.now();
    const commentId = await ctx.db.insert("supportComments", {
      ticketId: args.ticketId,
      content: args.content.trim(),
      authorId: args.authorId,
      isInternal: args.isInternal || false,
      attachments: args.attachments || [],
      createdAt: now,
      updatedAt: now,
    });

    // Update ticket's updated time
    await ctx.db.patch(args.ticketId, {
      updatedAt: now,
    });

    return commentId;
  },
});

export const updateComment = mutation({
  args: {
    id: v.id("supportComments"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    return await ctx.db.patch(args.id, {
      content: args.content.trim(),
      updatedAt: Date.now(),
    });
  },
});

export const deleteComment = mutation({
  args: { id: v.id("supportComments") },
  handler: async (ctx, args) => {
    const comment = await ctx.db.get(args.id);
    if (!comment) {
      throw new Error("Comment not found");
    }

    await ctx.db.delete(args.id);
    return { success: true };
  },
});
