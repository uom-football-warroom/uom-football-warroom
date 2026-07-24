import "dotenv/config";

import { prisma } from "../lib/db";

const DEMO_FILTER = {
  externalId: {
    lt: 0,
  },
};

async function main() {
  const shouldDelete = process.argv.includes("--confirm");

  const [demoFixtureCount, demoClubCount] = await Promise.all([
    prisma.fixture.count({
      where: DEMO_FILTER,
    }),
    prisma.club.count({
      where: DEMO_FILTER,
    }),
  ]);

  console.log("Demo data found:");
  console.log(`Fixtures: ${demoFixtureCount}`);
  console.log(`Clubs: ${demoClubCount}`);

  if (!shouldDelete) {
    console.log("");
    console.log("Dry run only. Nothing was deleted.");
    console.log(
      "Run again with --confirm to permanently delete the demo data.",
    );

    return;
  }

  /*
   * Delete fixtures first because they reference clubs through
   * homeClubId and awayClubId.
   */
  const [deletedFixtures, deletedClubs] = await prisma.$transaction([
    prisma.fixture.deleteMany({
      where: DEMO_FILTER,
    }),

    prisma.club.deleteMany({
      where: DEMO_FILTER,
    }),
  ]);

  console.log("");
  console.log("Demo data deleted successfully.");
  console.log(`Fixtures deleted: ${deletedFixtures.count}`);
  console.log(`Clubs deleted: ${deletedClubs.count}`);
}

main()
  .catch((error: unknown) => {
    console.error("Failed to delete demo data:");

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
