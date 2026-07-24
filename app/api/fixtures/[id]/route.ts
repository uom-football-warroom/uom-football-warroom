import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

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

    return NextResponse.json({
      success: true,
      data: fixture,
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
