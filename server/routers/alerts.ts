import { z } from "zod";
import { router, publicProcedure } from "../../lib/trpc";
import { prisma } from "../../lib/prisma";
import { telegramService } from "../../lib/telegram";

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
          "SEVERE_WEATHER_WARNING",
          "FLOOD_WARNING",
          "TORNADO_WARNING",
          "HURRICANE_WARNING",
          "EARTHQUAKE_ALERT",
          "TSUNAMI_WARNING",
          "WILDFIRE_ALERT",
          "CIVIL_EMERGENCY",
          "AMBER_ALERT",
          "SILVER_ALERT",
          "TERRORISM_ALERT",
          "HAZMAT_INCIDENT",
          "INFRASTRUCTURE_FAILURE",
          "PUBLIC_HEALTH_EMERGENCY",
          "EVACUATION_ORDER",
          "SHELTER_IN_PLACE",
          "ROAD_CLOSURE",
          "POWER_OUTAGE",
          "WATER_EMERGENCY",
        ]),
        severity: z.enum([
          "INFO",
          "ADVISORY",
          "WATCH",
          "WARNING",
          "EMERGENCY",
          "CRITICAL",
        ]),
        message: z.string(),
        latitude: z.number().optional(),
        longitude: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      // Create the alert in the database
      const alert = await prisma.alert.create({
        data: input,
        include: {
          user: true,
        },
      });

      // Send Telegram notification if user has telegramChatId
      const userWithTelegram = alert.user;
      console.log(userWithTelegram);
      if (userWithTelegram && userWithTelegram.telegramChatId) {
        console.log(
          "Sending Telegram alert to user",
          userWithTelegram.telegramChatId
        );
        try {
          await telegramService.sendAlertNotification(
            userWithTelegram.telegramChatId,
            {
              type: alert.type,
              severity: alert.severity,
              message: alert.message,
              user: {
                name: userWithTelegram.name ?? undefined,
                email: userWithTelegram.email ?? undefined,
              },
              latitude: alert.latitude ?? undefined,
              longitude: alert.longitude ?? undefined,
              createdAt: alert.createdAt,
            }
          );
        } catch (err) {
          console.error("Failed to send Telegram alert:", err);
        }
      }

      return alert;
    }),
});
