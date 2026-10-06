import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Heading } from "@/components/ui/Heading";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-brand-600">404</p>
      <Heading level={1} className="mt-2">Page not found</Heading>
      <p className="mt-3 max-w-md text-neutral-600">The page you are looking for does not exist or has been moved.</p>
      <Link href="/" className="mt-6 font-semibold text-brand-700 hover:underline">Back to homepage →</Link>
    </Container>
  );
}
