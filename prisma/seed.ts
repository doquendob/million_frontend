import { Prisma, PropertyType } from "@prisma/client";
import { prisma } from "../src/lib/prisma";

// Create users first
const users = [
  { id: "owner-123", email: "john.doe@example.com", name: "John Doe" },
  { id: "owner-456", email: "jane.smith@example.com", name: "Jane Smith" },
  { id: "owner-789", email: "mike.wilson@example.com", name: "Mike Wilson" },
  {
    id: "owner-234",
    email: "sarah.johnson@example.com",
    name: "Sarah Johnson",
  },
  { id: "owner-567", email: "david.brown@example.com", name: "David Brown" },
  { id: "owner-default", email: "default@example.com", name: "Default Owner" },
  { id: "owner-678", email: "emily.chen@example.com", name: "Emily Chen" },
  { id: "owner-789", email: "robert.garcia@example.com", name: "Robert Garcia" },
  { id: "owner-890", email: "lisa.wong@example.com", name: "Lisa Wong" },
  { id: "owner-901", email: "thomas.jackson@example.com", name: "Thomas Jackson" },
];

// Property data mapped to PostgreSQL schema
const properties = [
  {
    id: "prop-001",
    name: "Modern Downtown Loft",
    description:
      "Stunning contemporary loft in the heart of downtown with floor-to-ceiling windows, exposed brick, and high ceilings. Walking distance to restaurants and entertainment.",
    addressProperty: "245 Market Street, San Francisco, CA 94102",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("1250000"),
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    active: true,
    ownerId: "owner-123",
  },
  {
    id: "prop-002",
    name: "Spacious Family Home",
    description:
      "Beautiful 4-bedroom, 3-bathroom family home with large backyard, updated kitchen, and master suite. Perfect for growing families in excellent school district.",
    addressProperty: "1834 Elm Avenue, Austin, TX 78704",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("875000"),
    imageUrl:
      "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    active: true,
    ownerId: "owner-456",
  },
  {
    id: "prop-003",
    name: "Luxury Penthouse Suite",
    description:
      "Exclusive penthouse with panoramic city views, private elevator, rooftop terrace, and premium finishes throughout. Ultra-luxury living at its finest.",
    addressProperty: "88 Central Park West, New York, NY 10023",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("4500000"),
    imageUrl:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    active: true,
    ownerId: "owner-789",
  },
  {
    id: "prop-004",
    name: "Cozy Suburban Starter Home",
    description:
      "Charming 2-bedroom, 1-bathroom home perfect for first-time buyers. Recently renovated with modern appliances and a fenced yard.",
    addressProperty: "567 Oak Lane, Portland, OR 97210",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("425000"),
    imageUrl:
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
    active: true,
    ownerId: "owner-234",
  },
  {
    id: "prop-005",
    name: "Beachfront Villa",
    description:
      "Spectacular oceanfront property with direct beach access, infinity pool, 5 bedrooms, and breathtaking sunset views. Your dream vacation home awaits.",
    addressProperty: "12 Ocean Drive, Miami Beach, FL 33139",
    type: PropertyType.HOUSE, // Changed from Villa to HOUSE (Villa not in enum)
    priceProperty: new Prisma.Decimal("3200000"),
    imageUrl:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    active: true,
    ownerId: "owner-567",
  },
  {
    id: "prop-006",
    name: "Downtown Miami Penthouse",
    description: "Luxury penthouse with panoramic views of Biscayne Bay and the Miami skyline. Features marble floors, gourmet kitchen, and private balcony.",
    addressProperty: "125 SW North River Dr, Miami, FL 33130",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("850000"),
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    active: false,
    ownerId: "owner-default",
  },
  // NEW PROPERTIES BELOW
  {
    id: "prop-007",
    name: "Mountain Retreat Cabin",
    description:
      "Cozy log cabin nestled in the Rocky Mountains. Perfect for weekend getaways with fireplace, hot tub, and hiking trail access. Recently renovated.",
    addressProperty: "789 Pine Trail, Aspen, CO 81611",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("650000"),
    imageUrl: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    active: true,
    ownerId: "owner-678",
  },
  {
    id: "prop-008",
    name: "Urban Studio Apartment",
    description:
      "Modern studio apartment in bustling downtown. Perfect for young professionals. Includes gym access, rooftop terrace, and concierge service.",
    addressProperty: "456 Broadway, Seattle, WA 98101",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("375000"),
    imageUrl: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    active: true,
    ownerId: "owner-789",
  },
  {
    id: "prop-009",
    name: "Historic Victorian Home",
    description:
      "Beautifully restored 19th-century Victorian home with original hardwood floors, stained glass windows, and wrap-around porch. Recently updated with modern amenities.",
    addressProperty: "321 Maple Street, Boston, MA 02108",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("1250000"),
    imageUrl: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    active: true,
    ownerId: "owner-890",
  },
  {
    id: "prop-010",
    name: "Lakeside Cottage",
    description:
      "Charming 3-bedroom cottage on Crystal Lake. Features private dock, screened porch, and beautiful lake views. Perfect for summer retreats.",
    addressProperty: "123 Lakeview Drive, Traverse City, MI 49684",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("550000"),
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    active: false,
    ownerId: "owner-901",
  },
  {
    id: "prop-011",
    name: "Modern Luxury Condo",
    description:
      "Brand new luxury condo with smart home features, resort-style pool, and 24/7 security. Located in the heart of the financial district.",
    addressProperty: "999 Bay Street, Toronto, ON M5H 2Y4",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("950000"),
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    active: true,
    ownerId: "owner-123",
  },
  {
    id: "prop-012",
    name: "Desert Modern Home",
    description:
      "Architectural masterpiece in the Arizona desert. Features floor-to-ceiling windows, infinity pool, and minimalist design blending with natural surroundings.",
    addressProperty: "888 Joshua Tree Lane, Scottsdale, AZ 85255",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("1850000"),
    imageUrl: "https://images.unsplash.com/photo-1487956382158-bb926046304a?w=800",
    active: true,
    ownerId: "owner-456",
  },
  {
    id: "prop-013",
    name: "City View Apartment",
    description:
      "Spacious 2-bedroom apartment with stunning city skyline views. Recently renovated with high-end appliances and hardwood flooring.",
    addressProperty: "777 Michigan Ave, Chicago, IL 60611",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("625000"),
    imageUrl: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800",
    active: true,
    ownerId: "owner-789",
  },
  {
    id: "prop-014",
    name: "Farmhouse with Land",
    description:
      "30-acre farm with restored farmhouse, barn, and pond. Perfect for hobby farming or equestrian use. Beautiful country setting just 45 minutes from city.",
    addressProperty: "555 Country Road, Nashville, TN 37211",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("1250000"),
    imageUrl: "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800",
    active: true,
    ownerId: "owner-234",
  },
  {
    id: "prop-015",
    name: "Penthouse with Terrace",
    description:
      "Luxury penthouse featuring 500 sq ft private terrace, chef's kitchen, and custom finishes. Building amenities include pool, spa, and private theater.",
    addressProperty: "444 Rodeo Drive, Beverly Hills, CA 90210",
    type: PropertyType.APARTMENT,
    priceProperty: new Prisma.Decimal("3500000"),
    imageUrl: "https://images.unsplash.com/photo-1613977257363-707ba9348227?w=800",
    active: false,
    ownerId: "owner-567",
  },
  {
    id: "prop-016",
    name: "Waterfront Townhouse",
    description:
      "Modern townhouse with private boat slip and water views. Three-level living with rooftop deck, gourmet kitchen, and smart home system.",
    addressProperty: "222 Harbor View, San Diego, CA 92101",
    type: PropertyType.HOUSE,
    priceProperty: new Prisma.Decimal("1450000"),
    imageUrl: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800",
    active: true,
    ownerId: "owner-default",
  },
];

async function main() {
  console.log("🌱 Starting seed...");

  // Create users
  console.log("Creating users...");
  for (const user of users) {
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: user,
    });
  }
  console.log(`✅ Created ${users.length} users`);

  // Create properties
  console.log("Creating properties...");
  for (const property of properties) {
    await prisma.property.upsert({
      where: { id: property.id },
      update: {},
      create: property,
    });
  }
  console.log(`✅ Created ${properties.length} properties`);

  console.log("🎉 Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });