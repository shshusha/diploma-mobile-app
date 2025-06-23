import { z } from "zod";
import { router, publicProcedure } from "../../lib/trpc";
import { prisma } from "../../lib/prisma";

export const alertsRouter = router({
  getAll: publicProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        isResolved: z.boolean().optional(),
        limit: z.number().min(1).max(100).default(50),
      })
    )
    .query(async ({ input }) => {
      return await prisma.alert.findMany({
        where: {
          userId: input.userId,
          isResolved: input.isResolved,
        },
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        take: input.limit,
      });
    }),

  resolve: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input }) => {
      return await prisma.alert.update({
        where: { id: input.id },
        data: {
          isResolved: true,
          resolvedAt: new Date(),
        },
      });
    }),

  create: publicProcedure
    .input(
      z.object({
        userId: z.string(),
        type: z.enum([
          "FALL_DETECTED",
          "IMMOBILITY_DETECTED",
          "ROUTE_DEVIATION",
          "DANGER_ZONE_ENTRY",
          "MANUAL_EMERGENCY",
        ]),
        severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
        message: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      return await prisma.alert.create({
        data: input,
        include: {
          user: true,
        },
      });
    }),
});
