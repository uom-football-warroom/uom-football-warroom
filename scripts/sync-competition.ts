import "dotenv/config";

import { prisma } from "../lib/db";
import { syncClubs } from "../lib/sync/clubs";
import { syncFixtures } from "../lib/sync/fixtures";

async function main() {
  const competitionCode = process.argv[2]?.trim().toUpperCase();

  if (!competitionCode) {
    throw new Error(
      "Competition code is required. Example: npx tsx scripts/sync-competition.ts BL1",
    );
  }

  if (!/^[A-Z0-9]+$/.test(competitionCode)) {
    throw new Error("Invalid competition code");
  }

  console.log(`Starting synchronization for ${competitionCode}...`);

  const clubResult = await syncClubs(competitionCode);

  console.log("");
  console.log(`Clubs synchronized for ${clubResult.competitionName}`);
  console.log(`Created: ${clubResult.created}`);
  console.log(`Updated: ${clubResult.updated}`);
  console.log(`Skipped: ${clubResult.skipped}`);

  const fixtureResult = await syncFixtures(competitionCode);

  console.log("");
  console.log(`Fixtures synchronized for ${fixtureResult.competitionName}`);
  console.log(`Created: ${fixtureResult.created}`);
  console.log(`Updated: ${fixtureResult.updated}`);
  console.log(`Skipped: ${fixtureResult.skipped}`);
}

main()
  .catch((error: unknown) => {
    console.error("Competition synchronization failed:");

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