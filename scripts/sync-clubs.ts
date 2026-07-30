import "dotenv/config";

import { prisma } from "../lib/db";
import { syncClubs } from "../lib/sync/clubs";

async function main() {
  console.log("Starting football club synchronization...");

  const result = await syncClubs();

  console.log("");
  console.log("Club synchronization completed successfully.");
  console.log(`Competition: ${result.competitionName}`);
  console.log(`Competition code: ${result.competitionCode}`);
  console.log(`Teams received: ${result.received}`);
  console.log(`Clubs created: ${result.created}`);
  console.log(`Clubs updated: ${result.updated}`);
  console.log(`Teams skipped: ${result.skipped}`);
}

main()
  .catch((error: unknown) => {
    console.error("Club synchronization failed:");

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