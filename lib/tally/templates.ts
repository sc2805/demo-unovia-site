// =============================================================================
// Tally Sample Templates & Mock Row Generator
// Provides ready-to-use sample transaction data for Excel export & import testing
// =============================================================================

import { TallyTransactionRow } from "./xml-generator";

export const SAMPLE_TEMPLATES: Record<string, TallyTransactionRow[]> = {
  Sales: [
    {
      id: "s1",
      date: "2025-04-01",
      voucherType: "Sales",
      voucherNumber: "INV-2025-001",
      partyName: "Apex Retail Solutions Pvt Ltd",
      ledgerName: "Sales Account - Domestic",
      amount: 45000,
      gstRate: 18,
      gstType: "Intra-State (CGST+SGST)",
      cgstAmount: 4050,
      sgstAmount: 4050,
      igstAmount: 0,
      partyState: "West Bengal",
      partyGstin: "19AAACA1234A1Z5",
      narration: "Being IT Consulting services provided for Q1",
      status: "valid",
    },
    {
      id: "s2",
      date: "2025-04-03",
      voucherType: "Sales",
      voucherNumber: "INV-2025-002",
      partyName: "Global Trade Dynamics Inc",
      ledgerName: "Sales Account - Export",
      amount: 120000,
      gstRate: 18,
      gstType: "Inter-State (IGST)",
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 21600,
      partyState: "Maharashtra",
      partyGstin: "27BBBCC5678B2Z9",
      narration: "Software development services invoice",
      status: "valid",
    },
    {
      id: "s3",
      date: "2025-04-05",
      voucherType: "Sales",
      voucherNumber: "INV-2025-003",
      partyName: "Zenith Enterprises",
      ledgerName: "Sales Account - Exempt",
      amount: 28500,
      gstRate: 0,
      gstType: "Exempt / Non-GST",
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 0,
      partyState: "West Bengal",
      partyGstin: "19XYZAB9876C1Z3",
      narration: "Exempted audit consultancy advisory",
      status: "valid",
    },
  ],
  Purchase: [
    {
      id: "p1",
      date: "2025-04-02",
      voucherType: "Purchase",
      voucherNumber: "PUR-8849",
      partyName: "Dell India Pvt Ltd",
      ledgerName: "Computer & Hardware Expenses",
      amount: 85000,
      gstRate: 18,
      gstType: "Inter-State (IGST)",
      cgstAmount: 0,
      sgstAmount: 0,
      igstAmount: 15300,
      partyState: "Karnataka",
      partyGstin: "29AABCD1234E1Z6",
      narration: "Purchase of high-performance developer laptop",
      status: "valid",
    },
    {
      id: "p2",
      date: "2025-04-04",
      voucherType: "Purchase",
      voucherNumber: "PUR-1042",
      partyName: "Office Supplies Co",
      ledgerName: "Printing & Stationery Expenses",
      amount: 12400,
      gstRate: 12,
      gstType: "Intra-State (CGST+SGST)",
      cgstAmount: 744,
      sgstAmount: 744,
      igstAmount: 0,
      partyState: "West Bengal",
      partyGstin: "19AABCS9988D1Z2",
      narration: "Bulk purchase of printing paper and cartridges",
      status: "valid",
    },
  ],
  "Bank Statement": [
    {
      id: "b1",
      date: "2025-04-01",
      voucherType: "Bank Statement",
      voucherNumber: "TXN-909281",
      partyName: "Salary Transfer - Staff Payroll",
      ledgerName: "HDFC Bank Account",
      amount: -150000,
      narration: "NEFT Salary payout for March 2025",
      debitCredit: "Dr",
      status: "valid",
    },
    {
      id: "b2",
      date: "2025-04-02",
      voucherType: "Bank Statement",
      voucherNumber: "TXN-909282",
      partyName: "Apex Retail Solutions Pvt Ltd",
      ledgerName: "ICICI Bank Account",
      amount: 53100,
      narration: "Customer payment received against INV-2025-001",
      debitCredit: "Cr",
      status: "valid",
    },
    {
      id: "b3",
      date: "2025-04-04",
      voucherType: "Bank Statement",
      voucherNumber: "TXN-909283",
      partyName: "Airtel Telecommunications",
      ledgerName: "Telephone & Internet Charges",
      amount: -4999,
      narration: "Autopay monthly optical fiber connection bill",
      debitCredit: "Dr",
      status: "valid",
    },
  ],
  Payment: [
    {
      id: "pm1",
      date: "2025-04-06",
      voucherType: "Payment",
      voucherNumber: "PAY-0012",
      partyName: "Kolkata Electric Supply Corp",
      ledgerName: "HDFC Bank Account",
      amount: 18450,
      narration: "Office premises electricity bill for March 2025",
      status: "valid",
    },
  ],
  Journal: [
    {
      id: "j1",
      date: "2025-04-30",
      voucherType: "Journal",
      voucherNumber: "JV-2025-04",
      partyName: "Depreciation on Office Computers",
      ledgerName: "Accumulated Depreciation",
      amount: 15000,
      narration: "Monthly depreciation provision entry",
      debitCredit: "Dr",
      status: "valid",
    },
  ],
};

/**
 * Downloads sample CSV file directly in browser
 */
export function downloadSampleCSV(voucherType: string) {
  const data = SAMPLE_TEMPLATES[voucherType] || SAMPLE_TEMPLATES["Sales"];
  const headers = [
    "Date",
    "Voucher Type",
    "Voucher Number",
    "Party Name",
    "Ledger Name",
    "Amount",
    "GST Rate (%)",
    "GST Type",
    "Party State",
    "Party GSTIN",
    "Narration",
  ];

  const csvRows = [headers.join(",")];

  data.forEach((row) => {
    const values = [
      `"${row.date}"`,
      `"${row.voucherType}"`,
      `"${row.voucherNumber}"`,
      `"${row.partyName.replace(/"/g, '""')}"`,
      `"${row.ledgerName.replace(/"/g, '""')}"`,
      row.amount,
      row.gstRate || 0,
      `"${row.gstType || ""}"`,
      `"${row.partyState || ""}"`,
      `"${row.partyGstin || ""}"`,
      `"${(row.narration || "").replace(/"/g, '""')}"`,
    ];
    csvRows.push(values.join(","));
  });

  const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `Tally_Sample_Template_${voucherType.replace(/\s+/g, "_")}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
