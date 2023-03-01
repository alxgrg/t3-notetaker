import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.session.user.id;
      const { topicId } = input;

      const topic = await ctx.prisma.topic.findFirst({
        where: {
          id: topicId,
        },
      });

      if (topic && topic?.userId !== userId) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to view these notes",
        });
      }

      return ctx.prisma.note.findMany({
        where: {
          topicId,
        },
      });
    }),
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        content: z.string(),
        topicId: z.string({ required_error: "Select a topic first" }),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (!input.topicId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No topic selected",
        });
      }

      const user = ctx.session.user;

      const topic = await ctx.prisma.topic.findUnique({
        where: {
          id: input.topicId,
        },
      });

      if (!topic || topic.userId !== user.id) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to add to this topic",
        });
      }

      const note = await ctx.prisma.note.create({
        data: {
          title: input.title,
          content: input.content,
          topic: {
            connect: {
              id: input.topicId,
            },
          },
        },
      });

      if (!note) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Something went wrong",
        });
      }
      return note;
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const note = await ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
      return note;
    }),
});
