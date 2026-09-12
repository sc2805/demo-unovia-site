import { NextRequest, NextResponse } from "next/server";
import { getOrder, updateOrder } from "@/lib/dsc/orders";

// =============================================================================
// DSC Order Detail API — GET /api/dsc/orders/[id]
// =============================================================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  return NextResponse.json({ order }, { status: 200 });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminPassword = process.env.DSC_ADMIN_PASSWORD || "unovia2025";
  const authHeader = req.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();

  const allowedUpdates: Record<string, unknown> = {};
  if (body.orderState) allowedUpdates.orderState = body.orderState;
  if (body.paymentStatus) allowedUpdates.paymentStatus = body.paymentStatus;
  if (typeof body.notes === "string") allowedUpdates.notes = body.notes;

  const updated = await updateOrder(id, allowedUpdates);
  if (!updated) {
    return NextResponse.json({ error: "Order not found or update failed." }, { status: 404 });
  }

  return NextResponse.json({ order: updated }, { status: 200 });
}

