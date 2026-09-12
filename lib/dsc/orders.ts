// =============================================================================
// DSC Store — Order Management (JSON file storage)
// =============================================================================
// Production-upgradeable: swap this module for a database-backed version
// when ready. The interface remains the same.
// =============================================================================

import { promises as fs } from "fs";
import path from "path";
import type { OrderPricing } from "./pricing";
import type { OrderState } from "./config";

const ORDERS_DIR = path.join(process.cwd(), "data", "dsc-orders");

export interface ApplicantDetails {
  fullName: string;
  mobile: string;
  email: string;
  pan: string;
  applicantType: "individual" | "organization";
  organizationName?: string;
  gstin?: string;
  billingAddress: string;
  city: string;
  state: string;
  pinCode: string;
}

export interface DSCOrder {
  id: string;
  createdAt: string;
  updatedAt: string;
  applicant: ApplicantDetails;
  pricing: OrderPricing;
  orderState: OrderState;
  paymentStatus: "pending" | "paid" | "failed";
  paymentMethod: "offline";
  notes: string;

  // WhatsApp notification tracking
  whatsappNotificationStatus: "pending" | "sent" | "delivered" | "failed";
  whatsappNotificationMessageId: string | null;
  whatsappNotificationError: string | null;
  whatsappNotificationSentAt: string | null;

  // Idempotency
  idempotencyKey: string;
}

/** Generate a unique order ID: UNV-DSC-XXXXXX */
function generateOrderId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `UNV-DSC-${result}`;
}

/** Ensure the orders directory exists */
async function ensureDir() {
  await fs.mkdir(ORDERS_DIR, { recursive: true });
}

/** Get the file path for an order */
function orderPath(orderId: string): string {
  // Sanitize the ID to prevent directory traversal
  const sanitized = orderId.replace(/[^A-Za-z0-9\-]/g, "");
  return path.join(ORDERS_DIR, `${sanitized}.json`);
}

/** Create a new order */
export async function createOrder(
  applicant: ApplicantDetails,
  pricing: OrderPricing,
  idempotencyKey: string
): Promise<DSCOrder> {
  await ensureDir();

  // Check idempotency — prevent duplicate orders
  const existing = await findOrderByIdempotencyKey(idempotencyKey);
  if (existing) {
    return existing;
  }

  const now = new Date().toISOString();
  const order: DSCOrder = {
    id: generateOrderId(),
    createdAt: now,
    updatedAt: now,
    applicant,
    pricing,
    orderState: "pending",
    paymentStatus: "pending",
    paymentMethod: "offline",
    notes: "",
    whatsappNotificationStatus: "pending",
    whatsappNotificationMessageId: null,
    whatsappNotificationError: null,
    whatsappNotificationSentAt: null,
    idempotencyKey,
  };

  await fs.writeFile(orderPath(order.id), JSON.stringify(order, null, 2), "utf-8");
  return order;
}

/** Get an order by ID */
export async function getOrder(orderId: string): Promise<DSCOrder | null> {
  try {
    const data = await fs.readFile(orderPath(orderId), "utf-8");
    return JSON.parse(data) as DSCOrder;
  } catch {
    return null;
  }
}

/** Update an order */
export async function updateOrder(
  orderId: string,
  updates: Partial<DSCOrder>
): Promise<DSCOrder | null> {
  const order = await getOrder(orderId);
  if (!order) return null;

  const updated: DSCOrder = {
    ...order,
    ...updates,
    id: order.id, // prevent ID overwrite
    createdAt: order.createdAt, // prevent creation date overwrite
    updatedAt: new Date().toISOString(),
  };

  await fs.writeFile(orderPath(orderId), JSON.stringify(updated, null, 2), "utf-8");
  return updated;
}

/** List all orders, newest first */
export async function listOrders(): Promise<DSCOrder[]> {
  await ensureDir();
  const files = await fs.readdir(ORDERS_DIR);
  const orders: DSCOrder[] = [];

  for (const file of files) {
    if (!file.endsWith(".json")) continue;
    try {
      const data = await fs.readFile(path.join(ORDERS_DIR, file), "utf-8");
      orders.push(JSON.parse(data) as DSCOrder);
    } catch {
      // skip corrupt files
    }
  }

  return orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

/** Find order by idempotency key */
async function findOrderByIdempotencyKey(key: string): Promise<DSCOrder | null> {
  const orders = await listOrders();
  return orders.find((o) => o.idempotencyKey === key) || null;
}
