"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { type FormEvent, useEffect, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

const pendingEmailKey = "pendingVerificationEmail";
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeToken(value: string) {
  return value.trim().replace(/[\s-]+/g, "");
}

export function maskEmail(value: string) {
  const normalizedEmail = normalizeEmail(value);
  const separatorIndex = normalizedEmail.lastIndexOf("@");

  if (separatorIndex <= 0 || separatorIndex === normalizedEmail.length - 1) {
    return "your email address";
  }

  const localPart = normalizedEmail.slice(0, separatorIndex);
  const domain = normalizedEmail.slice(separatorIndex + 1);
  const visiblePrefix = localPart.slice(0, Math.min(2, localPart.length));

  return `${visiblePrefix}****@${domain}`;
}

export default function VerifyEmailForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [hasStoredEmail, setHasStoredEmail] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);
  const verificationInProgress = useRef(false);
  const resendInProgress = useRef(false);

  useEffect(() => {
    const storageRead = window.setTimeout(() => {
      let storedEmail = "";

      try {
        storedEmail = sessionStorage.getItem(pendingEmailKey) ?? "";
      } catch {
        // The editable email field is the fallback when storage is unavailable.
      }

      if (storedEmail) {
        setEmail(storedEmail);
        setHasStoredEmail(true);
      }

      setHasMounted(true);
    }, 0);

    return () => window.clearTimeout(storageRead);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = window.setTimeout(() => {
      setResendCooldown((current) => Math.max(0, current - 1));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  function validateEmail() {
    const normalizedEmail = normalizeEmail(email);

    if (!emailPattern.test(normalizedEmail)) {
      setErrorMessage("Enter the email address used during registration.");
      return null;
    }

    return normalizedEmail;
  }

  async function handleVerify(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (verificationInProgress.current || resendInProgress.current) return;

    const normalizedEmail = validateEmail();
    const normalizedToken = normalizeToken(token);

    if (!normalizedEmail) return;

    if (!normalizedToken || !/^\d+$/.test(normalizedToken)) {
      setErrorMessage("Enter the verification code from your email.");
      return;
    }

    verificationInProgress.current = true;
    setIsVerifying(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.verifyOtp({
        email: normalizedEmail,
        token: normalizedToken,
        type: "email",
      });

      if (error || (!data.user && !data.session)) {
        setErrorMessage("The verification code is invalid or has expired.");
        return;
      }

      try {
        sessionStorage.removeItem(pendingEmailKey);
      } catch {
        // Verification is still valid when browser storage is unavailable.
      }

      router.replace("/profile");
      router.refresh();
    } catch {
      setErrorMessage("The verification code is invalid or has expired.");
    } finally {
      verificationInProgress.current = false;
      setIsVerifying(false);
    }
  }

  async function handleResend() {
    if (
      resendInProgress.current ||
      verificationInProgress.current ||
      resendCooldown > 0
    ) {
      return;
    }

    const normalizedEmail = validateEmail();

    if (!normalizedEmail) return;

    resendInProgress.current = true;
    setIsResending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: normalizedEmail,
      });

      if (error) {
        setErrorMessage(
          "We could not send another code. Please try again later.",
        );
        return;
      }

      setToken("");
      setResendCooldown(60);
      setSuccessMessage(
        "A new verification code was sent to your email.",
      );
    } catch {
      setErrorMessage(
        "We could not send another code. Please try again later.",
      );
    } finally {
      resendInProgress.current = false;
      setIsResending(false);
    }
  }

  function handleDifferentEmail() {
    try {
      sessionStorage.removeItem(pendingEmailKey);
    } catch {
      // Navigation does not depend on browser storage being available.
    }

    router.replace("/register");
  }

  return (
    <form
      className="mt-8 space-y-6 sm:mt-10"
      noValidate
      onSubmit={handleVerify}
    >
      {hasMounted && hasStoredEmail ? (
        <p className="rounded-md bg-slate-50 px-4 py-3 text-center text-sm text-slate-600">
          Code sent to{" "}
          <span className="font-bold text-slate-800">{maskEmail(email)}</span>
        </p>
      ) : hasMounted ? (
        <div>
          <p className="mb-4 text-sm leading-6 text-slate-600">
            Enter the email address you used during registration to verify or
            resend your code.
          </p>
          <label
            htmlFor="verification-email"
            className="block text-sm font-bold text-slate-800 sm:text-base"
          >
            Email Address
          </label>
          <input
            id="verification-email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            disabled={isVerifying || isResending}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage("");
            }}
            className="mt-2 h-14 w-full rounded-lg border border-slate-300 bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-2 focus:ring-green-100 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16"
            placeholder="you@example.com"
          />
        </div>
      ) : (
        <p role="status" className="text-center text-sm text-slate-500">
          Loading verification details...
        </p>
      )}

      <div>
        <label
          htmlFor="email-otp"
          className="block text-sm font-bold text-slate-800 sm:text-base"
        >
          Verification Code
        </label>
        <input
          id="email-otp"
          name="token"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          value={token}
          disabled={isVerifying}
          aria-describedby={errorMessage ? "verification-error" : undefined}
          aria-invalid={Boolean(errorMessage)}
          onChange={(event) => {
            const nextToken = normalizeToken(event.target.value);

            if (!nextToken || /^\d+$/.test(nextToken)) {
              setToken(nextToken);
              setErrorMessage("");
            }
          }}
          className={`mt-2 h-14 w-full rounded-lg border bg-slate-50 px-4 text-center text-xl font-bold tracking-[0.25em] text-slate-900 outline-none transition placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus:ring-2 disabled:cursor-not-allowed disabled:opacity-70 sm:h-16 ${
            errorMessage
              ? "border-red-500 focus:border-red-500 focus:ring-red-100"
              : "border-slate-300 focus:border-green-600 focus:ring-green-100"
          }`}
          placeholder="Enter your code"
        />
      </div>

      {errorMessage && (
        <p
          id="verification-error"
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </p>
      )}

      {successMessage && (
        <p
          role="status"
          className="rounded-md border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700"
        >
          {successMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isVerifying || isResending || !hasMounted}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-green-700 px-5 text-base font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isVerifying ? "Verifying..." : "Verify email"}
      </button>

      <button
        type="button"
        disabled={
          isResending || isVerifying || resendCooldown > 0 || !hasMounted
        }
        onClick={handleResend}
        className="h-14 w-full rounded-lg border border-green-700 px-5 text-base font-bold text-green-700 transition hover:bg-green-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isResending
          ? "Sending..."
          : resendCooldown > 0
            ? `Resend in ${resendCooldown}s`
            : "Resend code"}
      </button>

      <p className="pt-2 text-center text-sm text-slate-600 sm:text-base">
        <button
          type="button"
          onClick={handleDifferentEmail}
          className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Use a different email
        </button>
        <span aria-hidden="true"> · </span>
        <Link
          href="/login"
          className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Log in
        </Link>
      </p>
    </form>
  );
}
