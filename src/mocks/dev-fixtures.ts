/**
 * DEVELOPMENT FIXTURES ONLY.
 * Clearly-marked placeholder content for visual development until the
 * backend API provides real data. Fixtures must never be imported by
 * production API logic — swap to service calls when endpoints are ready.
 */
import type { Banner, Faq, Offer, Product } from "@/lib/api/types";

export const devBanners: Banner[] = [
  {
    id: "dev-banner-1",
    title: "Reliable Ingredients for Better Food Solutions.",
    description: "PureBlend engineers high-purity food chemicals, hydrocolloids, and functional ingredient systems - batch-traceable, compliant, and consistent.",
    imageUrl: "/images/hero-placeholder.svg",
    imageAlt: "Abstract PureBlend brand background",
    linkUrl: "/products",
    linkLabel: "Explore Products",
    order: 1,
    active: true,
  },
];

export const devBanner = devBanners[0];

export const devProducts: Product[] = [
  {
    id: "dev-p1",
    name: "Development Product 1",
    slug: "development-product-1",
    description: "Placeholder product entry. Replace with real catalog data from the products API.",
    specifications: [
      { label: "Form", value: "Powder" },
      { label: "Solubility", value: "Water soluble" },
    ],
    images: [],
    category: { id: "dev-c1", name: "Category A", slug: "category-a" },
    published: true,
  },
  {
    id: "dev-p2",
    name: "Development Product 2",
    slug: "development-product-2",
    description: "Placeholder product entry. Replace with real catalog data from the products API.",
    specifications: [{ label: "Form", value: "Liquid" }],
    images: [],
    category: { id: "dev-c2", name: "Category B", slug: "category-b" },
    published: true,
  },
  {
    id: "dev-p3",
    name: "Development Product 3",
    slug: "development-product-3",
    description: "Placeholder product entry. Replace with real catalog data from the products API.",
    specifications: [],
    images: [],
    category: { id: "dev-c1", name: "Category A", slug: "category-a" },
    published: true,
  },
];

export const devOffers: Offer[] = [
  {
    id: "dev-o1",
    title: "Development offer",
    description: "Placeholder promotional offer. Real offers will be managed in the admin dashboard.",
    discountText: "Special value",
    active: true,
  },
];

export const devFaqs: Faq[] = [
  { id: "dev-f1", question: "How do I request a product specification?", answer: "Use the contact form and our team will respond with the available documentation.", order: 1, published: true },
  { id: "dev-f2", question: "Can the chatbot help with product questions?", answer: "Yes — it answers using approved PureBlend knowledge and declines unrelated topics.", order: 2, published: true },
  { id: "dev-f3", question: "Where can I find current offers?", answer: "Active offers are listed on the offers page once published.", order: 3, published: true },
];
