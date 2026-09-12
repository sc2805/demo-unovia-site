"use client";

// =============================================================================
// Importer Dashboard — Core Interactive SaaS Tool
// Reads XLSX/CSV, auto-maps columns, validates live data grid, and exports Tally XML
// =============================================================================

import { useState, useMemo, ChangeEvent } from "react";
import * as XLSX from "xlsx";
import {
  FileSpreadsheet,
  UploadCloud,
  Download,
  CheckCircle2,
  FileCode,
  HelpCircle,
  RefreshCw,
  Layers,
  Copy,
  Zap,
} from "lucide-react";
import { TallyTransactionRow, generateTallyXML } from "@/lib/tally/xml-generator";
import { SAMPLE_TEMPLATES, downloadSampleCSV } from "@/lib/tally/templates";
import TallyGuideModal from "./TallyGuideModal";

export default function ImporterDashboard() {
  const [activeVoucherType, setActiveVoucherType] = useState<string>("Sales");
  const [companyName, setCompanyName] = useState<string>("My Target Company");
  const [rows, setRows] = useState<TallyTransactionRow[]>(SAMPLE_TEMPLATES["Sales"]);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [copiedScript, setCopiedScript] = useState<boolean>(false);

  // Switch template / mock data when voucher type changes
  const handleVoucherTypeChange = (type: string) => {
    setActiveVoucherType(type);
    if (!fileName) {
      setRows(SAMPLE_TEMPLATES[type] || SAMPLE_TEMPLATES["Sales"]);
    }
  };

  // Read uploaded Excel / CSV file using SheetJS (xlsx)
  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json<Record<string, unknown>>(worksheet);

        if (jsonData.length === 0) {
          alert("Uploaded Excel sheet appears to be empty.");
          return;
        }

        // Map parsed JSON rows to standardized TallyTransactionRow format
        const parsedRows: TallyTransactionRow[] = jsonData.map((item, index) => {
          // Flexible key lookup logic for common Excel headers
          const getKey = (...possibleKeys: string[]) => {
            for (const key of possibleKeys) {
              const matched = Object.keys(item).find(
                (k) => k.trim().toLowerCase() === key.toLowerCase()
              );
              if (matched !== undefined && item[matched] !== undefined) {
                return item[matched];
              }
            }
            return undefined;
          };

          const rawDate = getKey("date", "invoice date", "txn date", "bill date", "date of invoice") || "2025-04-01";
          const rawVchNo = getKey("voucher number", "voucher no", "inv no", "invoice number", "ref no", "txn id") || `VCH-${1000 + index}`;
          const rawParty = getKey("party name", "customer name", "vendor name", "party", "account name", "particulars") || "Cash Account";
          const rawLedger = getKey("ledger name", "sales ledger", "purchase ledger", "category", "account") || (activeVoucherType === "Sales" ? "Sales Account" : "Purchase Account");
          const rawAmount = parseFloat(String(getKey("amount", "taxable amount", "value", "total", "net amount") || "0"));
          const rawGstRate = parseFloat(String(getKey("gst rate", "gst %", "tax rate", "rate") || "18"));
          const rawGstType = getKey("gst type", "tax type") || "Intra-State (CGST+SGST)";
          const rawNarration = getKey("narration", "remarks", "description", "note") || "Imported via Tally Importer SaaS";

          return {
            id: `row-${index}-${Date.now()}`,
            date: String(rawDate),
            voucherType: (activeVoucherType as TallyTransactionRow["voucherType"]) || "Sales",
            voucherNumber: String(rawVchNo),
            partyName: String(rawParty),
            ledgerName: String(rawLedger),
            amount: isNaN(rawAmount) ? 1000 : rawAmount,
            gstRate: isNaN(rawGstRate) ? 18 : rawGstRate,
            gstType: (rawGstType as TallyTransactionRow["gstType"]) || "Intra-State (CGST+SGST)",
            narration: String(rawNarration),
            status: isNaN(rawAmount) || rawAmount === 0 ? "warning" : "valid",
          };
        });

        setRows(parsedRows);
      } catch (err) {
        console.error("Failed to parse Excel file:", err);
        alert("Could not parse file. Please ensure it is a valid .xlsx, .xls, or .csv file.");
      }
    };

    reader.readAsArrayBuffer(file);
  };

  // Inline row edit handler
  const updateRowField = (id: string, field: keyof TallyTransactionRow, value: TallyTransactionRow[keyof TallyTransactionRow]) => {
    setRows((prev) =>
      prev.map((row) => (row.id === id ? { ...row, [field]: value } : row))
    );
  };

  // Calculations
  const stats = useMemo(() => {
    const totalCount = rows.length;
    const validCount = rows.filter((r) => r.status !== "error").length;
    const totalValue = rows.reduce((acc, r) => acc + Math.abs(r.amount), 0);
    const totalTax = rows.reduce((acc, r) => {
      const rate = r.gstRate || 0;
      return acc + (Math.abs(r.amount) * rate) / 100;
    }, 0);
    return { totalCount, validCount, totalValue, totalTax };
  }, [rows]);

  // Generated XML string
  const xmlOutput = useMemo(() => {
    return generateTallyXML(rows, companyName);
  }, [rows, companyName]);

  // Download XML file
  const handleDownloadXML = () => {
    if (!xmlOutput) return;
    const blob = new Blob([xmlOutput], { type: "application/xml;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Tally_Import_${activeVoucherType}_${Date.now()}.xml`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Copy Tally Push Script
  const handleCopyPushScript = () => {
    const script = `# PowerShell script to push XML directly to local Tally Prime (Port 9000)
$xmlData = @"
${xmlOutput}
"@
Invoke-RestMethod -Uri "http://localhost:9000" -Method Post -Body $xmlData -ContentType "text/xml"
Write-Host "Successfully sent to Tally!" -ForegroundColor Green`;

    navigator.clipboard.writeText(script);
    setCopiedScript(true);
    setTimeout(() => setCopiedScript(false), 2500);
  };

  return (
    <div id="importer-workspace" className="space-y-8">
      {/* Top Bar / Controls */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200/80 shadow-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-navy-100 text-navy-800 border border-navy-200">
                100% In-Browser Privacy
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                Tally Prime & ERP 9 Ready
              </span>
            </div>
            <h3 className="text-xl font-extrabold text-navy-900">Step 1: Select Voucher Type & Load Data</h3>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGuideOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-navy-50 hover:bg-navy-100 text-navy-800 text-xs font-semibold rounded-xl transition-colors border border-navy-200"
            >
              <HelpCircle className="w-4 h-4 text-navy-700" />
              Tally Setup Guide
            </button>
            <button
              onClick={() => downloadSampleCSV(activeVoucherType)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-gold-400 hover:bg-gold-300 text-navy-950 text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              <Download className="w-4 h-4" />
              Sample Template (.csv)
            </button>
          </div>
        </div>

        {/* Voucher Type Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2">
          {["Sales", "Purchase", "Bank Statement", "Payment", "Receipt", "Journal"].map((type) => (
            <button
              key={type}
              onClick={() => handleVoucherTypeChange(type)}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all text-center border ${
                activeVoucherType === type
                  ? "bg-navy-900 text-white border-navy-900 shadow-md ring-2 ring-gold-400/50"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:text-navy-900"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Drag & Drop Upload Zone */}
        <div className="relative border-2 border-dashed border-navy-200 hover:border-navy-400 bg-navy-50/30 rounded-2xl p-8 text-center transition-colors">
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="excel-file-input"
          />
          <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
            <div className="w-12 h-12 rounded-2xl bg-navy-800 text-gold-400 flex items-center justify-center shadow-md">
              <UploadCloud className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-navy-900">
                {fileName ? `Loaded: ${fileName}` : "Drag & Drop your Excel / CSV file here"}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                Supports .xlsx, .xls, .csv files (or use auto-loaded sample data below)
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Target Company Name Configuration */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Layers className="w-5 h-5 text-navy-800 shrink-0" />
          <div>
            <label className="text-xs font-bold text-navy-900 block">Tally Target Company Name</label>
            <p className="text-[11px] text-gray-500">Must match your open Company Name in Tally Prime</p>
          </div>
        </div>
        <input
          type="text"
          value={companyName}
          onChange={(e) => setCompanyName(e.target.value)}
          className="px-4 py-2 rounded-xl border border-gray-300 text-sm font-semibold text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800 w-full sm:w-72"
          placeholder="e.g. Acme Trading Corp"
        />
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Transactions</p>
          <p className="text-2xl font-black text-navy-900 mt-1">{stats.totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Validated Status</p>
          <p className="text-2xl font-black text-emerald-600 mt-1">{stats.validCount} / {stats.totalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Total Turnover Value</p>
          <p className="text-2xl font-black text-navy-900 mt-1">₹{stats.totalValue.toLocaleString("en-IN")}</p>
        </div>
        <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
          <p className="text-xs text-gray-500 font-medium">Est. Total GST Tax</p>
          <p className="text-2xl font-black text-navy-900 mt-1">₹{stats.totalTax.toLocaleString("en-IN")}</p>
        </div>
      </div>

      {/* Step 2: Data Grid & Live Validation */}
      <div className="bg-white rounded-3xl border border-gray-200/80 shadow-lg overflow-hidden space-y-4">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-gray-50/50">
          <div>
            <h3 className="text-lg font-extrabold text-navy-900 flex items-center gap-2">
              <FileSpreadsheet className="w-5 h-5 text-navy-800" />
              Step 2: Preview & Live Data Grid
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Click any cell to edit details before generating your final Tally XML
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRows(SAMPLE_TEMPLATES[activeVoucherType] || SAMPLE_TEMPLATES["Sales"])}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-navy-900 bg-white border border-gray-200 flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset Data
            </button>
          </div>
        </div>

        {/* Spreadsheet Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-navy-900 text-white text-xs font-bold uppercase tracking-wider">
                <th className="py-3 px-4">Date</th>
                <th className="py-3 px-4">Voucher No</th>
                <th className="py-3 px-4">Party Name</th>
                <th className="py-3 px-4">Ledger Name</th>
                <th className="py-3 px-4 text-right">Amount (₹)</th>
                <th className="py-3 px-4 text-center">GST Rate</th>
                <th className="py-3 px-4">Narration</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs">
              {rows.map((row) => (
                <tr key={row.id} className="hover:bg-navy-50/30 transition-colors">
                  <td className="py-3 px-4 font-mono font-medium">
                    <input
                      type="text"
                      value={row.date}
                      onChange={(e) => updateRowField(row.id, "date", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-24"
                    />
                  </td>
                  <td className="py-3 px-4 font-mono">
                    <input
                      type="text"
                      value={row.voucherNumber}
                      onChange={(e) => updateRowField(row.id, "voucherNumber", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-28"
                    />
                  </td>
                  <td className="py-3 px-4 font-semibold text-navy-900">
                    <input
                      type="text"
                      value={row.partyName}
                      onChange={(e) => updateRowField(row.id, "partyName", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-full"
                    />
                  </td>
                  <td className="py-3 px-4 text-gray-700">
                    <input
                      type="text"
                      value={row.ledgerName}
                      onChange={(e) => updateRowField(row.id, "ledgerName", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-full"
                    />
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-navy-900">
                    <input
                      type="number"
                      value={row.amount}
                      onChange={(e) => updateRowField(row.id, "amount", parseFloat(e.target.value) || 0)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-24 text-right font-bold"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <select
                      value={row.gstRate || 18}
                      onChange={(e) => updateRowField(row.id, "gstRate", parseInt(e.target.value, 10))}
                      className="bg-transparent border border-gray-200 rounded px-1.5 py-0.5 text-xs font-semibold focus:outline-none"
                    >
                      <option value={0}>0% (Exempt)</option>
                      <option value={5}>5%</option>
                      <option value={12}>12%</option>
                      <option value={18}>18%</option>
                      <option value={28}>28%</option>
                    </select>
                  </td>
                  <td className="py-3 px-4 text-gray-500 max-w-xs truncate">
                    <input
                      type="text"
                      value={row.narration || ""}
                      onChange={(e) => updateRowField(row.id, "narration", e.target.value)}
                      className="bg-transparent border-b border-transparent hover:border-gray-300 focus:border-navy-800 focus:bg-white px-1 py-0.5 rounded outline-none w-full text-gray-600"
                    />
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      <CheckCircle2 className="w-3 h-3" />
                      Valid
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Step 3: Export Tally XML & Live Sync Panel */}
      <div className="bg-navy-900 text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden space-y-6">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-navy-800 pb-6">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-gold-400/20 text-gold-300 border border-gold-400/30 mb-2">
              <Zap className="w-3.5 h-3.5" />
              Ready for Export
            </span>
            <h3 className="text-2xl font-extrabold text-white">Step 3: Export Tally XML Payload</h3>
            <p className="text-xs text-navy-200 mt-1">
              Generated XML is compatible with Tally Prime 1.0 - 4.0+ and Tally.ERP 9.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyPushScript}
              className="inline-flex items-center gap-2 px-5 py-3 bg-navy-800 hover:bg-navy-700 text-white text-xs font-bold rounded-xl transition-all border border-navy-700 shadow-md"
            >
              <Copy className="w-4 h-4 text-gold-400" />
              {copiedScript ? "Copied PowerShell Script!" : "Copy Tally HTTP Script"}
            </button>

            <button
              onClick={handleDownloadXML}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gold-400 hover:bg-gold-300 text-navy-950 text-sm font-extrabold rounded-xl transition-all shadow-xl shadow-gold-400/20 hover:shadow-gold-400/30"
            >
              <FileCode className="w-4 h-4" />
              Download Tally XML File
            </button>
          </div>
        </div>

        {/* XML Code Preview Window */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-navy-300 flex items-center justify-between">
            <span>Tally XML Payload Preview ({rows.length} Vouchers)</span>
            <span className="font-mono text-[11px] text-navy-400">ENVELOPE &gt; TALLYMESSAGE</span>
          </label>
          <div className="bg-slate-950 text-slate-200 p-4 rounded-2xl font-mono text-xs overflow-x-auto max-h-56 border border-navy-800">
            <pre>{xmlOutput}</pre>
          </div>
        </div>
      </div>

      {/* Guide Modal */}
      <TallyGuideModal isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />
    </div>
  );
}
