import { PrismaClient, AlertType, Severity } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create Users
  console.log("👥 Creating users...");
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
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create Emergency Contacts
  console.log("📞 Creating emergency contacts...");
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
  ];

  for (const contact of emergencyContacts) {
    await prisma.emergencyContact.upsert({
      where: {
        id: `contact_${contact.userId}_${contact.name
          .toLowerCase()
          .replace(/\s+/g, "_")}`,
      },
      update: {},
      create: {
        id: `contact_${contact.userId}_${contact.name
          .toLowerCase()
          .replace(/\s+/g, "_")}`,
        ...contact,
      },
    });
  }

  console.log(`✅ Created ${emergencyContacts.length} emergency contacts`);

  // Create Detection Rules
  console.log("⚙️ Creating detection rules...");
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
  ];

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
    });
  }

  console.log(`✅ Created ${detectionRules.length} detection rules`);

  // Create Locations (Recent locations for each user)
  console.log("📍 Creating location history...");
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
  ];

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
    });
  }

  console.log(`✅ Created ${locations.length} location records`);

  // Create Alerts (Government Emergency Style)
  console.log("🚨 Creating alerts...");
  const alerts = [
    // Severe Weather Warning - CRITICAL
    {
      userId: "user_john_doe",
      type: AlertType.SEVERE_WEATHER_WARNING,
      severity: Severity.CRITICAL,
      message:
        "Severe thunderstorm with potential tornadoes approaching. Seek shelter immediately.",
      latitude: 40.7829,
      longitude: -73.9654,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    },
    // Flood Warning - EMERGENCY
    {
      userId: "user_bob_wilson",
      type: AlertType.FLOOD_WARNING,
      severity: Severity.EMERGENCY,
      message:
        "Flash flooding expected in your area. Move to higher ground now.",
      latitude: 40.7061,
      longitude: -73.9969,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 15 * 60 * 1000), // 15 minutes ago
    },
    // Amber Alert - WARNING
    {
      userId: "user_jane_smith",
      type: AlertType.AMBER_ALERT,
      severity: Severity.WARNING,
      message:
        "Amber Alert: Child abduction reported. Check local news for details.",
      latitude: 40.7578,
      longitude: -73.9857,
      isResolved: false,
      resolvedAt: null,
      createdAt: new Date(Date.now() - 8 * 60 * 1000), // 8 minutes ago
    },
    // Public Health Emergency - ADVISORY
    {
      userId: "user_alice_johnson",
      type: AlertType.PUBLIC_HEALTH_EMERGENCY,
      severity: Severity.ADVISORY,
      message:
        "COVID-19 advisory: Mask mandate in effect. Follow local health guidelines.",
      latitude: 40.7074,
      longitude: -74.0113,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      createdAt: new Date(Date.now() - 45 * 60 * 1000), // 45 minutes ago
    },
    // Power Outage - INFO
    {
      userId: "user_mike_brown",
      type: AlertType.POWER_OUTAGE,
      severity: Severity.INFO,
      message: "Scheduled power outage in your area from 2:00 PM to 4:00 PM.",
      latitude: 40.748,
      longitude: -74.0048,
      isResolved: true,
      resolvedAt: new Date(Date.now() - 20 * 60 * 1000), // 20 minutes ago
      createdAt: new Date(Date.now() - 35 * 60 * 1000), // 35 minutes ago
    },
  ];

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
    });
  }

  console.log(`✅ Created ${alerts.length} alerts`);

  // Summary
  console.log("\n📊 Database seeding completed!");
  console.log("=".repeat(50));
  console.log(`👥 Users: ${users.length}`);
  console.log(`📞 Emergency Contacts: ${emergencyContacts.length}`);
  console.log(`⚙️ Detection Rules: ${detectionRules.length}`);
  console.log(`📍 Location Records: ${locations.length}`);
  console.log(`🚨 Alerts: ${alerts.length}`);
  console.log("=".repeat(50));

  // Alert breakdown
  const unresolvedAlerts = alerts.filter((a) => !a.isResolved).length;
  const criticalAlerts = alerts.filter((a) => a.severity === "CRITICAL").length;
  const highAlerts = alerts.filter((a) => a.severity === "HIGH").length;

  console.log(`🔴 Unresolved Alerts: ${unresolvedAlerts}`);
  console.log(`⚠️ Critical Alerts: ${criticalAlerts}`);
  console.log(`🟡 High Priority Alerts: ${highAlerts}`);
  console.log("\n✅ Ready to test the dashboard!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
