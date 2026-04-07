import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../services/api";
import { ArrowLeft, Tag, IndianRupee, Shield, CheckCircle2, X, Loader2, Calendar, MapPin, User } from "lucide-react";

function SkeletonDetail() {
  return (
    <div className="min-h-screen pt-28 pb-16 px-6 flex justify-center" style={{ background: "#080808", color: "#f0f0f0" }}>
      <div className="max-w-4xl w-full">
        <div className="skeleton h-5 w-20 rounded mb-8" />
        <div className="grid md:grid-cols-2 gap-10">
          <div className="skeleton h-80 w-full rounded-2xl" />
          <div className="space-y-4 pt-4">
            <div className="skeleton h-7 w-2/3 rounded" />
            <div className="skeleton h-5 w-1/3 rounded" />
            <div className="skeleton h-5 w-1/2 rounded" />
            <div className="skeleton h-5 w-1/4 rounded" />
            <div className="skeleton h-14 w-full rounded-xl mt-8" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmModal({ product, onConfirm, onCancel, loading }) {
  const [duration, setDuration] = useState(1);
  const mPrice = parseInt(product.price || 0);
  const dep    = parseInt(product.deposit || 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 animate-fade-in"
         style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}>
      <div className="rounded-2xl p-8 max-w-md w-full shadow-2xl"
           style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.09)" }}>

        <div className="flex items-start justify-between mb-6">
          <h3 className="text-xl font-bold text-white">Confirm Rental</h3>
          <button onClick={onCancel} className="transition" style={{ color: "#525252" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#525252"}>
            <X size={19} />
          </button>
        </div>

        <p className="text-sm mb-6" style={{ color: "#737373" }}>
          You're about to rent <span className="text-white font-semibold">{product.name}</span>.
        </p>

        {/* Duration Picker */}
        <div className="mb-6">
          <label className="flex items-center gap-2 text-xs font-medium mb-2" style={{ color: "#a3a3a3" }}>
            <Calendar size={13} style={{ color: "#f59e0b" }} /> Rental Duration
          </label>
          <div className="relative">
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full px-4 py-3 rounded-xl text-sm appearance-none focus:outline-none transition-colors"
              style={{
                background: "#0a0a0a",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "#f0f0f0",
              }}
            >
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1} style={{ background: "#0a0a0a" }}>
                  {i + 1} Month{i > 0 ? "s" : ""}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#525252" }}>
              <span className="text-xs">▼</span>
            </div>
          </div>
        </div>

        <div className="rounded-xl p-4 mb-6 space-y-3"
             style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#525252" }}>Monthly Rent</span>
            <span className="font-semibold gradient-text">₹{mPrice}/mo</span>
          </div>
          <div className="flex justify-between text-sm">
            <span style={{ color: "#525252" }}>Security Deposit</span>
            <span className="font-semibold" style={{ color: "#a3a3a3" }}>₹{dep}</span>
          </div>
          <div className="flex justify-between text-sm items-end pt-3"
               style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div>
              <span className="block mb-0.5" style={{ color: "#737373" }}>Total Due Today</span>
              <span className="text-[10px]" style={{ color: "#404040" }}>(Rent × {duration}) + Deposit</span>
            </div>
            <span className="font-bold text-white text-lg">₹{(mPrice * duration) + dep}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button onClick={onCancel} className="btn-secondary flex-1 py-3 text-sm" disabled={loading}>
            Cancel
          </button>
          <button
            onClick={() => onConfirm(duration)}
            disabled={loading}
            className="btn-primary flex-1 py-3 text-sm flex items-center justify-center gap-2"
            style={{ opacity: loading ? 0.65 : 1 }}
          >
            {loading ? <><Loader2 size={15} className="animate-spin" /> Processing...</> : "Confirm Rent"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductDetails() {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const [product,   setProduct]   = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [renting,   setRenting]   = useState(false);
  const [success,   setSuccess]   = useState(false);

  useEffect(() => {
    api.get(`/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) return <SkeletonDetail />;

  const handleRent = async (duration) => {
    setRenting(true);
    try {
      await api.post("/api/rentals", {
        productId:   product._id,
        productName: product.name,
        price:       product.price,
        deposit:     product.deposit,
        duration,
      });
      setShowModal(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    } catch (err) { console.log(err); }
    finally    { setRenting(false); }
  };

  return (
    <>
      {showModal && (
        <ConfirmModal
          product={product}
          onConfirm={handleRent}
          onCancel={() => setShowModal(false)}
          loading={renting}
        />
      )}

      <div className="min-h-screen pt-28 pb-16 px-6" style={{ background: "#080808", color: "#f0f0f0" }}>
        <div className="max-w-4xl mx-auto">

          {/* Back */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm mb-8 group transition"
            style={{ color: "#525252" }}
            onMouseEnter={(e) => e.currentTarget.style.color = "#f0f0f0"}
            onMouseLeave={(e) => e.currentTarget.style.color = "#525252"}
          >
            <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          {/* Success Toast */}
          {success && (
            <div
              className="mb-6 flex items-center gap-3 px-5 py-4 rounded-xl animate-fade-in"
              style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}
            >
              <CheckCircle2 size={18} />
              <div>
                <p className="font-semibold text-sm">Rental Confirmed!</p>
                <p className="text-xs mt-0.5" style={{ color: "#059669" }}>You can view it in My Rentals.</p>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-10 animate-fade-in">

            {/* Image */}
            <div className="rounded-2xl overflow-hidden" style={{ height: "320px" }}>
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex flex-col justify-between">
              <div>
                {product.category && (
                  <span className="tag-amber mb-4 inline-flex">
                    <Tag size={10} />
                    {product.category}
                  </span>
                )}

                <h1 className="text-3xl font-extrabold mb-5 text-white">{product.name}</h1>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-3 mb-7">
                  <div className="rounded-xl p-4" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "#525252" }}>
                      <IndianRupee size={11} /> Monthly Rent
                    </div>
                    <p className="text-2xl font-bold gradient-text">₹{product.price}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#404040" }}>per month</p>
                  </div>
                  <div className="rounded-xl p-4" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex items-center gap-1.5 text-xs mb-1" style={{ color: "#525252" }}>
                      <Shield size={11} /> Security Deposit
                    </div>
                    <p className="text-2xl font-bold text-white">₹{product.deposit}</p>
                    <p className="text-xs mt-0.5" style={{ color: "#404040" }}>refundable</p>
                  </div>
                </div>

                <div className="space-y-2 mb-7">
                  {["Flexible monthly billing", "Cancel anytime", "Deposit fully refundable"].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm" style={{ color: "#737373" }}>
                      <CheckCircle2 size={13} style={{ color: "#34d399", flexShrink: 0 }} />
                      {f}
                    </div>
                  ))}
                </div>

                {/* Owner Card */}
                {product.owner && (
                  <div
                    className="rounded-2xl p-4 mb-7 flex items-center justify-between"
                    style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-11 h-11 rounded-full flex items-center justify-center overflow-hidden"
                        style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        {product.owner.avatar ? (
                          <img src={product.owner.avatar} alt="Avatar" className="w-full h-full object-cover" />
                        ) : (
                          <User size={22} style={{ color: "#525252" }} />
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-white">Owner: {product.owner.name}</p>
                        <p className="text-xs mt-0.5" style={{ color: "#525252" }}>Trusted Lender</p>
                      </div>
                    </div>
                    {product.address && (
                      <div className="flex flex-col items-end">
                        <span className="text-[10px] mb-1 uppercase tracking-wider font-semibold" style={{ color: "#404040" }}>Location</span>
                        <div
                          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg"
                          style={{ background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.18)", color: "#34d399" }}
                        >
                          <MapPin size={11} />
                          {product.address}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button onClick={() => setShowModal(true)} className="btn-primary w-full py-4 text-base">
                Rent Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;