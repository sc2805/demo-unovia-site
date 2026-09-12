import { NextRequest, NextResponse } from "next/server";
import { sendContactEmail } from "@/lib/email";

// =============================================================================
// DSC Requirement Inquiry API Route — POST /api/dsc-inquiry
// =============================================================================

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      name,
      email,
      phone,
      category = "Class 3 Individual",
      type = "Combo (Signing & Encryption)",
      validity = "2 Years",
      needToken = "Yes",
      organization = "",
      purpose = "General Compliance (MCA/GST/ITR)",
      estimatedPrice = "",
      message = "",
    } = body;

    // Validate required fields
    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Name, Email, and Mobile Phone are required to request your DSC." },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    const formattedMessage = `
--- DIGITAL SIGNATURE CERTIFICATE (DSC) REQUIREMENT ---
Category: ${category}
Certificate Type: ${type}
Validity: ${validity}
USB Token Included: ${needToken}
Organization / Firm: ${organization || "Individual"}
Primary Purpose: ${purpose}
Estimated Fee: ₹${estimatedPrice}

Additional Notes / Requirements:
${message || "No additional notes specified."}
    `.trim();

    // Send the email notification
    const result = await sendContactEmail({
      name,
      email,
      phone,
      service: `DSC Service Inquiry — ${category} (${validity})`,
      message: formattedMessage,
    });

    return NextResponse.json(
      {
        message: "Your DSC requirement has been submitted successfully! Our certificate expert will call you within 15 minutes.",
        id: result?.id || "submitted",
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    console.error("DSC inquiry submission error:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to submit DSC requirement.";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
