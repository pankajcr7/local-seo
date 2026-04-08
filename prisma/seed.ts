import { seedDatabase } from "../src/data/seed";

seedDatabase()
  .then((result) => {
    console.log("Seed completed", result);
  })
  .catch((error) => {
    console.error("Seed failed", error);
    process.exit(1);
  });
