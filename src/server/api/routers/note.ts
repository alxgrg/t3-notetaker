import { TRPCError } from "@trpc/server";
import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const noteRouter = createTRPCRouter({
  getAll: protectedProcedure
    .input(z.object({ topicId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.note.findMany({
        where: {
          topicId: input.topicId,
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
    .mutation(({ ctx, input }) => {
      if (!input.topicId) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "No topic selected",
        });
      }
      const topic = ctx.prisma.topic.findUnique({
        where: {
          id: input.topicId,
        },
      });
      return ctx.prisma.note.create({
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
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.note.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
