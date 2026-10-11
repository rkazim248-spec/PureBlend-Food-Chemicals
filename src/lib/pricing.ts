export interface PricingDetails {
  regularPrice: number;
  finalPrice: number;
  hasDiscount: boolean;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  badgeText: string;
  unit: string;
}

export function calculateProductPrice(product: {
  regularPrice?: number;
  discountEnabled?: boolean;
  discountType?: 'percentage' | 'fixed';
  discountValue?: number;
  unit?: string;
  id?: string;
}): PricingDetails {
  const regular = product.regularPrice ?? 12500;
  const unit = product.unit || 'per 25 kg bag';
  const enabled = product.discountEnabled ?? (product.id === 'citric-acid-anhydrous' || product.id === 'xanthan-gum-80-mesh' || product.id === 'potassium-sorbate-granular');
  const discountType = product.discountType || 'percentage';
  const discountValue = product.discountValue ?? (product.id === 'citric-acid-anhydrous' ? 12 : product.id === 'xanthan-gum-80-mesh' ? 15 : product.id === 'potassium-sorbate-granular' ? 10 : 0);

  let finalPrice = regular;
  let hasDiscount = false;
  let badgeText = '';

  if (enabled && discountValue > 0) {
    if (discountType === 'percentage') {
      if (discountValue < 100) {
        finalPrice = regular * (1 - discountValue / 100);
        hasDiscount = true;
        badgeText = `${discountValue}% OFF`;
      }
    } else {
      if (discountValue < regular) {
        finalPrice = regular - discountValue;
        hasDiscount = true;
        badgeText = `PKR ${discountValue.toLocaleString()} OFF`;
      }
    }
  }

  return {
    regularPrice: regular,
    finalPrice: Math.max(0, Math.round(finalPrice)),
    hasDiscount,
    discountType,
    discountValue,
    badgeText,
    unit
  };
}
