import 'dotenv/config'

import { PrismaPg } from '@prisma/adapter-pg'

import { PrismaClient } from '../generated/prisma/client'
import { FixtureStatus } from '../generated/prisma/enums'

const connectionString = process.env.DIRECT_URL

if (!connectionString) {
  throw new Error('DIRECT_URL is missing from the .env file')
}

const adapter = new PrismaPg({
  connectionString,
})

const prisma = new PrismaClient({
  adapter,
})

function daysFromNow(days: number, hour = 18): Date {
  const date = new Date()

  date.setUTCDate(date.getUTCDate() + days)
  date.setUTCHours(hour, 0, 0, 0)

  return date
}

async function main() {
  console.log('Starting database seed...')

  // Negative external IDs identify temporary development data.
  const northbridge = await prisma.club.upsert({
    where: {
      externalId: -1001,
    },
    update: {
      slug: 'northbridge-fc',
      name: 'Northbridge FC',
      shortName: 'Northbridge',
      tla: 'NFC',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Northbridge Stadium',
      stadiumCapacity: 42000,
      founded: 1901,
    },
    create: {
      externalId: -1001,
      slug: 'northbridge-fc',
      name: 'Northbridge FC',
      shortName: 'Northbridge',
      tla: 'NFC',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Northbridge Stadium',
      stadiumCapacity: 42000,
      founded: 1901,
    },
  })

  const harborCity = await prisma.club.upsert({
    where: {
      externalId: -1002,
    },
    update: {
      slug: 'harbor-city-fc',
      name: 'Harbor City FC',
      shortName: 'Harbor City',
      tla: 'HCF',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Harbor Arena',
      stadiumCapacity: 38000,
      founded: 1912,
    },
    create: {
      externalId: -1002,
      slug: 'harbor-city-fc',
      name: 'Harbor City FC',
      shortName: 'Harbor City',
      tla: 'HCF',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Harbor Arena',
      stadiumCapacity: 38000,
      founded: 1912,
    },
  })

  const redwoodUnited = await prisma.club.upsert({
    where: {
      externalId: -1003,
    },
    update: {
      slug: 'redwood-united',
      name: 'Redwood United',
      shortName: 'Redwood',
      tla: 'RWU',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Redwood Park',
      stadiumCapacity: 35000,
      founded: 1920,
    },
    create: {
      externalId: -1003,
      slug: 'redwood-united',
      name: 'Redwood United',
      shortName: 'Redwood',
      tla: 'RWU',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Redwood Park',
      stadiumCapacity: 35000,
      founded: 1920,
    },
  })

  const kingsport = await prisma.club.upsert({
    where: {
      externalId: -1004,
    },
    update: {
      slug: 'kingsport-athletic',
      name: 'Kingsport Athletic',
      shortName: 'Kingsport',
      tla: 'KSA',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Kingsport Ground',
      stadiumCapacity: 31000,
      founded: 1926,
    },
    create: {
      externalId: -1004,
      slug: 'kingsport-athletic',
      name: 'Kingsport Athletic',
      shortName: 'Kingsport',
      tla: 'KSA',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Kingsport Ground',
      stadiumCapacity: 31000,
      founded: 1926,
    },
  })

  const riverside = await prisma.club.upsert({
    where: {
      externalId: -1005,
    },
    update: {
      slug: 'riverside-rovers',
      name: 'Riverside Rovers',
      shortName: 'Riverside',
      tla: 'RSR',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Riverside Stadium',
      stadiumCapacity: 29000,
      founded: 1934,
    },
    create: {
      externalId: -1005,
      slug: 'riverside-rovers',
      name: 'Riverside Rovers',
      shortName: 'Riverside',
      tla: 'RSR',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Riverside Stadium',
      stadiumCapacity: 29000,
      founded: 1934,
    },
  })

  const metroStars = await prisma.club.upsert({
    where: {
      externalId: -1006,
    },
    update: {
      slug: 'metro-stars',
      name: 'Metro Stars',
      shortName: 'Metro Stars',
      tla: 'MTS',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Metro Stadium',
      stadiumCapacity: 45000,
      founded: 1940,
    },
    create: {
      externalId: -1006,
      slug: 'metro-stars',
      name: 'Metro Stars',
      shortName: 'Metro Stars',
      tla: 'MTS',
      country: 'Demo Country',
      competition: 'Demo Premier League',
      stadium: 'Metro Stadium',
      stadiumCapacity: 45000,
      founded: 1940,
    },
  })

  const fixtures = [
    {
      externalId: -2001,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 1,
      homeClubId: northbridge.id,
      awayClubId: harborCity.id,
      startTime: daysFromNow(2),
      venue: northbridge.stadium,
      status: FixtureStatus.SCHEDULED,
    },
    {
      externalId: -2002,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 1,
      homeClubId: redwoodUnited.id,
      awayClubId: kingsport.id,
      startTime: daysFromNow(3),
      venue: redwoodUnited.stadium,
      status: FixtureStatus.SCHEDULED,
    },
    {
      externalId: -2003,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 1,
      homeClubId: riverside.id,
      awayClubId: metroStars.id,
      startTime: daysFromNow(4),
      venue: riverside.stadium,
      status: FixtureStatus.SCHEDULED,
    },
    {
      externalId: -2004,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 2,
      homeClubId: harborCity.id,
      awayClubId: redwoodUnited.id,
      startTime: daysFromNow(8),
      venue: harborCity.stadium,
      status: FixtureStatus.SCHEDULED,
    },
    {
      externalId: -2005,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 2,
      homeClubId: kingsport.id,
      awayClubId: riverside.id,
      startTime: daysFromNow(9),
      venue: kingsport.stadium,
      status: FixtureStatus.SCHEDULED,
    },
    {
      externalId: -2006,
      competition: 'Demo Premier League',
      competitionCode: 'DPL',
      matchday: 2,
      homeClubId: metroStars.id,
      awayClubId: northbridge.id,
      startTime: daysFromNow(10),
      venue: metroStars.stadium,
      status: FixtureStatus.SCHEDULED,
    },
  ]

  for (const fixture of fixtures) {
    await prisma.fixture.upsert({
      where: {
        externalId: fixture.externalId,
      },
      update: fixture,
      create: fixture,
    })
  }

  console.log(`Seeded 6 clubs and ${fixtures.length} fixtures.`)
  console.log('Database seed completed successfully.')
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed:', error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })