import { z } from "zod"
import { router, publicProcedure } from "../../lib/trpc"
import { prisma } from "../../lib/prisma"

export const detectionRulesRouter = router({
  getByUserId: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
    return await prisma.detectionRule.findFirst({
      where: { userId: input.userId },
    })
  }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        fallSensitivity: z.number().min(0.1).max(1).optional(),
        immobilityTimeout: z.number().min(60).max(3600).optional(),
        isActive: z.boolean().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.detectionRule.update({
        where: { id },
        data,
      })
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        fallSensitivity: z.number().min(0.1).max(1).default(0.8),
        immobilityTimeout: z.number().min(60).max(3600).default(300),
        isActive: z.boolean().default(true),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.detectionRule.create({
        data: input,
      })
    }),
})
