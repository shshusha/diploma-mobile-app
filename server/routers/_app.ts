import { router } from "../../lib/trpc"
import { usersRouter } from "./users"
import { alertsRouter } from "./alerts"
import { emergencyContactsRouter } from "./emergency-contacts"
import { detectionRulesRouter } from "./detection-rules"

export const appRouter = router({
  users: usersRouter,
  alerts: alertsRouter,
  emergencyContacts: emergencyContactsRouter,
  detectionRules: detectionRulesRouter,
})

export type AppRouter = typeof appRouter
