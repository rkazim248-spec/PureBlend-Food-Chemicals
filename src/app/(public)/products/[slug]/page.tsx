import { StitchPage } from "@/components/StitchPage";
import { notFound } from "next/navigation";

const validProductSlugs = new Set([
  "citric-acid-anhydrous",
  "sodium-alginate-fcc",
  "ascorbic-acid-usp",
  "xanthan-gum-200-mesh",
  "potassium-sorbate-granular",
  "sodium-acid-pyrophosphate-28",
  "sodium-benzoate-prills",
  "pectin-citrus-hm-rapid-set",
  "calcium-propionate-powder",
]);

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!validProductSlugs.has(slug)) notFound();
  return <StitchPage designPath="citric_acid_anhydrous_usp_fcc_product_details_pureblend_food_chemicals" />;
}
