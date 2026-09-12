// =============================================================================
// DSC Store — WhatsApp Business API Integration
// =============================================================================
// Uses WhatsApp Cloud API (graph.facebook.com).
// Falls back to email notification if WhatsApp credentials are not configured.
// WhatsApp failure NEVER blocks order confirmation.
// =============================================================================

import type { DSCOrder } from "./orders";
import { updateOrder } from "./orders";

interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

/**
 * Send order notification via WhatsApp Business API.
 * If credentials are not configured, logs the message and marks as failed.
 */
export async function sendWhatsAppOrderNotification(
  order: DSCOrder
): Promise<WhatsAppSendResult> {
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const recipientNumber = process.env.WHATSAPP_RECIPIENT_NUMBER || "917003796857";

  // Build the notification message
  const message = buildOrderMessage(order);

  // If WhatsApp is not configured, log and return failure
  if (!accessToken || !phoneNumberId || accessToken.includes("xxxx")) {
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log("📱 WhatsApp Notification (credentials not configured)");
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    console.log(`Recipient: +${recipientNumber}`);
    console.log(message);
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

    // Update order notification status
    await updateOrder(order.id, {
      whatsappNotificationStatus: "failed",
      whatsappNotificationError: "WhatsApp Business API credentials not configured. Message logged to console.",
    });

    return {
      success: false,
      error: "WhatsApp credentials not configured",
    };
  }

  try {
    const response = await fetch(
      `https://graph.facebook.com/v18.0/${phoneNumberId}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messaging_product: "whatsapp",
          to: recipientNumber,
          type: "text",
          text: { body: message },
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const errorMsg = data?.error?.message || `HTTP ${response.status}`;
      console.error("WhatsApp API error:", errorMsg);

      await updateOrder(order.id, {
        whatsappNotificationStatus: "failed",
        whatsappNotificationError: errorMsg,
      });

      return { success: false, error: errorMsg };
    }

    const messageId = data?.messages?.[0]?.id || "unknown";

    await updateOrder(order.id, {
      whatsappNotificationStatus: "sent",
      whatsappNotificationMessageId: messageId,
      whatsappNotificationSentAt: new Date().toISOString(),
    });

    return { success: true, messageId };
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "Unknown WhatsApp API error";
    console.error("WhatsApp send failed:", errorMsg);

    await updateOrder(order.id, {
      whatsappNotificationStatus: "failed",
      whatsappNotificationError: errorMsg,
    });

    return { success: false, error: errorMsg };
  }
}

/**
 * Build the WhatsApp notification message text.
 */
function buildOrderMessage(order: DSCOrder): string {
  const items = order.pricing.lineItems
    .map(
      (li) =>
        `${li.productName} (x${li.quantity}) — ₹${li.lineGrossAmount.toLocaleString("en-IN")}`
    )
    .join("\n");

  return `🔔 NEW DSC ORDER – UNOVIA

Order ID: ${order.id}

Customer:
${order.applicant.fullName}

Mobile:
${order.applicant.mobile}

Email:
${order.applicant.email}

DSC:
${items}

Token Selected:
${order.pricing.tokenSelected ? "Yes" : "No"}

Token Amount:
₹${order.pricing.tokenAmount.toLocaleString("en-IN")}

Support Charges:
₹${order.pricing.supportChargeAmount.toLocaleString("en-IN")}

GST:
₹${order.pricing.subtotalGstAmount.toLocaleString("en-IN")}

TOTAL:
₹${order.pricing.totalAmount.toLocaleString("en-IN")}

Payment Status:
${order.paymentStatus === "paid" ? "PAID" : "Pending (Offline)"}

Payment Method:
Offline

Order Date:
${new Date(order.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}

Please process the DSC order.`;
}
