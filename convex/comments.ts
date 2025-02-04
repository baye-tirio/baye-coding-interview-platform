import { equal } from "assert";
import { mutation, query } from "./_generated/server";
import { convexToJson, v } from "convex/values";
// These functions are equivalent to express js controllers where we write the actual logic to interact with our databases in convex
export const addComment = mutation({
  args: {
    interviewId: v.id("interviews"),
    content: v.string(),
    rating: v.number(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");
    // if the request is authenticated
    return await ctx.db.insert("comments", {
      interviewerId: identity.subject,
      content: args.content,
      rating: args.rating,
      interviewId: args.interviewId,
    });
  },
});
// get all the comments associated with a particular interview
export const getComments = query({
  args: {
    interviewId: v.id("interviews"),
  },
  handler: async (ctx, args) => {
    const comments = await ctx.db
      .query("comments")
      .withIndex("by_interview_id", (q) =>
        q.eq("interviewId", args.interviewId)
      )
      .collect();
      return comments;
  },
});
