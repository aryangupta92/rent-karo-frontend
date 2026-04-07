import { useEffect, useState, useRef } from "react";
import api from "../services/api";
import { Link } from "react-router-dom";
import { Search, Package, X, ArrowRight, MapPin, Loader2 } from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import SectionHeader from "../components/SectionHeader";

const CATEGORIES = ["All", "Tech", "Furniture", "Tools", "Gaming", "Kitchen"];

function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="skeleton h-48 w-full" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-5 w-2/3 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
      </div>
    </div>
  );
}

function Browse() {
  const [products,       setProducts]       = useState([]);
  const [loading,        setLoading]        = useState(true);
  const [search,         setSearch]         = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [loc,            setLoc]            = useState({ lat: null, lng: null, active: false });
  const [locLoading,     setLocLoading]     = useState(false);
  const pageRef = useRef(null);

  useScrollReveal(pageRef, [loading, loc.active]);

  const detectLocation = () => {
    if (loc.active) { setLoc({ ...loc, active: false }); return; }
    setLocLoading(true);
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      setLocLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => { setLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude, active: true }); setLocLoading(false); },
      () =>     { alert("Unable to retrieve your location. Please allow location access."); setLocLoading(false); }
    );
  };

  useEffect(() => {
    setLoading(true);
    let url = "/api/products";
    if (loc.active && loc.lat && loc.lng) url += `?lat=${loc.lat}&lng=${loc.lng}&radius=5`;
    api
      .get(url)
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [loc.active, loc.lat, loc.lng]);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat    =
      activeCategory === "All" ||
      (p.category && p.category.toLowerCase() === activeCategory.toLowerCase());
    return matchSearch && matchCat;
  });

  return (
    <div ref={pageRef} className="min-h-screen text-white pt-28 pb-20 px-6" style={{ background: "#080808" }}>
      <div className="max-w-7xl mx-auto">

        {/* Hero Header */}
        <div className="mb-12 animate-fade-in relative">
          <div className="absolute -top-20 -left-10 w-64 h-64 rounded-full blur-[90px] pointer-events-none"
               style={{ background: "rgba(245,158,11,0.03)" }} />
          <SectionHeader
            eyebrow="Marketplace"
            title={<>Browse <span className="gradient-text">Rentals</span></>}
            description="Find exactly what you need, on your terms."
            centered={false}
          />
        </div>

        {/* Search + Filters */}
        <div className="flex flex-col md:flex-row gap-3 mb-8 animate-fade-in delay-100">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: "#525252" }} />
            <input
              type="text"
              placeholder="Search for items..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-11 pr-10 text-sm"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                style={{ color: "#525252" }}
                onMouseEnter={(e) => e.currentTarget.style.color = "#f0f0f0"}
                onMouseLeave={(e) => e.currentTarget.style.color = "#525252"}
              >
                <X size={15} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Location filter */}
            <button
              onClick={detectLocation}
              disabled={locLoading}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-250 flex items-center gap-1.5"
              style={
                loc.active
                  ? { background: "rgba(16,185,129,0.1)", color: "#34d399", border: "1px solid rgba(16,185,129,0.25)" }
                  : { background: "rgba(255,255,255,0.04)", color: "#737373", border: "1px solid rgba(255,255,255,0.08)" }
              }
            >
              {locLoading ? <Loader2 size={13} className="animate-spin" /> : <MapPin size={13} />}
              {loc.active ? "Local (5km)" : "Local Only"}
            </button>
            <div className="w-px h-5 mx-1" style={{ background: "rgba(255,255,255,0.08)" }} />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all duration-250"
                style={
                  activeCategory === cat
                    ? {
                        background: "rgba(245,158,11,0.12)",
                        border: "1px solid rgba(245,158,11,0.3)",
                        color: "#fbbf24",
                        transform: "scale(1.04)",
                      }
                    : {
                        background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.07)",
                        color: "#737373",
                      }
                }
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        {!loading && (
          <p className="text-sm mb-7 animate-fade-in" style={{ color: "#525252" }}>
            <span style={{ color: "#f59e0b", fontWeight: 600 }}>{filtered.length}</span>{" "}
            {filtered.length === 1 ? "item" : "items"}
            {search && (
              <> for "<span style={{ color: "#f0f0f0" }}>{search}</span>"</>
            )}
          </p>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <SkeletonCard key={i} />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-28 animate-fade-in">
            <div
              className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              <Package size={34} style={{ color: "#2a2a2a" }} />
            </div>
            <h3 className="text-2xl font-bold mb-2" style={{ color: "#525252" }}>No items found</h3>
            <p className="mb-8" style={{ color: "#404040" }}>
              {search ? "Try a different keyword." : "No items in this category yet."}
            </p>
            {search && (
              <button
                onClick={() => setSearch("")}
                className="btn-secondary text-sm flex items-center gap-2 mx-auto"
              >
                <X size={13} /> Clear Search
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((product, i) => (
              <Link key={product._id} to={`/product/${product._id}`}>
                <div
                  data-reveal
                  data-delay={`${(i % 8) * 60}`}
                  className="reveal border-gradient rounded-2xl overflow-hidden card-hover group h-full flex flex-col"
                  style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  <div className="relative overflow-hidden flex-shrink-0" style={{ height: "192px" }}>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-600 group-hover:scale-110"
                      style={{ height: "192px" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {product.category && (
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold px-2.5 py-1 rounded-full"
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
                  <div className="p-5 flex flex-col flex-1">
                    <h2 className="font-bold mb-2 line-clamp-1 transition-colors duration-250" style={{ color: "#f0f0f0" }}>
                      {product.name}
                    </h2>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-black text-xl gradient-text">₹{product.price}</span>
                      <span className="text-xs mb-0.5" style={{ color: "#525252" }}>/mo</span>
                    </div>
                    <p className="text-xs" style={{ color: "#404040" }}>₹{product.deposit} deposit</p>
                    <div className="mt-auto pt-4">
                      <div
                        className="flex items-center text-xs font-semibold gap-1 transition-all duration-200 group-hover:gap-2"
                        style={{ color: "#f59e0b" }}
                      >
                        View Details <ArrowRight size={11} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Browse;