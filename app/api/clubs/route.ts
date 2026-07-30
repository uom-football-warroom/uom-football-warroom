import { NextResponse } from 'next/server'

import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const clubs = await prisma.club.findMany({
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json({
      success: true,
      data: clubs,
    })
  } catch (error) {
    console.error('Failed to fetch clubs:', error)

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch clubs',
      },
      {
        status: 500,
      },
    )
  }
}