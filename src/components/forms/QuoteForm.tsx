"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";

export function QuoteForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("error");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <Input label="Full Name" name="name" required autoComplete="name" />
      <Input label="Company" name="company" required autoComplete="organization" />
      <Input label="Email" name="email" type="email" required autoComplete="email" />
      <Input label="Phone" name="phone" type="tel" autoComplete="tel" />
      <Input label="Product" name="product" required />
      <Input label="Quantity" name="quantity" placeholder="e.g. 500 kg" />
      <Input label="Application" name="application" />
      <Input label="Required Date" name="requiredDate" type="date" />
      <Textarea label="Message" name="message" />
      <div>
        <Button type="submit" loading={status === "sending"}>Request a Quote</Button>
      </div>
      {status === "error" && (
        <Alert tone="danger">Quote submission is not connected yet. Please use the contact form in the meantime.</Alert>
      )}
    </form>
  );
}
