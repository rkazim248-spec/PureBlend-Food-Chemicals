"use client";

import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { admin } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const form = new FormData(e.currentTarget);
    try {
      await admin.login(String(form.get("email") ?? ""), String(form.get("password") ?? ""));
      router.replace("/admin");
    } catch {
      setError("Unable to sign in. Check your credentials and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-dvh items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-white p-6 shadow-raised sm:p-8">
        <Image src="/pureblend-primary-logo.svg" alt="PureBlend Food Chemicals" width={240} height={60} priority className="h-12 w-auto" />
        <Heading level={1} className="mt-8">Admin login</Heading>
        <p className="mt-2 text-sm text-neutral-600">Sign in with your administrator credentials.</p>
        <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
          <Input name="email" label="Email" type="email" autoComplete="username" required />
          <Input name="password" label="Password" type="password" autoComplete="current-password" required />
          <Button type="submit" loading={loading}>Sign in</Button>
        </form>
        {error && <div className="mt-4"><Alert tone="danger">{error}</Alert></div>}
      </div>
    </main>
  );
}
