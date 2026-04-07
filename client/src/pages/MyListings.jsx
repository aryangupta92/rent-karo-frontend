import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Trash2, Package, Plus, AlertCircle, Loader2 } from "lucide-react";

function MyListings() {
  const [products,   setProducts]   = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmId,  setConfirmId]  = useState(null);
  const navigate = useNavigate();
  const user     = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return;
    api
      .get(`/api/products/my-listings/${user._id}`)
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const deleteProduct = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/api/products/${id}`);
      setProducts((prev) => prev.filter((p) => p._id !== id));
      setConfirmId(null);
    } catch (err) { console.log(err); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 px-6" style={{ background: "#080808", color: "#f0f0f0" }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 animate-fade-in">
          <div>
            <h1 className="text-3xl font-extrabold mb-1">
              My <span className="gradient-text">Listings</span>
            </h1>
            <p className="text-sm" style={{ color: "#737373" }}>
              {products.length} item{products.length !== 1 ? "s" : ""} listed
            </p>
          </div>
          <button onClick={() => navigate("/list-item")} className="btn-primary flex items-center gap-2 text-sm">
            <Plus size={15} /> Add Item
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="skeleton h-52 w-full" />
                <div className="p-5 space-y-3">
                  <div className="skeleton h-5 w-2/3 rounded" />
                  <div className="skeleton h-4 w-1/3 rounded" />
                  <div className="skeleton h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-24 animate-fade-in">
            <Package size={60} className="mx-auto mb-5" style={{ color: "#1a1a1a" }} />
            <h3 className="text-2xl font-semibold mb-2" style={{ color: "#525252" }}>No listings yet</h3>
            <p className="mb-8" style={{ color: "#404040" }}>Start earning by listing your first item.</p>
            <button onClick={() => navigate("/list-item")} className="btn-primary flex items-center gap-2 mx-auto">
              <Plus size={15} /> List an Item
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map((product) => (
              <div
                key={product._id}
                className="rounded-2xl overflow-hidden transition-all duration-300 group animate-fade-in"
                style={{
                  background: "#0f0f0f",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)"}
              >
                <div className="relative overflow-hidden" style={{ height: "208px" }}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ height: "208px" }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  {product.category && (
                    <span
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-semibold"
                      style={{
                        background: "rgba(245,158,11,0.14)",
                        border: "1px solid rgba(245,158,11,0.22)",
                        color: "#fbbf24",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      {product.category}
                    </span>
                  )}
                </div>

                <div className="p-5">
                  <h2 className="text-base font-bold mb-1 text-white">{product.name}</h2>
                  <p className="font-semibold gradient-text">
                    ₹{product.price}
                    <span className="text-xs font-normal" style={{ color: "#525252", WebkitTextFillColor: "#525252" }}> /mo</span>
                  </p>
                  <p className="text-sm mt-0.5" style={{ color: "#404040" }}>₹{product.deposit} deposit</p>

                  {confirmId === product._id ? (
                    <div
                      className="mt-4 rounded-xl p-3"
                      style={{ background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.16)" }}
                    >
                      <div className="flex items-center gap-2 text-sm mb-3" style={{ color: "#f87171" }}>
                        <AlertCircle size={13} /> Delete this listing?
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => setConfirmId(null)} className="btn-secondary flex-1 py-2 text-xs">
                          Cancel
                        </button>
                        <button
                          onClick={() => deleteProduct(product._id)}
                          disabled={deletingId === product._id}
                          className="flex-1 py-2 text-xs rounded-xl font-semibold transition flex items-center justify-center gap-1.5"
                          style={{ background: "#dc2626", color: "#fff", opacity: deletingId === product._id ? 0.6 : 1 }}
                          onMouseEnter={(e) => { if (deletingId !== product._id) e.currentTarget.style.background = "#ef4444"; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = "#dc2626"; }}
                        >
                          {deletingId === product._id ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                          Delete
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setConfirmId(product._id)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 text-xs rounded-xl transition-all duration-200"
                      style={{
                        background: "#141414",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "#525252",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "rgba(239,68,68,0.07)";
                        e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)";
                        e.currentTarget.style.color = "#f87171";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "#141414";
                        e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                        e.currentTarget.style.color = "#525252";
                      }}
                    >
                      <Trash2 size={13} /> Delete Listing
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyListings;