"use client";

// =============================================================================
// Tally Prime Connection & Import Guide Modal
// Visual walkthrough explaining Tally HTTP Server setup & XML Import process
// =============================================================================

import { X, CheckCircle2, Server, FileCode, ArrowRight, Copy, Terminal } from "lucide-react";
import { useState } from "react";

interface TallyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TallyGuideModal({ isOpen, onClose }: TallyGuideModalProps) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const sampleXmlCurl = `curl -X POST http://localhost:9000 \\
  -H "Content-Type: text/xml" \\
  -d @tally_import_vouchers.xml`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleXmlCurl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden border border-gray-100 my-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-navy-900 text-white p-6 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 transform translate-x-8 -translate-y-8 w-48 h-48 bg-gold-400/10 rounded-full blur-2xl pointer-events-none" />
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gold-400/20 text-gold-300 border border-gold-400/30 mb-2">
              <Server className="w-3.5 h-3.5" />
              Tally Integration Guide
            </span>
            <h3 className="text-xl font-bold text-white">How to Import Transactions into Tally</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-navy-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Method 1: Tally UI Import */}
          <div className="bg-gray-50 rounded-xl p-5 border border-gray-200 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-navy-800 text-white flex items-center justify-center font-bold text-sm">
                1
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 text-base">Method A: Direct XML File Import in Tally Prime</h4>
                <p className="text-xs text-gray-500">Recommended for offline usage and standard accounting workflow</p>
              </div>
            </div>

            <ol className="space-y-2.5 text-sm text-gray-700 pl-4 border-l-2 border-navy-200 ml-4">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Download the generated <strong>.xml</strong> file from the Tally Importer dashboard.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Open your company in <strong>Tally Prime / Tally.ERP 9</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Go to Top Menu: <strong>Import &gt; Transactions</strong> (or press <kbd className="px-1.5 py-0.5 text-xs bg-white border border-gray-300 rounded shadow-xs">Alt + O</kbd>).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Select <strong>File Format: XML</strong> and enter the full file path of your downloaded XML file.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>Press <strong>Enter</strong> to execute import. Tally will create all vouchers in seconds!</span>
              </li>
            </ol>
          </div>

          {/* Method 2: HTTP Live Connector API */}
          <div className="bg-navy-50/50 rounded-xl p-5 border border-navy-100 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gold-500 text-navy-900 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <div>
                  <h4 className="font-semibold text-navy-900 text-base">Method B: Direct HTTP Sync (Port 9000)</h4>
                  <p className="text-xs text-navy-600">Push vouchers directly over local HTTP network to Tally Server</p>
                </div>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                Automated Sync
              </span>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p className="text-xs text-gray-600">
                Ensure Tally's local ODBC/ODBC HTTP server is enabled in Tally Prime settings:
              </p>
              <div className="bg-white p-3 rounded-lg border border-gray-200 text-xs font-mono text-gray-800 space-y-1">
                <div><span className="text-navy-700 font-bold">Path:</span> F1: Help &gt; Settings &gt; Connectivity &gt; Client/Server configuration</div>
                <div><span className="text-navy-700 font-bold">Enable:</span> Tally Prime Acts as Both / Server</div>
                <div><span className="text-navy-700 font-bold">Port:</span> 9000 (Default)</div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700 flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-navy-700" />
                  Terminal Command / Script to Push XML:
                </label>
                <div className="relative bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-xs overflow-x-auto">
                  <pre>{sampleXmlCurl}</pre>
                  <button
                    onClick={handleCopy}
                    className="absolute top-2 right-2 p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                    title="Copy snippet"
                  >
                    {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Need customized TDL or enterprise API connector? Connect with our CA team.</p>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-navy-800 hover:bg-navy-700 text-white font-semibold text-sm rounded-lg transition-colors"
          >
            Got it, thanks!
          </button>
        </div>
      </div>
    </div>
  );
}
