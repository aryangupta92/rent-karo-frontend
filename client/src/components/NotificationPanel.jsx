import { useState } from "react";
import api from "../services/api";
import { Bell, X, CheckCircle, XCircle, Package, User, Calendar, IndianRupee } from "lucide-react";

function RequestCard({ req, onAction }) {
  const [loading, setLoading] = useState(null);

  const handle = async (status) => {
    setLoading(status);
    try {
      await api.patch(`/api/rentals/${req.rentalId}`, { status });
      onAction(req.rentalId, status);
    } catch (err) { console.error("Action failed:", err); }
    finally     { setLoading(null); }
  };

  return (
    <div
      className="rounded-xl p-4 transition-all duration-200"
      style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.07)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2.5">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
          >
            <Package size={15} style={{ color: "#f59e0b" }} />
          </div>
          <div>
            <p className="font-bold text-sm text-white leading-tight">{req.productName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <User size={10} style={{ color: "#404040" }} />
              <p className="text-xs" style={{ color: "#525252" }}>{req.renter?.name}</p>
            </div>
          </div>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-lg flex-shrink-0"
          style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.18)", color: "#fbbf24" }}
        >
          Pending
        </span>
      </div>

      {/* Details */}
      <div className="grid grid-cols-3 gap-2 mb-3">
        {[
          { icon: <IndianRupee size={11} />, value: `₹${req.price}`,    sub: "/ month" },
          { icon: <Calendar   size={11} />, value: `${req.duration}mo`, sub: "duration" },
          { icon: <IndianRupee size={11} />, value: `₹${req.deposit}`, sub: "deposit" },
        ].map((item, i) => (
          <div
            key={i}
            className="rounded-lg p-2.5 text-center"
            style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.05)" }}
          >
            <div className="flex justify-center mb-1" style={{ color: "#f59e0b" }}>{item.icon}</div>
            <p className="font-bold text-sm gradient-text">{item.value}</p>
            <p className="text-[10px]" style={{ color: "#404040" }}>{item.sub}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => handle("confirmed")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.22)",
            color: "#34d399",
            opacity: loading === "confirmed" ? 0.65 : 1,
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "rgba(16,185,129,0.16)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(16,185,129,0.1)"; }}
        >
          <CheckCircle size={13} />
          {loading === "confirmed" ? "Confirming..." : "Confirm"}
        </button>
        <button
          onClick={() => handle("rejected")}
          disabled={!!loading}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
          style={{
            background: "rgba(239,68,68,0.08)",
            border: "1px solid rgba(239,68,68,0.2)",
            color: "#f87171",
            opacity: loading === "rejected" ? 0.65 : 1,
          }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.background = "rgba(239,68,68,0.13)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.08)"; }}
        >
          <XCircle size={13} />
          {loading === "rejected" ? "Rejecting..." : "Reject"}
        </button>
      </div>
    </div>
  );
}

function NotificationPanel({ requests, onAction, onClose }) {
  return (
    <div
      className="animate-slide-down absolute right-0 top-full mt-2 w-88 rounded-2xl z-50 flex flex-col overflow-hidden"
      style={{
        background: "#0f0f0f",
        border: "1px solid rgba(255,255,255,0.09)",
        boxShadow: "0 24px 48px rgba(0,0,0,0.6)",
        backdropFilter: "blur(20px)",
        maxHeight: "500px",
        width: "360px",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between flex-shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-2">
          <Bell size={14} style={{ color: "#f59e0b" }} />
          <span className="text-white font-bold text-sm">Rental Requests</span>
          {requests.length > 0 && (
            <span
              className="text-xs px-2 py-0.5 rounded-full font-semibold"
              style={{ background: "rgba(245,158,11,0.12)", border: "1px solid rgba(245,158,11,0.22)", color: "#fbbf24" }}
            >
              {requests.length}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg transition-all"
          style={{ color: "#525252" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f0f0f0"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#525252"; }}
        >
          <X size={14} />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {requests.length === 0 ? (
          <div className="text-center py-10">
            <div
              className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center"
              style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
            >
              <Bell size={18} style={{ color: "#2a2a2a" }} />
            </div>
            <p className="text-sm font-medium" style={{ color: "#525252" }}>No pending requests</p>
            <p className="text-xs mt-1" style={{ color: "#404040" }}>New rental requests will appear here.</p>
          </div>
        ) : (
          requests.map((req) => (
            <RequestCard key={req.rentalId} req={req} onAction={onAction} />
          ))
        )}
      </div>
    </div>
  );
}

export default NotificationPanel;
