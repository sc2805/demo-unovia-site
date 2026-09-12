// =============================================================================
// DSC Store — Central Configuration
// =============================================================================

/** GST rate applied to all DSC products */
export const GST_RATE = 0.18;

/** USB Crypto Token configuration */
export const TOKEN_CONFIG = {
  enabled: true,
  name: "DSC Crypto USB Token",
  price: 500,
  description:
    "FIPS 140-2 Level 3 certified USB cryptographic token for securely storing your Digital Signature Certificate.",
} as const;

/** Support charge configuration */
export const SUPPORT_CHARGE_CONFIG = {
  enabled: false,
  amount: 0,
  label: "Support Charges",
} as const;

/** WhatsApp notification recipient */
export const WHATSAPP_RECIPIENT = "917003796857";

/** DSC product categories for filtering */
export const DSC_CATEGORIES = [
  { id: "class3-signing", label: "Class 3 Signing", shortLabel: "Signing" },
  { id: "class3-encryption", label: "Class 3 Encryption", shortLabel: "Encryption" },
  { id: "class3-combo", label: "Class 3 Combo", shortLabel: "Combo" },
  { id: "dgft", label: "DGFT", shortLabel: "DGFT" },
  { id: "foreign-signing", label: "Foreign Class 3 Signing", shortLabel: "Foreign Signing" },
  { id: "foreign-encryption", label: "Foreign Class 3 Encryption", shortLabel: "Foreign Encryption" },
  { id: "foreign-combo", label: "Foreign Class 3 Combo", shortLabel: "Foreign Combo" },
  { id: "doc-signer-class2", label: "Document Signer Class 2", shortLabel: "Doc Signer C2" },
  { id: "doc-signer-class3", label: "Document Signer Class 3", shortLabel: "Doc Signer C3" },
] as const;

/** Validity options */
export const VALIDITY_OPTIONS = [
  { value: 1, label: "1 Year" },
  { value: 2, label: "2 Years" },
  { value: 3, label: "3 Years" },
] as const;

/** Sort options */
export const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
] as const;

/** Certificate type labels for filtering */
export const CERTIFICATE_TYPE_FILTERS = [
  { value: "all", label: "All Types" },
  { value: "signing", label: "Signing" },
  { value: "encryption", label: "Encryption" },
  { value: "combo", label: "Combo" },
  { value: "dgft", label: "DGFT" },
  { value: "foreign", label: "Foreign DSC" },
  { value: "document-signer", label: "Document Signer" },
] as const;

/** Order states */
export const ORDER_STATES = {
  PENDING: "pending",
  PAYMENT_INITIATED: "payment_initiated",
  PAID: "paid",
  PROCESSING: "processing",
  DOCUMENTS_REQUIRED: "documents_required",
  DSC_GENERATED: "dsc_generated",
  ISSUED: "issued",
  DELIVERED: "delivered",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
  REFUND_PENDING: "refund_pending",
  REFUNDED: "refunded",
} as const;

export type OrderState = (typeof ORDER_STATES)[keyof typeof ORDER_STATES];
