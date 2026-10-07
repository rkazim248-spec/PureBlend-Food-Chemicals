/**
 * DEVELOPMENT FIXTURES ONLY.
 * Clearly-marked placeholder content for visual development until the
 * backend API provides real data. Fixtures must never be imported by
 * production API logic — swap to service calls when endpoints are ready.
 */
import type { Banner, Faq, Offer, Product } from "@/lib/api/types";

const IMG = {
  hero: "https://lh3.googleusercontent.com/aida-public/AB6AXuAm_53lLU_NFZvfj2N466_R04xmSgIfUUx7B18CSCkwSe4yI4iZsg8htU5E7jQCNgGUqV6l3gt5BsNGtkvKxJJWjWqWapUFKLX0IRonJ26gRKTcvnc_nQ9wCoK8AkexlpMEhCfmzjAELNzmg9b-TCQuBO2dbPRUzVT-_fKjx9Z4bL6uypz9312scvNnpijjr1n-cGWq9Pk-uxslDNwcgT9P2nEjtzZ8MqPK9zkZ1cx1",
  product1: "https://lh3.googleusercontent.com/aida-public/AB6AXuBp0IobHIQ8qNSHoiM423Sbzsjqsm7UEEuEP73spjKzlRt9rj5aJnQDs6Ia3VINFKOAVP7CfNax00-QlOxloeLKCzXE9AcLGLsVmNUd3j5SefdEKowA29WVWkHPir69EvG43E5zefzCq_NVKXnWAGmzcYy3gDDGqv7DL87mPbGGK-KWl3SWuBL9_R_85fum5wZI6ETMOqScIqgQDyYCwatXtHGVFBO_yQSwJNQWc14h",
  product2: "https://lh3.googleusercontent.com/aida-public/AB6AXuACUbwp8kN78uQrtUwvSajvMPU1KcixTWh_zS5wVi-G0YdnmsHrgMD9w8vDSLATdVmLZHyVaa3gzCd67s3xIv5-wwgU535qDrz_nIFa0BavegCGDFSgAdJsX44vNIPipNKSfpJb9G1YCg_mr9GhEK2_TbXjHjLY6tIxJurd774xQcMQQzd2e8g3VBJ5wcZzlscoZNnzFuhmoqYOMR2iOIiXdIs6Wq0rwvu6gasyEuhR",
  product3: "https://lh3.googleusercontent.com/aida-public/AB6AXuAU3hGV5YkhQfjS4uPhwhrxfNAUTk392NL0WubzfbmAJn0wWAl0DJ2gWhur5GjLjAiq3gbLgIdCfhG4GRHlC2x9uIUBIcdhSInd5SMOf5Je-HAgKjao5JR8QbOQgNN1EY52jLU97BrRq3n9t8eOtA_wVvDcCwnL9eFA7JZa0IuiKg4pnqJ8m6XdWzqIZMinUMayEArBqfgu-AcfVoYN1P7vO4d6Kc_Oo4jmHYeL4SxE",
  category1: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYijeLF5ZjZ-T1kWCTBsFoY1-1tjbaCxw7WKeZq18CRFCljakeQZAKpruzljnX6lhm4hBDhcQ6zMMGX8te83thVEelB6kzJlnupKL1zw2g1Hj-2k8cLOVo5u9BNBKFF_Ldq04DbIWTn2Xot1l2l6_Z8aCWu-I9dHqszftTGn7DmEYiY6-DpcbRzzuvX0NjQFIdOx89AOKU9UVqHl_0vl5KMQ_s81SgfTLq0FRvclph",
  category2: "https://lh3.googleusercontent.com/aida-public/AB6AXuAgXejyHlkrbqwtNHg7y0Fq3FoyufO-LvL-xS1xNq34gdTYrkl8GjpiLfjcajACAS3rOxwHTJ5xJcZeDNJYlSHGVDmKwAWaFQlta9p6n2hVgdNozHE1EUcaPdco8We0Mxxs-F8xkiQfqndT0W9EqfkGm3J0QJQ6c7rs-puP01Zk0wK7Uc2zFmNxVtGj6K6aLS_t5btChkHqFrTssOhgBNmJ9AlmNEmbCVHf6Uto8161",
};

export const devBanners: Banner[] = [
  {
    id: "dev-banner-1",
    title: "Reliable Ingredients for Better Food Solutions.",
    description: "PureBlend engineers high-purity food chemicals, hydrocolloids, and functional ingredient systems - batch-traceable, compliant, and consistent.",
    imageUrl: IMG.hero,
    imageAlt: "Food science laboratory with beakers and ingredient powders",
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
    name: "Citric Acid Anhydrous",
    slug: "citric-acid-anhydrous",
    description: "High-purity acidulant for beverages, confections, and prepared foods. Consistent batch-to-batch performance.",
    specifications: [
      { label: "Purity", value: "≥ 99.5%" },
      { label: "Form", value: "Crystalline powder" },
      { label: "Solubility", value: "Water soluble" },
    ],
    images: [{ url: IMG.product1, alt: "Citric acid anhydrous powder in glass vessel" }],
    category: { id: "dev-c1", name: "Acidulants", slug: "acidulants" },
    published: true,
  },
  {
    id: "dev-p2",
    name: "Sodium Alginate FCC",
    slug: "sodium-alginate-fcc",
    description: "Hydrocolloid thickener and stabilizer for dairy, sauces, and restructured foods.",
    specifications: [
      { label: "Viscosity", value: "Grade-dependent" },
      { label: "Form", value: "Fine powder" },
    ],
    images: [{ url: IMG.product2, alt: "Sodium alginate powder sample" }],
    category: { id: "dev-c2", name: "Hydrocolloids", slug: "hydrocolloids" },
    published: true,
  },
  {
    id: "dev-p3",
    name: "Ascorbic Acid USP",
    slug: "ascorbic-acid-usp",
    description: "Vitamin C antioxidant and nutrient fortifier for beverages and baked goods.",
    specifications: [{ label: "Form", value: "Crystalline powder" }],
    images: [{ url: IMG.product3, alt: "Ascorbic acid crystals" }],
    category: { id: "dev-c1", name: "Acidulants", slug: "acidulants" },
    published: true,
  },
];

export const devOffers: Offer[] = [
  {
    id: "dev-o1",
    title: "Q4 Volume Pricing on Hydrocolloids",
    description: "Preferential rates on qualifying hydrocolloid orders through Q4.",
    discountText: "Volume pricing",
    active: true,
  },
];

export const devFaqs: Faq[] = [
  { id: "dev-f1", question: "How do I request a product specification?", answer: "Use the contact form and our team will respond with the available documentation.", order: 1, published: true },
  { id: "dev-f2", question: "Can the chatbot help with product questions?", answer: "Yes - it answers using approved PureBlend knowledge and declines unrelated topics.", order: 2, published: true },
  { id: "dev-f3", question: "Where can I find current offers?", answer: "Active offers are listed on the offers page once published.", order: 3, published: true },
];
