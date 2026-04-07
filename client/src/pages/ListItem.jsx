import { useState } from "react";
import axios from "axios";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import {
  Package, Tag, IndianRupee, Shield, Image as ImageIcon,
  CheckCircle2, Loader2, ChevronDown, ArrowRight, MapPin
} from "lucide-react";

const CATEGORIES = ["Tech", "Furniture", "Tools", "Gaming", "Kitchen", "Sports", "Books", "Other"];

const inputStyle = {
  width: "100%",
  padding: "11px 14px",
  borderRadius: "10px",
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.09)",
  color: "#f0f0f0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

function Field({ label, icon, children }) {
  return (
    <div>
      <label className="text-xs font-medium mb-1.5 flex items-center gap-1.5" style={{ color: "#737373" }}>
        {icon} {label}
      </label>
      {children}
    </div>
  );
}

function ListItem() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", price: "", deposit: "", category: "" });
  const [file,       setFile]       = useState(null);
  const [loc,        setLoc]        = useState({ lat: null, lng: null, address: "" });
  const [loading,    setLoading]    = useState(false);
  const [locLoading, setLocLoading] = useState(false);
  const [success,    setSuccess]    = useState(false);
  const [error,      setError]      = useState("");

  const detectLocation = () => {
    setLocLoading(true);
    if (!navigator.geolocation) { setError("Geolocation is not supported by your browser"); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        let addressStr = loc.address;
        try {
          const res = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`);
          if (res.data?.address) {
            const a = res.data.address;
            addressStr = a.neighbourhood || a.suburb || a.city_district || a.city || a.town || a.county || "";
          }
        } catch {}
        setLoc({ lat, lng, address: addressStr });
        setLocLoading(false);
      },
      () => { setError("Unable to retrieve your location. Please allow location access."); setLocLoading(false); }
    );
  };

  const handleChange = (e) => { setForm({ ...form, [e.target.name]: e.target.value }); if (error) setError(""); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    if (!file) { setError("Please select an image file."); setLoading(false); return; }
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      const formData = new FormData();
      formData.append("name",     form.name);
      formData.append("price",    form.price);
      formData.append("deposit",  form.deposit);
      formData.append("category", form.category);
      formData.append("owner",    user?._id);
      formData.append("image",    file);
      if (loc.lat && loc.lng) { formData.append("lat", loc.lat); formData.append("lng", loc.lng); }
      if (loc.address)          formData.append("address", loc.address);
      await api.post("/api/products", formData, { headers: { "Content-Type": "multipart/form-data" } });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to list item.");
    } finally { setLoading(false); }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 pt-20" style={{ background: "#080808", color: "#f0f0f0" }}>
        <div className="text-center animate-fade-in max-w-sm">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse-ring"
            style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)" }}
          >
            <CheckCircle2 size={38} style={{ color: "#34d399" }} />
          </div>
          <h2 className="text-3xl font-bold mb-3">Item Listed!</h2>
          <p className="mb-8" style={{ color: "#737373" }}>
            Your item is now live on rentKaro. Renters can find it right away.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => { setSuccess(false); setForm({ name: "", price: "", deposit: "", category: "" }); setFile(null); setLoc({ lat: null, lng: null, address: "" }); }}
              className="btn-secondary"
            >
              List Another
            </button>
            <button onClick={() => navigate("/my-listings")} className="btn-primary flex items-center gap-2">
              My Listings <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-28 pb-16 px-6" style={{ background: "#080808", color: "#f0f0f0" }}>
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-10 animate-fade-in">
          <h1 className="text-3xl font-extrabold mb-1.5">
            List Your <span className="gradient-text">Item</span>
          </h1>
          <p className="text-sm" style={{ color: "#737373" }}>Fill in the details and start earning from your idle items.</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-7">

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="lg:col-span-3 p-7 rounded-2xl space-y-5 animate-fade-in delay-100"
            style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            <Field label="Item Name" icon={<Package size={12} />}>
              <input
                name="name"
                placeholder="e.g. Sony 65-inch TV"
                value={form.name}
                onChange={handleChange}
                style={inputStyle}
                onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)"; }}
                onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                required
              />
            </Field>

            <Field label="Category" icon={<Tag size={12} />}>
              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ ...inputStyle, paddingRight: "36px", cursor: "pointer", appearance: "none" }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  required
                >
                  <option value="" disabled style={{ background: "#0a0a0a" }}>Select a category</option>
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} style={{ background: "#0a0a0a" }}>{c}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "#525252" }} />
              </div>
            </Field>

            <div className="grid grid-cols-2 gap-4">
              <Field label="Monthly Rent" icon={<IndianRupee size={12} />}>
                <input
                  name="price"
                  type="number"
                  placeholder="e.g. 1500"
                  value={form.price}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  required
                />
              </Field>
              <Field label="Security Deposit" icon={<Shield size={12} />}>
                <input
                  name="deposit"
                  type="number"
                  placeholder="e.g. 5000"
                  value={form.deposit}
                  onChange={handleChange}
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  required
                />
              </Field>
            </div>

            <Field label="Item Location (Required for local search)" icon={<MapPin size={12} />}>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Neighborhood (e.g. Bandra West)"
                  value={loc.address}
                  onChange={(e) => setLoc({ ...loc, address: e.target.value })}
                  style={{ ...inputStyle, flex: 1 }}
                  onFocus={(e) => { e.target.style.borderColor = "rgba(245,158,11,0.35)"; e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.07)"; }}
                  onBlur={(e)  => { e.target.style.borderColor = "rgba(255,255,255,0.09)"; e.target.style.boxShadow = "none"; }}
                  required
                />
                <button
                  type="button"
                  onClick={detectLocation}
                  className="px-3.5 rounded-xl flex items-center justify-center transition-all duration-200"
                  style={
                    loc.lat && loc.lng
                      ? { background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.25)", color: "#34d399" }
                      : { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.09)", color: "#737373" }
                  }
                >
                  {locLoading ? <Loader2 size={15} className="animate-spin" /> : <MapPin size={15} />}
                </button>
              </div>
            </Field>

            <Field label="Upload Image" icon={<ImageIcon size={12} />}>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm cursor-pointer rounded-xl"
                style={{
                  background: "#0a0a0a",
                  border: "1px solid rgba(255,255,255,0.09)",
                  padding: "10px 14px",
                  color: "#737373",
                }}
                required
              />
            </Field>

            {error && (
              <div
                className="text-sm px-4 py-3 rounded-xl"
                style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#fca5a5" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <><Loader2 size={15} className="animate-spin" /> Listing...</>
              ) : (
                <><Package size={15} /> List Item</>
              )}
            </button>
          </form>

          {/* Preview + Tips */}
          <div className="lg:col-span-2 animate-fade-in delay-200">
            <p className="text-xs font-medium mb-2.5 flex items-center gap-1.5" style={{ color: "#737373" }}>
              <ImageIcon size={12} /> Image Preview
            </p>
            <div
              className="aspect-square rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
            >
              {file ? (
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover animate-fade-in" />
              ) : (
                <div className="text-center" style={{ color: "#2a2a2a" }}>
                  <ImageIcon size={36} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Select an image file<br />to preview</p>
                </div>
              )}
            </div>

            <div
              className="mt-4 rounded-xl p-4 text-sm space-y-1.5"
              style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.12)" }}
            >
              <p className="font-semibold text-xs mb-2" style={{ color: "#f59e0b" }}>Tips for a great listing:</p>
              <p className="text-xs" style={{ color: "#737373" }}>• Use a clear, well-lit photo</p>
              <p className="text-xs" style={{ color: "#737373" }}>• Set a competitive price</p>
              <p className="text-xs" style={{ color: "#737373" }}>• Keep deposit reasonable</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListItem;