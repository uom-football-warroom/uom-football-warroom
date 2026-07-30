import { NextResponse } from "next/server";

import { syncClubs } from "@/lib/sync/clubs";
import { syncFixtures } from "@/lib/sync/fixtures";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isAuthorized(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    throw new Error("CRON_SECRET is not configured.");
  }

  const authorization = request.headers.get("authorization");

  return authorization === `Bearer ${cronSecret}`;
}

async function runSync(request: Request) {
  try {
    if (!isAuthorized(request)) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized.",
        },
        {
          status: 401,
        },
      );
    }

    // Clubs must exist before fixtures reference them.
    const clubsResult = await syncClubs();
    const fixturesResult = await syncFixtures();

    return NextResponse.json(
      {
        success: true,
        message: "Football data synchronized successfully.",
        data: {
          clubs: clubsResult,
          fixtures: fixturesResult,
          completedAt: new Date().toISOString(),
        },
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Football data synchronization failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Unable to synchronize football data.",
      },
      {
        status: 500,
      },
    );
  }
}

export async function GET(request: Request) {
  return runSync(request);
}

export async function POST(request: Request) {
  return runSync(request);
}