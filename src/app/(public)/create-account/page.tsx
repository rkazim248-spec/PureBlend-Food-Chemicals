"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function CreateAccountPage() {
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setNotice(null);
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") ?? "");
    const confirmation = String(form.get("confirmation") ?? "");

    if (password.length < 10) {
      setError("Use at least 10 characters for your password.");
      return;
    }
    if (password !== confirmation) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      setNotice("Your details are valid. Account creation requires the approved backend service and has not been submitted.");
    }, 350);
  }

  return (
    <main className="min-h-dvh bg-background px-4 py-10 sm:px-6 lg:py-16">
      <div className="mx-auto w-full max-w-5xl overflow-hidden rounded-2xl border border-border bg-white shadow-raised lg:grid lg:grid-cols-[0.9fr_1.1fr]">
        <div className="hidden flex-col justify-between bg-brand-950 p-10 text-white lg:flex">
          <Image src="/pureblend-light-mode-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-14 w-auto brightness-0 invert" />
          <div>
            <p className="font-display text-4xl font-bold leading-tight">Built for trusted ingredient partnerships.</p>
            <p className="mt-4 text-brand-100">Request access to procurement resources and technical documentation.</p>
          </div>
        </div>
        <div className="p-6 sm:p-10">
          <Image src="/pureblend-light-mode-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-12 w-auto lg:hidden" />
          <div className="mt-8 lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Commercial access</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-950">Create your account</h1>
            <p className="mt-3 text-sm leading-6 text-foreground-muted">Use your business details. No information is submitted until the account backend is connected.</p>
          </div>
          <form className="mt-8 grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            <Input name="name" label="Full name" autoComplete="name" required />
            <Input name="company" label="Company" autoComplete="organization" required />
            <div className="sm:col-span-2"><Input name="email" label="Email address" type="email" autoComplete="email" placeholder="you@example.com" required /></div>
            <Input name="password" label="Password" type="password" autoComplete="new-password" required />
            <Input name="confirmation" label="Confirm password" type="password" autoComplete="new-password" required />
            <label className="flex items-start gap-3 text-sm text-foreground-muted sm:col-span-2">
              <input name="terms" type="checkbox" required className="mt-1 h-4 w-4 accent-brand-600" />
              <span>I agree to the PureBlend commercial terms and privacy notice.</span>
            </label>
            <div className="sm:col-span-2">
              <Button type="submit" loading={loading} size="lg" className="w-full">Create account</Button>
            </div>
          </form>
          {error && <div className="mt-5"><Alert tone="danger">{error}</Alert></div>}
          {notice && <div className="mt-5"><Alert tone="info">{notice}</Alert></div>}
          <p className="mt-8 text-center text-sm text-foreground-muted">
            Already have an account? <Link href="/sign-in" className="font-semibold text-brand-600 hover:text-brand-500">Sign in</Link>
          </p>
          <p className="mt-4 text-center text-xs text-neutral-500"><Link href="/" className="hover:text-brand-600">Back to PureBlend</Link></p>
        </div>
      </div>
    </main>
  );
}
