"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type LogoutButtonProps = {
  className?: string;
};

export default function LogoutButton({ className }: LogoutButtonProps) {
  const router = useRouter();
  const logoutInProgress = useRef(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleLogout() {
    if (logoutInProgress.current) return;

    logoutInProgress.current = true;
    setIsLoggingOut(true);
    setErrorMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage("We could not log you out. Please try again.");
        return;
      }

      router.replace("/");
      router.refresh();
    } catch {
      setErrorMessage("We could not log you out. Please try again.");
    } finally {
      logoutInProgress.current = false;
      setIsLoggingOut(false);
    }
  }

  return (
    <span className="flex flex-col items-stretch">
      <button
        type="button"
        disabled={isLoggingOut}
        onClick={handleLogout}
        className={className}
      >
        {isLoggingOut ? "Logging out..." : "Log out"}
      </button>
      {errorMessage && (
        <span
          role="alert"
          className="mt-1 max-w-48 text-xs font-medium text-red-600"
        >
          {errorMessage}
        </span>
      )}
    </span>
  );
}
