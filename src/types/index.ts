export type ProductCategory = 
  | 'Acidulants'
  | 'Preservatives'
  | 'Hydrocolloids & Stabilizers'
  | 'Antioxidants'
  | 'Leavening & Buffering Agents'
  | 'Flavor Enhancers & Sweeteners';

export type ProductGrade = 'FCC (Food Grade)' | 'USP Grade' | 'BP Grade' | 'Technical Grade';

export interface ProductSpec {
  label: string;
  value: string;
  testMethod?: string;
}

export interface Product {
  id: string;
  name: string;
  code: string;
  category: ProductCategory;
  casNumber: string;
  insNumber: string;
  grade: ProductGrade;
  shortDescription: string;
  description: string;
  appearance: string;
  chemicalFormula: string;
  molecularWeight: string;
  purity: string;
  phValue?: string;
  moistureContent?: string;
  meshSize?: string;
  heavyMetals?: string;
  shelfLife: string;
  storageCondition: string;
  packagingOptions: string[];
  minOrderQuantity: string;
  standardLeadTime: string;
  applications: string[];
  certifications: string[];
  featured?: boolean;
  stockStatus: 'In Stock' | 'Limited Stock' | 'Contract Basis Only';
  imagePlaceholderColor?: string;
  imageUrl?: string;
}

export interface IndustrySolution {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  categoryTag: string;
  functionalBenefits: string[];
  keyProducts: string[];
  recommendedIngredients: {
    productId: string;
    productName: string;
    role: string;
  }[];
  processConsiderations: string;
  imageUrl?: string;
}

export interface B2BOffer {
  id: string;
  title: string;
  badge: string;
  description: string;
  volumeTier: string;
  terms: string[];
  validityDate: string;
  status: 'Active' | 'Limited Availability' | 'Upcoming';
  targetProducts: string[];
  inquiryCode: string;
}

export interface RFQSubmission {
  id: string;
  createdAt: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  productId: string;
  productName: string;
  requiredVolume: string;
  volumeUnit: 'kg' | 'Metric Tons (MT)' | 'Pallets' | 'FCL (20ft Container)';
  preferredPackaging: string;
  targetDeliveryDate: string;
  deliveryLocation: string;
  incoterm: 'FOB' | 'CIF' | 'DDP' | 'EXW';
  specialRequirements?: string;
  status: 'Pending Review' | 'Technical Review' | 'Quote Issued' | 'Contract Drafted';
  estimatedValue?: string;
}

export interface FAQItem {
  id: string;
  category: 'Product Specifications' | 'Ordering & MOQs' | 'Quality & Compliance' | 'Logistics & Packaging';
  question: string;
  answer: string;
}

export interface QualityBatchDoc {
  id: string;
  batchNumber: string;
  productId: string;
  productName: string;
  manufacturingDate: string;
  expiryDate: string;
  releaseDate: string;
  testingLab: string;
  assayResult: string;
  status: 'Released' | 'Under Incubation' | 'Archived';
}

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

export interface BannerSlide {
  id: string;
  kicker: string;
  title: string;
  description: string;
  ctaText: string;
  ctaLink: string;
  secondaryCtaText?: string;
  secondaryCtaLink?: string;
  badgeText?: string;
  badgeValue?: string;
  chemicalCode?: string;
  chemicalPurity?: string;
  active: boolean;
  order: number;
  bgGradient?: string;
  imageUrl?: string;
}

