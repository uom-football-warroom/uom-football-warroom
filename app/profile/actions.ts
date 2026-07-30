"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db";
import { createClient } from "@/lib/supabase/server";

export type ProfileUpdateState = {
  success: boolean;
  message: string;
  errors?: {
    username?: string;
    displayName?: string;
  };
};

const usernamePattern = /^[A-Za-z0-9_.-]+$/;

function isUniqueUsernameError(error: unknown) {
  if (!error || typeof error !== "object" || !("code" in error)) {
    return false;
  }

  return error.code === "P2002";
}

export async function updateProfile(
  _previousState: ProfileUpdateState,
  formData: FormData,
): Promise<ProfileUpdateState> {
  const supabase = await createClient();
  const {
    data: { user },
    error: authenticationError,
  } = await supabase.auth.getUser();

  if (authenticationError || !user) {
    return {
      success: false,
      message: "You must be signed in to update your profile.",
    };
  }

  const usernameValue = formData.get("username");
  const displayNameValue = formData.get("displayName");
  const username =
    typeof usernameValue === "string" ? usernameValue.trim() : "";
  const displayName =
    typeof displayNameValue === "string" ? displayNameValue.trim() : "";
  const errors: NonNullable<ProfileUpdateState["errors"]> = {};

  if (!username) {
    errors.username = "Username is required.";
  } else if (username.length < 3 || username.length > 30) {
    errors.username = "Username must be between 3 and 30 characters.";
  } else if (!usernamePattern.test(username)) {
    errors.username =
      "Use only letters, numbers, underscores, periods, or hyphens.";
  }

  if (displayName.length > 80) {
    errors.displayName = "Display name must be 80 characters or fewer.";
  }

  if (Object.keys(errors).length > 0) {
    return {
      success: false,
      message: "Please correct the highlighted fields.",
      errors,
    };
  }

  try {
    const existingProfile = await prisma.userProfile.findFirst({
      where: {
        username,
        id: {
          not: user.id,
        },
      },
      select: {
        id: true,
      },
    });

    if (existingProfile) {
      return {
        success: false,
        message: "Please choose a different username.",
        errors: {
          username: "That username is already taken.",
        },
      };
    }

    await prisma.userProfile.update({
      where: {
        id: user.id,
      },
      data: {
        username,
        displayName: displayName || null,
      },
    });
  } catch (error) {
    if (isUniqueUsernameError(error)) {
      return {
        success: false,
        message: "Please choose a different username.",
        errors: {
          username: "That username is already taken.",
        },
      };
    }

    console.error("Failed to update authenticated user profile", error);

    return {
      success: false,
      message: "We couldn’t update your profile. Please try again.",
    };
  }

  revalidatePath("/profile");

  return {
    success: true,
    message: "Profile updated successfully.",
  };
}
