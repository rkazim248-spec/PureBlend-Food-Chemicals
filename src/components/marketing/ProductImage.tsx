import Image from "next/image";

/** Product image with consistent aspect ratio and optimization. */
export function ProductImage({ url, alt, priority = false }: { url: string; alt: string; priority?: boolean }) {
  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-md bg-neutral-100">
      <Image src={url} alt={alt} fill priority={priority} sizes="(min-width:1280px) 33vw, (min-width:640px) 50vw, 100vw" className="object-cover" />
    </div>
  );
}
