export interface DiscountCodeOffer {
  code: string;
  type: 'percentage' | 'fixed';
  value: number; // percentage (e.g. 10) or fixed amount
  startDate?: string;
  endDate?: string;
  minOrderValue?: number;
}

export const DEFAULT_DISCOUNT_CODES: Record<string, DiscountCodeOffer> = {
  'PUREBLEND10': {
    code: 'PUREBLEND10',
    type: 'percentage',
    value: 10,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  'BULKFOOD15': {
    code: 'BULKFOOD15',
    type: 'percentage',
    value: 15,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  'CHEMICAL20': {
    code: 'CHEMICAL20',
    type: 'percentage',
    value: 20,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  },
  'WELCOME5': {
    code: 'WELCOME5',
    type: 'percentage',
    value: 5,
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  }
};

export function getActiveDiscountCodes(): Record<string, DiscountCodeOffer> {
  if (typeof window === 'undefined') return DEFAULT_DISCOUNT_CODES;
  try {
    const saved = localStorage.getItem('pureblend_discount_codes');
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    // fallback
  }
  return DEFAULT_DISCOUNT_CODES;
}

export function saveDiscountCodes(codes: Record<string, DiscountCodeOffer>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('pureblend_discount_codes', JSON.stringify(codes));
  } catch (e) {
    // fallback
  }
}

export function validatePromoCode(codeStr: string): { valid: boolean; offer?: DiscountCodeOffer; error?: string } {
  if (!codeStr || !codeStr.trim()) {
    return { valid: false, error: 'Please enter a discount code.' };
  }
  const cleanCode = codeStr.trim().toUpperCase();
  const codes = getActiveDiscountCodes();
  const offer = codes[cleanCode];

  if (!offer) {
    return { valid: false, error: 'Invalid or unrecognized discount code.' };
  }

  // Check validity dates
  const now = new Date();
  if (offer.startDate && new Date(offer.startDate) > now) {
    return { valid: false, error: 'This discount code is not yet active.' };
  }
  if (offer.endDate && new Date(offer.endDate) < now) {
    return { valid: false, error: 'This discount code has expired.' };
  }

  return { valid: true, offer };
}

export function calculateDiscountedTotal(baseTotal: number, offer: DiscountCodeOffer): { discountAmount: number; finalTotal: number } {
  let discountAmount = 0;
  if (offer.type === 'percentage') {
    discountAmount = (baseTotal * offer.value) / 100;
  } else {
    discountAmount = offer.value;
  }
  const finalTotal = Math.max(0, baseTotal - discountAmount);
  return { discountAmount, finalTotal };
}
