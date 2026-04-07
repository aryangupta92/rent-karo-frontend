import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import {
  ArrowRight, Package, Zap, Shield, ChevronRight, Sparkles,
  CheckCircle, Search, LayoutGrid, Wrench, Gamepad2, UtensilsCrossed,
  Users, MapPin, BadgeCheck, TrendingUp, Clock, RotateCcw, Star
} from "lucide-react";
import { useScrollReveal } from "../hooks/useScrollReveal";
import SectionHeader from "../components/SectionHeader";

/* ── Skeleton Card ── */
function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="skeleton h-56 w-full" />
      <div className="p-6 space-y-3">
        <div className="skeleton h-5 w-3/4 rounded" />
        <div className="skeleton h-4 w-1/3 rounded" />
        <div className="skeleton h-4 w-1/2 rounded" />
        <div className="skeleton h-11 w-full rounded-xl mt-4" />
      </div>
    </div>
  );
}

const MARQUEE_ITEMS = [
  { icon: <BadgeCheck size={13} />, text: "Zero hidden fees" },
  { icon: <Package size={13} />, text: "500+ verified items" },
  { icon: <Shield size={13} />, text: "Secure deposits" },
  { icon: <Zap size={13} />, text: "Instant booking" },
  { icon: <Gamepad2 size={13} />, text: "Gaming gear" },
  { icon: <LayoutGrid size={13} />, text: "Home furniture" },
  { icon: <Search size={13} />, text: "Tech gadgets" },
  { icon: <Wrench size={13} />, text: "Professional tools" },
  { icon: <UtensilsCrossed size={13} />, text: "Kitchen appliances" },
  { icon: <RotateCcw size={13} />, text: "Easy returns" },
];

const CATEGORIES = ["All", "Tech", "Furniture", "Tools", "Gaming", "Kitchen"];

const STATS = [
  { value: "500+",  label: "Items Listed",    icon: <Package    size={18} style={{ color: "#f59e0b" }} /> },
  { value: "1.2K+", label: "Active Renters",  icon: <Users      size={18} style={{ color: "#f59e0b" }} /> },
  { value: "15+",   label: "Cities Covered",  icon: <MapPin     size={18} style={{ color: "#f59e0b" }} /> },
  { value: "₹0",    label: "Hidden Charges",  icon: <BadgeCheck size={18} style={{ color: "#f59e0b" }} /> },
];

const HOW_IT_WORKS = [
  {
    icon: <Search className="w-5 h-5" style={{ color: "#f59e0b" }} />,
    title: "Browse & Discover",
    desc: "Search hundreds of verified listings across categories — tech, furniture, tools, and more.",
    step: "01",
  },
  {
    icon: <BadgeCheck className="w-5 h-5" style={{ color: "#f59e0b" }} />,
    title: "Book Instantly",
    desc: "Reserve any item in seconds. Flexible monthly plans with no long-term commitment required.",
    step: "02",
  },
  {
    icon: <RotateCcw className="w-5 h-5" style={{ color: "#f59e0b" }} />,
    title: "Return with Ease",
    desc: "Return anytime, no questions asked. Your security deposit is 100% refundable.",
    step: "03",
  },
];

const TRUST_ITEMS = [
  { icon: <Shield   size={17} style={{ color: "#f59e0b" }} />, title: "Verified Listings",   desc: "Every item is reviewed and verified before going live." },
  { icon: <BadgeCheck size={17} style={{ color: "#f59e0b" }} />, title: "Secure Payments",   desc: "Deposits and payments are handled safely." },
  { icon: <Clock    size={17} style={{ color: "#f59e0b" }} />, title: "Flexible Duration",   desc: "Rent for a month or a year — completely up to you." },
  { icon: <TrendingUp size={17} style={{ color: "#f59e0b" }} />, title: "Best Market Price", desc: "Competitive pricing across all categories." },
];

function Home() {
  const [products, setProducts]         = useState([]);
  const [loading, setLoading]           = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const navigate   = useNavigate();
  const pageRef    = useRef(null);

  useScrollReveal(pageRef, [loading]);

  useEffect(() => {
    api
      .get("/api/products")
      .then((res) => { setProducts(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const filteredProducts =
    activeCategory === "All"
      ? products
      : products.filter(
          (p) => p.category && p.category.toLowerCase() === activeCategory.toLowerCase()
        );

  return (
    <div ref={pageRef} className="min-h-screen text-white overflow-x-hidden" style={{ background: "#080808" }}>

      {/* ── HERO ── */}
      <section className="relative flex flex-col items-center justify-center text-center px-6 pt-40 pb-32 overflow-hidden">

        {/* Background glow orbs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="animate-orb1 absolute top-1/4 left-1/4 w-[480px] h-[480px] rounded-full blur-[130px]"
               style={{ background: "rgba(245,158,11,0.04)" }} />
          <div className="animate-orb2 absolute bottom-1/4 right-1/4 w-[380px] h-[380px] rounded-full blur-[110px]"
               style={{ background: "rgba(245,158,11,0.03)" }} />
          <div className="animate-orb3 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[280px] rounded-full blur-[90px]"
               style={{ background: "rgba(255,255,255,0.015)" }} />
          {/* Subtle grid */}
          <div
            className="absolute inset-0 opacity-[0.018]"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)`,
              backgroundSize: "72px 72px",
            }}
          />
        </div>

        {/* Badge */}
        <div
          className="animate-fade-in delay-100 inline-flex items-center gap-2 text-sm px-5 py-2 rounded-full mb-10 cursor-default"
          style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.18)",
            color: "#fbbf24",
          }}
        >
          <Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
          India's Premier Rental Marketplace
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        </div>

        {/* Headline */}
        <h1 className="animate-fade-in delay-200 text-6xl md:text-8xl font-black leading-[1.06] tracking-tight max-w-5xl">
          Rent Smarter.
          <br />
          <span className="text-shimmer">Live Better.</span>
        </h1>

        <p className="animate-fade-in delay-300 mt-7 max-w-2xl text-xl leading-relaxed font-light" style={{ color: "#737373" }}>
          Access furniture, gadgets, tools and appliances on{" "}
          <span className="text-white font-medium">flexible monthly plans</span>.
          No ownership burden. No long-term lock-in.
        </p>

        {/* CTAs */}
        <div className="animate-fade-in delay-400 flex flex-wrap gap-4 mt-12 justify-center">
          <button
            onClick={() => navigate("/browse")}
            className="btn-primary flex items-center gap-2 text-sm px-8 py-3.5"
          >
            <span>Browse Listings</span>
            <ArrowRight size={16} />
          </button>
          <button
            onClick={() => navigate("/list-item")}
            className="btn-secondary flex items-center gap-2 text-sm px-8 py-3.5"
          >
            List Your Items
          </button>
        </div>

        {/* Stats */}
        <div className="animate-fade-in delay-600 mt-24 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-2xl">
          {STATS.map((stat, i) => (
            <div
              key={stat.label}
              className="rounded-2xl p-5 text-center cursor-default animate-border-pulse"
              style={{
                background: "rgba(15,15,15,0.8)",
                border: "1px solid rgba(255,255,255,0.07)",
                animationDelay: `${i * 0.7}s`,
              }}
            >
              <div className="flex justify-center mb-2">{stat.icon}</div>
              <p className="text-2xl font-black gradient-text">{stat.value}</p>
              <p className="text-xs mt-1 font-medium" style={{ color: "#525252" }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── MARQUEE TICKER ── */}
      <div
        className="relative py-4 overflow-hidden"
        style={{ background: "rgba(255,255,255,0.02)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
      >
        <div className="flex animate-marquee">
          {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((item, i) => (
            <span
              key={i}
              className="flex items-center gap-2 px-8 text-sm font-medium whitespace-nowrap"
              style={{ color: "#525252" }}
            >
              <span style={{ color: "#f59e0b" }}>{item.icon}</span>
              {item.text}
              <span className="w-px h-3 ml-4 flex-shrink-0" style={{ background: "rgba(255,255,255,0.08)" }} />
            </span>
          ))}
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionHeader
              eyebrow="Simple Process"
              title={<>How <span className="gradient-text">rentKaro</span> Works</>}
              description="From browsing to returning — seamless at every step."
              centered
            />
          </div>

          <div className="grid md:grid-cols-3 gap-5 relative">
            {/* Connector line */}
            <div
              className="hidden md:block absolute top-[38px] left-[18%] right-[18%] h-px"
              style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.2), transparent)" }}
            />

            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                data-reveal data-delay={`${i * 120}`}
                className="reveal-scale reveal rounded-2xl p-7 transition-all duration-400 group cursor-default relative overflow-hidden"
                style={{
                  background: "#0f0f0f",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "rgba(245,158,11,0.2)";
                  e.currentTarget.style.background = "#111111";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.background = "#0f0f0f";
                }}
              >
                <span
                  className="absolute top-5 right-5 text-5xl font-black select-none font-mono"
                  style={{ color: "rgba(255,255,255,0.04)" }}
                >
                  {item.step}
                </span>
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300"
                  style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
                >
                  {item.icon}
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "#737373" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST SIGNALS ── */}
      <section className="py-14 px-6" style={{ background: "rgba(255,255,255,0.015)" }}>
        <div className="max-w-5xl mx-auto">
          <div data-reveal className="reveal grid grid-cols-2 md:grid-cols-4 gap-3">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl p-5 transition-colors duration-200 group"
                style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.06)" }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = "rgba(245,158,11,0.15)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div className="mb-3">{item.icon}</div>
                <p className="font-semibold text-sm text-white mb-1">{item.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#525252" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED RENTALS ── */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(245,158,11,0.15), transparent)" }}
        />

        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <p data-reveal className="reveal text-xs font-bold tracking-widest uppercase mb-3" style={{ color: "#f59e0b" }}>
              Marketplace
            </p>
            <h2 data-reveal data-delay="100" className="reveal text-4xl md:text-5xl font-black mb-3">
              Featured <span className="gradient-text">Listings</span>
            </h2>
            <p data-reveal data-delay="200" className="reveal mb-12 text-base" style={{ color: "#737373" }}>
              Handpicked items available to rent today.
            </p>
          </div>

          {/* Category Filter */}
          <div data-reveal data-delay="300" className="reveal flex justify-center gap-2 mb-12 flex-wrap">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-all duration-250"
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
                onMouseEnter={(e) => {
                  if (activeCategory !== cat) e.currentTarget.style.color = "#fff";
                }}
                onMouseLeave={(e) => {
                  if (activeCategory !== cat) e.currentTarget.style.color = "#737373";
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
              {[1, 2, 3].map((i) => <SkeletonCard key={i} />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <Package size={48} className="mx-auto mb-4" style={{ color: "#2a2a2a" }} />
              <h3 className="text-xl font-semibold mb-2" style={{ color: "#737373" }}>No items in this category</h3>
              <p className="text-sm" style={{ color: "#404040" }}>Try selecting a different category.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
              {filteredProducts.map((product, i) => (
                <div
                  key={product._id}
                  data-reveal data-delay={`${i * 80}`}
                  className="reveal border-gradient rounded-2xl overflow-hidden card-hover group cursor-pointer"
                  style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
                  onClick={() => navigate(`/product/${product._id}`)}
                >
                  <div className="relative overflow-hidden h-54">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                      style={{ height: "216px", width: "100%", objectFit: "cover" }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                    {product.category && (
                      <span
                        className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-lg"
                        style={{
                          background: "rgba(245,158,11,0.16)",
                          border: "1px solid rgba(245,158,11,0.25)",
                          color: "#fbbf24",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        {product.category}
                      </span>
                    )}
                  </div>
                  <div className="p-5">
                    <h3
                      className="text-base font-bold mb-1.5 transition-colors duration-250 line-clamp-1"
                      style={{ color: "#f0f0f0" }}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-end gap-1 mb-1">
                      <span className="font-black text-xl gradient-text">₹{product.price}</span>
                      <span className="text-xs mb-0.5" style={{ color: "#525252" }}>/month</span>
                    </div>
                    <p className="text-xs" style={{ color: "#404040" }}>
                      <span style={{ color: "#737373" }}>₹{product.deposit}</span> refundable deposit
                    </p>
                    <button
                      className="mt-4 w-full btn-primary flex items-center justify-center gap-2 text-sm py-2.5"
                      onClick={(e) => { e.stopPropagation(); navigate(`/product/${product._id}`); }}
                    >
                      <span>View Details</span>
                      <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && filteredProducts.length > 0 && (
            <div className="text-center mt-12">
              <button onClick={() => navigate("/browse")} className="btn-secondary flex items-center gap-2 mx-auto">
                View All Listings
                <ArrowRight size={15} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── BOTTOM CTA ── */}
      <section className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full blur-[90px] animate-glow-pulse"
            style={{ background: "rgba(245,158,11,0.04)" }}
          />
        </div>
        <div data-reveal className="reveal max-w-3xl mx-auto text-center animated-border p-px rounded-3xl">
          <div className="rounded-3xl px-10 py-16" style={{ background: "#080808" }}>
            <div
              className="w-11 h-11 rounded-2xl mx-auto mb-6 flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}
            >
              <Sparkles size={20} style={{ color: "#f59e0b" }} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              Ready to get started?
            </h2>
            <p className="mb-10 max-w-lg mx-auto text-lg leading-relaxed" style={{ color: "#737373" }}>
              Join thousands of renters and owners on rentKaro. Start renting or earning today.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <button onClick={() => navigate("/browse")} className="btn-primary flex items-center gap-2 px-10 py-3.5 text-sm">
                <span>Browse Listings</span>
                <ArrowRight size={16} />
              </button>
              <button onClick={() => navigate("/list-item")} className="btn-secondary flex items-center gap-2 px-10 py-3.5 text-sm">
                List Your Items
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Home;