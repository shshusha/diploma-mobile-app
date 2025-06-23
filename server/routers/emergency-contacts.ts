import { z } from "zod"
import { router, publicProcedure } from "../../lib/trpc"
import { prisma } from "../../lib/prisma"

export const emergencyContactsRouter = router({
  getByUserId: publicProcedure.input(z.object({ userId: z.string() })).query(async ({ input }) => {
    return await prisma.emergencyContact.findMany({
      where: { userId: input.userId },
    })
  }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        name: z.string(),
        phone: z.string(),
        email: z.string().optional(),
        relation: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return await prisma.emergencyContact.create({
        data: input,
      })
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        phone: z.string().optional(),
        email: z.string().optional(),
        relation: z.string().optional(),
      }),
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return await prisma.emergencyContact.update({
        where: { id },
        data,
      })
    }),

  delete: publicProcedure.input(z.object({ id: z.string() })).mutation(async ({ input }) => {
    return await prisma.emergencyContact.delete({
      where: { id: input.id },
    })
  }),
})
