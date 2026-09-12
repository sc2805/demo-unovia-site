import { NextRequest, NextResponse } from "next/server";
import { calculateOrderPricing, type CartItemInput } from "@/lib/dsc/pricing";
import { createOrder, listOrders, type ApplicantDetails } from "@/lib/dsc/orders";
import { sendWhatsAppOrderNotification } from "@/lib/dsc/whatsapp";
import { sendContactEmail } from "@/lib/email";

// =============================================================================
// DSC Orders API — POST (create order) / GET (list orders for admin)
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { items, tokenSelected, applicant, idempotencyKey } = body as {
      items: CartItemInput[];
      tokenSelected: boolean;
      applicant: ApplicantDetails;
      idempotencyKey: string;
    };

    // --- Validate required fields ---
    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
    }

    if (!applicant?.fullName || !applicant?.mobile || !applicant?.email) {
      return NextResponse.json(
        { error: "Applicant name, mobile and email are required." },
        { status: 400 }
      );
    }

    if (!applicant?.pan) {
      return NextResponse.json({ error: "PAN is required for DSC application." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(applicant.email)) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    if (!idempotencyKey) {
      return NextResponse.json({ error: "Idempotency key is required." }, { status: 400 });
    }

    // --- Server-side price calculation (NEVER trust browser prices) ---
    let pricing;
    try {
      pricing = calculateOrderPricing(items, tokenSelected);
    } catch (error: unknown) {
      const msg = error instanceof Error ? error.message : "Pricing calculation failed";
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    // --- Create the order ---
    const order = await createOrder(applicant, pricing, idempotencyKey);

    // --- Send WhatsApp notification (non-blocking, failure is OK) ---
    // For offline payment, we send notification immediately on order creation
    sendWhatsAppOrderNotification(order).catch((err) => {
      console.error("WhatsApp notification background error:", err);
    });

    // --- Send email notification to Unovia team ---
    const productList = pricing.lineItems
      .map((li) => `${li.productName} (x${li.quantity}) — ₹${li.lineGrossAmount}`)
      .join("\n");

    sendContactEmail({
      name: applicant.fullName,
      email: applicant.email,
      phone: applicant.mobile,
      service: `DSC Order — ${order.id}`,
      message: `New DSC Order: ${order.id}\n\nProducts:\n${productList}\n\nToken: ${
        pricing.tokenSelected ? "Yes (₹500)" : "No"
      }\nTotal: ₹${pricing.totalAmount}\n\nPayment: Offline (pending)\n\nApplicant PAN: ${
        applicant.pan
      }\nType: ${applicant.applicantType}${
        applicant.organizationName ? `\nOrg: ${applicant.organizationName}` : ""
      }`,
    }).catch((err) => {
      console.error("Email notification error:", err);
    });

    return NextResponse.json(
      {
        message: "Order placed successfully!",
        orderId: order.id,
        totalAmount: order.pricing.totalAmount,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("Order creation error:", error);
    const msg = error instanceof Error ? error.message : "Failed to create order.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const adminPassword = process.env.DSC_ADMIN_PASSWORD || "unovia2025";
  const authHeader = req.headers.get("authorization");

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const orders = await listOrders();
    return NextResponse.json({ orders }, { status: 200 });
  } catch (error: unknown) {
    console.error("List orders error:", error);
    return NextResponse.json({ error: "Failed to list orders." }, { status: 500 });
  }
}
