"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { admin } from "@/lib/api";

export default function SignInPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      await admin.login(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
      router.replace("/admin");
    } catch {
      setError("We could not sign you in. Check your email and password, then try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden bg-brand-950 px-4 py-16 sm:px-6">
      <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-brand-500/20 blur-3xl" aria-hidden="true" />
      <div className="absolute -bottom-32 -right-20 h-80 w-80 rounded-full bg-accent-400/10 blur-3xl" aria-hidden="true" />
      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-white shadow-modal lg:grid-cols-[1fr_1.05fr]">
        <div className="hidden flex-col justify-between bg-brand-600 p-10 text-white lg:flex">
          <div>
            <Image src="/pureblend-primary-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-14 w-auto brightness-0 invert" />
            <p className="mt-16 max-w-sm font-display text-4xl font-bold leading-tight">Trusted chemistry for better food.</p>
            <p className="mt-5 max-w-sm text-brand-100">Access your procurement workspace, product specifications, and compliance documents.</p>
          </div>
          <p className="text-sm text-brand-200">Secure workspace access · ISO 22000 aligned</p>
        </div>
        <div className="p-7 sm:p-12">
          <Image src="/pureblend-primary-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-12 w-auto lg:hidden" />
          <div className="mt-8 lg:mt-0">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-500">Welcome back</p>
            <h1 className="mt-2 font-display text-3xl font-bold tracking-tight text-brand-950">Sign in to your workspace</h1>
            <p className="mt-3 text-sm leading-6 text-foreground-muted">Use your business email to continue to PureBlend.</p>
          </div>
          <form className="mt-8 flex flex-col gap-5" onSubmit={onSubmit}>
            <Input name="email" label="Business email" type="email" autoComplete="username" placeholder="you@company.com" required />
            <div>
              <Input name="password" label="Password" type="password" autoComplete="current-password" required />
            </div>
            <Button type="submit" loading={loading} size="lg" className="mt-2 w-full">Sign in securely</Button>
          </form>
          {error && <div className="mt-5"><Alert tone="danger">{error}</Alert></div>}
          <p className="mt-8 text-center text-sm text-foreground-muted">Need an account? <Link href="/contact" className="font-semibold text-brand-600 hover:text-brand-500">Contact our team</Link></p>
          <p className="mt-8 text-center text-xs text-neutral-400"><Link href="/" className="hover:text-brand-600">Back to PureBlend.com</Link></p>
        </div>
      </div>
    </main>
  );
}
