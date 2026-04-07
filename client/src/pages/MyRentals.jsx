import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  ShoppingBag, ArrowUpRight, CheckCircle2, AlertCircle, Loader2,
  Clock, XCircle, PackageCheck, MessageCircle
} from "lucide-react";
import { getSocket } from "../services/socketService";
import ChatModal from "../components/ChatModal";

function MyRentals() {
  const [rentals,     setRentals]     = useState([]);
  const [loading,     setLoading]     = useState(true);
  const [returningId, setReturningId] = useState(null);
  const [confirmId,   setConfirmId]   = useState(null);
  const [chatRental,  setChatRental]  = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRentals = async () => {
      try {
        const res = await api.get("/api/rentals");
        setRentals(res.data);
      } catch (err) { console.log("Error fetching rentals", err); }
      finally      { setLoading(false); }
    };
    fetchRentals();

    const socket = getSocket();
    const handleStatusUpdate = (data) => {
      setRentals((prev) =>
        prev.map((rental) =>
          rental._id === data.rentalId ? { ...rental, status: data.status } : rental
        )
      );
    };
    socket.on("rental_status_update", handleStatusUpdate);
    return () => socket.off("rental_status_update", handleStatusUpdate);
  }, []);

  const handleReturn = async (id) => {
    setReturningId(id);
    try {
      await api.delete(`/api/rentals/${id}`);
      setRentals((prev) => prev.filter((item) => item._id !== id));
      setConfirmId(null);
    } catch (err) { console.log("Return failed", err); }
    finally     { setReturningId(null); }
  };

  const StatusBadge = ({ status }) => {
    const map = {
      pending:   { icon: <Clock size={11} />,        label: "Awaiting Confirmation", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.22)",  color: "#fbbf24" },
      confirmed: { icon: <PackageCheck size={11} />,  label: "Confirmed",             bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.22)", color: "#34d399" },
      rejected:  { icon: <XCircle size={11} />,       label: "Rejected",              bg: "rgba(239,68,68,0.1)",  border: "rgba(239,68,68,0.22)",  color: "#f87171" },
    };
    const s = map[status];
    if (!s) return null;
    return (
      <span
        className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
        style={{ background: s.bg, border: `1px solid ${s.border}`, color: s.color }}
      >
        {s.icon} {s.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6" style={{ background: "#080808", color: "#f0f0f0" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">
              My <span className="gradient-text">Rentals</span>
            </h1>
            <p className="text-sm" style={{ color: "#737373" }}>
              {rentals.length} active rental{rentals.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl p-6 space-y-4"
                   style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="skeleton h-5 w-2/3 rounded" />
                <div className="skeleton h-4 w-1/3 rounded" />
                <div className="skeleton h-4 w-1/2 rounded" />
                <div className="skeleton h-10 w-full rounded-xl mt-4" />
              </div>
            ))}
          </div>
        ) : rentals.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <ShoppingBag size={60} className="mx-auto mb-5" style={{ color: "#1a1a1a" }} />
            <h3 className="text-2xl font-semibold mb-2" style={{ color: "#525252" }}>No active rentals</h3>
            <p className="mb-8" style={{ color: "#404040" }}>Browse available items and start renting today.</p>
            <button onClick={() => navigate("/browse")} className="btn-primary flex items-center gap-2 mx-auto">
              Browse Rentals <ArrowUpRight size={15} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {rentals.map((item) => (
              <div
                key={item._id}
                className="rounded-2xl p-6 flex flex-col justify-between animate-fade-in transition-all duration-300"
                style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div>
                  {/* Status */}
                  <div className="flex items-center justify-between mb-4">
                    <StatusBadge status={item.status} />
                  </div>

                  <h2 className="text-lg font-bold mb-4 line-clamp-2 text-white">{item.productName}</h2>

                  {/* Specs */}
                  <div
                    className="rounded-xl p-4 space-y-2.5 mb-5"
                    style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#525252" }}>Rent ({item.duration || 1} {item.duration === 1 ? "mo" : "mos"})</span>
                      <span className="font-semibold gradient-text">₹{item.price}/mo</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: "#525252" }}>Deposit Paid</span>
                      <span className="font-semibold" style={{ color: "#a3a3a3" }}>₹{item.deposit}</span>
                    </div>
                  </div>
                </div>

                {/* Return Confirm */}
                {confirmId === item._id ? (
                  <div
                    className="rounded-xl p-3"
                    style={{ background: "rgba(245,158,11,0.07)", border: "1px solid rgba(245,158,11,0.18)" }}
                  >
                    <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "#fbbf24" }}>
                      <AlertCircle size={13} /> Return this item?
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setConfirmId(null)} className="btn-secondary flex-1 py-2 text-xs">
                        Cancel
                      </button>
                      <button
                        onClick={() => handleReturn(item._id)}
                        disabled={returningId === item._id}
                        className="flex-1 py-2 text-xs rounded-xl font-semibold transition flex items-center justify-center gap-1.5"
                        style={{
                          background: "#d97706",
                          color: "#080808",
                          opacity: returningId === item._id ? 0.65 : 1,
                        }}
                        onMouseEnter={(e) => { if (returningId !== item._id) e.currentTarget.style.background = "#f59e0b"; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = "#d97706"; }}
                      >
                        {returningId === item._id ? <Loader2 size={13} className="animate-spin" /> : <CheckCircle2 size={13} />}
                        Confirm
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setConfirmId(item._id)}
                      className="flex-1 py-2.5 text-xs rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200"
                      style={{
                        background: "#141414",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "#737373",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(245,158,11,0.08)";
                        e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)";
                        e.currentTarget.style.color = "#fbbf24";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#141414";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                        e.currentTarget.style.color = "#737373";
                      }}
                    >
                      Return
                    </button>
                    {item.status === "confirmed" && (
                      <button
                        onClick={() => setChatRental(item)}
                        className="flex-1 py-2.5 text-xs rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-200 btn-primary"
                      >
                        <MessageCircle size={13} /> Message
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {chatRental && (
        <ChatModal rental={chatRental} onClose={() => setChatRental(null)} />
      )}
    </div>
  );
}

export default MyRentals;