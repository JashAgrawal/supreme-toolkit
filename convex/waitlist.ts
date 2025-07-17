import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// WAITLIST QUERIES
// ============================================================================

export const getWaitlistEntry = query({
  args: { id: v.id("waitlist") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getWaitlistByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();
  },
});

export const getWaitlistEntries = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let baseQuery = ctx.db.query("waitlist");
    let queryWithIndex;

    if (args.status !== undefined) {
      queryWithIndex = baseQuery.withIndex("by_status", (q) => q.eq("status", args.status!));
    } else {
      queryWithIndex = baseQuery.withIndex("by_position");
    }

    const entries = await queryWithIndex.collect();
    
    // Sort by position for consistent ordering
    const sortedEntries = entries.sort((a, b) => a.position - b.position);

    if (args.offset) {
      const offsetEntries = sortedEntries.slice(args.offset);
      return args.limit ? offsetEntries.slice(0, args.limit) : offsetEntries;
    }

    return args.limit ? sortedEntries.slice(0, args.limit) : sortedEntries;
  },
});

export const getWaitlistStats = query({
  args: {},
  handler: async (ctx) => {
    const entries = await ctx.db.query("waitlist").collect();
    
    const stats = {
      total: entries.length,
      pending: entries.filter(e => e.status === "pending").length,
      approved: entries.filter(e => e.status === "approved").length,
      rejected: entries.filter(e => e.status === "rejected").length,
      averageWaitTime: 0, // Calculate based on approved entries
    };

    // Calculate average wait time for approved entries
    const approvedEntries = entries.filter(e => e.status === "approved" && e.approvedAt);
    if (approvedEntries.length > 0) {
      const totalWaitTime = approvedEntries.reduce((sum, entry) => {
        return sum + (entry.approvedAt! - entry.createdAt);
      }, 0);
      stats.averageWaitTime = Math.round(totalWaitTime / approvedEntries.length);
    }

    return stats;
  },
});

export const getWaitlistPosition = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const entry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", args.email.toLowerCase()))
      .first();

    if (!entry) {
      return null;
    }

    // Get all pending entries with lower positions
    const pendingEntries = await ctx.db
      .query("waitlist")
      .withIndex("by_status", (q) => q.eq("status", "pending"))
      .collect();

    const currentPosition = pendingEntries
      .filter(e => e.position <= entry.position)
      .length;

    return {
      entry,
      currentPosition,
      totalPending: pendingEntries.length,
    };
  },
});

// ============================================================================
// WAITLIST MUTATIONS
// ============================================================================

export const addToWaitlist = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    referralCode: v.optional(v.string()),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      utm_campaign: v.optional(v.string()),
      utm_source: v.optional(v.string()),
      utm_medium: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const email = args.email.toLowerCase();

    // Check if email already exists
    const existingEntry = await ctx.db
      .query("waitlist")
      .withIndex("by_email", (q) => q.eq("email", email))
      .first();

    if (existingEntry) {
      throw new Error("Email already exists in waitlist");
    }

    // Get current waitlist size to determine position
    const allEntries = await ctx.db.query("waitlist").collect();
    const position = allEntries.length + 1;

    const now = Date.now();
    return await ctx.db.insert("waitlist", {
      email,
      name: args.name,
      referralCode: args.referralCode,
      status: "pending",
      position,
      metadata: args.metadata,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const approveWaitlistEntry = mutation({
  args: {
    id: v.id("waitlist"),
    approvedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      throw new Error("Waitlist entry not found");
    }

    if (entry.status !== "pending") {
      throw new Error("Entry is not pending approval");
    }

    const now = Date.now();
    return await ctx.db.patch(args.id, {
      status: "approved",
      approvedAt: now,
      approvedBy: args.approvedBy,
      updatedAt: now,
    });
  },
});

export const rejectWaitlistEntry = mutation({
  args: {
    id: v.id("waitlist"),
    rejectedBy: v.optional(v.id("users")),
  },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      throw new Error("Waitlist entry not found");
    }

    if (entry.status !== "pending") {
      throw new Error("Entry is not pending");
    }

    return await ctx.db.patch(args.id, {
      status: "rejected",
      updatedAt: Date.now(),
    });
  },
});

export const updateWaitlistEntry = mutation({
  args: {
    id: v.id("waitlist"),
    name: v.optional(v.string()),
    referralCode: v.optional(v.string()),
    metadata: v.optional(v.object({
      source: v.optional(v.string()),
      utm_campaign: v.optional(v.string()),
      utm_source: v.optional(v.string()),
      utm_medium: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    
    const entry = await ctx.db.get(id);
    if (!entry) {
      throw new Error("Waitlist entry not found");
    }

    return await ctx.db.patch(id, {
      ...updates,
      updatedAt: Date.now(),
    });
  },
});

export const deleteWaitlistEntry = mutation({
  args: { id: v.id("waitlist") },
  handler: async (ctx, args) => {
    const entry = await ctx.db.get(args.id);
    if (!entry) {
      throw new Error("Waitlist entry not found");
    }

    await ctx.db.delete(args.id);

    // Reorder positions for remaining entries
    const remainingEntries = await ctx.db
      .query("waitlist")
      .withIndex("by_position")
      .collect();

    // Update positions for entries that came after the deleted one
    const updates = remainingEntries
      .filter(e => e.position > entry.position)
      .map((e, index) => ({
        id: e._id,
        position: entry.position + index,
      }));

    for (const update of updates) {
      await ctx.db.patch(update.id, {
        position: update.position,
        updatedAt: Date.now(),
      });
    }

    return { success: true };
  },
});

// ============================================================================
// WAITLIST UTILITIES
// ============================================================================

export const searchWaitlist = query({
  args: {
    searchTerm: v.string(),
    status: v.optional(v.union(v.literal("pending"), v.literal("approved"), v.literal("rejected"))),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let entries = await ctx.db.query("waitlist").collect();

    if (args.status) {
      entries = entries.filter(e => e.status === args.status);
    }

    const searchTerm = args.searchTerm.toLowerCase();
    const filteredEntries = entries.filter(entry => 
      entry.email.toLowerCase().includes(searchTerm) ||
      entry.name.toLowerCase().includes(searchTerm) ||
      (entry.referralCode && entry.referralCode.toLowerCase().includes(searchTerm))
    );

    const sortedEntries = filteredEntries.sort((a, b) => a.position - b.position);

    return args.limit ? sortedEntries.slice(0, args.limit) : sortedEntries;
  },
});

export const getReferralStats = query({
  args: { referralCode: v.string() },
  handler: async (ctx, args) => {
    const entries = await ctx.db
      .query("waitlist")
      .withIndex("by_referral", (q) => q.eq("referralCode", args.referralCode))
      .collect();

    return {
      totalReferrals: entries.length,
      pendingReferrals: entries.filter(e => e.status === "pending").length,
      approvedReferrals: entries.filter(e => e.status === "approved").length,
      rejectedReferrals: entries.filter(e => e.status === "rejected").length,
    };
  },
});
