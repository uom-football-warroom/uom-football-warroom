import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json(
      {
        success: false,
        message: "You must be signed in to save favourite clubs.",
      },
      {
        status: 401,
      },
    );
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid request body.",
      },
      {
        status: 400,
      },
    );
  }

  const clubIds =
    typeof body === "object" && body !== null && "clubIds" in body
      ? body.clubIds
      : null;

  if (
    !Array.isArray(clubIds) ||
    clubIds.length === 0 ||
    !clubIds.every(
      (clubId) =>
        typeof clubId === "string" && clubId.trim().length > 0,
    )
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "Select at least one valid club.",
      },
      {
        status: 400,
      },
    );
  }

  const uniqueClubIds = [...new Set(clubIds)];

  try {
    const userProfile = await prisma.userProfile.findUnique({
      where: {
        id: user.id,
      },
      select: {
        id: true,
      },
    });


    if (!userProfile) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Your supporter profile is not ready yet. Please try again.",
        },
        {
          status: 409,
        },
      );
    }

    const clubs = await prisma.club.findMany({
      where: {
        id: {
          in: uniqueClubIds,
        },
      },
      select: {
        id: true,
      },
    });
    

    if (clubs.length !== uniqueClubIds.length) {
      return NextResponse.json(
        {
          success: false,
          message: "One or more selected clubs are invalid.",
        },
        {
          status: 400,
        },
      );
    }

    await prisma.$transaction(async (tx) => {
      const supportProfile = await tx.supportProfile.upsert({
        where: {
          userId: user.id,
        },
        update: {},
        create: {
          userId: user.id,
        },
        select: {
          id: true,
        },
      });

      await tx.supportProfileClub.deleteMany({
        where: {
          supportProfileId: supportProfile.id,
        },
      });

      await tx.supportProfileClub.createMany({
        data: uniqueClubIds.map((clubId) => ({
          supportProfileId: supportProfile.id,
          clubId,
        })),
      });
    });

    return NextResponse.json({
      success: true,
      message: "Favourite clubs saved successfully.",
      clubIds: uniqueClubIds,
    });
  } catch (databaseError) {
    console.error("Failed to save favourite clubs", databaseError);

    return NextResponse.json(
      {
        success: false,
        message:
          "We couldn’t save your favourite clubs. Please try again.",
      },
      {
        status: 500,
      },
    );
  }
}
