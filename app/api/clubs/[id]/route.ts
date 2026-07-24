import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

type RouteContext = {
  params: Promise<{
    id: string
  }>
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function isValidUuid(value: string) {
  return uuidPattern.test(value)
}

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params

  if (!id || !isValidUuid(id)) {
    return NextResponse.json(
      {
        success: false,
        message: 'Invalid club ID',
      },
      {
        status: 400,
      },
    )
  }

  try {
    const club = await prisma.club.findUnique({
      where: {
        id,
      },
      include: {
        homeFixtures: {
          include: {
            awayClub: true,
          },
          orderBy: {
            startTime: 'asc',
          },
        },
        awayFixtures: {
          include: {
            homeClub: true,
          },
          orderBy: {
            startTime: 'asc',
          },
        },
      },
    })

    if (!club) {
      return NextResponse.json(
        {
          success: false,
          message: 'Club not found',
        },
        {
          status: 404,
        },
      )
    }

    return NextResponse.json({
      success: true,
      data: club,
    })
  } catch (error) {
    console.error('Failed to fetch club:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch club',
      },
      {
        status: 500,
      },
    )
  }
}
