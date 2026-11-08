"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  PhoneCall,
  CheckCircle2,
  Truck,
  Printer,
  Search,
  MessageCircle,
  Trash2,
} from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  // Dispatch modal
  const [dispatchModalOrder, setDispatchModalOrder] = useState(null);
  const [selectedCourier, setSelectedCourier] = useState("Leopard Courier Express");
  const [trackingAWB, setTrackingAWB] = useState("");

  const refreshOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (data && data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to refresh orders:", err);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch("/api/orders")
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) {
          if (data && data.orders) {
            setOrders(data.orders);
          }
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Failed to load orders:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderStatus: status }),
      });
      if (res.ok) {
        refreshOrders();
      }
    } catch (err) {
      console.error("Failed to update status:", err);
    }
  };

  const handleQuickVerifyCOD = (orderId) => {
    handleUpdateStatus(orderId, "CONFIRMED");
  };

  const handleDispatchSubmit = async (e) => {
    e.preventDefault();
    if (!dispatchModalOrder) return;

    try {
      const res = await fetch(`/api/orders/${dispatchModalOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderStatus: "DISPATCHED",
          courierName: selectedCourier,
          trackingNumber: trackingAWB || `AWB-${Math.floor(1000000 + Math.random() * 9000000)}`,
        }),
      });
      if (res.ok) {
        setDispatchModalOrder(null);
        setTrackingAWB("");
        refreshOrders();
      }
    } catch (err) {
      console.error("Failed to dispatch order:", err);
    }
  };

  const handleDeleteOrder = async (orderId, orderNum) => {
    if (!confirm(`Are you sure you want to delete order ${orderNum}?`)) return;
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) refreshOrders();
    } catch (err) {
      console.error("Failed to delete order:", err);
    }
  };

  const filtered = orders.filter((o) => {
    if (filterStatus !== "ALL" && o.orderStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        o.orderNumber.toLowerCase().includes(q) ||
        o.customer?.fullName?.toLowerCase().includes(q) ||
        o.customer?.phone?.includes(q) ||
        o.customer?.city?.toLowerCase().includes(q) ||
        (Array.isArray(o.items) && o.items.some((i) => i.productName?.toLowerCase().includes(q)))
      );
    }
    return true;
  });

  // Calculate quick metrics
  const totalCount = orders.length;
  const pendingCount = orders.filter((o) => o.orderStatus === "PENDING_VERIFICATION").length;
  const confirmedCount = orders.filter((o) => o.orderStatus === "CONFIRMED").length;
  const processingCount = orders.filter((o) => o.orderStatus === "PROCESSING").length;
  const dispatchedCount = orders.filter((o) => o.orderStatus === "DISPATCHED").length;
  const deliveredCount = orders.filter((o) => o.orderStatus === "DELIVERED").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#171717]">
            Order Operations & Dispatch Desk
          </h1>
          <p className="text-xs text-[#71717A]">
            Manage Pakistan Cash on Delivery (COD) verification, international DHL bookings, and courier waybill tracking.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-[#E5E5E9] hover:bg-[#FAF8F5] text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Manifest</span>
        </button>
      </div>

      {/* Real-time Order Status Counts Bar (Fulfilling User Request) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        <button
          onClick={() => setFilterStatus("ALL")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "ALL"
              ? "bg-[#171717] text-white border-[#171717] shadow-xs"
              : "bg-white text-[#171717] border-[#E5E5E9] hover:border-[#171717]"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider opacity-75">All Orders</div>
          <div className="text-xl font-extrabold mt-0.5">{totalCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus("PENDING_VERIFICATION")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "PENDING_VERIFICATION"
              ? "bg-amber-600 text-white border-amber-600 shadow-xs"
              : "bg-white text-amber-900 border-[#E5E5E9] hover:border-amber-400"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-600">Pending Call (COD)</div>
          <div className="text-xl font-extrabold mt-0.5">{pendingCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus("CONFIRMED")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "CONFIRMED"
              ? "bg-blue-600 text-white border-blue-600 shadow-xs"
              : "bg-white text-blue-900 border-[#E5E5E9] hover:border-blue-400"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-blue-600">Confirmed</div>
          <div className="text-xl font-extrabold mt-0.5">{confirmedCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus("PROCESSING")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "PROCESSING"
              ? "bg-purple-600 text-white border-purple-600 shadow-xs"
              : "bg-white text-purple-900 border-[#E5E5E9] hover:border-purple-400"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-purple-600">In Processing</div>
          <div className="text-xl font-extrabold mt-0.5">{processingCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus("DISPATCHED")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "DISPATCHED"
              ? "bg-indigo-600 text-white border-indigo-600 shadow-xs"
              : "bg-white text-indigo-900 border-[#E5E5E9] hover:border-indigo-400"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-indigo-600">Dispatched</div>
          <div className="text-xl font-extrabold mt-0.5">{dispatchedCount}</div>
        </button>

        <button
          onClick={() => setFilterStatus("DELIVERED")}
          className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
            filterStatus === "DELIVERED"
              ? "bg-green-600 text-white border-green-600 shadow-xs"
              : "bg-white text-green-900 border-[#E5E5E9] hover:border-green-400"
          }`}
        >
          <div className="text-[10px] uppercase font-bold tracking-wider text-green-600">Delivered</div>
          <div className="text-xl font-extrabold mt-0.5">{deliveredCount}</div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-[#E5E5E9] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="text-xs text-[#71717A]">
          Showing <strong>{filtered.length}</strong> consignments
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#A1A1AA] absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search order#, phone, patron, city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs bg-[#FAF8F5] border border-[#E5E5E9] rounded-xl text-[#171717] focus:outline-none focus:border-[#171717]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl border border-[#E5E5E9] p-6 h-36 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#E5E5E9] text-[#71717A] text-xs">
            No orders found matching this filter criteria.
          </div>
        ) : (
          filtered.map((order) => {
            const isNational = order.customer?.country === "Pakistan" || order.currency === "PKR";

            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl border border-[#E5E5E9] p-6 shadow-xs space-y-4 hover:border-[#B58A52]/40 transition-colors"
              >
                {/* Order Meta Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F0ECE3] gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex items-center justify-center text-[#B58A52] font-mono font-bold text-xs">
                      #{order.orderNumber.slice(-4)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[#171717]">
                          {order.orderNumber}
                        </span>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                            isNational
                              ? "bg-green-50 text-green-800 border border-green-200"
                              : "bg-blue-50 text-blue-800 border border-blue-200"
                          }`}
                        >
                          {isNational ? "🇵🇰 National (COD)" : "🌍 International (Card)"}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">
                        Placed on {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </div>
                  </div>

                  {/* Status & Dispatch Controls */}
                  <div className="flex items-center gap-3">
                    <select
                      value={order.orderStatus}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                      className={`text-xs font-bold uppercase tracking-wider rounded-xl px-3 py-1.5 border transition-colors ${
                        order.orderStatus === "DELIVERED"
                          ? "bg-green-50 text-green-800 border-green-200"
                          : order.orderStatus === "DISPATCHED"
                          ? "bg-indigo-50 text-indigo-800 border-indigo-200"
                          : order.orderStatus === "PROCESSING"
                          ? "bg-purple-50 text-purple-800 border-purple-200"
                          : order.orderStatus === "CONFIRMED"
                          ? "bg-blue-50 text-blue-800 border-blue-200"
                          : order.orderStatus === "CANCELLED"
                          ? "bg-red-50 text-red-800 border-red-200"
                          : "bg-amber-50 text-amber-800 border-amber-200"
                      }`}
                    >
                      <option value="PENDING_VERIFICATION">Pending Verification (COD)</option>
                      <option value="CONFIRMED">Confirmed</option>
                      <option value="PROCESSING">Processing</option>
                      <option value="DISPATCHED">Dispatched</option>
                      <option value="DELIVERED">Delivered</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>

                    {/* Dispatch Order Shortcut */}
                    {order.orderStatus !== "DISPATCHED" && order.orderStatus !== "DELIVERED" && (
                      <button
                        onClick={() => {
                          setDispatchModalOrder(order);
                          setSelectedCourier(isNational ? "Leopard Courier Express" : "DHL Express Priority");
                          setTrackingAWB(`AWB-${Math.floor(1000000 + Math.random() * 9000000)}`);
                        }}
                        className="px-3.5 py-1.5 bg-[#171717] hover:bg-[#B58A52] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <Truck className="w-3.5 h-3.5" />
                        <span>Dispatch Order</span>
                      </button>
                    )}

                    <button
                      onClick={() => handleDeleteOrder(order.id, order.orderNumber)}
                      title="Delete order"
                      className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Order Content Grid: Patron & Items */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-xs">
                  {/* Patron Details (4 cols) */}
                  <div className="lg:col-span-4 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] space-y-3">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52] block">
                      Recipient & Destination
                    </span>
                    <div>
                      <div className="font-bold text-sm text-[#171717]">
                        {order.customer?.fullName}
                      </div>
                      <div className="text-[#71717A] mt-0.5">
                        {order.customer?.addressLine1}
                        {order.customer?.addressLine2 && `, ${order.customer.addressLine2}`}
                      </div>
                      <div className="text-[#71717A]">
                        {order.customer?.city}, {order.customer?.country}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E4DC] flex items-center justify-between">
                      <div className="font-mono text-[#171717]">
                        {order.customer?.phone}
                      </div>
                      {/* Pakistan Phone Direct Call / WhatsApp Verification for COD */}
                      <div className="flex items-center gap-1.5">
                        <a
                          href={`tel:${order.customer?.phone}`}
                          title="Call Patron"
                          className="p-1.5 bg-white border border-[#E5E5E9] hover:bg-green-50 hover:text-green-600 rounded-lg transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                        </a>
                        <a
                          href={`https://wa.me/${order.customer?.phone?.replace(/[^0-9]/g, "")}?text=Assalam-o-Alaikum%20${encodeURIComponent(order.customer?.fullName)},%20this%20is%20Maison%20Atelier%20calling%20to%20verify%20your%20order%20${order.orderNumber}`}
                          target="_blank"
                          rel="noreferrer"
                          title="WhatsApp Patron"
                          className="p-1.5 bg-white border border-[#E5E5E9] hover:bg-green-50 text-green-600 rounded-lg transition-colors"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    </div>

                    {order.paymentMethod === "COD" && order.orderStatus === "PENDING_VERIFICATION" && (
                      <button
                        onClick={() => handleQuickVerifyCOD(order.id)}
                        className="w-full mt-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold text-[11px] uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Confirm Phone Verification</span>
                      </button>
                    )}
                  </div>

                  {/* Items List (5 cols) */}
                  <div className="lg:col-span-5 space-y-2">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#71717A] block">
                      Enclosed Garments & Goods ({order.items?.length || 0})
                    </span>
                    <div className="divide-y divide-[#F0ECE3] max-h-40 overflow-y-auto pr-1">
                      {order.items?.map((item, idx) => (
                        <div key={idx} className="py-2 flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="relative w-10 h-12 rounded bg-[#E8E4DC] overflow-hidden shrink-0">
                              {item.productImage && (
                                <Image
                                  src={item.productImage}
                                  alt={item.productName || "Product"}
                                  fill
                                  sizes="40px"
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-[#171717]">{item.productName}</div>
                              <div className="text-[10px] text-[#71717A]">
                                SKU: {item.sku} {item.size && `• Size: ${item.size}`}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-[#171717]">
                              Qty: {item.quantity}
                            </div>
                            <div className="text-[10px] text-[#71717A]">
                              {order.currency === "PKR" ? `₨ ${(item.price * item.quantity).toLocaleString()}` : `$${item.price * item.quantity}`}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Financials & Courier Dispatch Details (3 cols) */}
                  <div className="lg:col-span-3 p-4 rounded-xl bg-[#FAF8F5] border border-[#E8E4DC] flex flex-col justify-between space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-widest text-[#71717A] block mb-1">
                        Settlement Summary
                      </span>
                      <div className="font-bold text-lg text-[#171717]">
                        {order.currency === "PKR" ? `₨ ${order.total?.toLocaleString()}` : `$${order.total}`}
                      </div>
                      <div className="text-[11px] text-[#71717A] mt-0.5">
                        Method: <strong>{order.paymentMethod === "COD" ? "Cash On Delivery (National)" : "Prepaid Card (Intl)"}</strong>
                      </div>
                      <div className="text-[11px] text-[#71717A]">
                        Payment Status: <span className="font-semibold">{order.paymentStatus}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8E4DC]">
                      <div className="text-[11px] text-[#71717A]">
                        Carrier: <strong>{order.courierName || "To be dispatched"}</strong>
                      </div>
                      {order.trackingNumber && (
                        <div className="text-[11px] font-mono text-[#171717] mt-0.5">
                          AWB: <strong>{order.trackingNumber}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Dispatch Modal */}
      {dispatchModalOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setDispatchModalOrder(null)}
          />
          <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8 z-10 border border-[#E5E5E9] space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#F4F4F6]">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-[#B58A52]">
                  Logistics Dispatch Station
                </span>
                <h3 className="font-bold text-lg text-[#171717]">
                  Dispatch Consignment {dispatchModalOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setDispatchModalOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleDispatchSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-[#FAF8F5] rounded-xl border border-[#E5E5E9] space-y-1">
                <div className="font-bold text-[#171717]">{dispatchModalOrder.customer?.fullName}</div>
                <div className="text-[#71717A]">{dispatchModalOrder.customer?.addressLine1}, {dispatchModalOrder.customer?.city}</div>
                <div className="text-amber-800 font-semibold pt-1">
                  Payment: {dispatchModalOrder.paymentMethod === "COD" ? "Cash On Delivery (Collect from Customer)" : "Prepaid Card"}
                </div>
              </div>

              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  Assign Courier Partner *
                </label>
                <select
                  value={selectedCourier}
                  onChange={(e) => setSelectedCourier(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E9] rounded-xl text-xs text-[#171717]"
                >
                  <option value="Leopard Courier Express">Leopard Courier Express (National)</option>
                  <option value="TCS Express Logistics">TCS Express Logistics (National)</option>
                  <option value="Trax Courier Logistics">Trax Courier Logistics (National)</option>
                  <option value="PostEx Express COD">PostEx Pakistan COD</option>
                  <option value="DHL Express Priority">DHL Express Worldwide Priority (International)</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-[#171717] block mb-1">
                  Consignment AWB / Tracking Code *
                </label>
                <input
                  type="text"
                  required
                  value={trackingAWB}
                  onChange={(e) => setTrackingAWB(e.target.value)}
                  placeholder="e.g. LEO-8924128 or DHL-992144"
                  className="w-full px-3.5 py-2.5 bg-white border border-[#E5E5E9] rounded-xl text-xs font-mono text-[#171717]"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDispatchModalOrder(null)}
                  className="px-4 py-2 text-xs font-semibold text-[#71717A] hover:bg-gray-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#171717] hover:bg-[#B58A52] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors shadow-sm cursor-pointer"
                >
                  Confirm Courier Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
