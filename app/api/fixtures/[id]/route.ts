import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'
import { getMatchHeadToHead } from '@/lib/football-data/client'
import type {
  FootballDataMatch,
  FootballDataMatchTeam,
} from '@/lib/football-data/types'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(value: string): boolean {
  return uuidPattern.test(value)
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid fixture ID',
      },
      {
        status: 400,
      },
    )
  }

  try {
    const fixture = await prisma.fixture.findUnique({
      where: {
        id,
      },
      include: {
        homeClub: true,
        awayClub: true,
      },
    })

    if (!fixture) {
      return NextResponse.json(
        {
          success: false,
          message: 'Fixture not found',
        },
        {
          status: 404,
        },
      )
    }

    const otherFixturesPromise = findOtherFixtures(fixture)
    let headToHead: ReturnType<typeof normalizeHeadToHeadMatch>[] = []
    let headToHeadUnavailable = !isPositiveInteger(fixture.externalId)

    if (isPositiveInteger(fixture.externalId)) {
      try {
        const response = await getMatchHeadToHead(fixture.externalId)

        if (!Array.isArray(response.matches)) {
          console.warn(
            `Head-to-head response is invalid for fixture ${fixture.id}.`,
          )
          headToHeadUnavailable = true
        } else {
          headToHead = response.matches
            .filter(
              (match) =>
                isPositiveInteger(match.id) &&
                match.id !== fixture.externalId &&
                (match.status === 'FINISHED' || match.status === 'AWARDED') &&
                isValidTeam(match.homeTeam) &&
                isValidTeam(match.awayTeam) &&
                isValidDate(match.utcDate),
            )
            .sort(
              (first, second) =>
                new Date(second.utcDate).getTime() -
                new Date(first.utcDate).getTime(),
            )
            .slice(0, 5)
            .map(normalizeHeadToHeadMatch)
          headToHeadUnavailable = false
        }
      } catch {
        console.warn(
          `Head-to-head data is unavailable for fixture ${fixture.id}.`,
        )
        headToHeadUnavailable = true
      }
    }

    const otherFixtures = await otherFixturesPromise

    return NextResponse.json({
      success: true,
      data: {
        fixture,
        headToHead,
        headToHeadUnavailable,
        otherFixtures,
      },
    })
  } catch (error) {
    console.error('Failed to fetch fixture:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch fixture',
      },
      {
        status: 500,
      },
    )
  }
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && (value as number) > 0
}

function isValidDate(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    !Number.isNaN(new Date(value).getTime())
  )
}

function isValidTeam(
  team: FootballDataMatchTeam | null | undefined,
): team is FootballDataMatchTeam {
  return Boolean(team && cleanText(team.name))
}

function cleanText(value: string | null | undefined): string | null {
  const cleanedValue = value?.trim()
  return cleanedValue ? cleanedValue : null
}

function nullableScore(value: number | null | undefined): number | null {
  return typeof value === 'number' && Number.isFinite(value)
    ? value
    : null
}

function normalizeTeam(team: FootballDataMatchTeam) {
  return {
    externalId: isPositiveInteger(team.id) ? team.id : null,
    name: cleanText(team.name) ?? 'Unknown team',
    shortName: cleanText(team.shortName),
    tla: cleanText(team.tla),
    crestUrl: cleanText(team.crest),
  }
}

function normalizeHeadToHeadMatch(match: FootballDataMatch) {
  return {
    externalId: match.id,
    utcDate: match.utcDate,
    status: match.status,
    competition: {
      name: cleanText(match.competition?.name),
      code: cleanText(match.competition?.code),
    },
    homeTeam: normalizeTeam(match.homeTeam),
    awayTeam: normalizeTeam(match.awayTeam),
    homeScore: nullableScore(match.score?.fullTime?.home),
    awayScore: nullableScore(match.score?.fullTime?.away),
  }
}

type SelectedFixture = {
  id: string
  competitionCode: string | null
  matchday: number | null
}

async function findOtherFixtures(fixture: SelectedFixture) {
  const competitionCode = cleanText(fixture.competitionCode)

  if (!competitionCode) {
    return []
  }

  const baseWhere = {
    competitionCode,
    id: {
      not: fixture.id,
    },
  }

  if (fixture.matchday !== null) {
    const sameMatchdayFixtures = await prisma.fixture.findMany({
      where: {
        ...baseWhere,
        matchday: fixture.matchday,
      },
      include: {
        homeClub: true,
        awayClub: true,
      },
      orderBy: {
        startTime: 'asc',
      },
      take: 6,
    })

    if (sameMatchdayFixtures.length > 0) {
      return sameMatchdayFixtures
    }
  }

  return prisma.fixture.findMany({
    where: baseWhere,
    include: {
      homeClub: true,
      awayClub: true,
    },
    orderBy: {
      startTime: 'asc',
    },
    take: 6,
  })
}
