import { NextRequest, NextResponse } from "next/server";
import { getOrder } from "@/lib/dsc/orders";
import { sendWhatsAppOrderNotification } from "@/lib/dsc/whatsapp";

// =============================================================================
// Resend WhatsApp Notification — POST /api/dsc/orders/[id]/resend-whatsapp
// =============================================================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const adminPassword = process.env.DSC_ADMIN_PASSWORD || "unovia2025";
  const authHeader = req.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const order = await getOrder(id);

  if (!order) {
    return NextResponse.json({ error: "Order not found." }, { status: 404 });
  }

  const result = await sendWhatsAppOrderNotification(order);

  return NextResponse.json(
    {
      message: result.success
        ? "WhatsApp notification sent successfully."
        : "WhatsApp notification failed.",
      ...result,
    },
    { status: result.success ? 200 : 500 }
  );
}
