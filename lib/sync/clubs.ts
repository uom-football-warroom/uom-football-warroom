import { getCompetitionTeams } from "@/lib/football-data/client";
import type { FootballDataTeam } from "@/lib/football-data/types";
import { prisma } from "@/lib/db";

export type SyncClubsResult = {
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

function createSlug(name: string, externalId: number): string {
  const normalizedName = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  const suffix = `-${externalId}`;
  const maximumBaseLength = 120 - suffix.length;

  const slugBase =
    normalizedName
      .slice(0, maximumBaseLength)
      .replace(/-+$/g, "") || "club";

  return `${slugBase}${suffix}`;
}

function isValidTeam(team: FootballDataTeam): boolean {
  return (
    Number.isInteger(team.id) &&
    typeof team.name === "string" &&
    team.name.trim().length > 0
  );
}

export async function syncClubs(
  competitionCode = process.env.FOOTBALL_DATA_COMPETITION?.trim() || "PL",
): Promise<SyncClubsResult> {
  const normalizedCompetitionCode = competitionCode
    .trim()
    .toUpperCase();

  console.log(
    `Fetching clubs for competition ${normalizedCompetitionCode}...`,
  );

  const response = await getCompetitionTeams(
    normalizedCompetitionCode,
  );

  if (!Array.isArray(response.teams)) {
    throw new Error(
      "Football-data.org response does not contain a valid teams array",
    );
  }

  const validTeams = response.teams.filter(isValidTeam);
  const skipped = response.teams.length - validTeams.length;

  const externalIds = validTeams.map((team) => team.id);

  const existingClubs = await prisma.club.findMany({
    where: {
      externalId: {
        in: externalIds,
      },
    },
    select: {
      externalId: true,
    },
  });

  const existingExternalIds = new Set(
    existingClubs
      .map((club) => club.externalId)
      .filter((externalId): externalId is number => externalId !== null),
  );

  const competitionName =
    limitText(response.competition?.name, 120) ??
    normalizedCompetitionCode;

  let created = 0;
  let updated = 0;

  for (const team of validTeams) {
    const clubData = {
      externalId: team.id,
      slug: createSlug(team.name, team.id),
      name: team.name.trim().slice(0, 120),
      shortName: limitText(team.shortName, 80),
      tla: limitText(team.tla, 10),
      crestUrl: cleanText(team.crest),
      country: limitText(team.area?.name, 80),
      competition: competitionName,
      stadium: limitText(team.venue, 160),
      founded:
        typeof team.founded === "number" &&
        Number.isInteger(team.founded)
          ? team.founded
          : null,
      manager: limitText(team.coach?.name, 120),
      websiteUrl: cleanText(team.website),
    };

    await prisma.club.upsert({
      where: {
        externalId: team.id,
      },
      update: clubData,
      create: clubData,
    });

    if (existingExternalIds.has(team.id)) {
      updated += 1;
    } else {
      created += 1;
    }

    console.log(`Synchronized: ${team.name}`);
  }

  return {
    competitionCode: normalizedCompetitionCode,
    competitionName,
    received: response.teams.length,
    created,
    updated,
    skipped,
  };
}