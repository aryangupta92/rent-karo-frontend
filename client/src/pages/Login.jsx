import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, LogIn, UserPlus, AlertCircle, CheckCircle2, Loader2, Zap, Lock, Users2 } from "lucide-react";

function GoogleButton({ onSuccess, onError, label = "Continue with Google" }) {
  const handleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!clientId || clientId === "your-google-client-id-here.apps.googleusercontent.com") {
      onError("Google Client ID is not configured. Add VITE_GOOGLE_CLIENT_ID to your .env file.");
      return;
    }
    const gis = window.google?.accounts?.oauth2;
    if (!gis) { onError("Google sign-in library failed to load. Refresh and try again."); return; }
    const client = gis.initTokenClient({
      client_id: clientId,
      scope: "openid email profile",
      callback: onSuccess,
      error_callback: () => onError("Google sign-in was cancelled or failed."),
    });
    client.requestAccessToken();
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-200"
      style={{
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#d4d4d4",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.07)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.16)";
        e.currentTarget.style.color = "#fff";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = "#d4d4d4";
      }}
    >
      <svg width="17" height="17" viewBox="0 0 48 48">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
        <path fill="none" d="M0 0h48v48H0z" />
      </svg>
      <span>{label}</span>
    </button>
  );
}

function Toast({ message, type }) {
  if (!message) return null;
  const isError = type === "error";
  return (
    <div
      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm"
      style={
        isError
          ? { background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", color: "#fca5a5" }
          : { background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "#6ee7b7" }
      }
    >
      {isError ? <AlertCircle size={15} /> : <CheckCircle2 size={15} />}
      {message}
    </div>
  );
}

/* shared input style */
const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: "12px",
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#f0f0f0",
  fontSize: "14px",
  outline: "none",
  transition: "border-color 0.2s ease, box-shadow 0.2s ease",
};

function InputField({ style, ...props }) {
  return (
    <input
      {...props}
      style={{ ...inputStyle, ...style }}
      onFocus={(e) => {
        e.target.style.borderColor = "rgba(245,158,11,0.4)";
        e.target.style.boxShadow = "0 0 0 3px rgba(245,158,11,0.08)";
        props.onFocus && props.onFocus(e);
      }}
      onBlur={(e) => {
        e.target.style.borderColor = "rgba(255,255,255,0.1)";
        e.target.style.boxShadow = "none";
        props.onBlur && props.onBlur(e);
      }}
    />
  );
}

function Login() {
  const navigate  = useNavigate();
  const [mode,    setMode]    = useState("login");
  const [role,    setRole]    = useState("renter");
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast,   setToast]   = useState({ message: "", type: "error" });
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const showToast = (message, type = "error") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "error" }), 4000);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const saveAndRedirect = (data) => {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(data.user));
    showToast(mode === "login" ? "Welcome back! Redirecting..." : "Account created! Redirecting...", "success");
    setTimeout(() => navigate("/"), 1100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast({ message: "", type: "error" });
    try {
      if (mode === "signup") {
        if (form.password !== form.confirmPassword) { showToast("Passwords do not match."); setLoading(false); return; }
        if (form.password.length < 6) { showToast("Password must be at least 6 characters."); setLoading(false); return; }
        const res = await api.post("/api/auth/register", { name: form.name, email: form.email, password: form.password, role });
        saveAndRedirect(res.data);
      } else {
        const res = await api.post("/api/auth/login", { email: form.email, password: form.password });
        saveAndRedirect(res.data);
      }
    } catch (err) {
      showToast(err?.response?.data?.message || "Unable to sign in. Please try again.");
    } finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (response) => {
    if (!response?.access_token) { showToast("Google sign-in was cancelled."); return; }
    setLoading(true);
    try {
      const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${response.access_token}` },
      });
      if (!infoRes.ok) throw new Error("Failed to fetch Google user info");
      const info = await infoRes.json();
      const res = await api.post("/api/auth/google", {
        googleId: info.sub, name: info.name, email: info.email, avatar: info.picture,
        role: mode === "signup" ? role : undefined,
      });
      saveAndRedirect(res.data);
    } catch { showToast("Google sign-in failed. Please try again."); }
    finally { setLoading(false); }
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setToast({ message: "", type: "error" });
    setForm({ name: "", email: "", password: "", confirmPassword: "" });
  };

  const featureCards = [
    { icon: <Zap  size={17} />, title: "Quick rentals",          desc: "Search items, reserve instantly, and manage every booking from one place.", color: "#f59e0b" },
    { icon: <Lock size={17} />, title: "Safe deposits",          desc: "Payments and deposits are protected so you can rent without uncertainty.", color: "#f59e0b" },
    { icon: <Users2 size={17} />, title: "Clear communication", desc: "Chat with owners and renters, confirm details, and stay organized.", color: "#f59e0b" },
  ];

  return (
    <div className="min-h-screen text-white relative overflow-hidden py-10" style={{ background: "#080808" }}>
      {/* subtle glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full blur-[140px]"
             style={{ background: "rgba(245,158,11,0.04)" }} />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[120px]"
             style={{ background: "rgba(245,158,11,0.025)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-6 grid gap-8 lg:grid-cols-[1fr_1fr] items-start pt-8">

        {/* ── Left Panel ── */}
        <section
          className="hidden lg:flex flex-col justify-between rounded-2xl p-10 shadow-2xl"
          style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="space-y-5 mb-10">
            <p className="text-xs uppercase tracking-widest font-bold" style={{ color: "#f59e0b" }}>rentKaro</p>
            <h1 className="text-4xl font-black tracking-tight text-white leading-[1.1]">
              A better way to rent and earn from the things you own.
            </h1>
            <p className="leading-relaxed" style={{ color: "#737373" }}>
              Build trust with a clean rental dashboard, transparent listings, and simple communication with owners and renters.
            </p>
          </div>

          <div className="space-y-3">
            {featureCards.map((f) => (
              <div
                key={f.title}
                className="rounded-xl p-5 transition-colors duration-200"
                style={{ background: "#141414", border: "1px solid rgba(255,255,255,0.06)" }}
              >
                <div
                  className="inline-flex h-10 w-10 items-center justify-center rounded-xl mb-3"
                  style={{ background: "rgba(245,158,11,0.08)", color: f.color }}
                >
                  {f.icon}
                </div>
                <p className="font-semibold text-white text-sm mb-1">{f.title}</p>
                <p className="text-xs leading-relaxed" style={{ color: "#737373" }}>{f.desc}</p>
              </div>
            ))}
          </div>

          <p className="mt-8 text-xs" style={{ color: "#404040" }}>
            The friendliest rental marketplace for communities and creatives.
          </p>
        </section>

        {/* ── Right Panel / Form ── */}
        <section
          className="rounded-2xl p-8 shadow-2xl"
          style={{ background: "#0f0f0f", border: "1px solid rgba(255,255,255,0.07)" }}
        >
          {/* Tab toggle */}
          <div
            className="grid grid-cols-2 gap-2 p-1 rounded-xl mb-8"
            style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.07)" }}
          >
            {[
              { key: "login",  label: "Sign In",  icon: <LogIn    size={14} /> },
              { key: "signup", label: "Sign Up",  icon: <UserPlus size={14} /> },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => switchMode(item.key)}
                className="rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2"
                style={
                  mode === item.key
                    ? { background: "#ffffff", color: "#080808" }
                    : { color: "#737373" }
                }
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </div>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-black text-white">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h2>
            <p className="text-sm mt-1" style={{ color: "#737373" }}>
              {mode === "login"
                ? "Sign in to manage your rentals, listings, and messages."
                : "Make your account and choose whether you want to rent or list items."}
            </p>
          </div>

          {/* Role Selector (signup only) */}
          {mode === "signup" && (
            <div className="grid grid-cols-2 gap-3 mb-6">
              {[
                { key: "renter", label: "Rent items",  sub: "Find and book verified rentals in minutes." },
                { key: "owner",  label: "List items", sub: "Show your gear and earn with flexible plans." },
              ].map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRole(r.key)}
                  className="rounded-xl px-4 py-4 text-left text-sm transition-all duration-200"
                  style={
                    role === r.key
                      ? { background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.25)", color: "#fff" }
                      : { background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.08)", color: "#a3a3a3" }
                  }
                >
                  <p className="font-semibold">{r.label}</p>
                  <p className="text-xs mt-1" style={{ color: "#525252" }}>{r.sub}</p>
                </button>
              ))}
            </div>
          )}

          {/* Google button */}
          <div className="mb-5">
            <GoogleButton
              onSuccess={handleGoogleSuccess}
              onError={(msg) => showToast(msg)}
              label={mode === "login" ? "Continue with Google" : "Sign up with Google"}
            />
          </div>

          {/* Divider */}
          <div className="divider mb-5">Or continue with email</div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3a3a3" }}>Full name</label>
                <InputField
                  name="name"
                  type="text"
                  placeholder="Your full name"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3a3a3" }}>Email address</label>
              <InputField
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3a3a3" }}>Password</label>
              <div className="relative">
                <InputField
                  name="password"
                  type={showPw ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  style={{ paddingRight: "44px" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition"
                  style={{ color: "#525252" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#a3a3a3"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#525252"}
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {mode === "signup" && (
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: "#a3a3a3" }}>Confirm password</label>
                <InputField
                  name="confirmPassword"
                  type={showPw ? "text" : "password"}
                  placeholder="Re-enter password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            <Toast message={toast.message} type={toast.type} />

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 py-3.5 text-sm"
              style={{ opacity: loading ? 0.65 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            >
              {loading ? (
                <><Loader2 size={16} className="animate-spin" /> {mode === "login" ? "Signing in..." : "Creating account..."}</>
              ) : mode === "login" ? (
                "Sign in"
              ) : (
                "Create account"
              )}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: "#525252" }}>
            {mode === "login" ? (
              <>
                Don't have an account?{" "}
                <button
                  onClick={() => switchMode("signup")}
                  className="font-semibold transition"
                  style={{ color: "#f59e0b" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#fbbf24"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#f59e0b"}
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <button
                  onClick={() => switchMode("login")}
                  className="font-semibold transition"
                  style={{ color: "#f59e0b" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#fbbf24"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#f59e0b"}
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </section>
      </div>
    </div>
  );
}

export default Login;
