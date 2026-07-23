import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const fixtures = await prisma.fixture.findMany({
      include: {
        homeClub: true,
        awayClub: true,
      },
      orderBy: {
        startTime: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: fixtures,
    })
  } catch (error) {
    console.error('Failed to fetch fixtures:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch fixtures',
      },
      {
        status: 500,
      },
    )
  }
}
