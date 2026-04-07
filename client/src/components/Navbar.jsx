import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { Menu, X, Package, LogOut, List, ShoppingBag, Search, Sparkles, Bell, MessageSquare } from "lucide-react";
import { getSocket, connectSocket, disconnectSocket } from "../services/socketService";
import NotificationPanel from "./NotificationPanel";

function Navbar() {
  const navigate  = useNavigate();
  const location  = useLocation();

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user")) || null; }
    catch { return null; }
  });
  const [menuOpen,           setMenuOpen]           = useState(false);
  const [scrolled,           setScrolled]           = useState(false);
  const [notifications,      setNotifications]      = useState([]);
  const [showNotifications,  setShowNotifications]  = useState(false);
  const panelRef = useRef(null);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || null;
      setUser(u);
      if (u) { connectSocket(u._id); fetchNotifications(); }
      else    { disconnectSocket(); setNotifications([]); }
    } catch { setUser(null); }
  }, [location.pathname]);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res  = await api.get("/api/rentals/owner");
      const reqs = res.data.map((r) => ({
        rentalId:    r._id,
        productName: r.productName,
        price:       r.price,
        deposit:     r.deposit,
        duration:    r.duration,
        renter:      r.user,
        createdAt:   r.createdAt,
      }));
      setNotifications(reqs);
    } catch (err) { console.error("Failed to fetch notifications:", err); }
  };

  useEffect(() => {
    const socket         = getSocket();
    const handleNewRequest = (data) => setNotifications((prev) => [data, ...prev]);
    socket.on("new_rental_request", handleNewRequest);
    return () => socket.off("new_rental_request", handleNewRequest);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target))
        setShowNotifications(false);
    };
    if (showNotifications) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showNotifications]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location.pathname]);

  const isActive  = (path) => location.pathname === path;
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const navLinks = [
    { path: "/browse",      label: "Browse",      icon: <Search       size={14} /> },
    { path: "/my-rentals",  label: "My Rentals",  icon: <ShoppingBag  size={14} /> },
    { path: "/list-item",   label: "List an Item", icon: <Package      size={14} /> },
    { path: "/my-listings", label: "My Listings", icon: <List         size={14} /> },
    { path: "/inbox",       label: "Inbox",       icon: <MessageSquare size={14} /> },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-500"
      style={
        scrolled
          ? { background: "rgba(8,8,8,0.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }
          : { background: "transparent" }
      }
    >
      {/* Top accent line */}
      <div
        className="h-px w-full transition-all duration-500"
        style={{
          background: scrolled
            ? "linear-gradient(90deg, transparent, rgba(245,158,11,0.35), transparent)"
            : "transparent",
        }}
      />

      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shadow-lg transition-all duration-200"
            style={{
              background: "linear-gradient(135deg, #d97706, #f59e0b)",
              boxShadow: "0 0 16px rgba(245,158,11,0.25)",
            }}
          >
            <Sparkles size={13} style={{ color: "#080808" }} />
          </div>
          <span className="text-xl font-extrabold tracking-tight gradient-text">rentKaro</span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-xl transition-all duration-200"
              style={
                isActive(link.path)
                  ? { background: "rgba(245,158,11,0.1)", color: "#fbbf24", border: "1px solid rgba(245,158,11,0.2)", fontWeight: 600 }
                  : { color: "#737373", border: "1px solid transparent" }
              }
              onMouseEnter={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = "#f0f0f0"; }}
              onMouseLeave={(e) => { if (!isActive(link.path)) e.currentTarget.style.color = "#737373"; }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop Auth & Notifications */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              {/* Bell */}
              <div className="relative" ref={panelRef}>
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-xl transition-all duration-200 mr-1"
                  style={{ color: "#737373" }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#f0f0f0"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#737373"; }}
                >
                  <Bell size={17} />
                  {notifications.length > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                  )}
                </button>
                {showNotifications && (
                  <NotificationPanel
                    requests={notifications}
                    onAction={(rentalId) => setNotifications((prev) => prev.filter((n) => n.rentalId !== rentalId))}
                    onClose={() => setShowNotifications(false)}
                  />
                )}
              </div>

              {/* Avatar + Name */}
              <div className="flex items-center gap-2.5">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-9 h-9 rounded-xl object-cover"
                    style={{ border: "1px solid rgba(245,158,11,0.2)" }}
                  />
                ) : (
                  <div
                    className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm"
                    style={{
                      background: "rgba(245,158,11,0.1)",
                      border: "1px solid rgba(245,158,11,0.2)",
                      color: "#fbbf24",
                    }}
                  >
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                )}
                <div className="text-left">
                  <p className="text-sm font-medium leading-none" style={{ color: "#f0f0f0" }}>{user.name}</p>
                  {user.role && (
                    <p className="text-xs capitalize mt-0.5" style={{ color: "#f59e0b" }}>{user.role}</p>
                  )}
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm transition-all duration-200"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "#737373",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                  e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)";
                  e.currentTarget.style.color = "#f87171";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.04)";
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)";
                  e.currentTarget.style.color = "#737373";
                }}
              >
                <LogOut size={14} />
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="btn-primary text-sm py-2 px-5 flex items-center">
              <span>Sign In</span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2.5 rounded-xl transition-all duration-200"
          style={{ color: "#a3a3a3" }}
          onClick={() => setMenuOpen(!menuOpen)}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#fff"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#a3a3a3"; }}
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div
          className="md:hidden animate-slide-down"
          style={{ background: "rgba(8,8,8,0.97)", backdropFilter: "blur(20px)", borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all"
                style={
                  isActive(link.path)
                    ? { background: "rgba(245,158,11,0.1)", color: "#fbbf24", fontWeight: 600, border: "1px solid rgba(245,158,11,0.15)" }
                    : { color: "#737373", border: "1px solid transparent" }
                }
              >
                {link.icon}
                {link.label}
              </Link>
            ))}
            <div className="mt-2 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
              {user ? (
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2 text-sm" style={{ color: "#f0f0f0" }}>
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-lg object-cover" />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs"
                        style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#fbbf24" }}
                      >
                        {user.name ? user.name[0].toUpperCase() : "U"}
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{user.name}</p>
                      {user.role && <p className="text-xs capitalize" style={{ color: "#f59e0b" }}>{user.role}</p>}
                    </div>
                  </div>
                  <button onClick={handleLogout} className="flex items-center gap-1.5 text-sm" style={{ color: "#f87171" }}>
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn-primary text-sm py-2.5 text-center block">
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;