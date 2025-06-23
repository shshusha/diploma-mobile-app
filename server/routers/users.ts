import { z } from "zod"
import { router, publicProcedure } from "../../lib/trpc"
import { prisma } from "../../lib/prisma"

export const usersRouter = router({
  getAll: publicProcedure.query(async () => {
    return await prisma.user.findMany({
      include: {
        _count: {
          select: {
            alerts: true,
            locations: true,
            emergencyContacts: true,
          },
        },
      },
    })
  }),

  getById: publicProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    return await prisma.user.findUnique({
      where: { id: input.id },
      include: {
        alerts: {
          orderBy: { createdAt: "desc" },
          take: 10,
        },
        locations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        emergencyContacts: true,
        detectionRules: true,
      },
    })
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        name: z.string().optional(),
        phone: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.user.create({
        data: input,
      })
    }),
})
