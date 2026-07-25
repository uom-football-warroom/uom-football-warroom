"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useRef, useState } from "react";

import { createClient } from "@/lib/supabase/client";

type FieldName =
  | "username"
  | "displayName"
  | "email"
  | "password"
  | "confirmPassword"
  | "terms";

type FieldErrors = Partial<Record<FieldName, string>>;

type FormValues = {
  username: string;
  displayName: string;
  email: string;
  password: string;
  confirmPassword: string;
  terms: boolean;
};

const initialValues: FormValues = {
  username: "",
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
  terms: false,
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const fieldOrder: FieldName[] = [
  "username",
  "displayName",
  "email",
  "password",
  "confirmPassword",
  "terms",
];

export default function RegisterForm() {
  const router = useRouter();
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submissionInProgress = useRef(false);
  const fieldRefs = useRef<
    Partial<Record<FieldName, HTMLInputElement | null>>
  >({});

  function validateForm() {
    const nextErrors: FieldErrors = {};
    const username = values.username.trim();
    const displayName = values.displayName.trim();
    const email = values.email.trim();

    if (!username) {
      nextErrors.username = "Username is required.";
    } else if (username.length < 3) {
      nextErrors.username = "Username must be at least 3 characters.";
    }

    if (!displayName) {
      nextErrors.displayName = "Display name is required.";
    }

    if (!email) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.password) {
      nextErrors.password = "Password is required.";
    } else if (values.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters.";
    }

    if (!values.confirmPassword) {
      nextErrors.confirmPassword = "Confirm password is required.";
    } else if (values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "Passwords must match.";
    }

    if (!values.terms) {
      nextErrors.terms = "You must accept the terms and conditions.";
    }

    setErrors(nextErrors);
    return nextErrors;
  }

  function updateValue<Field extends keyof FormValues>(
    field: Field,
    value: FormValues[Field],
  ) {
    setValues((current) => ({ ...current, [field]: value }));
    if (errors[field]) {
      setErrors((current) => ({ ...current, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (submissionInProgress.current) return;

    const nextErrors = validateForm();
    const firstInvalidField = fieldOrder.find((field) => nextErrors[field]);

    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus();
      return;
    }

    submissionInProgress.current = true;
    setIsSubmitting(true);
    setFormError("");

    try {
      const username = values.username.trim();
      const displayName = values.displayName.trim();
      const normalizedEmail = values.email.trim().toLowerCase();
      const supabase = createClient();
      const { data, error } = await supabase.auth.signUp({
        email: normalizedEmail,
        password: values.password,
        options: {
          data: {
            username,
            display_name: displayName || username,
          },
        },
      });

      if (error) {
        setFormError(
          "Registration failed. Check your information and try again.",
        );
        return;
      }

      setValues(initialValues);
      setErrors({});

      if (data.session) {
        router.replace("/profile");
        router.refresh();
        return;
      }

      try {
        sessionStorage.setItem(
          "pendingVerificationEmail",
          normalizedEmail,
        );
      } catch {
        // The verification page also supports entering the email manually.
      }

      router.replace("/verify-email");
    } catch {
      setFormError(
        "Registration failed. Check your information and try again.",
      );
    } finally {
      submissionInProgress.current = false;
      setIsSubmitting(false);
    }
  }

  const inputClassName = (field: FieldName) =>
    `h-14 w-full rounded-lg border bg-slate-50 px-4 text-base text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2 sm:h-16 ${
      errors[field]
        ? "border-red-500 focus:border-red-500 focus:ring-red-100"
        : "border-slate-300 focus:border-green-600 focus:ring-green-100"
    }`;

  return (
    <form className="mt-8 space-y-6 sm:mt-10" noValidate onSubmit={handleSubmit}>
      <FormField label="Username" error={errors.username} errorId="username-error">
        <div className="relative mt-2">
          <input
            ref={(element) => {
              fieldRefs.current.username = element;
            }}
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            value={values.username}
            aria-describedby={errors.username ? "username-error" : undefined}
            aria-invalid={Boolean(errors.username)}
            onChange={(event) => updateValue("username", event.target.value)}
            className={`${inputClassName("username")} pr-12`}
            placeholder="footballfan123"
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 right-0 flex w-12 items-center justify-center font-semibold text-slate-500"
          >
            @
          </span>
        </div>
      </FormField>

      <FormField
        label="Display Name"
        error={errors.displayName}
        errorId="display-name-error"
      >
        <input
          ref={(element) => {
            fieldRefs.current.displayName = element;
          }}
          id="display-name"
          name="displayName"
          type="text"
          autoComplete="name"
          value={values.displayName}
          aria-describedby={
            errors.displayName ? "display-name-error" : undefined
          }
          aria-invalid={Boolean(errors.displayName)}
          onChange={(event) =>
            updateValue("displayName", event.target.value)
          }
          className={`${inputClassName("displayName")} mt-2`}
          placeholder="Alex Morgan"
        />
      </FormField>

      <FormField label="Email Address" error={errors.email} errorId="email-error">
        <input
          ref={(element) => {
            fieldRefs.current.email = element;
          }}
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={values.email}
          aria-describedby={errors.email ? "email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          onChange={(event) => updateValue("email", event.target.value)}
          className={`${inputClassName("email")} mt-2`}
          placeholder="you@example.com"
        />
      </FormField>

      <FormField label="Password" error={errors.password} errorId="password-error">
        <PasswordInput
          id="password"
          autoComplete="new-password"
          value={values.password}
          visible={showPassword}
          error={errors.password}
          inputClassName={inputClassName("password")}
          inputRef={(element) => {
            fieldRefs.current.password = element;
          }}
          onChange={(value) => updateValue("password", value)}
          onToggle={() => setShowPassword((current) => !current)}
          placeholder="Create a strong password"
        />
      </FormField>

      <FormField
        label="Confirm Password"
        error={errors.confirmPassword}
        errorId="confirm-password-error"
      >
        <PasswordInput
          id="confirm-password"
          autoComplete="new-password"
          value={values.confirmPassword}
          visible={showConfirmPassword}
          error={errors.confirmPassword}
          inputClassName={inputClassName("confirmPassword")}
          inputRef={(element) => {
            fieldRefs.current.confirmPassword = element;
          }}
          onChange={(value) => updateValue("confirmPassword", value)}
          onToggle={() => setShowConfirmPassword((current) => !current)}
          placeholder="Repeat your password"
        />
      </FormField>

      <div>
        <div className="flex items-start gap-3">
          <input
            ref={(element) => {
              fieldRefs.current.terms = element;
            }}
            id="terms"
            name="terms"
            type="checkbox"
            checked={values.terms}
            aria-describedby={errors.terms ? "terms-error" : undefined}
            aria-invalid={Boolean(errors.terms)}
            onChange={(event) => updateValue("terms", event.target.checked)}
            className="mt-0.5 h-5 w-5 shrink-0 rounded border-slate-300 accent-green-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
          />
          <label htmlFor="terms" className="text-sm leading-5 text-slate-700 sm:text-base">
            I agree to the{" "}
            <Link
              href="/terms"
              className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
            >
              Privacy Policy
            </Link>{" "}
            regarding fan data usage.
          </label>
        </div>
        {errors.terms && (
          <p id="terms-error" role="alert" className="mt-2 text-sm text-red-600">
            {errors.terms}
          </p>
        )}
      </div>

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
        className="flex h-14 w-full items-center justify-center gap-3 rounded-lg bg-green-700 px-5 text-base font-bold text-white shadow-lg shadow-green-700/20 transition hover:bg-green-800 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <span
              aria-hidden="true"
              className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
            Creating account...
          </>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="pt-2 text-center text-sm text-slate-600 sm:text-base">
        Already part of the crowd?{" "}
        <Link
          href="/login"
          className="font-bold text-green-700 underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          Log In
        </Link>
      </p>
    </form>
  );
}

type FormFieldProps = {
  label: string;
  error?: string;
  errorId: string;
  children: React.ReactNode;
};

function FormField({ label, error, errorId, children }: FormFieldProps) {
  const inputId = errorId.replace("-error", "");

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-bold text-slate-800 sm:text-base">
        {label}
      </label>
      {children}
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}

type PasswordInputProps = {
  id: string;
  autoComplete: string;
  value: string;
  visible: boolean;
  error?: string;
  inputClassName: string;
  placeholder: string;
  inputRef: (element: HTMLInputElement | null) => void;
  onChange: (value: string) => void;
  onToggle: () => void;
};

function PasswordInput({
  id,
  autoComplete,
  value,
  visible,
  error,
  inputClassName,
  placeholder,
  inputRef,
  onChange,
  onToggle,
}: PasswordInputProps) {
  return (
    <div className="relative mt-2">
      <input
        ref={inputRef}
        id={id}
        name={id === "password" ? "password" : "confirmPassword"}
        type={visible ? "text" : "password"}
        autoComplete={autoComplete}
        value={value}
        aria-describedby={error ? `${id}-error` : undefined}
        aria-invalid={Boolean(error)}
        onChange={(event) => onChange(event.target.value)}
        className={`${inputClassName} pr-14`}
        placeholder={placeholder}
      />
      <button
        type="button"
        aria-label={visible ? `Hide ${id.replace("-", " ")}` : `Show ${id.replace("-", " ")}`}
        aria-pressed={visible}
        onClick={onToggle}
        className="absolute inset-y-0 right-0 flex w-14 items-center justify-center rounded-r-lg text-slate-600 transition hover:text-green-700 focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-green-600"
      >
        <EyeIcon crossed={visible} />
      </button>
    </div>
  );
}

function EyeIcon({ crossed }: { crossed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      className="h-6 w-6"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="M2.5 12s3.5-6 9.5-6 9.5 6 9.5 6-3.5 6-9.5 6-9.5-6-9.5-6Z" />
      <circle cx="12" cy="12" r="2.5" />
      {crossed && <path d="m4 4 16 16" />}
    </svg>
  );
}
