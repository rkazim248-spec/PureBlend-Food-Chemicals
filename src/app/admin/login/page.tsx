"use client";

import { Heading } from "@/components/ui/Heading";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { useState, type FormEvent } from "react";

/* TEMPORARY: UI shell only. Real authentication connects in a later phase. */
export default function AdminLoginPage() {
  const [error, setError] = useState<string | null>(null);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("Login is not connected yet — this is a foundation shell.");
  }

  return (
    <div className="mx-auto max-w-sm">
      <Heading level={1}>Admin login</Heading>
      <p className="mt-2 text-sm text-neutral-600">Sign in with your administrator credentials.</p>
      <form className="mt-6 flex flex-col gap-4" onSubmit={onSubmit}>
        <Input label="Email" type="email" autoComplete="username" required />
        <Input label="Password" type="password" autoComplete="current-password" required />
        <Button type="submit">Sign in</Button>
      </form>
      {error && <div className="mt-4"><Alert tone="info">{error}</Alert></div>}
    </div>
  );
}
