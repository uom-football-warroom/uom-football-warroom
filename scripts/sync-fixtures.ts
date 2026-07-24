import "dotenv/config";

import { prisma } from "../lib/db";
import { syncFixtures } from "../lib/sync/fixtures";

async function main() {
  console.log("Starting football fixture synchronization...");

  const result = await syncFixtures();

  console.log("");
  console.log("Fixture synchronization completed successfully.");
  console.log(`Competition: ${result.competitionName}`);
  console.log(`Competition code: ${result.competitionCode}`);
  console.log(`Matches received: ${result.received}`);
  console.log(`Fixtures created: ${result.created}`);
  console.log(`Fixtures updated: ${result.updated}`);
  console.log(`Matches skipped: ${result.skipped}`);
}

main()
  .catch((error: unknown) => {
    console.error("Fixture synchronization failed:");

    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(error);
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
