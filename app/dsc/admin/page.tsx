"use client";

// =============================================================================
// DSC Store — Admin Dashboard — /dsc/admin
// =============================================================================

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  RefreshCw,
  MessageCircle,
  Phone,
  Mail,
  Lock,
  Package,
  Usb,
  X,
  ChevronRight,
  ExternalLink,
  Edit3,
} from "lucide-react";
import type { DSCOrder } from "@/lib/dsc/orders";

export default function DSCAdminPage() {
  const [password, setPassword] = useState("");
  const [authHeader, setAuthHeader] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [orders, setOrders] = useState<DSCOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");

  const [selectedOrder, setSelectedOrder] = useState<DSCOrder | null>(null);
  const [updating, setUpdating] = useState(false);
  const [resendingWA, setResendingWA] = useState(false);
  const [updateMsg, setUpdateMsg] = useState<string | null>(null);

  // Form state for selected order
  const [editState, setEditState] = useState<{
    orderState: string;
    paymentStatus: string;
    notes: string;
  }>({
    orderState: "pending",
    paymentStatus: "pending",
    notes: "",
  });

  // Try auto-login from sessionStorage
  useEffect(() => {
    const saved = sessionStorage.getItem("unovia_dsc_admin_pwd");
    if (saved) {
      setPassword(saved);
      authenticate(saved);
    }
  }, []);

  const authenticate = async (pwd: string) => {
    setLoading(true);
    setAuthError(null);

    try {
      const res = await fetch("/api/dsc/orders", {
        headers: {
          Authorization: `Bearer ${pwd}`,
        },
      });

      if (!res.ok) {
        throw new Error("Invalid admin password. Please try again.");
      }

      const data = await res.json();
      setOrders(data.orders || []);
      setAuthHeader(`Bearer ${pwd}`);
      setIsAuthenticated(true);
      sessionStorage.setItem("unovia_dsc_admin_pwd", pwd);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed.";
      setAuthError(msg);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    authenticate(password);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("unovia_dsc_admin_pwd");
    setIsAuthenticated(false);
    setAuthHeader(null);
    setPassword("");
    setOrders([]);
  };

  const refreshOrders = async () => {
    if (!authHeader) return;
    setLoading(true);
    try {
      const res = await fetch("/api/dsc/orders", {
        headers: { Authorization: authHeader },
      });
      const data = await res.json();
      if (res.ok) {
        setOrders(data.orders || []);
        if (selectedOrder) {
          const fresh = data.orders.find((o: DSCOrder) => o.id === selectedOrder.id);
          if (fresh) setSelectedOrder(fresh);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const openOrderDrawer = (order: DSCOrder) => {
    setSelectedOrder(order);
    setEditState({
      orderState: order.orderState,
      paymentStatus: order.paymentStatus,
      notes: order.notes || "",
    });
    setUpdateMsg(null);
  };

  const saveOrderUpdates = async () => {
    if (!selectedOrder || !authHeader) return;
    setUpdating(true);
    setUpdateMsg(null);

    try {
      const res = await fetch(`/api/dsc/orders/${selectedOrder.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: authHeader,
        },
        body: JSON.stringify(editState),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update order");

      setSelectedOrder(data.order);
      setUpdateMsg("Order updated successfully!");
      refreshOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Update failed";
      setUpdateMsg(`Error: ${msg}`);
    } finally {
      setUpdating(false);
    }
  };

  const resendWhatsApp = async () => {
    if (!selectedOrder || !authHeader) return;
    setResendingWA(true);
    setUpdateMsg(null);

    try {
      const res = await fetch(`/api/dsc/orders/${selectedOrder.id}/resend-whatsapp`, {
        method: "POST",
        headers: {
          Authorization: authHeader,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to send WhatsApp message");

      setUpdateMsg("WhatsApp message triggered successfully!");
      refreshOrders();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "WhatsApp trigger failed";
      setUpdateMsg(`Error: ${msg}`);
    } finally {
      setResendingWA(false);
    }
  };

  // KPIs
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.orderState === "pending" || o.orderState === "processing").length;
  const completedOrders = orders.filter((o) => o.orderState === "issued" || o.orderState === "delivered").length;
  const totalRevenue = orders
    .filter((o) => o.orderState !== "cancelled")
    .reduce((sum, o) => sum + (o.pricing?.totalAmount || 0), 0);

  // Filtered list
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.applicant.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.applicant.mobile.includes(searchTerm) ||
      o.applicant.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.applicant.pan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.orderState === statusFilter;
    const matchesPayment = paymentFilter === "all" || o.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Render Login Prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4 pt-20 pb-16">
        <div className="max-w-md w-full bg-white rounded-2xl border border-gray-200 shadow-xl p-8">
          <div className="w-12 h-12 bg-navy-50 rounded-2xl flex items-center justify-center text-navy-800 mb-6 mx-auto">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-navy-900 text-center mb-2">
            DSC Administration
          </h1>
          <p className="text-xs text-gray-500 text-center mb-6">
            Enter your administrative credentials to manage DSC orders, update verification states, and monitor sales.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">
                Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-navy-800"
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-medium">
                {authError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-navy-800 hover:bg-navy-700 text-white font-bold rounded-xl text-sm transition-all shadow-md disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Unlock Dashboard"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link href="/dsc" className="text-xs text-gray-400 hover:text-navy-800">
              ← Return to DSC Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 pt-28 pb-20 md:pt-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold bg-gold-100 text-gold-800 px-2 py-0.5 rounded-md uppercase tracking-wider">
                Admin Panel
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-navy-900">
                DSC Order Management
              </h1>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Real-time monitoring of Class 3 DSC orders & offline payments
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refreshOrders}
              disabled={loading}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-navy-800 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
            <Link
              href="/dsc/track"
              target="_blank"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-all shadow-sm"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Tracking View
            </Link>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-50 text-red-700 border border-red-200 rounded-xl text-xs font-bold hover:bg-red-100 transition-all"
            >
              Logout
            </button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <span className="text-xs text-gray-500 font-semibold block mb-1">Total Orders</span>
            <span className="text-2xl sm:text-3xl font-black text-navy-900">{totalOrders}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <span className="text-xs text-amber-600 font-semibold block mb-1">Pending Verification</span>
            <span className="text-2xl sm:text-3xl font-black text-amber-700">{pendingOrders}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <span className="text-xs text-emerald-600 font-semibold block mb-1">Issued / Delivered</span>
            <span className="text-2xl sm:text-3xl font-black text-emerald-700">{completedOrders}</span>
          </div>
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
            <span className="text-xs text-gold-600 font-semibold block mb-1">Total Pipeline Gross</span>
            <span className="text-2xl sm:text-3xl font-black text-navy-900">
              ₹{totalRevenue.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-6 flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[240px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by ID, name, mobile, email, PAN..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-gray-200 text-xs text-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-800"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">State:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none"
            >
              <option value="all">All States</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="verified">Verified</option>
              <option value="issued">Issued</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 font-semibold">Payment:</span>
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-navy-900 focus:outline-none"
            >
              <option value="all">All Payments</option>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold border-b border-gray-200">
                <tr>
                  <th className="px-5 py-3.5">Order Ref</th>
                  <th className="px-5 py-3.5">Applicant</th>
                  <th className="px-5 py-3.5">Certificates</th>
                  <th className="px-5 py-3.5">Amount</th>
                  <th className="px-5 py-3.5">State</th>
                  <th className="px-5 py-3.5">Payment</th>
                  <th className="px-5 py-3.5">WhatsApp</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-12 text-center text-gray-400">
                      No DSC orders found matching your criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => (
                    <tr
                      key={order.id}
                      onClick={() => openOrderDrawer(order)}
                      className="hover:bg-navy-50/40 cursor-pointer transition-colors"
                    >
                      <td className="px-5 py-4 font-mono font-bold text-navy-900">
                        {order.id}
                        <span className="block text-[10px] text-gray-400 font-sans font-normal mt-0.5">
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-navy-900 block">{order.applicant.fullName}</span>
                        <span className="text-[11px] text-gray-500 block">
                          +91 {order.applicant.mobile}
                        </span>
                        <span className="text-[10px] text-gray-400 block truncate max-w-[140px]">
                          {order.applicant.email}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {order.pricing.lineItems.map((item, idx) => (
                          <div key={idx} className="truncate max-w-[200px] text-navy-800 font-medium">
                            {item.quantity}× {item.productName}
                          </div>
                        ))}
                        {order.pricing.tokenSelected && (
                          <span className="inline-flex items-center gap-1 text-[10px] text-gold-700 bg-gold-50 px-1.5 py-0.5 rounded mt-0.5">
                            <Usb className="w-2.5 h-2.5" /> +Token
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 font-bold text-navy-900">
                        ₹{order.pricing.totalAmount.toLocaleString("en-IN")}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            order.orderState === "issued" || order.orderState === "delivered"
                              ? "bg-emerald-50 text-emerald-700"
                              : order.orderState === "cancelled"
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {order.orderState}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            order.paymentStatus === "paid"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-[10px] font-semibold ${
                            order.whatsappNotificationStatus === "sent" ||
                            order.whatsappNotificationStatus === "delivered"
                              ? "text-emerald-600"
                              : order.whatsappNotificationStatus === "failed"
                              ? "text-red-500"
                              : "text-gray-400"
                          }`}
                        >
                          <MessageCircle className="w-3 h-3" />
                          {order.whatsappNotificationStatus}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-navy-800 hover:text-gold-600">
                          Manage <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Order Drawer / Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-sm flex justify-end">
            <div className="w-full max-w-xl bg-white h-full shadow-2xl overflow-y-auto flex flex-col">
              {/* Drawer Header */}
              <div className="p-6 bg-navy-900 text-white flex items-center justify-between sticky top-0 z-10">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-gold-400">
                    Order Details
                  </span>
                  <h2 className="text-xl font-bold font-mono">{selectedOrder.id}</h2>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 rounded-xl text-gray-300 hover:text-white hover:bg-navy-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                {/* Status alerts */}
                {updateMsg && (
                  <div
                    className={`p-3 rounded-xl font-medium ${
                      updateMsg.includes("Error")
                        ? "bg-red-50 text-red-700 border border-red-200"
                        : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    }`}
                  >
                    {updateMsg}
                  </div>
                )}

                {/* Quick contact shortcuts */}
                <div className="p-4 bg-navy-50/60 rounded-2xl border border-navy-100 flex flex-wrap gap-2">
                  <a
                    href={`https://wa.me/91${selectedOrder.applicant.mobile}?text=${encodeURIComponent(
                      `Hello ${selectedOrder.applicant.fullName}, Unovia Consulting team here regarding your DSC order ${selectedOrder.id}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-sm"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    WhatsApp
                  </a>
                  <a
                    href={`tel:+91${selectedOrder.applicant.mobile}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-navy-800 text-white rounded-xl font-bold hover:bg-navy-700 transition-all shadow-sm"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    Call
                  </a>
                  <a
                    href={`mailto:${selectedOrder.applicant.email}?subject=${encodeURIComponent(
                      `DSC Order ${selectedOrder.id} Verification — Unovia Consulting`
                    )}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-white border border-gray-200 text-navy-900 rounded-xl font-bold hover:bg-gray-50 transition-all shadow-sm"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    Email
                  </a>
                </div>

                {/* Status Update Form */}
                <div className="p-5 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                  <h3 className="font-bold text-navy-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Edit3 className="w-3.5 h-3.5 text-gold-500" />
                    Update Order Status & Payment
                  </h3>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Order State
                      </label>
                      <select
                        value={editState.orderState}
                        onChange={(e) => setEditState((prev) => ({ ...prev, orderState: e.target.value }))}
                        className="w-full p-2 rounded-xl border border-gray-200 bg-white font-semibold text-navy-900"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing (eKYC)</option>
                        <option value="verified">Verified</option>
                        <option value="issued">Issued</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                        Payment Status
                      </label>
                      <select
                        value={editState.paymentStatus}
                        onChange={(e) => setEditState((prev) => ({ ...prev, paymentStatus: e.target.value }))}
                        className="w-full p-2 rounded-xl border border-gray-200 bg-white font-semibold text-navy-900"
                      >
                        <option value="pending">Pending (Offline)</option>
                        <option value="paid">Paid (Confirmed)</option>
                        <option value="failed">Failed</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                      Internal Admin Notes
                    </label>
                    <textarea
                      value={editState.notes}
                      onChange={(e) => setEditState((prev) => ({ ...prev, notes: e.target.value }))}
                      placeholder="e.g. Paid via UPI on 13-Sep. Video eKYC link sent."
                      rows={2}
                      className="w-full p-2.5 rounded-xl border border-gray-200 bg-white text-navy-900 resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={saveOrderUpdates}
                      disabled={updating}
                      className="flex-1 py-2.5 bg-navy-800 text-white rounded-xl font-bold hover:bg-navy-700 transition-all disabled:opacity-50"
                    >
                      {updating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={resendWhatsApp}
                      disabled={resendingWA}
                      className="px-4 py-2.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-xl font-bold hover:bg-emerald-100 transition-all disabled:opacity-50 flex items-center gap-1.5"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      {resendingWA ? "Sending..." : "Resend WA"}
                    </button>
                  </div>
                </div>

                {/* Applicant Details */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-navy-900 mb-3 uppercase tracking-wider text-[11px]">
                    Applicant Information
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Full Name</span>
                      <span className="font-bold text-navy-900">{selectedOrder.applicant.fullName}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Applicant Type</span>
                      <span className="font-bold text-navy-900 capitalize">
                        {selectedOrder.applicant.applicantType}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Mobile</span>
                      <span className="font-bold text-navy-900">+91 {selectedOrder.applicant.mobile}</span>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">PAN</span>
                      <span className="font-bold text-navy-900">{selectedOrder.applicant.pan}</span>
                    </div>
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px]">Email</span>
                      <span className="font-bold text-navy-900">{selectedOrder.applicant.email}</span>
                    </div>
                    {selectedOrder.applicant.organizationName && (
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[10px]">Organization Name</span>
                        <span className="font-bold text-navy-900">
                          {selectedOrder.applicant.organizationName}
                        </span>
                      </div>
                    )}
                    {selectedOrder.applicant.gstin && (
                      <div className="col-span-2">
                        <span className="text-gray-400 block text-[10px]">GSTIN</span>
                        <span className="font-bold text-navy-900">{selectedOrder.applicant.gstin}</span>
                      </div>
                    )}
                    <div className="col-span-2">
                      <span className="text-gray-400 block text-[10px]">Delivery Address</span>
                      <span className="text-navy-900">
                        {selectedOrder.applicant.billingAddress}, {selectedOrder.applicant.city},{" "}
                        {selectedOrder.applicant.state} - {selectedOrder.applicant.pinCode}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items and Financial Breakdown */}
                <div className="p-5 bg-white rounded-2xl border border-gray-200">
                  <h3 className="font-bold text-navy-900 mb-3 uppercase tracking-wider text-[11px]">
                    Purchased Items & Totals
                  </h3>
                  <div className="space-y-2 mb-4">
                    {selectedOrder.pricing.lineItems.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-1 border-b border-gray-50">
                        <div>
                          <span className="font-bold text-navy-900 block">{item.productName}</span>
                          <span className="text-[10px] text-gray-500">
                            Qty: {item.quantity} × ₹{item.unitGrossAmount}
                          </span>
                        </div>
                        <span className="font-bold text-navy-900">
                          ₹{item.lineGrossAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    ))}
                    {selectedOrder.pricing.tokenSelected && (
                      <div className="flex justify-between items-center py-1">
                        <span className="text-gray-700 flex items-center gap-1">
                          <Usb className="w-3 h-3 text-gold-600" /> USB Crypto Token
                        </span>
                        <span className="font-bold text-navy-900">
                          ₹{selectedOrder.pricing.tokenAmount.toLocaleString("en-IN")}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-gray-50 rounded-xl space-y-1 text-xs">
                    <div className="flex justify-between text-gray-500">
                      <span>Base Subtotal</span>
                      <span>₹{selectedOrder.pricing.subtotalBasicAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between text-gray-500">
                      <span>GST (18%)</span>
                      <span>₹{selectedOrder.pricing.subtotalGstAmount.toLocaleString("en-IN", { maximumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between font-black text-navy-900 pt-1.5 border-t border-gray-200">
                      <span>Total Amount</span>
                      <span>₹{selectedOrder.pricing.totalAmount.toLocaleString("en-IN")}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
