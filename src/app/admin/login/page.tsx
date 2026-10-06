"use client";

import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
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
    <div className="mx-auto max-w-sm">
      <Heading level={1}>Admin login</Heading>
      <p className="mt-2 text-sm text-neutral-600">Sign in with your administrator credentials.</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <Input name="email" label="Email" type="email" autoComplete="username" required />
        <Input name="password" label="Password" type="password" autoComplete="current-password" required />
        <Button type="submit" loading={loading}>Sign in</Button>
      </form>
      {error && <div className="mt-4"><Alert tone="danger">{error}</Alert></div>}
    </div>
  );
}

