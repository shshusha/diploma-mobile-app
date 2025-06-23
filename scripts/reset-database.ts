import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🗑️ Clearing database...")

  // Delete all data in reverse order of dependencies
  await prisma.alert.deleteMany()
  await prisma.location.deleteMany()
  await prisma.emergencyContact.deleteMany()
  await prisma.detectionRule.deleteMany()
  await prisma.user.deleteMany()

  console.log("✅ Database cleared!")
  console.log("🌱 Now run: npm run seed")
}

main()
  .catch((e) => {
    console.error("❌ Error clearing database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
