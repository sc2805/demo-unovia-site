// =============================================================================
// Tally XML Generator Engine
// Converts structured transaction rows into Tally Prime / Tally.ERP 9 XML
// =============================================================================

export interface TallyTransactionRow {
  id: string;
  date: string; // YYYY-MM-DD or DD-MM-YYYY or DD/MM/YYYY
  voucherType: "Sales" | "Purchase" | "Payment" | "Receipt" | "Journal" | "Bank Statement";
  voucherNumber: string;
  partyName: string;
  ledgerName: string; // Sales / Purchase / Expense / Bank Ledger
  amount: number; // Base Taxable Amount or Total Amount
  gstRate?: number; // e.g., 18 for 18%
  gstType?: "Intra-State (CGST+SGST)" | "Inter-State (IGST)" | "Exempt / Non-GST";
  cgstAmount?: number;
  sgstAmount?: number;
  igstAmount?: number;
  partyState?: string;
  partyGstin?: string;
  narration?: string;
  refNo?: string;
  debitCredit?: "Dr" | "Cr";
  status?: "valid" | "warning" | "error";
  errorMessage?: string;
}

/**
 * Helper to escape special XML characters to prevent XML parsing errors
 */
function escapeXml(unsafe: string): string {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * Normalizes dates into Tally's expected YYYYMMDD format
 */
export function formatTallyDate(dateStr: string): string {
  if (!dateStr) {
    const today = new Date();
    return today.toISOString().slice(0, 10).replace(/-/g, "");
  }

  const clean = String(dateStr).trim();

  // YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean.replace(/-/g, "");
  }

  // DD-MM-YYYY or DD/MM/YYYY
  if (/^\d{1,2}[-\/]\d{1,2}[-\/]\d{4}$/.test(clean)) {
    const parts = clean.split(/[-\/]/);
    const day = parts[0].padStart(2, "0");
    const month = parts[1].padStart(2, "0");
    const year = parts[2];
    return `${year}${month}${day}`;
  }

  // YYYYMMDD already
  if (/^\d{8}$/.test(clean)) {
    return clean;
  }

  // Fallback parsed date
  const parsed = new Date(clean);
  if (!isNaN(parsed.getTime())) {
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    return `${yyyy}${mm}${dd}`;
  }

  const today = new Date();
  return today.toISOString().slice(0, 10).replace(/-/g, "");
}

/**
 * Generate Tally XML for a list of processed transaction rows
 */
export function generateTallyXML(rows: TallyTransactionRow[], companyName: string = "Target Company"): string {
  if (!rows || rows.length === 0) {
    return "";
  }

  const tallyMessages = rows.map((row) => generateVoucherXML(row)).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<ENVELOPE>
  <HEADER>
    <TALLYREQUEST>Import Data</TALLYREQUEST>
  </HEADER>
  <BODY>
    <IMPORTDATA>
      <REQUESTDESC>
        <REPORTNAME>Vouchers</REPORTNAME>
        <STATICVARIABLES>
          <SVCURRENTCOMPANY>${escapeXml(companyName)}</SVCURRENTCOMPANY>
        </STATICVARIABLES>
      </REQUESTDESC>
      <REQUESTDATA>
${tallyMessages}
      </REQUESTDATA>
    </IMPORTDATA>
  </BODY>
</ENVELOPE>`;
}

/**
 * Generate single Voucher TALLYMESSAGE XML
 */
function generateVoucherXML(row: TallyTransactionRow): string {
  const dateFormatted = formatTallyDate(row.date);
  const vchType = escapeXml(row.voucherType === "Bank Statement" ? (row.amount < 0 ? "Payment" : "Receipt") : row.voucherType);
  const vchNo = escapeXml(row.voucherNumber || row.refNo || `IMP-${Date.now()}`);
  const party = escapeXml(row.partyName || "Cash Account");
  const mainLedger = escapeXml(row.ledgerName || (row.voucherType === "Sales" ? "Sales Account" : "Purchase Account"));
  const narrationText = escapeXml(row.narration || `Imported via Tally SaaS Importer - Ref #${vchNo}`);

  // Base financial calculations
  const taxableAmount = Math.abs(row.amount);
  const gstRate = row.gstRate || 0;
  
  let cgst = row.cgstAmount || 0;
  let sgst = row.sgstAmount || 0;
  let igst = row.igstAmount || 0;

  // Auto tax breakdown if not explicitly provided
  if (gstRate > 0 && cgst === 0 && sgst === 0 && igst === 0) {
    const isInterstate = row.gstType === "Inter-State (IGST)";
    if (isInterstate) {
      igst = (taxableAmount * gstRate) / 100;
    } else if (row.gstType !== "Exempt / Non-GST") {
      cgst = (taxableAmount * (gstRate / 2)) / 100;
      sgst = (taxableAmount * (gstRate / 2)) / 100;
    }
  }

  const totalInvoiceVal = taxableAmount + cgst + sgst + igst;

  let ledgerEntriesXML = "";

  if (row.voucherType === "Sales") {
    // Sales Voucher: Party is DEBIT (Negative amount in Tally), Sales & Taxes are CREDIT (Positive amount in Tally)
    ledgerEntriesXML += `            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${party}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${totalInvoiceVal.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${mainLedger}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;

    if (cgst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>CGST Output</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${cgst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }
    if (sgst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>SGST Output</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${sgst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }
    if (igst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>IGST Output</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${igst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }
  } else if (row.voucherType === "Purchase") {
    // Purchase Voucher: Purchase & Input Taxes are DEBIT (Negative in Tally), Party is CREDIT (Positive in Tally)
    ledgerEntriesXML += `            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${mainLedger}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;

    if (cgst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>CGST Input</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${cgst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }
    if (sgst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>SGST Input</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${sgst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }
    if (igst > 0) {
      ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>IGST Input</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${igst.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
    }

    ledgerEntriesXML += `\n            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${party}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${totalInvoiceVal.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
  } else if (row.voucherType === "Payment") {
    // Payment: Party/Expense is DEBIT, Bank/Cash is CREDIT
    ledgerEntriesXML += `            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${party}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${mainLedger}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
  } else if (row.voucherType === "Receipt") {
    // Receipt: Bank/Cash is DEBIT, Party/Income is CREDIT
    ledgerEntriesXML += `            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${mainLedger}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>YES</ISDEEMEDPOSITIVE>
              <AMOUNT>-${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${party}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>NO</ISDEEMEDPOSITIVE>
              <AMOUNT>${taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
  } else {
    // Generic / Journal Voucher
    const isDr = row.debitCredit === "Dr" || row.amount > 0;
    ledgerEntriesXML += `            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${party}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>${isDr ? "YES" : "NO"}</ISDEEMEDPOSITIVE>
              <AMOUNT>${isDr ? `-${taxableAmount.toFixed(2)}` : taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>
            <ALLLEDGERENTRIES.LIST>
              <LEDGERNAME>${mainLedger}</LEDGERNAME>
              <ISDEEMEDPOSITIVE>${!isDr ? "YES" : "NO"}</ISDEEMEDPOSITIVE>
              <AMOUNT>${!isDr ? `-${taxableAmount.toFixed(2)}` : taxableAmount.toFixed(2)}</AMOUNT>
            </ALLLEDGERENTRIES.LIST>`;
  }

  return `        <TALLYMESSAGE xmlns:UDF="TallyUDF">
          <VOUCHER VCHTYPE="${vchType}" ACTION="Create" OBJVIEW="Accounting Voucher View">
            <DATE>${dateFormatted}</DATE>
            <VOUCHERTYPENAME>${vchType}</VOUCHERTYPENAME>
            <VOUCHERNUMBER>${vchNo}</VOUCHERNUMBER>
            <PARTYLEDGERNAME>${party}</PARTYLEDGERNAME>
            <PERSISTEDVIEW>Accounting Voucher View</PERSISTEDVIEW>
            <NARRATION>${narrationText}</NARRATION>
            <BASICBUYERNAME>${party}</BASICBUYERNAME>
${ledgerEntriesXML}
          </VOUCHER>
        </TALLYMESSAGE>`;
}
