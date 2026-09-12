// =============================================================================
// DSC Store — Server-side Pricing Engine
// =============================================================================
// All final pricing MUST be calculated server-side. Never trust browser values.
// =============================================================================

import { getProductById, type DSCProduct } from "./products";
import { TOKEN_CONFIG, SUPPORT_CHARGE_CONFIG, GST_RATE } from "./config";

export interface CartItemInput {
  productId: string;
  quantity: number;
}

export interface PricedLineItem {
  productId: string;
  productName: string;
  certificateType: string;
  validityYears: number;
  quantity: number;
  unitBasicAmount: number;
  unitGstAmount: number;
  unitGrossAmount: number;
  lineBasicAmount: number;
  lineGstAmount: number;
  lineGrossAmount: number;
}

export interface OrderPricing {
  lineItems: PricedLineItem[];
  tokenSelected: boolean;
  tokenAmount: number;
  supportChargeEnabled: boolean;
  supportChargeAmount: number;
  subtotalBasicAmount: number;
  subtotalGstAmount: number;
  subtotalGrossAmount: number;
  totalAmount: number;
}

/**
 * Calculate full order pricing server-side.
 * This is the ONLY source of truth for pricing.
 */
export function calculateOrderPricing(
  items: CartItemInput[],
  tokenSelected: boolean
): OrderPricing {
  const lineItems: PricedLineItem[] = [];

  for (const item of items) {
    const product = getProductById(item.productId);
    if (!product || !product.active) {
      throw new Error(`Product not found or inactive: ${item.productId}`);
    }
    if (item.quantity < 1 || item.quantity > 100) {
      throw new Error(`Invalid quantity for ${product.name}: ${item.quantity}`);
    }

    lineItems.push({
      productId: product.id,
      productName: product.name,
      certificateType: product.certificateType,
      validityYears: product.validityYears,
      quantity: item.quantity,
      unitBasicAmount: product.basicAmount,
      unitGstAmount: product.gstAmount,
      unitGrossAmount: product.grossAmount,
      lineBasicAmount: round(product.basicAmount * item.quantity),
      lineGstAmount: round(product.gstAmount * item.quantity),
      lineGrossAmount: round(product.grossAmount * item.quantity),
    });
  }

  const subtotalGrossAmount = lineItems.reduce((sum, li) => sum + li.lineGrossAmount, 0);
  const subtotalBasicAmount = lineItems.reduce((sum, li) => sum + li.lineBasicAmount, 0);
  const subtotalGstAmount = lineItems.reduce((sum, li) => sum + li.lineGstAmount, 0);

  const tokenAmount = tokenSelected && TOKEN_CONFIG.enabled ? TOKEN_CONFIG.price : 0;
  const supportChargeAmount = SUPPORT_CHARGE_CONFIG.enabled ? SUPPORT_CHARGE_CONFIG.amount : 0;

  const totalAmount = round(subtotalGrossAmount + tokenAmount + supportChargeAmount);

  return {
    lineItems,
    tokenSelected: tokenSelected && TOKEN_CONFIG.enabled,
    tokenAmount,
    supportChargeEnabled: SUPPORT_CHARGE_CONFIG.enabled,
    supportChargeAmount,
    subtotalBasicAmount: round(subtotalBasicAmount),
    subtotalGstAmount: round(subtotalGstAmount),
    subtotalGrossAmount: round(subtotalGrossAmount),
    totalAmount,
  };
}

function round(n: number): number {
  return Math.round(n * 100) / 100;
}
