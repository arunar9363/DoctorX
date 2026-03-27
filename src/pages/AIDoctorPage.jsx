import { useState, useRef, useEffect, useCallback } from "react";

// ─── Constants ────────────────────────────────────────────────────────────────
const API_BASE = import.meta.env.VITE_API_URL || "https://doctorx-backend-t1ic.onrender.com";

const EMERGENCY_CONFIG = {
  1: { label: "Non-Urgent", color: "#22c55e", bg: "rgba(34,197,94,0.1)", icon: "🟢", border: "rgba(34,197,94,0.25)" },
  2: { label: "Low", color: "#84cc16", bg: "rgba(132,204,22,0.1)", icon: "🟡", border: "rgba(132,204,22,0.25)" },
  3: { label: "Moderate", color: "#f59e0b", bg: "rgba(245,158,11,0.1)", icon: "🟠", border: "rgba(245,158,11,0.25)" },
  4: { label: "High", color: "#ef4444", bg: "rgba(239,68,68,0.1)", icon: "🔴", border: "rgba(239,68,68,0.25)" },
  5: { label: "Critical", color: "#dc2626", bg: "rgba(220,38,38,0.12)", icon: "🚨", border: "rgba(220,38,38,0.3)" },
};

const TYPING_SPEED = 14;

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSR() { return window.SpeechRecognition || window.webkitSpeechRecognition || null; }
function stopTTS() { window.speechSynthesis?.cancel(); }

function ttsSpeak(text, onEnd) {
  if (!window.speechSynthesis) { onEnd?.(); return; }
  stopTTS();
  const utt = new SpeechSynthesisUtterance(text);
  utt.rate = 0.92; utt.pitch = 1.05; utt.volume = 1;
  const pickVoice = () => {
    const vs = window.speechSynthesis.getVoices();
    const v = vs.find(v => v.lang.startsWith("en") && /natural|premium|google/i.test(v.name))
      || vs.find(v => v.lang.startsWith("en")) || vs[0];
    if (v) utt.voice = v;
  };
  pickVoice();
  if (!window.speechSynthesis.getVoices().length)
    window.speechSynthesis.onvoiceschanged = pickVoice;
  utt.onend = () => onEnd?.();
  utt.onerror = () => onEnd?.();
  window.speechSynthesis.speak(utt);
}

// ─── DoctorAvatar ─────────────────────────────────────────────────────────────
function DoctorAvatar({ size = 56, glow = false, style: sx = {} }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid rgba(13,157,184,0.35)", boxSizing: "border-box", filter: glow ? "drop-shadow(0 0 10px rgba(13,157,184,0.6))" : "none", transition: "filter 0.4s", ...sx }}>
      <img src="/assets/aidoctor.jpeg" alt="Doctorxcare Assistance"
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        onError={e => {
          e.target.style.display = "none";
          e.target.parentNode.innerHTML = `<div style="width:100%;height:100%;background:linear-gradient(135deg,#0d9db8,#3b82f6);display:flex;align-items:center;justify-content:center;font-size:${Math.round(size * 0.45)}px">🩺</div>`;
        }} />
    </div>
  );
}

// ─── TypewriterText ───────────────────────────────────────────────────────────
function TypewriterText({ text, onDone }) {
  const [shown, setShown] = useState("");
  const idxRef = useRef(0);
  const doneRef = useRef(onDone);
  useEffect(() => { doneRef.current = onDone; }, [onDone]);

  useEffect(() => {
    setShown(""); idxRef.current = 0;
    if (!text) { doneRef.current?.(); return; }
    const iv = setInterval(() => {
      idxRef.current += 1;
      setShown(text.slice(0, idxRef.current));
      if (idxRef.current >= text.length) { clearInterval(iv); doneRef.current?.(); }
    }, TYPING_SPEED);
    return () => clearInterval(iv);
  }, [text]);

  return <span>{shown}</span>;
}

// ─── ThinkingDots ─────────────────────────────────────────────────────────────
function ThinkingDots() {
  return (
    <span style={{ display: "flex", gap: 4, alignItems: "center", padding: "2px 0" }}>
      {[0, 1, 2].map(i => (
        <span key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: "#0d9db8", display: "inline-block", animation: `blink 1.2s ${i * 0.2}s infinite` }} />
      ))}
    </span>
  );
}

// ─── AssessmentCard ───────────────────────────────────────────────────────────
function AssessmentCard({ data, isDark, c, onReset }) {
  const level = data.emergency_level || 3;
  const cfg = EMERGENCY_CONFIG[level];
  return (
    <div style={{ border: "1px solid rgba(13,157,184,0.2)", borderRadius: 16, padding: 18, marginTop: 10, animation: "slideUp 0.4s ease", background: isDark ? "rgba(15,23,42,0.95)" : "#ffffff" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, flexWrap: "wrap", gap: 4 }}>
        <span style={{ fontSize: 14, fontWeight: 700, color: c.title }}>🩺 Clinical Assessment</span>
        <span style={{ fontSize: 10, color: c.muted }}>AI-generated · Confirm with physician</span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", padding: "11px 14px", borderRadius: 11, border: `1px solid ${cfg.border}`, background: cfg.bg, marginBottom: 12 }}>
        <span style={{ fontSize: 22 }}>{cfg.icon}</span>
        <div>
          <div style={{ fontWeight: 700, color: cfg.color, fontSize: 13 }}>Level {level} — {cfg.label}</div>
          <div style={{ color: c.muted, fontSize: 11, marginTop: 2 }}>Emergency classification</div>
        </div>
      </div>
      {data.summary && <p style={{ color: c.muted, fontSize: 12, lineHeight: 1.7, margin: "0 0 12px" }}>{data.summary}</p>}
      {data.possible_conditions?.length > 0 && (
        <ASection title="🔬 Possible Conditions" c={c}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
            {data.possible_conditions.map((cond, i) => (
              <span key={i} style={{ border: "1px solid", borderRadius: 999, padding: "2px 9px", fontSize: 10, background: i === 0 ? "rgba(13,157,184,0.12)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)", color: i === 0 ? "#0d9db8" : c.muted, borderColor: i === 0 ? "rgba(13,157,184,0.3)" : c.border }}>{cond}</span>
            ))}
          </div>
        </ASection>
      )}
      {data.immediate_actions?.length > 0 && (
        <ASection title="⚡ Immediate Actions" c={c}>
          <ul style={{ margin: "0 0 0 13px", padding: 0 }}>
            {data.immediate_actions.map((a, i) => <li key={i} style={{ fontSize: 11, lineHeight: 1.7, marginBottom: 2, color: c.muted }}>{a}</li>)}
          </ul>
        </ASection>
      )}
      {data.lifestyle_advice?.length > 0 && (
        <ASection title="🌿 Lifestyle Advice" c={c}>
          <ul style={{ margin: "0 0 0 13px", padding: 0 }}>
            {data.lifestyle_advice.map((a, i) => <li key={i} style={{ fontSize: 11, lineHeight: 1.7, marginBottom: 2, color: c.muted }}>{a}</li>)}
          </ul>
        </ASection>
      )}
      {data.red_flags?.length > 0 && (
        <ASection title="⚠️ Red Flags" c={c}>
          <ul style={{ margin: "0 0 0 13px", padding: 0 }}>
            {data.red_flags.map((f, i) => <li key={i} style={{ fontSize: 11, lineHeight: 1.7, marginBottom: 2, color: "#fca5a5" }}>{f}</li>)}
          </ul>
        </ASection>
      )}
      {data.specialist_referral && data.specialist_referral !== "None" && (
        <ASection title="🏥 Recommended Specialist" c={c}>
          <span style={{ border: "1px solid rgba(13,157,184,0.3)", borderRadius: 999, padding: "2px 9px", fontSize: 10, background: "rgba(13,157,184,0.12)", color: "#0d9db8" }}>{data.specialist_referral}</span>
        </ASection>
      )}
      <p style={{ marginTop: 12, padding: "8px 11px", background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, color: "#fbbf24", fontSize: 10 }}>
        ⚠️ AI-assisted only. Consult a licensed physician for diagnosis and treatment.
      </p>
      <button style={{ marginTop: 12, display: "inline-flex", alignItems: "center", color: "#fff", border: "none", borderRadius: 50, padding: "11px 24px", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "linear-gradient(135deg,#0d9db8,#3b82f6)", boxShadow: "0 4px 14px rgba(13,157,184,0.3)" }} onClick={onReset}>
        Start New Consultation →
      </button>
    </div>
  );
}

function ASection({ title, children, c }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <div style={{ fontWeight: 600, color: c.text, fontSize: 11, marginBottom: 5 }}>{title}</div>
      {children}
    </div>
  );
}

// ─── ConvRow ──────────────────────────────────────────────────────────────────
function ConvRow({ role, text, extra, isNew, isDark, c, onTypingDone, onReset }) {
  const isDoc = role === "doctor";
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, flexDirection: isDoc ? "row" : "row-reverse" }}>
      {isDoc ? <DoctorAvatar size={24} /> : <span style={{ fontSize: 20, flexShrink: 0 }}>🙋</span>}
      <div style={{ maxWidth: extra?.type === "assessment" ? "92%" : "72%", animation: "slideUp 0.25s ease" }}>
        <div style={{ padding: "11px 15px", borderRadius: 15, border: "1px solid", background: isDoc ? (isDark ? "rgba(13,157,184,0.08)" : "rgba(13,157,184,0.06)") : (isDark ? "rgba(99,102,241,0.12)" : "rgba(99,102,241,0.08)"), borderColor: isDoc ? "rgba(13,157,184,0.18)" : "rgba(99,102,241,0.2)", borderBottomLeftRadius: isDoc ? 4 : 15, borderBottomRightRadius: isDoc ? 15 : 4 }}>
          <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.8px", textTransform: "uppercase", marginBottom: 4, color: isDoc ? "#0d9db8" : "#6366f1" }}>
            {isDoc ? "Doctorxcare Assistance" : "You"}
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.7, color: c.text }}>
            {isDoc && isNew ? <TypewriterText text={text} onDone={onTypingDone} /> : text}
          </div>
        </div>
        {extra?.type === "assessment" && extra?.data && (
          <AssessmentCard data={extra.data} isDark={isDark} c={c} onReset={onReset} />
        )}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  MAIN PAGE
// ═══════════════════════════════════════════════════════
export default function AIDoctorPage() {
  const [isDark, setIsDark] = useState(false);
  const [phase, setPhase] = useState("idle");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [muted, setMuted] = useState(false);
  const [newMsgIdx, setNewMsgIdx] = useState(null);
  const [micSupported] = useState(() => !!getSR());
  const [interimText, setInterimText] = useState("");
  const [micState, setMicState] = useState("off");
  const [isHovered, setIsHovered] = useState(false);
  const [navHeight, setNavHeight] = useState(64);
  const [turnDisplay, setTurnDisplay] = useState(0);

  // ── All mutable state lives in refs so mic callbacks never go stale ──
  const recogRef = useRef(null);
  const finalRef = useRef("");
  const shouldListenRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isMutedRef = useRef(false);
  const historyRef = useRef([]);
  const turnRef = useRef(0);
  const phaseRef = useRef("idle");
  const bottomRef = useRef(null);

  // Keep mutable refs in sync
  useEffect(() => { isMutedRef.current = muted; }, [muted]);

  // ── Navbar ──
  useEffect(() => {
    const detect = () => {
      for (const sel of ["nav", "header.navbar", ".navbar", "[class*='Navbar']", "[class*='navbar']", "header"]) {
        const el = document.querySelector(sel);
        if (el && el.offsetHeight > 10) { setNavHeight(el.offsetHeight); break; }
      }
    };
    detect(); setTimeout(detect, 500);
    window.addEventListener("resize", detect);
    return () => window.removeEventListener("resize", detect);
  }, []);

  // ── Dark mode ──
  useEffect(() => {
    const check = () => setIsDark(document.documentElement.getAttribute("data-theme") === "dark");
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => obs.disconnect();
  }, []);

  // ── Auto scroll ──
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading, interimText]);

  // ── Add message ──
  const addMessage = useCallback((role, text, extra = null) => {
    setMessages(prev => {
      const next = [...prev, { role, text, extra }];
      setNewMsgIdx(next.length - 1);
      return next;
    });
  }, []);

  // ══════════════════════════════════════════
  //  MIC ENGINE — pure refs, no stale closures
  // ══════════════════════════════════════════

  // Forward ref for mutual recursion
  const handleVoiceRef = useRef(null);

  // startMic: fire-and-forget, reads everything from refs
  const startMic = useCallback(() => {
    const SR = getSR();
    if (!SR || !shouldListenRef.current || isLoadingRef.current || isSpeakingRef.current) return;

    if (recogRef.current) {
      try { recogRef.current.abort(); } catch (e) { void e; }
      recogRef.current = null;
    }
    finalRef.current = "";
    setInterimText("");

    const r = new SR();
    r.lang = "en-US";
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;

    r.onstart = () => setMicState("listening");

    r.onresult = (evt) => {
      let interim = "";
      for (let i = evt.resultIndex; i < evt.results.length; i++) {
        const t = evt.results[i][0].transcript;
        if (evt.results[i].isFinal) finalRef.current += (finalRef.current ? " " : "") + t.trim();
        else interim += t;
      }
      setInterimText(finalRef.current + (interim ? " " + interim : ""));
    };

    r.onerror = (evt) => {
      if (evt.error === "not-allowed" || evt.error === "service-not-allowed") {
        shouldListenRef.current = false;
        setMicState("off");
      } else if (shouldListenRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
        setTimeout(() => startMic(), 700);
      }
    };

    r.onend = () => {
      const final = finalRef.current.trim();
      finalRef.current = "";
      setInterimText("");
      if (final && shouldListenRef.current && !isLoadingRef.current) {
        handleVoiceRef.current?.(final);
      } else if (shouldListenRef.current && !isLoadingRef.current && !isSpeakingRef.current) {
        setTimeout(() => startMic(), 400);
      }
    };

    recogRef.current = r;
    try { r.start(); } catch (e) { console.warn("mic:", e); }
  }, []); // zero state deps — pure refs

  // afterSpeak: called when TTS finishes
  const afterSpeak = useCallback(() => {
    setSpeaking(false); isSpeakingRef.current = false;
    if (shouldListenRef.current && !isLoadingRef.current) {
      setMicState("listening");
      setTimeout(() => startMic(), 300);
    } else {
      setMicState("off");
    }
  }, [startMic]);

  // speakDoctor: play TTS then restart mic
  const speakDoctor = useCallback((text) => {
    if (isMutedRef.current) {
      if (shouldListenRef.current && !isLoadingRef.current) setTimeout(() => startMic(), 300);
      return;
    }
    setSpeaking(true); isSpeakingRef.current = true; setMicState("speaking");
    ttsSpeak(text, afterSpeak);
  }, [afterSpeak, startMic]);

  // Called when typewriter animation finishes for a doctor message
  const onTypingDone = useCallback((text) => {
    speakDoctor(text);
  }, [speakDoctor]);

  // handleVoiceInput: send user speech to API
  const handleVoiceInput = useCallback(async (msg) => {
    if (!msg) return;
    addMessage("patient", msg);
    setLoading(true); isLoadingRef.current = true;
    setMicState("processing"); stopTTS();

    try {
      const res = await fetch(`${API_BASE}/api/ai-doctor/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patient_message: msg,
          history: historyRef.current,
          turn: turnRef.current,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.detail || "Response failed");

      historyRef.current = data.history;
      turnRef.current = data.turn;
      setTurnDisplay(data.turn);

      if (data.assessment_ready) {
        const summary = data.response?.summary || "Your assessment is ready. Please review the report below.";
        addMessage("doctor", summary, { type: "assessment", data: data.response });
        setPhase("done"); phaseRef.current = "done";
        shouldListenRef.current = false;
      } else {
        const q = data.response?.question || "Can you tell me more?";
        const em = data.response?.empathy_note || "";
        addMessage("doctor", em ? `${em} ${q}` : q);
      }
    } catch (err) {
      addMessage("doctor", `Sorry, something went wrong: ${err.message}`);
      if (shouldListenRef.current) setTimeout(() => startMic(), 800);
    } finally {
      setLoading(false); isLoadingRef.current = false;
    }
  }, [addMessage, startMic]);

  handleVoiceRef.current = handleVoiceInput;

  // stopMic: kill mic permanently
  const stopMic = useCallback(() => {
    shouldListenRef.current = false;
    if (recogRef.current) {
      try { recogRef.current.abort(); } catch (e) { void e; }
      recogRef.current = null;
    }
    setMicState("off"); setInterimText("");
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      shouldListenRef.current = false;
      stopTTS();
      if (recogRef.current) { try { recogRef.current.abort(); } catch (e) { void e; } }
    };
  }, []);

  // ── Start consultation ──
  const startConsultation = async () => {
    setPhase("consulting"); phaseRef.current = "consulting";
    setMessages([]); historyRef.current = [];
    setTurnDisplay(0); turnRef.current = 0;
    setLoading(true); isLoadingRef.current = true;

    try {
      const res = await fetch(`${API_BASE}/api/ai-doctor/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patient_name: "Patient" }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.detail || "Start failed");

      historyRef.current = data.history;
      turnRef.current = data.turn;
      setTurnDisplay(data.turn);
      addMessage("doctor", data.response?.question || "Hello! Which language do you prefer — English or Hindi (हिंदी)?");
      // Enable mic — TypewriterText will call onTypingDone → speakDoctor → afterSpeak → startMic
      shouldListenRef.current = true;
    } catch (err) {
      setPhase("error");
      addMessage("doctor", `Connection error: ${err.message}`);
    } finally {
      setLoading(false); isLoadingRef.current = false;
    }
  };

  const reset = () => {
    stopTTS(); stopMic();
    setPhase("idle"); phaseRef.current = "idle";
    setMessages([]); historyRef.current = [];
    setTurnDisplay(0); turnRef.current = 0;
    setSpeaking(false); isSpeakingRef.current = false;
    setLoading(false); isLoadingRef.current = false;
    setNewMsgIdx(null);
  };

  const c = isDark ? DARK : LIGHT;

  return (
    <div style={{ minHeight: "100vh", background: c.pageBg, fontFamily: "'Inter','Segoe UI',system-ui,sans-serif", paddingTop: navHeight + 16, paddingBottom: 48, paddingLeft: 12, paddingRight: 12, position: "relative", overflowX: "hidden" }}>
      <div style={{ position: "fixed", top: "-20%", right: "-10%", width: 600, height: 600, borderRadius: "50%", background: c.blob1, pointerEvents: "none", zIndex: 0 }} />
      <div style={{ position: "fixed", bottom: "-20%", left: "-10%", width: 500, height: 500, borderRadius: "50%", background: c.blob2, pointerEvents: "none", zIndex: 0 }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <header style={{ display: "flex", alignItems: "center", justifyContent: "space-between", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: c.glass, border: `1px solid ${c.border}`, borderRadius: 16, padding: "10px 16px", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, overflow: "hidden", flexShrink: 0 }}>
              <DoctorAvatar size={40} style={{ border: "none" }} />
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: c.title }}>Doctorxcare Assistance</h1>
              <p style={{ margin: 0, fontSize: 10, color: c.muted, marginTop: 1 }}>AI Health Consultation · Clinical Grade · Confidential</p>
            </div>
          </div>
          {phase !== "idle" && (
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
              <button style={{ border: `1px solid ${c.border}`, borderRadius: 50, padding: "6px 14px", cursor: "pointer", fontSize: 11, fontWeight: 500, background: c.pillBg, color: c.muted }}
                onClick={() => setMuted(m => { if (!m) stopTTS(); return !m; })}>
                {muted ? "🔇 Muted" : "🔊 Audio"}
              </button>
              <button style={{ border: "1px solid rgba(239,68,68,0.2)", borderRadius: 50, padding: "6px 14px", cursor: "pointer", fontSize: 11, fontWeight: 500, background: "rgba(239,68,68,0.08)", color: "#ef4444" }} onClick={reset}>
                ✕ End
              </button>
            </div>
          )}
        </header>

        {/* ── IDLE ── */}
        {phase === "idle" && (
          <div style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: c.glass, border: `1px solid ${c.border}`, borderRadius: 20, padding: "28px 20px" }}>
            <div style={{ display: "flex", gap: 36, alignItems: "center", marginBottom: 32, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, minWidth: 120 }}>
                <div style={{ position: "relative", width: 130, height: 130, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <div style={{ width: 96, height: 96, borderRadius: "50%", overflow: "hidden", zIndex: 2, boxShadow: "0 8px 28px rgba(13,157,184,0.4)" }}>
                    <DoctorAvatar size={96} style={{ border: "none" }} />
                  </div>
                  {[0, 1, 2].map(i => (
                    <div key={i} style={{ position: "absolute", width: `${100 + i * 30}%`, height: `${100 + i * 30}%`, borderRadius: "50%", border: "1px solid rgba(13,157,184,0.25)", left: `${-i * 15}%`, top: `${-i * 15}%`, animation: `expand 3s ease-out ${i}s infinite` }} />
                  ))}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 3, height: 30 }}>
                  {[3, 5, 8, 11, 8, 5, 3, 6, 9, 10, 7, 4, 6, 8, 10, 7, 4].map((h, i) => (
                    <div key={i} style={{ width: 3, height: h * 2.2, borderRadius: 2, background: "linear-gradient(180deg,#0d9db8,#3b82f6)", opacity: 0.4 }} />
                  ))}
                </div>
              </div>

              <div style={{ flex: 1, minWidth: 220 }}>
                <span style={{ display: "inline-block", padding: "5px 14px", background: isDark ? "rgba(13,157,184,0.15)" : "rgba(13,157,184,0.1)", border: "1px solid rgba(13,157,184,0.3)", borderRadius: 50, fontSize: "0.68rem", fontWeight: 700, letterSpacing: "1.2px", color: "#0d9db8", marginBottom: 12 }}>
                  AI-POWERED CONSULTATION
                </span>
                <h2 style={{ fontSize: "clamp(1.3rem,3vw,2.3rem)", fontWeight: 800, margin: "0 0 10px", lineHeight: 1.25, fontFamily: "'Merriweather',Georgia,serif", color: c.title }}>
                  Your Personal{" "}
                  <span style={{ background: "linear-gradient(135deg,#0d9db8,#3b82f6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>Health Intelligence</span>{" "}
                  Platform
                </h2>
                <p style={{ fontSize: 13, lineHeight: 1.7, margin: "0 0 18px", color: c.muted, maxWidth: 500 }}>
                  Speak naturally with Doctorxcare Assistance — no typing, no forms. Clinical-grade AI with emergency triage, differential diagnosis, and personalised next steps.
                </p>
                <div style={{ display: "flex", gap: 15, flexWrap: "wrap", marginBottom: 20 }}>
                  {[["", "Voice-First", "Just speak"], ["", "95% Accuracy", "Clinical AI"], ["", "<2 Min", "Fast"], ["", "Private", "Secure"]].map(([icon, num, label]) => (
                    <div key={num} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "8px 13px", borderRadius: 12, background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", border: `1px solid ${c.border}`, minWidth: 72 }}>
                      <span style={{ fontSize: 16 }}>{icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: c.title }}>{num}</span>
                      <span style={{ fontSize: 10, fontWeight: 500, color: c.muted, textAlign: "center" }}>{label}</span>
                    </div>
                  ))}
                </div>
                <button
                  style={{ display: "inline-flex", alignItems: "center", color: "#fff", border: "none", borderRadius: 50, padding: "13px 30px", fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.3s ease", background: isHovered ? "linear-gradient(135deg,#3b82f6,#0d9db8)" : "linear-gradient(135deg,#0d9db8,#3b82f6)", transform: isHovered ? "translateY(-2px) scale(1.02)" : "none", boxShadow: isHovered ? "0 10px 28px rgba(13,157,184,0.45)" : "0 6px 20px rgba(13,157,184,0.3)" }}
                  onClick={startConsultation}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  Begin Consultation
                  <span style={{ marginLeft: 8, transition: "transform 0.3s", transform: isHovered ? "translateX(4px)" : "none" }}>→</span>
                </button>
                <p style={{ fontSize: 10, marginTop: 10, color: c.subtle }}>For emergencies call 112 immediately. AI does not replace a licensed physician.</p>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(170px,1fr))", gap: 10 }}>
              {[
                { icon: "", title: "Always-On Voice", desc: "No buttons — just speak naturally" },
                { icon: "", title: "Differential Diagnosis", desc: "Millions of clinical cases analysed" },
                { icon: "", title: "Emergency Triage", desc: "Instant urgency classification" },
                { icon: "", title: "Action Plan", desc: "Personalised next steps & referrals" },
              ].map((f, i) => (
                <div key={i} style={{ padding: "14px 16px", borderRadius: 13, border: `1px solid ${c.border}`, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", gap: 4 }}>
                  <span style={{ fontSize: 18, marginBottom: 2 }}>{f.icon}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, color: c.title }}>{f.title}</span>
                  <span style={{ fontSize: 10, lineHeight: 1.6, color: c.muted }}>{f.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── CONSULTATION ── */}
        {phase !== "idle" && (
          <div className="consult-grid" style={{ display: "grid", gridTemplateColumns: "256px 1fr", gap: 14, alignItems: "start" }}>

            {/* Doctor panel */}
            <div style={{ backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", background: c.glass, border: `1px solid ${c.border}`, borderRadius: 18, overflow: "hidden", position: "sticky", top: navHeight + 8 }}>
              <div style={{ padding: 18, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
                <div style={{ position: "relative" }}>
                  <div style={{ width: 82, height: 82, borderRadius: "50%", overflow: "hidden", boxShadow: speaking ? "0 0 0 6px rgba(13,157,184,0.2),0 0 0 12px rgba(13,157,184,0.07)" : "0 6px 24px rgba(13,157,184,0.3)", transition: "box-shadow 0.4s" }}>
                    <DoctorAvatar size={82} glow={speaking} style={{ border: "none" }} />
                  </div>
                  {speaking && <div style={{ position: "absolute", inset: -5, borderRadius: "50%", border: "2px solid rgba(13,157,184,0.6)", animation: "pingRing 1.2s ease-in-out infinite" }} />}
                </div>

                <div style={{ fontSize: 14, fontWeight: 700, color: c.title }}>Doctorxcare Assistance</div>
                <div style={{ fontSize: 11, fontWeight: 500, color: "#0d9db8" }}>AI Physician · General Practice</div>

                {/* Waveform */}
                <div style={{ display: "flex", alignItems: "center", gap: 2, height: 34, width: "100%" }}>
                  {Array.from({ length: 18 }).map((_, i) => (
                    <div key={i} style={{ flex: 1, borderRadius: 2, minHeight: 4, height: speaking ? `${10 + Math.abs(Math.sin(Date.now() / 300 + i * 0.8)) * 20}px` : loading ? `${4 + (i % 3) * 4}px` : "4px", background: speaking ? "linear-gradient(180deg,#0d9db8,#3b82f6)" : loading ? "rgba(13,157,184,0.5)" : isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", animation: (speaking || loading) ? `wave ${0.8 + i * 0.06}s ease-in-out infinite alternate` : "none", transition: "height 0.15s ease, background 0.3s" }} />
                  ))}
                </div>

                {/* Status */}
                <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "6px 14px", borderRadius: 50, border: `1px solid ${speaking ? "rgba(13,157,184,0.3)" : c.border}`, background: speaking ? "rgba(13,157,184,0.1)" : loading ? "rgba(99,102,241,0.08)" : micState === "listening" ? "rgba(34,197,94,0.08)" : isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)", width: "100%", justifyContent: "center" }}>
                  <div style={{ width: 6, height: 6, borderRadius: "50%", flexShrink: 0, background: speaking ? "#0d9db8" : loading ? "#6366f1" : micState === "listening" ? "#22c55e" : isDark ? "#475569" : "#cbd5e1", animation: (speaking || loading || micState === "listening") ? "blink 1.2s ease-in-out infinite" : "none" }} />
                  <span style={{ fontSize: 11, fontWeight: 600, color: speaking ? "#0d9db8" : loading ? "#6366f1" : micState === "listening" ? "#22c55e" : c.muted }}>
                    {speaking ? "Speaking…" : loading ? "Thinking…" : micState === "listening" ? "Listening…" : micState === "processing" ? "Processing…" : "Standby"}
                  </span>
                </div>

                {/* Progress */}
                {phase === "consulting" && (
                  <div style={{ width: "100%", padding: 11, borderRadius: 10, border: `1px solid ${c.border}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 10, color: c.muted, fontWeight: 500 }}>Progress</span>
                      <span style={{ fontSize: 10, color: "#0d9db8", fontWeight: 700 }}>{Math.round(Math.min((turnDisplay / 7) * 100, 100))}%</span>
                    </div>
                    <div style={{ height: 4, borderRadius: 999, overflow: "hidden", background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
                      <div style={{ height: "100%", background: "linear-gradient(90deg,#0d9db8,#3b82f6)", borderRadius: 999, width: `${Math.min((turnDisplay / 7) * 100, 100)}%`, transition: "width 0.5s ease" }} />
                    </div>
                    <div style={{ fontSize: 10, color: c.subtle, marginTop: 4 }}>Question {Math.min(turnDisplay + 1, 7)} of ~7</div>
                  </div>
                )}

                {/* Mic orb */}
                {(phase === "consulting" || phase === "done") && (
                  !micSupported ? (
                    <div style={{ color: "#fbbf24", fontSize: 10, textAlign: "center", padding: "9px 12px", background: "rgba(245,158,11,0.08)", borderRadius: 9, border: "1px solid rgba(245,158,11,0.2)", width: "100%" }}>
                      ⚠️ Voice not supported. Use Chrome/Edge.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 7, width: "100%" }}>
                      <div style={{ position: "relative", width: 48, height: 48, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.3s", background: micState === "listening" ? "linear-gradient(135deg,#0d9db8,#0284c7)" : micState === "processing" ? "linear-gradient(135deg,#6366f1,#4f46e5)" : micState === "speaking" ? "linear-gradient(135deg,#0d9db8,#3b82f6)" : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)", boxShadow: micState === "listening" ? "0 0 20px rgba(13,157,184,0.5)" : "none" }}>
                        {micState === "listening" && (
                          <>
                            <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid rgba(13,157,184,0.5)", animation: "ripple 2s ease-out infinite" }} />
                            <span style={{ position: "absolute", width: "100%", height: "100%", borderRadius: "50%", border: "2px solid rgba(13,157,184,0.25)", animation: "ripple 2s ease-out 0.6s infinite" }} />
                          </>
                        )}
                        <span style={{ fontSize: 17, position: "relative", zIndex: 2 }}>
                          {micState === "processing" ? "⏳" : micState === "speaking" ? "🔊" : "🎙️"}
                        </span>
                      </div>
                      <span style={{ fontSize: 10, color: c.muted, textAlign: "center", lineHeight: 1.4 }}>
                        {micState === "listening" ? "Listening… speak now"
                          : micState === "processing" ? "Processing your reply"
                            : micState === "speaking" ? "Doctorxcare Assistance is speaking"
                              : "Microphone ready"}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>

            {/* Chat panel */}
            <div style={{ backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)", background: isDark ? "rgba(255,255,255,0.015)" : "rgba(255,255,255,0.75)", border: `1px solid ${c.border}`, borderRadius: 18, overflow: "hidden", display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 18px 12px", borderBottom: `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}`, flexWrap: "wrap", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: c.title }}>Consultation</span>
                <span style={{ fontSize: 10, color: c.muted }}>AI-assisted · Private · Not a substitute for real care</span>
              </div>

              <div style={{ padding: "14px 16px", display: "flex", flexDirection: "column", gap: 14, minHeight: 300, maxHeight: "62vh", overflowY: "auto" }}>
                {messages.length === 0 && !loading && (
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 48, opacity: 0.5 }}>
                    <span style={{ fontSize: 34, marginBottom: 8, display: "block" }}>💬</span>
                    <span style={{ color: c.muted, fontSize: 12 }}>Consultation starting…</span>
                  </div>
                )}

                {messages.map((m, i) => (
                  <ConvRow
                    key={i}
                    role={m.role}
                    text={m.text}
                    extra={m.extra}
                    isNew={i === newMsgIdx && m.role === "doctor"}
                    isDark={isDark}
                    c={c}
                    onTypingDone={() => onTypingDone(m.text)}
                    onReset={reset}
                  />
                ))}

                {loading && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                    <DoctorAvatar size={24} />
                    <div style={{ padding: "10px 14px", borderRadius: 14, border: "1px solid rgba(13,157,184,0.15)", background: isDark ? "rgba(13,157,184,0.08)" : "rgba(13,157,184,0.06)" }}>
                      <ThinkingDots />
                    </div>
                  </div>
                )}

                {micState === "listening" && interimText && (
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 8, justifyContent: "flex-end" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 13px", borderRadius: 14, border: "1px dashed rgba(99,102,241,0.2)", background: isDark ? "rgba(99,102,241,0.08)" : "rgba(99,102,241,0.06)", maxWidth: "75%" }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#ef4444", flexShrink: 0, animation: "blink 1s infinite", display: "inline-block" }} />
                      <span style={{ color: c.muted, fontSize: 12, fontStyle: "italic" }}>{interimText}</span>
                    </div>
                  </div>
                )}

                <div ref={bottomRef} />
              </div>
            </div>
          </div>
        )}
      </div>
      <style>{CSS}</style>
    </div>
  );
}

// ─── Themes ───────────────────────────────────────────────────────────────────
const DARK = {
  pageBg: "linear-gradient(135deg,#0f172a 0%,#1e293b 25%,#0f172a 50%,#1e1b4b 75%,#0f172a 100%)",
  blob1: "radial-gradient(circle,rgba(13,157,184,0.08) 0%,transparent 70%)",
  blob2: "radial-gradient(circle,rgba(99,102,241,0.07) 0%,transparent 70%)",
  glass: "rgba(255,255,255,0.04)", border: "rgba(255,255,255,0.08)",
  title: "#f1f5f9", text: "#cbd5e1", muted: "#94a3b8", subtle: "#475569", pillBg: "rgba(255,255,255,0.06)",
};
const LIGHT = {
  pageBg: "linear-gradient(135deg,#ffffff 0%,#f0f9ff 25%,#e0f2fe 50%,#f0f9ff 75%,#ffffff 100%)",
  blob1: "radial-gradient(circle,rgba(13,157,184,0.1) 0%,transparent 70%)",
  blob2: "radial-gradient(circle,rgba(59,130,246,0.08) 0%,transparent 70%)",
  glass: "rgba(255,255,255,0.85)", border: "rgba(0,0,0,0.08)",
  title: "#0f172a", text: "#334155", muted: "#64748b", subtle: "#94a3b8", pillBg: "rgba(0,0,0,0.04)",
};

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;500;600;700;800&display=swap');
@keyframes slideUp  { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
@keyframes expand   { 0%{transform:scale(1);opacity:0.6} 100%{transform:scale(1.6);opacity:0} }
@keyframes pingRing { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.12);opacity:0.6} }
@keyframes ripple   { 0%{transform:scale(1);opacity:1} 100%{transform:scale(2.6);opacity:0} }
@keyframes blink    { 0%,80%,100%{opacity:0.2} 40%{opacity:1} }
@keyframes wave     { from{transform:scaleY(0.5)} to{transform:scaleY(1.5)} }
* { box-sizing: border-box; }
button:hover { opacity: 0.88; }
@media (max-width:700px) {
  .consult-grid { grid-template-columns: 1fr !important; }
  .consult-grid > div:first-child { position: static !important; }
}
`;