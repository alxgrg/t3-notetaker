import { z } from "zod";

import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";

export const topicRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const { session } = ctx;
    const topic = await ctx.prisma.topic.findMany({
      where: {
        userId: session.user.id,
      },
    });

    return topic;
  }),

  create: protectedProcedure
    .input(z.object({ title: z.string().min(1).max(100) }))
    .mutation(({ ctx, input }) => {
      const { session, prisma } = ctx;
      return prisma.topic.create({
        data: {
          title: input.title,
          user: {
            connect: {
              id: session.user.id,
            },
          },
        },
      });
    }),
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return ctx.prisma.topic.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
