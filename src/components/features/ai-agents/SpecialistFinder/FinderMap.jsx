import { useState, useEffect, useCallback } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";

// ─── IMPORTANT: Declare libraries OUTSIDE component to avoid re-render loops ──
const GOOGLE_MAPS_LIBRARIES = ["places"];

// ─── Constants ────────────────────────────────────────────────────────────────
const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_Maps_API_KEY || "";

const FILTER_OPTIONS = [
  {
    id: "hospital",
    label: "All Hospitals",
    icon: "🏥",
    keyword: "hospital",
    color: "#0d9db8",
    bg: "rgba(13,157,184,0.12)",
  },
  {
    id: "emergency",
    label: "Emergency",
    icon: "🚨",
    keyword: "emergency",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.12)",
  },
  {
    id: "doctor",
    label: "Specialist Clinics",
    icon: "🩺",
    keyword: "doctor",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.12)",
  },
  {
    id: "pharmacy",
    label: "24/7 Pharmacies",
    icon: "💊",
    keyword: "pharmacy",
    color: "#10b981",
    bg: "rgba(16,185,129,0.12)",
  },
];

const MAP_CONTAINER_STYLE = { width: "100%", height: "100%" };

const DARK_MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a2035" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a2035" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8a9fc0" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c4d0e8" }] },
  { featureType: "poi", elementType: "labels.text.fill", stylers: [{ color: "#8a9fc0" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#162030" }] },
  { featureType: "poi.park", elementType: "labels.text.fill", stylers: [{ color: "#3a5a6a" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#253352" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#192038" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#7a8faf" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2c4070" }] },
  { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: "#1a2e50" }] },
  { featureType: "road.highway", elementType: "labels.text.fill", stylers: [{ color: "#b0c4d8" }] },
  { featureType: "transit", elementType: "geometry", stylers: [{ color: "#1e2e48" }] },
  { featureType: "transit.station", elementType: "labels.text.fill", stylers: [{ color: "#8a9fc0" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1a2d" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#2a4060" }] },
  { featureType: "water", elementType: "labels.text.stroke", stylers: [{ color: "#0d1a2d" }] },
];

// ─── Star Rating Helper ────────────────────────────────────────────────────────
function StarRating({ rating }) {
  if (!rating) return <span style={{ color: "#6b7280", fontSize: "0.8rem" }}>No ratings yet</span>;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  const empty = 5 - full - (half ? 1 : 0);
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "2px" }}>
      {Array(full).fill(0).map((_, i) => (
        <span key={`f${i}`} style={{ color: "#f59e0b", fontSize: "0.95rem" }}>★</span>
      ))}
      {half && <span style={{ color: "#f59e0b", fontSize: "0.95rem" }}>½</span>}
      {Array(empty).fill(0).map((_, i) => (
        <span key={`e${i}`} style={{ color: "#374151", fontSize: "0.95rem" }}>★</span>
      ))}
      <span style={{ color: "#9ca3af", fontSize: "0.8rem", marginLeft: "4px" }}>
        {rating.toFixed(1)}
      </span>
    </span>
  );
}

// ─── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonCard({ isDarkMode }) {
  return (
    <div style={{
      background: isDarkMode
        ? "linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.95))"
        : "#ffffff",
      borderRadius: "20px",
      padding: "20px",
      border: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(148,163,184,0.15)",
      boxShadow: isDarkMode ? "0 4px 16px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.06)",
    }}>
      {[80, 50, 60].map((w, i) => (
        <div key={i} style={{
          height: i === 0 ? "18px" : "12px",
          width: `${w}%`,
          background: isDarkMode
            ? "linear-gradient(90deg, rgba(255,255,255,0.04) 25%, rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.04) 75%)"
            : "linear-gradient(90deg, rgba(0,0,0,0.04) 25%, rgba(0,0,0,0.08) 50%, rgba(0,0,0,0.04) 75%)",
          backgroundSize: "200% 100%",
          borderRadius: "6px",
          marginBottom: "10px",
          animation: "shimmer 1.5s infinite",
        }} />
      ))}
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function FinderMap() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(true);
  const [facilitiesLoading, setFacilitiesLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [activeFilter, setActiveFilter] = useState("hospital");
  const [locationError, setLocationError] = useState("");
  const [apiError, setApiError] = useState("");
  const [mapRef, setMapRef] = useState(null);
  const [isListView, setIsListView] = useState(false);
  const isMobile = typeof window !== "undefined" && window.matchMedia("(max-width: 768px)").matches;
  const isSmall = typeof window !== "undefined" && window.matchMedia("(max-width: 480px)").matches;

  // ── Load Google Maps JS SDK ───────────────────────────────────────────────
  // FIX: Use the constant declared outside this component to prevent
  // "LoadScript has been reloaded unintentionally" errors and the
  // "This page can't load Google Maps correctly" dialog.
  const { isLoaded: mapsLoaded, loadError: mapsLoadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // ── Theme detection ───────────────────────────────────────────────────────
  useEffect(() => {
    const check = () => setIsDarkMode(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // ── Inject CSS ────────────────────────────────────────────────────────────
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@300;400;700;900&family=Inter:wght@300;400;500;600;700;800&display=swap');

      @keyframes fadeInUp { from { opacity:0; transform:translateY(40px); } to { opacity:1; transform:translateY(0); } }
      @keyframes slideInLeft { from { opacity:0; transform:translateX(-40px); } to { opacity:1; transform:translateX(0); } }
      @keyframes slideInRight { from { opacity:0; transform:translateX(40px); } to { opacity:1; transform:translateX(0); } }
      @keyframes scaleIn { from { opacity:0; transform:scale(0.9); } to { opacity:1; transform:scale(1); } }
      @keyframes rotation { from { transform:rotate(0deg); } to { transform:rotate(360deg); } }
      @keyframes fadeOut { from { opacity:1; } to { opacity:0; pointer-events:none; } }
      @keyframes float { 0%,100%{transform:translateY(0);} 50%{transform:translateY(-8px);} }
      @keyframes pulse { 0%,100%{opacity:1;} 50%{opacity:0.5;} }
      @keyframes shimmer { 0%{background-position:-200% 0;} 100%{background-position:200% 0;} }
      @keyframes ripple { 0%{transform:scale(0);opacity:1;} 100%{transform:scale(2.5);opacity:0;} }
      @keyframes shimmerLight { 0%{background-position:-1000px 0;} 100%{background-position:1000px 0;} }

      .facility-card { transition: all 0.5s cubic-bezier(0.4,0,0.2,1); }
      .facility-card:hover { transform: translateY(-8px) scale(1.01); }
      .filter-btn { transition: all 0.3s cubic-bezier(0.4,0,0.2,1); }
      .filter-btn:hover { transform: translateY(-2px); }
      .gradient-text {
        background: linear-gradient(135deg, #0d9db8, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      .nav-btn { transition: all 0.3s ease; }
      .nav-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(13,157,184,0.4) !important; }

      .card-glow-bar {
        position: absolute;
        top: 0; left: 0; right: 0;
        height: 3px;
        background: linear-gradient(90deg, #0d9db8, #3b82f6, #0d9db8);
        background-size: 200% 100%;
        border-radius: 20px 20px 0 0;
        opacity: 0;
        animation: shimmerLight 2s infinite;
        transition: opacity 0.3s ease;
      }
      .facility-card:hover .card-glow-bar { opacity: 1; }

      ::-webkit-scrollbar { width: 6px; }
      ::-webkit-scrollbar-track { background: rgba(15,23,42,0.5); }
      ::-webkit-scrollbar-thumb { background: rgba(13,157,184,0.4); border-radius: 3px; }
      ::-webkit-scrollbar-thumb:hover { background: rgba(13,157,184,0.7); }
    `;
    document.head.appendChild(style);
    return () => { if (document.head.contains(style)) document.head.removeChild(style); };
  }, []);

  // ── Page load timer ───────────────────────────────────────────────────────
  useEffect(() => {
    const t = setTimeout(() => setIsPageLoading(false), 900);
    return () => clearTimeout(t);
  }, []);

  // ── Geolocation ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      (err) => {
        const messages = {
          1: "Location access denied. Please allow location permission and reload.",
          2: "Unable to determine your location. Check GPS/network.",
          3: "Location request timed out. Please try again.",
        };
        setLocationError(messages[err.code] || "Unknown location error.");
        setLocationLoading(false);
      },
      { timeout: 12000, enableHighAccuracy: true }
    );
  }, []);

  // ── Fetch facilities from backend ─────────────────────────────────────────
  const fetchFacilities = useCallback(async (facilityType) => {
    if (!userLocation) return;
    setFacilitiesLoading(true);
    setApiError("");
    setSelectedFacility(null);

    try {
      const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';
      const url = `${BASE}/api/v1/nearby-finder?latitude=${userLocation.lat}&longitude=${userLocation.lng}&facility_type=${facilityType}`;
      const res = await fetch(url);
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.detail || `Server error: ${res.status}`);
      }
      const data = await res.json();
      setFacilities(data.facilities || []);
    } catch (err) {
      setApiError(err.message || "Failed to fetch nearby facilities.");
      setFacilities([]);
    } finally {
      setFacilitiesLoading(false);
    }
  }, [userLocation]);

  // Auto-fetch when location ready or filter changes
  useEffect(() => {
    if (userLocation) fetchFacilities(activeFilter);
  }, [userLocation, activeFilter, fetchFacilities]);

  // ── Map callbacks ─────────────────────────────────────────────────────────
  const onMapLoad = useCallback((map) => setMapRef(map), []);

  const onMapUnmount = useCallback(() => setMapRef(null), []);

  const handleMarkerClick = (facility) => {
    setSelectedFacility(facility);
    if (mapRef && facility.geometry) {
      mapRef.panTo({ lat: facility.geometry.lat, lng: facility.geometry.lng });
    }
  };

  const openNavigation = (facility) => {
    const { lat, lng } = facility.geometry;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&destination_place_id=${facility.id}&travelmode=driving`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  // ── Active filter config ──────────────────────────────────────────────────
  const activeFilterConfig = FILTER_OPTIONS.find(f => f.id === activeFilter) || FILTER_OPTIONS[0];

  // ─────────────────────────────────────────────────────────────────────────
  // STYLES — now light/dark aware, matching Services.jsx
  // ─────────────────────────────────────────────────────────────────────────
  const S = {
    pageLoader: {
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f0f9ff 50%, #ffffff 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      zIndex: 9999,
      animation: isPageLoading ? "none" : "fadeOut 0.5s ease-out 0.1s forwards",
    },
    spinner: {
      width: "56px", height: "56px",
      border: "4px solid rgba(13,157,184,0.2)",
      borderTop: "4px solid #0d9db8",
      borderRadius: "50%",
      animation: "rotation 1s linear infinite",
    },
    loaderText: {
      marginTop: "20px", fontSize: "1.05rem", fontWeight: 600,
      background: "linear-gradient(135deg, #0d9db8, #3b82f6)",
      WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
      fontFamily: "'Inter', sans-serif",
    },
    // ── Page wrapper — matches Services.jsx backgrounds ──────────────────
    pageWrapper: {
      width: "100%", minHeight: "100vh",
      background: isDarkMode
        ? "linear-gradient(135deg, #0f172a 0%, #1e293b 25%, #0f172a 50%, #1e1b4b 75%, #0f172a 100%)"
        : "linear-gradient(135deg, #ffffff 0%, #f0f9ff 25%, #e0f2fe 50%, #f0f9ff 75%, #ffffff 100%)",
      position: "relative", overflow: "hidden", fontFamily: "'Inter', sans-serif",
    },
    bgPattern: {
      position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
      opacity: isDarkMode ? 0.03 : 0.05,
      pointerEvents: "none",
      backgroundImage: `radial-gradient(circle at 25px 25px, ${isDarkMode ? "#60a5fa" : "#0d9db8"} 2%, transparent 0%), radial-gradient(circle at 75px 75px, ${isDarkMode ? "#0d9db8" : "#60a5fa"} 2%, transparent 0%)`,
      backgroundSize: "100px 100px",
    },
    contentWrap: {
      maxWidth: "1500px", margin: "0 auto",
      padding: isSmall ? "90px 16px 40px" : isMobile ? "100px 16px 40px" : "120px 40px 60px",
      position: "relative", zIndex: 1,
    },
    // ── Header ───────────────────────────────────────────────────────────
    header: { marginBottom: isSmall ? "24px" : "36px", animation: "fadeInUp 0.8s ease-out" },
    badge: {
      display: "inline-block", padding: "8px 20px",
      background: isDarkMode
        ? "linear-gradient(135deg, rgba(13,157,184,0.15), rgba(96,165,250,0.15))"
        : "linear-gradient(135deg, rgba(13,157,184,0.1), rgba(59,130,246,0.1))",
      border: `1px solid ${isDarkMode ? "rgba(13,157,184,0.3)" : "rgba(13,157,184,0.2)"}`,
      borderRadius: "50px",
      fontSize: "0.72rem", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase",
      color: isDarkMode ? "#60a5fa" : "#0d9db8",
      marginBottom: "14px",
      animation: "scaleIn 0.6s ease-out",
    },
    heroTitle: {
      fontSize: isSmall ? "1.8rem" : isMobile ? "2.2rem" : "3rem",
      fontWeight: 900, lineHeight: 1.2,
      color: isDarkMode ? "#f9fafb" : "#0f172a",
      fontFamily: "'Merriweather', serif", marginBottom: "10px",
      animation: "slideInLeft 0.8s ease-out 0.2s backwards",
    },
    heroSub: {
      fontSize: isSmall ? "0.9rem" : "1.1rem",
      color: isDarkMode ? "#9ca3af" : "#64748b",
      lineHeight: 1.6, maxWidth: "680px",
      animation: "fadeInUp 0.8s ease-out 0.4s backwards",
    },
    // ── Stats bar ─────────────────────────────────────────────────────────
    statsBar: {
      display: "flex", gap: isSmall ? "12px" : "20px", marginBottom: "28px",
      flexWrap: "wrap", animation: "fadeInUp 0.6s ease-out 0.1s backwards",
    },
    statChip: {
      display: "flex", alignItems: "center", gap: "8px",
      padding: "8px 16px",
      background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.8)",
      border: isDarkMode ? "1px solid rgba(255,255,255,0.08)" : "1px solid rgba(148,163,184,0.2)",
      borderRadius: "50px",
      boxShadow: isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.05)",
    },
    statDot: (color) => ({
      width: "8px", height: "8px", borderRadius: "50%", background: color,
      animation: "pulse 2s infinite",
    }),
    statText: { fontSize: "0.82rem", color: isDarkMode ? "#94a3b8" : "#64748b", fontWeight: 500 },
    statBold: { color: isDarkMode ? "#e2e8f0" : "#0f172a", fontWeight: 700 },
    // ── Filters ───────────────────────────────────────────────────────────
    filtersWrap: {
      display: "flex", gap: isSmall ? "8px" : "12px", marginBottom: "24px",
      flexWrap: "wrap", animation: "fadeInUp 0.6s ease-out 0.15s backwards",
    },
    filterBtn: (isActive, cfg) => ({
      display: "inline-flex", alignItems: "center", gap: "8px",
      padding: isSmall ? "9px 16px" : "10px 20px",
      borderRadius: "50px",
      border: isActive ? `2px solid ${cfg.color}` : `2px solid ${isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(148,163,184,0.25)"}`,
      background: isActive ? cfg.bg : isDarkMode ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.7)",
      color: isActive ? cfg.color : isDarkMode ? "#94a3b8" : "#64748b",
      fontWeight: isActive ? 700 : 500,
      fontSize: isSmall ? "0.8rem" : "0.88rem",
      cursor: "pointer",
      boxShadow: isActive ? `0 0 16px ${cfg.color}30` : isDarkMode ? "none" : "0 2px 8px rgba(0,0,0,0.06)",
      outline: "none",
      fontFamily: "'Inter', sans-serif",
    }),
    filterIcon: { fontSize: isSmall ? "1rem" : "1.1rem" },
    // ── Main grid ─────────────────────────────────────────────────────────
    mainGrid: {
      display: "grid",
      gridTemplateColumns: isMobile ? "1fr" : "1fr 400px",
      gridTemplateRows: isMobile ? "460px auto" : "640px",
      gap: isSmall ? "16px" : "28px",
      animation: "scaleIn 0.7s ease-out 0.2s backwards",
    },
    // ── Map panel ─────────────────────────────────────────────────────────
    mapPanel: {
      position: "relative",
      borderRadius: "24px", overflow: "hidden",
      border: isDarkMode
        ? "2px solid rgba(13,157,184,0.55)"
        : "2px solid rgba(13,157,184,0.45)",
      boxShadow: isDarkMode
        ? "0 20px 60px rgba(0,0,0,0.5), 0 0 0 1px rgba(13,157,184,0.1), 0 0 24px rgba(13,157,184,0.12)"
        : "0 20px 60px rgba(0,0,0,0.12), 0 0 0 1px rgba(13,157,184,0.08), 0 0 24px rgba(13,157,184,0.08)",
      background: isDarkMode ? "#0d1a2d" : "#e8f4f8",
    },
    mapTopBar: {
      position: "absolute", top: 0, left: 0, right: 0, zIndex: 10,
      padding: isSmall ? "10px 12px" : "14px 18px",
      background: isDarkMode
        ? "linear-gradient(180deg, rgba(10,18,35,0.98) 0%, rgba(10,18,35,0.85) 70%, transparent 100%)"
        : "linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.85) 70%, transparent 100%)",
      display: "flex", alignItems: "center", justifyContent: "space-between",
      backdropFilter: "blur(6px)",
    },
    mapLabel: {
      display: "flex", alignItems: "center", gap: "8px",
      fontSize: "0.82rem", fontWeight: 600,
      color: isDarkMode ? "#94a3b8" : "#475569",
    },
    liveDot: {
      width: "7px", height: "7px", borderRadius: "50%", background: "#10b981",
      animation: "pulse 1.5s infinite",
    },
    viewToggle: {
      display: isMobile ? "flex" : "none",
      gap: "4px",
      background: isDarkMode ? "rgba(15,23,42,0.9)" : "rgba(240,249,255,0.9)",
      borderRadius: "12px", padding: "4px",
      border: isDarkMode ? "1px solid rgba(13,157,184,0.3)" : "1px solid rgba(13,157,184,0.25)",
      boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
    },
    toggleBtn: (isActive) => ({
      padding: "6px 14px", borderRadius: "9px", border: "none",
      background: isActive
        ? "linear-gradient(135deg, #0d9db8, #3b82f6)"
        : "transparent",
      color: isActive ? "#ffffff" : (isDarkMode ? "#94a3b8" : "#475569"),
      fontSize: "0.8rem", fontWeight: 700, cursor: "pointer",
      fontFamily: "'Inter', sans-serif",
      boxShadow: isActive ? "0 2px 8px rgba(13,157,184,0.4)" : "none",
      transition: "all 0.2s ease",
    }),
    // ── List panel ────────────────────────────────────────────────────────
    listPanel: {
      display: "flex", flexDirection: "column", height: isMobile ? "auto" : "640px",
      ...(isMobile ? {
        background: isDarkMode
          ? "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)"
          : "linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)",
        borderRadius: "20px",
        padding: "20px 16px",
        border: isDarkMode ? "1px solid rgba(255,255,255,0.05)" : "1px solid rgba(148,163,184,0.18)",
        boxShadow: isDarkMode ? "0 8px 32px rgba(0,0,0,0.3)" : "0 8px 32px rgba(0,0,0,0.08)",
        minHeight: "400px",
      } : {}),
    },
    listHeader: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "14px", flexShrink: 0,
      padding: "0 2px",
    },
    listTitle: {
      fontSize: "1.1rem", fontWeight: 700,
      color: isDarkMode ? "#e2e8f0" : "#0f172a",
      fontFamily: "'Merriweather', serif",
    },
    countBadge: {
      padding: "4px 12px", borderRadius: "50px",
      background: isDarkMode ? "rgba(13,157,184,0.15)" : "rgba(13,157,184,0.1)",
      border: "1px solid rgba(13,157,184,0.3)",
      fontSize: "0.78rem", fontWeight: 700, color: "#0d9db8",
    },
    listScroll: {
      flex: 1, overflowY: "auto", paddingRight: "4px",
      display: "flex", flexDirection: "column", gap: "14px",
      maxHeight: isMobile ? "600px" : "610px",
    },
    // ── Improved facility card — matches Services card style ──────────────
    facilityCard: (isSelected) => ({
      background: isDarkMode
        ? (isSelected
          ? "linear-gradient(135deg, rgba(13,157,184,0.18), rgba(59,130,246,0.12))"
          : "linear-gradient(135deg, rgba(30,41,59,0.95) 0%, rgba(15,23,42,0.95) 100%)")
        : (isSelected
          ? "linear-gradient(135deg, rgba(13,157,184,0.08), rgba(59,130,246,0.05))"
          : "#ffffff"),
      backdropFilter: "blur(20px)",
      border: isDarkMode
        ? (isSelected ? "1px solid rgba(13,157,184,0.5)" : "1px solid rgba(255,255,255,0.07)")
        : (isSelected ? "1.5px solid rgba(13,157,184,0.4)" : "1px solid rgba(148,163,184,0.2)"),
      borderRadius: "20px",
      padding: "16px 16px 16px 20px",
      cursor: "pointer",
      boxShadow: isDarkMode
        ? (isSelected ? "0 8px 32px rgba(13,157,184,0.25)" : "0 4px 16px rgba(0,0,0,0.3)")
        : (isSelected ? "0 8px 32px rgba(13,157,184,0.18)" : "0 4px 16px rgba(0,0,0,0.08)"),
      position: "relative",
      overflow: "visible",
      transition: "all 0.5s cubic-bezier(0.4,0,0.2,1)",
    }),
    cardAccent: (cfg) => ({
      position: "absolute", left: 0, top: "8px", bottom: "8px", width: "4px",
      background: `linear-gradient(180deg, ${cfg.color}, transparent)`,
      borderRadius: "4px",
    }),
    // Card rank number — like Services card number
    cardRank: () => ({
      position: "absolute", top: "14px", right: "14px",
      width: "28px", height: "28px", borderRadius: "50%",
      background: isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
      border: isDarkMode ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(148,163,184,0.2)",
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "0.7rem", fontWeight: 700,
      color: isDarkMode ? "#475569" : "#94a3b8",
    }),
    cardIcon: (cfg) => ({
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: "40px", height: "40px", borderRadius: "12px",
      background: `${cfg.bg}`,
      border: `1px solid ${cfg.color}30`,
      fontSize: "1.2rem",
      marginBottom: "10px",
      boxShadow: `0 4px 12px ${cfg.color}20`,
    }),
    cardName: {
      fontSize: "0.96rem", fontWeight: 700,
      color: isDarkMode ? "#f1f5f9" : "#0f172a",
      marginBottom: "4px", lineHeight: 1.35,
      fontFamily: "'Merriweather', serif",
      paddingRight: "30px",
    },
    cardAddr: {
      fontSize: "0.79rem",
      color: isDarkMode ? "#94a3b8" : "#64748b",
      marginBottom: "10px", lineHeight: 1.5,
      paddingRight: "4px",
    },
    cardMeta: {
      display: "flex", alignItems: "center", justifyContent: "space-between",
      flexWrap: "wrap", gap: "6px",
    },
    openBadge: (isOpen) => ({
      padding: "3px 10px", borderRadius: "50px", fontSize: "0.7rem", fontWeight: 700,
      background: isOpen ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
      color: isOpen ? "#10b981" : "#ef4444",
      border: `1px solid ${isOpen ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.25)"}`,
    }),
    navBtn: {
      display: "inline-flex", alignItems: "center", gap: "5px",
      padding: "7px 14px", borderRadius: "10px", border: "none",
      background: "linear-gradient(135deg, #0d9db8, #3b82f6)",
      color: "#fff", fontSize: "0.75rem", fontWeight: 700, cursor: "pointer",
      fontFamily: "'Inter', sans-serif", textTransform: "uppercase", letterSpacing: "0.4px",
      boxShadow: "0 4px 12px rgba(13,157,184,0.25)",
    },
    // ── InfoWindow ─────────────────────────────────────────────────────────
    infoWinWrap: {
      background: isDarkMode ? "#0f172a" : "#ffffff",
      borderRadius: "12px",
      padding: "14px 16px", minWidth: "220px", maxWidth: "280px",
      border: "1px solid rgba(13,157,184,0.3)",
      fontFamily: "'Inter', sans-serif",
    },
    infoWinName: {
      fontSize: "0.95rem", fontWeight: 700,
      color: isDarkMode ? "#f1f5f9" : "#0f172a",
      marginBottom: "4px", lineHeight: 1.3,
    },
    infoWinAddr: {
      fontSize: "0.78rem",
      color: isDarkMode ? "#64748b" : "#94a3b8",
      marginBottom: "10px", lineHeight: 1.4,
    },
    infoWinMeta: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px" },
    // ── Error / empty states ───────────────────────────────────────────────
    errorBox: {
      padding: "20px 24px",
      background: "rgba(239,68,68,0.08)",
      border: "1px solid rgba(239,68,68,0.25)",
      borderRadius: "16px", marginBottom: "20px",
      display: "flex", alignItems: "flex-start", gap: "12px",
    },
    errorText: { color: "#fca5a5", fontSize: "0.92rem", lineHeight: 1.5 },
    emptyState: {
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: "48px 24px", textAlign: "center",
    },
    emptyIcon: { fontSize: "3rem", marginBottom: "16px", animation: "float 3s ease-in-out infinite" },
    emptyTitle: {
      fontSize: "1rem", fontWeight: 700,
      color: isDarkMode ? "#e2e8f0" : "#0f172a",
      marginBottom: "6px",
    },
    emptyText: {
      fontSize: "0.85rem",
      color: isDarkMode ? "#64748b" : "#94a3b8",
      lineHeight: 1.5,
    },
    // ── Location loading ───────────────────────────────────────────────────
    locationLoadWrap: {
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      minHeight: "340px", gap: "20px",
    },
    bigSpinner: {
      width: "64px", height: "64px",
      border: "4px solid rgba(13,157,184,0.2)",
      borderTop: "4px solid #0d9db8",
      borderRadius: "50%", animation: "rotation 1s linear infinite",
    },
    locationText: {
      fontSize: "1.05rem", fontWeight: 600,
      color: isDarkMode ? "#94a3b8" : "#475569",
    },
    locationSub: {
      fontSize: "0.85rem",
      color: isDarkMode ? "#64748b" : "#94a3b8",
    },
  };

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  // User marker SVG
  const userMarkerSvg = encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <circle cx="16" cy="16" r="14" fill="#0d9db8" opacity="0.3"/>
      <circle cx="16" cy="16" r="8" fill="#0d9db8"/>
      <circle cx="16" cy="16" r="4" fill="white"/>
    </svg>
  `);

  // Facility marker SVG factory
  const getFacilityMarkerSvg = (color, isSelected) => {
    const size = isSelected ? 38 : 30;
    return encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size + 8}" viewBox="0 0 ${size} ${size + 8}">
        <defs>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="${color}" flood-opacity="0.5"/>
          </filter>
        </defs>
        <ellipse cx="${size / 2}" cy="${size + 4}" rx="${size * 0.3}" ry="4" fill="${color}" opacity="0.25"/>
        <path d="M${size / 2},${size + 2} L${size / 2 - 6},${size * 0.65} A${size * 0.45},${size * 0.45} 0 1 1 ${size / 2 + 6},${size * 0.65} Z"
          fill="${color}" filter="url(#shadow)"/>
        <circle cx="${size / 2}" cy="${size * 0.42}" r="${size * 0.3}" fill="white" opacity="0.95"/>
        <text x="${size / 2}" y="${size * 0.49}" text-anchor="middle" dominant-baseline="middle"
          font-size="${size * 0.28}" font-family="Arial">🏥</text>
      </svg>
    `);
  };

  return (
    <>
      {/* Page Loader */}
      {isPageLoading && (
        <div style={S.pageLoader}>
          <div style={S.spinner} />
          <div style={S.loaderText}>Loading DoctorXCare</div>
          <div style={{ fontSize: "0.85rem", color: isDarkMode ? "#64748b" : "#94a3b8", marginTop: "6px", fontFamily: "'Inter',sans-serif" }}>
            Nearby Medical Finder
          </div>
        </div>
      )}

      <div style={S.pageWrapper}>
        <div style={S.bgPattern} />

        <div style={S.contentWrap}>
          {/* ── Header ───────────────────────────────────────────────────── */}
          <div style={S.header}>
            <span style={S.badge}>📍 AI-POWERED MEDICAL LOCATOR</span>
            <h1 style={S.heroTitle}>
              Find <span className="gradient-text">Nearby</span> Medical Facilities
            </h1>
            <p style={S.heroSub}>
              Instantly locate hospitals, clinics, pharmacies, and specialists near you.
              Powered by real-time location and Google Places data.
            </p>
          </div>

          {/* ── Stats Bar ────────────────────────────────────────────────── */}
          <div style={S.statsBar}>
            <div style={S.statChip}>
              <div style={S.statDot("#10b981")} />
              <span style={S.statText}>
                <span style={S.statBold}>{facilities.length}</span> facilities found
              </span>
            </div>
            <div style={S.statChip}>
              <div style={S.statDot("#0d9db8")} />
              <span style={S.statText}>
                Searching <span style={S.statBold}>5 km</span> radius
              </span>
            </div>
            {userLocation && (
              <div style={S.statChip}>
                <div style={S.statDot("#8b5cf6")} />
                <span style={S.statText}>
                  <span style={S.statBold}>📍</span> Location active
                </span>
              </div>
            )}
          </div>

          {/* ── Error Banners ─────────────────────────────────────────────── */}
          {locationError && (
            <div style={S.errorBox}>
              <span style={{ fontSize: "1.3rem" }}>⚠️</span>
              <div>
                <div style={{ color: "#fca5a5", fontWeight: 700, marginBottom: "4px" }}>
                  Location Access Error
                </div>
                <div style={S.errorText}>{locationError}</div>
              </div>
            </div>
          )}
          {apiError && (
            <div style={S.errorBox}>
              <span style={{ fontSize: "1.3rem" }}>🔌</span>
              <div>
                <div style={{ color: "#fca5a5", fontWeight: 700, marginBottom: "4px" }}>
                  API Error
                </div>
                <div style={S.errorText}>{apiError}</div>
              </div>
            </div>
          )}
          {mapsLoadError && (
            <div style={S.errorBox}>
              <span style={{ fontSize: "1.3rem" }}>🗺️</span>
              <div>
                <div style={{ color: "#fca5a5", fontWeight: 700, marginBottom: "4px" }}>
                  Google Maps Failed to Load
                </div>
                <div style={S.errorText}>
                  Check that your VITE_Maps_API_KEY is valid and has Maps JavaScript API enabled.
                </div>
              </div>
            </div>
          )}

          {/* ── Filter Buttons ────────────────────────────────────────────── */}
          <div style={S.filtersWrap}>
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                className="filter-btn"
                style={S.filterBtn(activeFilter === opt.id, opt)}
                onClick={() => setActiveFilter(opt.id)}
                disabled={locationLoading || facilitiesLoading}
              >
                <span style={S.filterIcon}>{opt.icon}</span>
                {opt.label}
              </button>
            ))}
          </div>

          {/* ── Location Loading ──────────────────────────────────────────── */}
          {locationLoading ? (
            <div style={S.locationLoadWrap}>
              <div style={S.bigSpinner} />
              <div style={S.locationText}>Detecting Your Location</div>
              <div style={S.locationSub}>Please allow location access when prompted…</div>
            </div>
          ) : (
            /* ── Main Grid ─────────────────────────────────────────────── */
            <div style={S.mainGrid}>
              {/* MAP PANEL */}
              <div
                style={{
                  ...S.mapPanel,
                  display: isMobile && isListView ? "none" : "block",
                }}
              >
                {/* Map top bar */}
                <div style={S.mapTopBar}>
                  <div style={S.mapLabel}>
                    <div style={S.liveDot} />
                    Live Map — {activeFilterConfig.icon} {activeFilterConfig.label}
                  </div>
                  {/* Mobile toggle */}
                  <div style={S.viewToggle}>
                    <button style={S.toggleBtn(!isListView)} onClick={() => setIsListView(false)}>Map</button>
                    <button style={S.toggleBtn(isListView)} onClick={() => setIsListView(true)}>List</button>
                  </div>
                </div>

                {/* Map loading overlay */}
                {facilitiesLoading && (
                  <div style={{
                    position: "absolute", inset: 0, zIndex: 20,
                    background: "rgba(15,23,42,0.65)", backdropFilter: "blur(4px)",
                    display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "16px",
                  }}>
                    <div style={S.bigSpinner} />
                    <div style={{ color: "#94a3b8", fontWeight: 600, fontSize: "0.95rem" }}>
                      Scanning {activeFilterConfig.label}…
                    </div>
                  </div>
                )}

                {mapsLoaded && userLocation && !mapsLoadError ? (
                  <GoogleMap
                    mapContainerStyle={MAP_CONTAINER_STYLE}
                    center={userLocation}
                    zoom={14}
                    onLoad={onMapLoad}
                    onUnmount={onMapUnmount}
                    options={{
                      styles: isDarkMode ? DARK_MAP_STYLE : [],
                      disableDefaultUI: false,
                      zoomControl: true,
                      mapTypeControl: false,
                      streetViewControl: false,
                      fullscreenControl: true,
                      clickableIcons: false,
                    }}
                  >
                    {/* User marker */}
                    <Marker
                      position={userLocation}
                      icon={{
                        url: `data:image/svg+xml,${userMarkerSvg}`,
                        scaledSize: new window.google.maps.Size(32, 32),
                        anchor: new window.google.maps.Point(16, 16),
                      }}
                      title="Your Location"
                      zIndex={1000}
                    />

                    {/* Facility markers */}
                    {facilities.map((facility) => (
                      facility.geometry?.lat && facility.geometry?.lng && (
                        <Marker
                          key={facility.id}
                          position={{ lat: facility.geometry.lat, lng: facility.geometry.lng }}
                          onClick={() => handleMarkerClick(facility)}
                          icon={{
                            url: `data:image/svg+xml,${getFacilityMarkerSvg(
                              activeFilterConfig.color,
                              selectedFacility?.id === facility.id
                            )}`,
                            scaledSize: new window.google.maps.Size(
                              selectedFacility?.id === facility.id ? 38 : 30,
                              selectedFacility?.id === facility.id ? 46 : 38
                            ),
                            anchor: new window.google.maps.Point(
                              selectedFacility?.id === facility.id ? 19 : 15,
                              selectedFacility?.id === facility.id ? 46 : 38
                            ),
                          }}
                          title={facility.name}
                          zIndex={selectedFacility?.id === facility.id ? 500 : 100}
                        />
                      )
                    ))}

                    {/* InfoWindow */}
                    {selectedFacility && selectedFacility.geometry?.lat && (
                      <InfoWindow
                        position={{ lat: selectedFacility.geometry.lat, lng: selectedFacility.geometry.lng }}
                        onCloseClick={() => setSelectedFacility(null)}
                        options={{ pixelOffset: new window.google.maps.Size(0, -40) }}
                      >
                        <div style={S.infoWinWrap}>
                          <div style={S.infoWinName}>{selectedFacility.name}</div>
                          <div style={S.infoWinAddr}>{selectedFacility.vicinity}</div>
                          <div style={{ marginBottom: "10px" }}>
                            <StarRating rating={selectedFacility.rating} />
                            {selectedFacility.user_ratings_total > 0 && (
                              <span style={{ color: "#6b7280", fontSize: "0.75rem", marginLeft: "6px" }}>
                                ({selectedFacility.user_ratings_total.toLocaleString()})
                              </span>
                            )}
                          </div>
                          <div style={S.infoWinMeta}>
                            {selectedFacility.open_now !== null && selectedFacility.open_now !== undefined && (
                              <span style={S.openBadge(selectedFacility.open_now)}>
                                {selectedFacility.open_now ? "● Open Now" : "● Closed"}
                              </span>
                            )}
                            <button
                              className="nav-btn"
                              style={S.navBtn}
                              onClick={() => openNavigation(selectedFacility)}
                            >
                              🧭 Navigate
                            </button>
                          </div>
                        </div>
                      </InfoWindow>
                    )}
                  </GoogleMap>
                ) : !mapsLoadError && (
                  <div style={{
                    width: "100%", height: "100%",
                    background: isDarkMode ? "#0d1a2d" : "#e8f4f8",
                    display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "16px",
                  }}>
                    <div style={S.bigSpinner} />
                    <div style={{ color: isDarkMode ? "#64748b" : "#94a3b8", fontSize: "0.9rem" }}>
                      Loading Google Maps…
                    </div>
                  </div>
                )}
              </div>

              {/* FACILITY LIST PANEL */}
              <div style={{
                ...S.listPanel,
                display: isMobile && !isListView ? "none" : "flex",
              }}>
                {/* Mobile list header with background — shows above the map area */}
                <div style={{
                  ...S.listHeader,
                  ...(isMobile ? {
                    position: "sticky", top: 0, zIndex: 5,
                    background: isDarkMode
                      ? "linear-gradient(180deg, #0f172a 80%, transparent 100%)"
                      : "linear-gradient(180deg, #f0f9ff 80%, transparent 100%)",
                    paddingTop: "4px", paddingBottom: "12px",
                    marginBottom: "8px",
                  } : {}),
                }}>
                  <span style={S.listTitle}>
                    {activeFilterConfig.icon}&nbsp; Nearby {activeFilterConfig.label}
                  </span>
                  <span style={S.countBadge}>
                    {facilitiesLoading ? "…" : `${facilities.length} found`}
                  </span>
                </div>

                <div style={S.listScroll}>
                  {facilitiesLoading ? (
                    Array(5).fill(0).map((_, i) => <SkeletonCard key={i} isDarkMode={isDarkMode} />)
                  ) : facilities.length === 0 ? (
                    <div style={S.emptyState}>
                      <div style={S.emptyIcon}>🏥</div>
                      <div style={S.emptyTitle}>No facilities found</div>
                      <div style={S.emptyText}>
                        Try a different filter or expand your search radius.
                      </div>
                    </div>
                  ) : (
                    facilities.map((facility, idx) => {
                      const isSelected = selectedFacility?.id === facility.id;
                      return (
                        <div
                          key={facility.id}
                          className="facility-card"
                          style={{
                            ...S.facilityCard(isSelected),
                            animation: `fadeInUp 0.5s ease-out ${idx * 0.06}s backwards`,
                          }}
                          onClick={() => {
                            handleMarkerClick(facility);
                            if (isMobile) setIsListView(false);
                          }}
                        >
                          {/* Glow bar on hover — needs own overflow-hidden wrapper */}
                          <div style={{
                            position: "absolute", top: 0, left: 0, right: 0, height: "3px",
                            borderRadius: "20px 20px 0 0", overflow: "hidden",
                          }}>
                            <div className="card-glow-bar" style={{ position: "relative", top: 0, left: 0, right: 0, borderRadius: 0 }} />
                          </div>

                          {/* Left accent stripe */}
                          <div style={S.cardAccent(activeFilterConfig)} />

                          {/* Rank number */}
                          <div style={S.cardRank(idx)}>{idx + 1}</div>

                          <div style={{ paddingLeft: "12px", paddingRight: "36px" }}>
                            {/* Category icon chip */}
                            <div style={S.cardIcon(activeFilterConfig)}>
                              {activeFilterConfig.icon}
                            </div>

                            {/* Name */}
                            <div style={S.cardName}>{facility.name}</div>

                            {/* Address */}
                            <div style={S.cardAddr}>📍 {facility.vicinity}</div>

                            {/* Features row — ratings + open badge */}
                            <div style={{
                              display: "flex", flexDirection: "column", gap: "8px",
                              marginBottom: "14px",
                            }}>
                              {/* Rating row */}
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                                <StarRating rating={facility.rating} />
                                {facility.user_ratings_total > 0 && (
                                  <span style={{
                                    fontSize: "0.72rem",
                                    color: isDarkMode ? "#6b7280" : "#94a3b8",
                                  }}>
                                    ({facility.user_ratings_total.toLocaleString()} reviews)
                                  </span>
                                )}
                              </div>

                              {/* Open status as feature item — matches Services checkmarks style */}
                              {facility.open_now !== null && facility.open_now !== undefined && (
                                <div style={{
                                  display: "flex", alignItems: "center", gap: "8px",
                                  fontSize: "0.82rem",
                                  color: isDarkMode ? "#d1d5db" : "#475569",
                                }}>
                                  <div style={{
                                    width: "20px", height: "20px", minWidth: "20px",
                                    borderRadius: "50%",
                                    background: facility.open_now
                                      ? "linear-gradient(135deg, #10b981, #059669)"
                                      : "linear-gradient(135deg, #ef4444, #dc2626)",
                                    display: "flex", alignItems: "center", justifyContent: "center",
                                    color: "#ffffff", fontSize: "0.65rem", fontWeight: "bold",
                                    flexShrink: 0,
                                    boxShadow: facility.open_now
                                      ? "0 4px 12px rgba(16,185,129,0.35)"
                                      : "0 4px 12px rgba(239,68,68,0.3)",
                                  }}>
                                    {facility.open_now ? "✓" : "✕"}
                                  </div>
                                  <span style={{ fontWeight: 500 }}>
                                    {facility.open_now ? "Open Now" : "Currently Closed"}
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* CTA button — matches Services ctaButton style */}
                            <button
                              className="nav-btn"
                              style={{
                                ...S.navBtn,
                                width: "100%", justifyContent: "center",
                                padding: "10px 16px", borderRadius: "12px",
                                fontSize: "0.85rem", fontWeight: 600,
                                textTransform: "none", letterSpacing: "0",
                              }}
                              onClick={(e) => { e.stopPropagation(); openNavigation(facility); }}
                            >
                              Get Directions &nbsp;→
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ── Footer note ──────────────────────────────────────────────── */}
          <div style={{
            marginTop: "28px", textAlign: "center",
            fontSize: "0.78rem",
            color: isDarkMode ? "#475569" : "#94a3b8",
            lineHeight: 1.5,
          }}>
            🔐 Location data is only used for this search and is never stored.
            Results powered by Google Places API. For emergencies, call <strong style={{ color: "#ef4444" }}>112</strong>.
          </div>
        </div>
      </div>
    </>
  );
}