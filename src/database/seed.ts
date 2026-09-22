import "dotenv/config";
import * as bcrypt from "bcrypt";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

async function seed(): Promise<void> {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool, { schema });

  console.log("Seeding database...");

  const adminPasswordHash = await bcrypt.hash("AdminPass123", 12);
  const [admin] = await db
    .insert(schema.users)
    .values({
      email: "admin@bloghub.local",
      password: adminPasswordHash,
      name: "Admin User",
      role: "ADMIN",
    })
    .onConflictDoNothing()
    .returning();

  if (admin) {
    console.log(`Admin created: ${admin.email} (password: AdminPass123)`);

    await db.insert(schema.posts).values({
      title: "Welcome to BlogHub",
      slug: "welcome-to-bloghub",
      content:
        "This is a seeded post to help you get started exploring the API.",
      status: "PUBLISHED",
      publishedAt: new Date(),
      authorId: admin.id,
    });
    console.log("Sample post created");
  } else {
    console.log("ℹAdmin already exists, skipping seed (data already present)");
  }

  await pool.end();
  console.log("Seeding complete");
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
