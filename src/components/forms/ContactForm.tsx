"use client";

import { useState, type FormEvent } from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { apiRequest } from "@/lib/api/client";
import { endpoints } from "@/lib/api/endpoints";
import { ApiError } from "@/lib/api/types";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [errors, setErrors] = useState<{ name?: string; email?: string; subject?: string; message?: string }>({});
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  function validate() {
    const next: typeof errors = {};
    if (!name.trim()) next.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address";
    if (!subject.trim()) next.subject = "Subject is required";
    if (message.trim().length < 10) next.message = "Message must be at least 10 characters";
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setServerMessage(null);
    try {
      await apiRequest(endpoints.contact.submit, {
        method: "POST",
        body: { name: name.trim(), email: email.trim(), subject: subject.trim(), message: message.trim(), honeypot },
      });
      setStatus("success");
      setName(""); setEmail(""); setSubject(""); setMessage("");
    } catch (err) {
      setStatus("error");
      setServerMessage(err instanceof ApiError ? err.message : "Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} autoComplete="name" />
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} autoComplete="email" />
      <Input label="Subject" value={subject} onChange={(e) => setSubject(e.target.value)} error={errors.subject} />
      <Textarea label="Message" value={message} onChange={(e) => setMessage(e.target.value)} error={errors.message} />
      {/* Honeypot: hidden from users, filled by bots. Backend rejects submissions with this set. */}
      <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor="company-website">Company website</label>
        <input id="company-website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>
      <div>
        <Button type="submit" loading={status === "sending"}>Send message</Button>
      </div>
      {status === "success" && <Alert tone="success">Thank you — your message has been sent.</Alert>}
      {status === "error" && <Alert tone="danger">{serverMessage}</Alert>}
    </form>
  );
}
