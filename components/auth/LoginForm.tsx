"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type FieldErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type LoginFormProps = {
  confirmationError?: boolean;
  nextPath?: string;
};

export default function LoginForm({
  confirmationError = false,
  nextPath = "/profile",
}: LoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState(
    confirmationError
      ? "We could not confirm your email. Request a new verification email or try again."
      : "",
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);

  function validateForm() {
    const nextErrors: FieldErrors = {};

    if (!email.trim()) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) return;
    if (!validateForm()) return;

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setFormError("");

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });

      if (error) {
        setFormError("Invalid email or password.");
        return;
      }

      router.replace(nextPath);
      router.refresh();
    } catch {
      setFormError("Invalid email or password.");
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <form className="mt-8 space-y-6 sm:mt-10" noValidate onSubmit={handleSubmit}>
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-bold text-slate-800 sm:text-base"
        >
          Email Address
        </label>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
            <MailIcon />
          </span>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={email}
            aria-describedby={errors.email ? "email-error" : undefined}
            aria-invalid={Boolean(errors.email)}
            onChange={(event) => {
              setEmail(event.target.value);
              if (errors.email) setErrors((current) => ({ ...current, email: undefined }));
            }}
            className={`h-14 w-full rounded-lg border bg-slate-50 pl-12 pr-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 sm:h-16 ${
              errors.email
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-green-600 focus:ring-green-100"
            }`}
            placeholder="alex.morgan@stadium.com"
          />
        </div>
        {errors.email && (
          <p id="email-error" role="alert" className="mt-2 text-sm text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      <div>
        <div className="flex items-center justify-between gap-4">
          <label
            htmlFor="password"
            className="block text-sm font-bold text-slate-800 sm:text-base"
          >
            Password
          </label>
          <Link
            href="/forgot-password"
            className="text-sm font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          >
            Forgot Password?
          </Link>
        </div>
        <div className="relative mt-2">
          <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-500">
            <LockIcon />
          </span>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            value={password}
            aria-describedby={errors.password ? "password-error" : undefined}
            aria-invalid={Boolean(errors.password)}
            onChange={(event) => {
              setPassword(event.target.value);
              if (errors.password) {
                setErrors((current) => ({ ...current, password: undefined }));
              }
            }}
            className={`h-14 w-full rounded-lg border bg-slate-50 pl-12 pr-14 text-base text-slate-900 outline-none transition focus:ring-2 sm:h-16 ${
              errors.password
                ? "border-red-500 focus:border-red-500 focus:ring-red-100"
                : "border-slate-300 focus:border-green-600 focus:ring-green-100"
            }`}
            placeholder="Enter your password"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
            onClick={() => setShowPassword((visible) => !visible)}
            className="absolute inset-y-0 right-0 flex w-14 items-center justify-center rounded-r-lg text-slate-600 transition hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-600"
          >
            <EyeIcon crossed={showPassword} />
          </button>
        </div>
        {errors.password && (
          <p id="password-error" role="alert" className="mt-2 text-sm text-red-600">
            {errors.password}
          </p>
        )}
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-3 text-base text-slate-700">
        <input
          name="rememberMe"
          type="checkbox"
          className="h-5 w-5 rounded border-slate-300 accent-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        />
        Remember me
      </label>

      {formError && (
        <p
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {formError}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-green-700 px-5 text-base font-bold text-white transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <SignInIcon />
          </>
        )}
      </button>

      <p className="pt-2 text-center text-sm text-slate-600 sm:text-base">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Sign Up
        </Link>
      </p>
    </form>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m4 7 8 6 8-6" />
    </svg>
  );
}

function LockIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <rect x="5" y="10" width="14" height="11" rx="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" />
    </svg>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-6 w-6" stroke="currentColor" strokeWidth="1.8">
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {crossed && <path d="m4 4 16 16" />}
    </svg>
  );
}

function SignInIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" className="h-5 w-5" stroke="currentColor" strokeWidth="2">
      <path d="M10 17l5-5-5-5M15 12H3M14 4h5a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-5" />
    </svg>
  );
}
