import { FixtureStatus } from "../../generated/prisma/enums";
import { prisma } from "@/lib/db";
import { getCompetitionMatches } from "@/lib/football-data/client";
import type {
  FootballDataMatch,
  FootballDataMatchStatus,
} from "@/lib/football-data/types";

export type SyncFixturesResult = {
  competitionCode: string;
  competitionName: string;
  received: number;
  created: number;
  updated: number;
  skipped: number;
};

function cleanText(value: string | null | undefined): string | null {
  const cleanedValue = value?.trim();

  return cleanedValue ? cleanedValue : null;
}

function limitText(
  value: string | null | undefined,
  maximumLength: number,
): string | null {
  const cleanedValue = cleanText(value);

  return cleanedValue
    ? cleanedValue.slice(0, maximumLength)
    : null;
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0;
}

function mapFixtureStatus(
  status: FootballDataMatchStatus | string | null | undefined,
): FixtureStatus {
  switch (status) {
    case "IN_PLAY":
    case "PAUSED":
    case "EXTRA_TIME":
    case "PENALTY_SHOOTOUT":
      return FixtureStatus.LIVE;
    case "FINISHED":
    case "AWARDED":
      return FixtureStatus.COMPLETED;
    case "SUSPENDED":
    case "POSTPONED":
      return FixtureStatus.POSTPONED;
    case "CANCELLED":
      return FixtureStatus.CANCELLED;
    case "SCHEDULED":
    case "TIMED":
    default:
      return FixtureStatus.SCHEDULED;
  }
}

function validScore(value: number | null | undefined): number | null {
  return typeof value === "number" &&
    Number.isInteger(value) &&
    value >= 0
    ? value
    : null;
}

function selectReferee(match: FootballDataMatch): string | null {
  const referees = Array.isArray(match.referees) ? match.referees : [];
  const mainReferee =
    referees.find(
      (referee) => referee.type?.trim().toUpperCase() === "REFEREE",
    ) ?? referees[0];

  return limitText(mainReferee?.name, 120);
}

export async function syncFixtures(
  competitionCode =
    process.env.FOOTBALL_DATA_COMPETITION?.trim() || "PL",
): Promise<SyncFixturesResult> {
  const normalizedCompetitionCode = competitionCode.trim().toUpperCase();

  console.log(
    `Fetching fixtures for competition ${normalizedCompetitionCode}...`,
  );

  const response = await getCompetitionMatches(normalizedCompetitionCode);

  if (!Array.isArray(response.matches)) {
    throw new Error(
      "Football-data.org response does not contain a valid matches array",
    );
  }

  const externalTeamIds = Array.from(
    new Set(
      response.matches.flatMap((match) =>
        [match.homeTeam?.id, match.awayTeam?.id].filter(isPositiveInteger),
      ),
    ),
  );

  const clubs = await prisma.club.findMany({
    where: {
      externalId: {
        in: externalTeamIds,
      },
    },
    select: {
      id: true,
      externalId: true,
      name: true,
      stadium: true,
    },
  });

  const clubsByExternalId = new Map(
    clubs
      .filter(
        (club): club is typeof club & { externalId: number } =>
          club.externalId !== null,
      )
      .map((club) => [club.externalId, club]),
  );

  const externalMatchIds = response.matches
    .map((match) => match.id)
    .filter(isPositiveInteger);

  const existingFixtures = await prisma.fixture.findMany({
    where: {
      externalId: {
        in: externalMatchIds,
      },
    },
    select: {
      externalId: true,
    },
  });

  const existingExternalIds = new Set(
    existingFixtures
      .map((fixture) => fixture.externalId)
      .filter((externalId): externalId is number => externalId !== null),
  );

  const competitionName =
    limitText(response.competition?.name, 120) ??
    normalizedCompetitionCode;

  let created = 0;
  let updated = 0;
  let skipped = 0;

  for (const match of response.matches) {
    if (!isPositiveInteger(match.id)) {
      console.warn("Skipped fixture with an invalid external match ID.");
      skipped += 1;
      continue;
    }

    if (
      !isPositiveInteger(match.homeTeam?.id) ||
      !isPositiveInteger(match.awayTeam?.id)
    ) {
      console.warn(
        `Skipped fixture ${match.id}: invalid home or away team ID.`,
      );
      skipped += 1;
      continue;
    }

    const homeClub = clubsByExternalId.get(match.homeTeam.id);
    const awayClub = clubsByExternalId.get(match.awayTeam.id);

    if (!homeClub || !awayClub) {
      console.warn(
        `Skipped fixture ${match.id}: a related club is missing from the database.`,
      );
      skipped += 1;
      continue;
    }

    const startTime = new Date(match.utcDate);

    if (Number.isNaN(startTime.getTime())) {
      console.warn(`Skipped fixture ${match.id}: invalid kickoff date.`);
      skipped += 1;
      continue;
    }

    const fixtureData = {
      externalId: match.id,
      competition:
        limitText(match.competition?.name, 120) ?? competitionName,
      competitionCode:
        limitText(match.competition?.code, 20) ??
        normalizedCompetitionCode.slice(0, 20),
      matchday:
        typeof match.matchday === "number" &&
        Number.isInteger(match.matchday)
          ? match.matchday
          : null,
      homeClubId: homeClub.id,
      awayClubId: awayClub.id,
      startTime,
      venue:
        limitText(match.venue, 160) ??
        limitText(homeClub.stadium, 160),
      status: mapFixtureStatus(match.status),
      homeScore: validScore(match.score?.fullTime?.home),
      awayScore: validScore(match.score?.fullTime?.away),
      referee: selectReferee(match),
    };

    await prisma.fixture.upsert({
      where: {
        externalId: match.id,
      },
      update: fixtureData,
      create: fixtureData,
    });

    if (existingExternalIds.has(match.id)) {
      updated += 1;
    } else {
      created += 1;
      existingExternalIds.add(match.id);
    }

    const homeName = cleanText(match.homeTeam.name) ?? homeClub.name;
    const awayName = cleanText(match.awayTeam.name) ?? awayClub.name;

    console.log(`Synchronized: ${homeName} vs ${awayName}`);
  }

  return {
    competitionCode: normalizedCompetitionCode,
    competitionName,
    received: response.matches.length,
    created,
    updated,
    skipped,
  };
}
