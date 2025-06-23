import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Starting database seeding...")

  // Create Users
  console.log("👥 Creating users...")
  const users = await Promise.all([
    prisma.user.upsert({
      where: { email: "john.doe@example.com" },
      update: {},
      create: {
        id: "user_john_doe",
        email: "john.doe@example.com",
        name: "John Doe",
        phone: "+1-555-0101",
      },
    }),
    prisma.user.upsert({
      where: { email: "jane.smith@example.com" },
      update: {},
      create: {
        id: "user_jane_smith",
        email: "jane.smith@example.com",
        name: "Jane Smith",
        phone: "+1-555-0102",
      },
    }),
    prisma.user.upsert({
      where: { email: "bob.wilson@example.com" },
      update: {},
      create: {
        id: "user_bob_wilson",
        email: "bob.wilson@example.com",
        name: "Bob Wilson",
        phone: "+1-555-0103",
      },
    }),
    prisma.user.upsert({
      where: { email: "alice.johnson@example.com" },
      update: {},
      create: {
        id: "user_alice_johnson",
        email: "alice.johnson@example.com",
        name: "Alice Johnson",
        phone: "+1-555-0104",
      },
    }),
    prisma.user.upsert({
      where: { email: "mike.brown@example.com" },
      update: {},
      create: {
        id: "user_mike_brown",
        email: "mike.brown@example.com",
        name: "Mike Brown",
        phone: "+1-555-0105",
      },
    }),
  ])

  console.log(`✅ Created ${users.length} users`)

  // Create Emergency Contacts
  console.log("📞 Creating emergency contacts...")
  const emergencyContacts = [
    // John Doe's contacts
    {
      userId: "user_john_doe",
      name: "Sarah Doe",
      phone: "+1-555-0201",
      email: "sarah.doe@example.com",
      relation: "Spouse",
    },
    {
      userId: "user_john_doe",
      name: "Emergency Services",
      phone: "911",
      email: null,
      relation: "Emergency",
    },
    {
      userId: "user_john_doe",
      name: "Dr. Smith",
      phone: "+1-555-0301",
      email: "dr.smith@hospital.com",
      relation: "Doctor",
    },
    // Jane Smith's contacts
    {
      userId: "user_jane_smith",
      name: "Tom Smith",
      phone: "+1-555-0202",
      email: "tom.smith@example.com",
      relation: "Brother",
    },
    {
      userId: "user_jane_smith",
      name: "Emergency Services",
      phone: "911",
      email: null,
      relation: "Emergency",
    },
    // Bob Wilson's contacts
    {
      userId: "user_bob_wilson",
      name: "Mary Wilson",
      phone: "+1-555-0203",
      email: "mary.wilson@example.com",
      relation: "Wife",
    },
    {
      userId: "user_bob_wilson",
      name: "Emergency Services",
      phone: "911",
      email: null,
      relation: "Emergency",
    },
    // Alice Johnson's contacts
    {
      userId: "user_alice_johnson",
      name: "David Johnson",
      phone: "+1-555-0204",
      email: "david.johnson@example.com",
      relation: "Husband",
    },
    {
      userId: "user_alice_johnson",
      name: "Emergency Services",
      phone: "911",
      email: null,
      relation: "Emergency",
    },
    // Mike Brown's contacts
    {
      userId: "user_mike_brown",
      name: "Lisa Brown",
      phone: "+1-555-0205",
      email: "lisa.brown@example.com",
      relation: "Sister",
    },
    {
      userId: "user_mike_brown",
      name: "Emergency Services",
      phone: "911",
      email: null,
      relation: "Emergency",
    },
  ]

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.upsert({
      where: {
        id: `contact_${contact.userId}_${contact.name.toLowerCase().replace(/\s+/g, "_")}`,
      },
      update: {},
      create: {
        id: `contact_${contact.userId}_${contact.name.toLowerCase().replace(/\s+/g, "_")}`,
        ...contact,
      },
    })
  }

  console.log(`✅ Created ${emergencyContacts.length} emergency contacts`)

  // Create Detection Rules
  console.log("⚙️ Creating detection rules...")
  const detectionRules = [
    {
      userId: "user_john_doe",
      fallSensitivity: 0.8,
      immobilityTimeout: 300, // 5 minutes
      isActive: true,
    },
    {
      userId: "user_jane_smith",
      fallSensitivity: 0.7,
      immobilityTimeout: 600, // 10 minutes
      isActive: true,
    },
    {
      userId: "user_bob_wilson",
      fallSensitivity: 0.9,
      immobilityTimeout: 180, // 3 minutes
      isActive: true,
    },
    {
      userId: "user_alice_johnson",
      fallSensitivity: 0.75,
      immobilityTimeout: 450, // 7.5 minutes
      isActive: true,
    },
    {
      userId: "user_mike_brown",
      fallSensitivity: 0.85,
      immobilityTimeout: 240, // 4 minutes
      isActive: false, // Disabled for testing
    },
  ]

  for (const rule of detectionRules) {
    await prisma.detectionRule.upsert({
      where: {
        id: `rule_${rule.userId}`,
      },
      update: {},
      create: {
        id: `rule_${rule.userId}`,
        ...rule,
      },
    })
  }

  console.log(`✅ Created ${detectionRules.length} detection rules`)

  // Create Locations (Recent locations for each user)
  console.log("📍 Creating location history...")
  const locations = [
    // John Doe - Central Park area
    {
      userId: "user_john_doe",
      latitude: 40.7829,
      longitude: -73.9654,
      accuracy: 5.0,
      speed: 0.0,
      heading: null,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    {
      userId: "user_john_doe",
      latitude: 40.7831,
      longitude: -73.9652,
      accuracy: 4.2,
      speed: 1.2,
      heading: 45.0,
      createdAt: new Date(Date.now() - 3 * 60 * 1000), // 3 minutes ago
    },
    // Jane Smith - Times Square area
    {
      userId: "user_jane_smith",
      latitude: 40.758,
      longitude: -73.9855,
      accuracy: 3.8,
      speed: 2.1,
      heading: 180.0,
      createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    },
    {
      userId: "user_jane_smith",
      latitude: 40.7578,
      longitude: -73.9857,
      accuracy: 4.1,
      speed: 0.5,
      heading: 90.0,
      createdAt: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
    },
    // Bob Wilson - Brooklyn Bridge area
    {
      userId: "user_bob_wilson",
      latitude: 40.7061,
      longitude: -73.9969,
      accuracy: 6.2,
      speed: 3.5,
      heading: 270.0,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    // Alice Johnson - Wall Street area
    {
      userId: "user_alice_johnson",
      latitude: 40.7074,
      longitude: -74.0113,
      accuracy: 4.8,
      speed: 1.8,
      heading: 135.0,
      createdAt: new Date(Date.now() - 7 * 60 * 1000), // 7 minutes ago
    },
    // Mike Brown - High Line area
    {
      userId: "user_mike_brown",
      latitude: 40.748,
      longitude: -74.0048,
      accuracy: 5.5,
      speed: 0.8,
      heading: 225.0,
      createdAt: new Date(Date.now() - 12 * 60 * 1000), // 12 minutes ago
    },
  ]

  for (const [index, location] of locations.entries()) {
    await prisma.location.upsert({
      where: {
        id: `location_${index + 1}`,
      },
      update: {},
      create: {
        id: `location_${index + 1}`,
        ...location,
      },
    })
  }

  console.log(`✅ Created ${locations.length} location records`)

  // Create Alerts (Mix of resolved and unresolved)
  console.log("🚨 Creating alerts...")
  const alerts = [
    // Recent critical fall alert - UNRESOLVED
    {
      userId: "user_john_doe",
      type: "FALL_DETECTED",
      severity: "CRITICAL",
      message: "Severe fall detected at Central Park. User may be unconscious.",
      latitude: 40.7829,
      longitude: -73.9654,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    // High priority immobility alert - UNRESOLVED
    {
      userId: "user_bob_wilson",
      type: "IMMOBILITY_DETECTED",
      severity: "HIGH",
      message: "No movement detected for 15 minutes. Last known location: Brooklyn Bridge.",
      latitude: 40.7061,
      longitude: -73.9969,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    // Route deviation - UNRESOLVED
    {
      userId: "user_jane_smith",
      type: "ROUTE_DEVIATION",
      severity: "MEDIUM",
      message: "User has deviated from planned route by more than 500 meters.",
      latitude: 40.7578,
      longitude: -73.9857,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    },
    // Manual emergency - RESOLVED
    {
      userId: "user_alice_johnson",
      type: "MANUAL_EMERGENCY",
      severity: "HIGH",
      message: "User manually triggered emergency alert. Reported feeling unwell.",
      latitude: 40.7074,
      longitude: -74.0113,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
    // Danger zone entry - RESOLVED
    {
      userId: "user_mike_brown",
      type: "DANGER_ZONE_ENTRY",
      severity: "MEDIUM",
      message: "User entered restricted construction zone area.",
      latitude: 40.748,
      longitude: -74.0048,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    },
    // Old fall alert - RESOLVED
    {
      userId: "user_john_doe",
      type: "FALL_DETECTED",
      severity: "MEDIUM",
      message: "Minor fall detected. User recovered quickly.",
      latitude: 40.7825,
      longitude: -73.9658,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    },
    // Low priority immobility - RESOLVED
    {
      userId: "user_jane_smith",
      type: "IMMOBILITY_DETECTED",
      severity: "LOW",
      message: "Extended rest period detected. User was taking a planned break.",
      latitude: 40.7582,
      longitude: -73.9851,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
    },
    // Yesterday's alerts
    {
      userId: "user_bob_wilson",
      type: "ROUTE_DEVIATION",
      severity: "LOW",
      message: "Minor route deviation to avoid construction.",
      latitude: 40.7065,
      longitude: -73.9965,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000), // 20 hours ago
      createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 24 hours ago
    },
    {
      userId: "user_alice_johnson",
      type: "FALL_DETECTED",
      severity: "LOW",
      message: "Stumble detected, user maintained balance.",
      latitude: 40.7076,
      longitude: -74.0115,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 22 * 60 * 60 * 1000), // 22 hours ago
      createdAt: new Date(Date.now() - 25 * 60 * 60 * 1000), // 25 hours ago
    },
    {
      userId: "user_mike_brown",
      type: "IMMOBILITY_DETECTED",
      severity: "MEDIUM",
      message: "Extended immobility during lunch break.",
      latitude: 40.7485,
      longitude: -74.0045,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 26 * 60 * 60 * 1000), // 26 hours ago
      createdAt: new Date(Date.now() - 28 * 60 * 60 * 1000), // 28 hours ago
    },
  ]

  for (const [index, alert] of alerts.entries()) {
    await prisma.alert.upsert({
      where: {
        id: `alert_${index + 1}`,
      },
      update: {},
      create: {
        id: `alert_${index + 1}`,
        ...alert,
      },
    })
  }

  console.log(`✅ Created ${alerts.length} alerts`)

  // Summary
  console.log("\n📊 Database seeding completed!")
  console.log("=".repeat(50))
  console.log(`👥 Users: ${users.length}`)
  console.log(`📞 Emergency Contacts: ${emergencyContacts.length}`)
  console.log(`⚙️ Detection Rules: ${detectionRules.length}`)
  console.log(`📍 Location Records: ${locations.length}`)
  console.log(`🚨 Alerts: ${alerts.length}`)
  console.log("=".repeat(50))

  // Alert breakdown
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved).length
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length
  const highAlerts = alerts.filter((a) => a.severity === "HIGH").length

  console.log(`🔴 Unresolved Alerts: ${unresolvedAlerts}`)
  console.log(`⚠️ Critical Alerts: ${criticalAlerts}`)
  console.log(`🟡 High Priority Alerts: ${highAlerts}`)
  console.log("\n✅ Ready to test the dashboard!")
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
