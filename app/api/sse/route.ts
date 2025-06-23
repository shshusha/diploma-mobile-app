import { prisma } from "../../../lib/prisma"

export async function GET() {
  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    start(controller) {
      // Send initial data
      const sendUpdate = async () => {
        try {
          const alerts = await prisma.alert.findMany({
            where: { isResolved: false },
            include: {
              user: {
                select: { name: true, email: true },
              },
            },
            orderBy: { createdAt: "desc" },
            take: 10,
          })

          const users = await prisma.user.findMany({
            include: {
              locations: {
                orderBy: { createdAt: "desc" },
                take: 1,
              },
            },
          })

          const data = {
            alerts,
            users,
            timestamp: new Date().toISOString(),
          }

          controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
        } catch (error) {
          console.error("SSE Error:", error)
        }
      }

      // Send initial data
      sendUpdate()

      // Send updates every 30 seconds
      const interval = setInterval(sendUpdate, 30000)

      // Cleanup function
      return () => {
        clearInterval(interval)
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}
