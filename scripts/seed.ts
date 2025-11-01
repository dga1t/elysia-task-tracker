import { db } from "../src/infrastructure/db/connection";
import { tasks } from "../src/infrastructure/db/schema";

await db.delete(tasks);

await db.insert(tasks).values([
  {
    title: "Design architecture",
    description: "Draft the system design document",
    status: "pending"
  },
  {
    title: "Prepare release",
    description: "Coordinate QA for release",
    status: "completed"
  }
]);

console.log("Seed data inserted");
process.exit(0);
