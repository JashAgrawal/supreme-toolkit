import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ============================================================================
// ANALYTICS QUERIES
// ============================================================================

export const getAnalyticsEvents = query({
  args: {
    event: v.optional(v.string()),
    userId: v.optional(v.id("users")),
    sessionId: v.optional(v.string()),
    startTime: v.optional(v.number()),
    endTime: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let queryWithIndex;
    if (args.event !== undefined) {
      queryWithIndex = ctx.db.query("analytics").withIndex("by_event", (q) => q.eq("event", args.event!));
    } else if (args.userId !== undefined) {
      queryWithIndex = ctx.db.query("analytics").withIndex("by_user", (q) => q.eq("userId", args.userId!));
    } else if (args.sessionId !== undefined) {
      queryWithIndex = ctx.db.query("analytics").withIndex("by_session", (q) => q.eq("sessionId", args.sessionId!));
    } else {
      queryWithIndex = ctx.db.query("analytics").withIndex("by_created_at");
    }
    let events = await queryWithIndex.collect();

    // Filter by time range if specified
    if (args.startTime) {
      events = events.filter(e => e.createdAt >= args.startTime!);
    }
    if (args.endTime) {
      events = events.filter(e => e.createdAt <= args.endTime!);
    }

    // Sort by creation time (newest first)
    events = events.sort((a, b) => b.createdAt - a.createdAt);

    if (args.limit) {
      events = events.slice(0, args.limit);
    }

    return events;
  },
});

export const getEventStats = query({
  args: {
    timeRange: v.optional(v.number()), // Days to look back
    groupBy: v.optional(v.union(v.literal("event"), v.literal("user"), v.literal("day"))),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("analytics").collect();

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      events = events.filter(e => e.createdAt >= cutoffTime);
    }

    const stats: any = {
      total: events.length,
      uniqueUsers: new Set(events.filter(e => e.userId).map(e => e.userId)).size,
      uniqueSessions: new Set(events.filter(e => e.sessionId).map(e => e.sessionId)).size,
    };

    if (args.groupBy === "event") {
      const eventCounts: Record<string, number> = {};
      events.forEach(e => {
        eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
      });
      stats.byEvent = eventCounts;
    }

    if (args.groupBy === "user") {
      const userCounts: Record<string, number> = {};
      events.filter(e => e.userId).forEach(e => {
        const userId = e.userId!.toString();
        userCounts[userId] = (userCounts[userId] || 0) + 1;
      });
      stats.byUser = userCounts;
    }

    if (args.groupBy === "day") {
      const dayCounts: Record<string, number> = {};
      events.forEach(e => {
        const day = new Date(e.createdAt).toISOString().split('T')[0];
        dayCounts[day] = (dayCounts[day] || 0) + 1;
      });
      stats.byDay = dayCounts;
    }

    return stats;
  },
});

export const getUserAnalytics = query({
  args: {
    userId: v.id("users"),
    timeRange: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db
      .query("analytics")
      .withIndex("by_user", (q) => q.eq("userId", args.userId))
      .collect();

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      events = events.filter(e => e.createdAt >= cutoffTime);
    }

    const eventCounts: Record<string, number> = {};
    const sessionIds = new Set<string>();
    
    events.forEach(e => {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
      if (e.sessionId) {
        sessionIds.add(e.sessionId);
      }
    });

    return {
      totalEvents: events.length,
      uniqueSessions: sessionIds.size,
      eventBreakdown: eventCounts,
      firstSeen: events.length > 0 ? Math.min(...events.map(e => e.createdAt)) : null,
      lastSeen: events.length > 0 ? Math.max(...events.map(e => e.createdAt)) : null,
    };
  },
});

// ============================================================================
// ANALYTICS MUTATIONS
// ============================================================================

export const trackEvent = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analytics", {
      event: args.event,
      userId: args.userId,
      sessionId: args.sessionId,
      properties: args.properties,
      metadata: args.metadata,
      createdAt: Date.now(),
    });
  },
});

export const trackMultipleEvents = mutation({
  args: {
    events: v.array(v.object({
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
      timestamp: v.optional(v.number()),
    })),
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    const insertPromises = args.events.map(event => 
      ctx.db.insert("analytics", {
        event: event.event,
        userId: event.userId,
        sessionId: event.sessionId,
        properties: event.properties,
        metadata: event.metadata,
        createdAt: event.timestamp || now,
      })
    );

    return await Promise.all(insertPromises);
  },
});

export const deleteOldAnalytics = mutation({
  args: {
    olderThanDays: v.number(),
  },
  handler: async (ctx, args) => {
    const cutoffTime = Date.now() - (args.olderThanDays * 24 * 60 * 60 * 1000);
    
    const oldEvents = await ctx.db
      .query("analytics")
      .withIndex("by_created_at")
      .collect();

    const eventsToDelete = oldEvents.filter(e => e.createdAt < cutoffTime);
    
    const deletePromises = eventsToDelete.map(event => ctx.db.delete(event._id));
    await Promise.all(deletePromises);

    return {
      deletedCount: eventsToDelete.length,
      cutoffTime,
    };
  },
});

// ============================================================================
// ANALYTICS UTILITIES
// ============================================================================

export const getPopularEvents = query({
  args: {
    timeRange: v.optional(v.number()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("analytics").collect();

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      events = events.filter(e => e.createdAt >= cutoffTime);
    }

    // Count events
    const eventCounts: Record<string, number> = {};
    events.forEach(e => {
      eventCounts[e.event] = (eventCounts[e.event] || 0) + 1;
    });

    // Sort by count and return top events
    const sortedEvents = Object.entries(eventCounts)
      .sort(([, a], [, b]) => b - a)
      .map(([event, count]) => ({ event, count }));

    return args.limit ? sortedEvents.slice(0, args.limit) : sortedEvents;
  },
});

export const getActiveUsers = query({
  args: {
    timeRange: v.optional(v.number()), // Hours to look back
  },
  handler: async (ctx, args) => {
    const timeRange = args.timeRange || 24; // Default to 24 hours
    const cutoffTime = Date.now() - (timeRange * 60 * 60 * 1000);
    
    const recentEvents = await ctx.db
      .query("analytics")
      .withIndex("by_created_at")
      .collect();

    const activeEvents = recentEvents.filter(e => 
      e.createdAt >= cutoffTime && e.userId
    );

    const activeUserIds = new Set(activeEvents.map(e => e.userId!));
    
    return {
      count: activeUserIds.size,
      timeRangeHours: timeRange,
      userIds: Array.from(activeUserIds),
    };
  },
});

export const getFunnelAnalytics = query({
  args: {
    events: v.array(v.string()),
    timeRange: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    let allEvents = await ctx.db.query("analytics").collect();

    // Filter by time range if specified
    if (args.timeRange) {
      const cutoffTime = Date.now() - (args.timeRange * 24 * 60 * 60 * 1000);
      allEvents = allEvents.filter(e => e.createdAt >= cutoffTime);
    }

    // Group events by user
    const userEvents: Record<string, any[]> = {};
    allEvents.filter(e => e.userId).forEach(e => {
      const userId = e.userId!.toString();
      if (!userEvents[userId]) {
        userEvents[userId] = [];
      }
      userEvents[userId].push(e);
    });

    // Calculate funnel metrics
    const funnelData = args.events.map((eventName, index) => {
      const usersWhoCompletedStep = Object.keys(userEvents).filter(userId => 
        userEvents[userId].some(e => e.event === eventName)
      );

      const conversionRate = index === 0 ? 100 : 
        (usersWhoCompletedStep.length / Object.keys(userEvents).length) * 100;

      return {
        step: index + 1,
        event: eventName,
        users: usersWhoCompletedStep.length,
        conversionRate: Math.round(conversionRate * 100) / 100,
      };
    });

    return {
      totalUsers: Object.keys(userEvents).length,
      funnel: funnelData,
    };
  },
});
