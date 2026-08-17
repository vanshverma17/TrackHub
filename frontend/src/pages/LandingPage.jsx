import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger, useGSAP);

import {
  Activity,
  BarChart3,
  ChevronRight,
  Clock,
  Grid3X3,
  Menu,
  Network,
  Play,
  X,
  Zap,
} from "lucide-react";
import logo from "../assets/logotrack.png";

/* ─── Animation Helpers ─── */
function FadeInWhenVisible({ children, delay = 0, direction = "up" }) {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.fromTo(
      ref.current,
      {
        opacity: 0,
        y: direction === "up" ? 40 : direction === "down" ? -40 : 0,
        x: direction === "left" ? 40 : direction === "right" ? -40 : 0,
      },
      {
        opacity: 1,
        y: 0,
        x: 0,
        duration: 0.8,
        delay: delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      }
    );
  }, { scope: ref });

  return (
    <div ref={ref}>
      {children}
    </div>
  );
}

/* ─── Dashboard Mockup ─── */
function DashboardMockup() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Glow behind */}
      <div
        className="absolute inset-0 rounded-2xl blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 50%, #00D2FF 0%, transparent 70%)" }}
      />
      {/* Browser chrome */}
      <div
        className="relative rounded-2xl overflow-hidden shadow-2xl border"
        style={{ background: "#0F172A", borderColor: "#1E293B" }}
      >
        {/* Title bar */}
        <div
          className="flex items-center gap-2 px-4 py-3 border-b"
          style={{ background: "#0B1220", borderColor: "#1E293B" }}
        >
          <div className="w-3 h-3 rounded-full bg-red-500 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-yellow-400 opacity-80" />
          <div className="w-3 h-3 rounded-full bg-green-500 opacity-80" />
          <div
            className="flex-1 mx-4 rounded-full px-3 py-1 text-xs text-center"
            style={{ background: "#1E293B", color: "#8A909E" }}
          >
            app.trackhub.io/dashboard
          </div>
        </div>

        {/* Dashboard content */}
        <div className="flex" style={{ minHeight: 340 }}>
          {/* Sidebar */}
          <div
            className="w-44 flex-shrink-0 border-r p-3 flex flex-col gap-1"
            style={{ background: "#080E18", borderColor: "#1E293B" }}
          >
            <div className="flex items-center gap-2 mb-4 px-2 pt-1">
              <div className="w-5 h-5 rounded-full" style={{ background: "#00D2FF" }} />
              <span className="text-xs font-bold text-white">TrackHub</span>
            </div>
            {["Dashboard", "Focus", "Projects", "Timetable", "Analytics", "Settings"].map(
              (item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs"
                  style={{
                    background: i === 0 ? "rgba(0,210,255,0.1)" : "transparent",
                    color: i === 0 ? "#00D2FF" : "#8A909E",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 0 ? "#00D2FF" : "#3A3F4A" }}
                  />
                  {item}
                </div>
              )
            )}
          </div>

          {/* Main area */}
          <div className="flex-1 p-4 overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="text-xs" style={{ color: "#8A909E" }}>Wednesday, Aug 13</p>
                <h3 className="text-sm font-bold text-white">Welcome back, Vansh 👋</h3>
              </div>
              <div
                className="text-xs px-3 py-1 rounded-full font-semibold"
                style={{ background: "rgba(0,210,255,0.15)", color: "#00D2FF" }}
              >
                LIVE
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { label: "Focus Hours", value: "6.4h", delta: "+12%" },
                { label: "Tasks Done", value: "24", delta: "+8%" },
                { label: "Streak", value: "14d", delta: "🔥" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl p-2.5"
                  style={{ background: "#0F172A", border: "1px solid #1E293B" }}
                >
                  <p className="text-xs mb-1" style={{ color: "#8A909E" }}>{stat.label}</p>
                  <p className="text-base font-bold text-white">{stat.value}</p>
                  <p className="text-xs" style={{ color: "#00D2FF" }}>{stat.delta}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div
              className="rounded-xl p-3 mb-3"
              style={{ background: "#0F172A", border: "1px solid #1E293B" }}
            >
              <p className="text-xs font-semibold text-white mb-2">Weekly Activity</p>
              <div className="flex items-end gap-1 h-14">
                {[40, 65, 45, 80, 55, 90, 70].map((h, i) => (
                  <div key={i} className="flex-1" style={{ height: "100%" }}>
                    <motion.div
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: "easeOut" }}
                      style={{
                        originY: 1,
                        background: i === 5 ? "#00D2FF" : "#1E3A4A",
                        height: `${h}%`,
                        width: "100%",
                        borderRadius: 3,
                        marginTop: `${100 - h}%`,
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row */}
            <div className="grid grid-cols-2 gap-2">
              <div
                className="rounded-xl p-2.5"
                style={{ background: "#0F172A", border: "1px solid #1E293B" }}
              >
                <p className="text-xs font-semibold text-white mb-1.5">Active Projects</p>
                {["TrackHub UI", "API Refactor"].map((p) => (
                  <div key={p} className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#00D2FF" }} />
                    <p className="text-xs" style={{ color: "#8A909E" }}>{p}</p>
                  </div>
                ))}
              </div>
              <div
                className="rounded-xl p-2.5"
                style={{ background: "#0F172A", border: "1px solid #1E293B" }}
              >
                <p className="text-xs font-semibold text-white mb-1.5">Today's Focus</p>
                <div className="text-xl font-bold font-mono" style={{ color: "#00D2FF" }}>
                  02:34:18
                </div>
                <div className="mt-1 rounded-full h-1" style={{ background: "#1E293B" }}>
                  <div
                    className="h-full rounded-full"
                    style={{ width: "64%", background: "#00D2FF" }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Navbar ─── */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,250,252,0.92)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="TrackHub" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight" style={{ color: "#0F172A" }}>
            TrackHub
          </span>
        </div>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          {[
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            // { name: "Pricing", href: "#pricing" },
            { name: "Community", href: "#community" },
          ].map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.target.style.color = "#0F172A")}
              onMouseLeave={(e) => (e.target.style.color = "#475569")}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/signin"
            className="text-sm font-semibold px-4 py-2 rounded-full transition-all duration-200 hover:opacity-80"
            style={{ color: "#475569" }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-bold px-5 py-2 rounded-full transition-all duration-200 hover:opacity-85"
            style={{ background: "#00D2FF", color: "#0F172A" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ color: "#0F172A" }}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden px-6 pb-5 pt-2 flex flex-col gap-4"
          style={{
            background: "rgba(248,250,252,0.97)",
            borderBottom: "1px solid rgba(0,0,0,0.06)",
          }}
        >
          {[
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            // { name: "Pricing", href: "#pricing" },
            { name: "Community", href: "#community" },
          ].map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium" style={{ color: "#475569" }}>
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/signin"
              className="text-sm font-semibold text-center py-2 rounded-full border"
              style={{ borderColor: "#CBD5E1", color: "#475569" }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-center py-2 rounded-full"
              style={{ background: "#00D2FF", color: "#0F172A" }}
            >
              Get Started
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  const container = useRef();

  useGSAP(() => {
    const tl = gsap.timeline();

    tl.from(".hero-badge", { opacity: 0, y: 20, duration: 0.5, ease: "power2.out" })
      .from(".hero-title", { opacity: 0, y: 30, duration: 0.7, ease: "power3.out" }, "-=0.3")
      .from(".hero-subtitle", { opacity: 0, y: 20, duration: 0.7, ease: "power3.out" }, "-=0.5")
      .from(".hero-cta", { opacity: 0, y: 20, duration: 0.6, ease: "power2.out" }, "-=0.4")
      .from(".hero-mockup", {
        opacity: 0,
        y: 60,
        scale: 0.95,
        duration: 1,
        ease: "power4.out"
      }, "-=0.4");

    gsap.to(".hero-mockup", {
      y: -6,
      duration: 5,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      delay: 0.5
    });
  }, { scope: container });

  return (
    <section
      ref={container}
      className="relative min-h-screen flex flex-col items-center justify-center pt-24 pb-16 px-6 overflow-hidden"
      style={{ background: "#F8FAFC" }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,210,255,0.12) 0%, transparent 65%)",
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,210,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,210,255,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 text-center max-w-4xl mx-auto w-full">
        {/* Badge */}
        <div
          className="hero-badge inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 text-xs font-semibold tracking-widest uppercase"
          style={{
            background: "rgba(0,210,255,0.1)",
            border: "1px solid rgba(0,210,255,0.25)",
            color: "#00D2FF",
          }}
        >
          <Zap size={12} />
          High-Performance Tracking
        </div>

        {/* Headline */}
        <h1
          className="hero-title text-3xl sm:text-4xl md:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight mb-6"
          style={{ color: "#0F172A" }}
        >
          Built for{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00D2FF 0%, #0080FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Discipline.
          </span>{" "}
          Engineered for{" "}
          <span
            style={{
              background: "linear-gradient(135deg, #00D2FF 0%, #0080FF 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Performance.
          </span>
        </h1>

        {/* Subtitle */}
        <p
          className="hero-subtitle text-sm md:text-base max-w-3xl mx-auto mb-10 leading-relaxed"
          style={{ color: "#64748B" }}
        >
          A minimalist, high-performance tracking system designed to eliminate distractions and
          amplify your focus. Master your habits with silent precision.
        </p>

        {/* CTA Buttons */}
        <div
          className="hero-cta flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
        >
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
            style={{
              background: "linear-gradient(135deg, #00D2FF 0%, #0099CC 100%)",
              color: "#0F172A",
              boxShadow: "0 8px 32px rgba(0,210,255,0.35)",
            }}
          >
            Get Started Free
            <ChevronRight size={16} />
          </Link>
        </div>

        {/* Dashboard Mockup */}
        <div className="hero-mockup">
          <DashboardMockup />
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="about" className="py-24 px-6" style={{ background: "#080E18" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 w-full">
          <FadeInWhenVisible direction="right">
            <div
              className="relative rounded-3xl overflow-hidden shadow-2xl p-8 border"
              style={{
                background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
                borderColor: "#334155",
              }}
            >
              <div
                className="absolute -top-24 -right-24 w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(0,210,255,0.1) 0%, transparent 70%)",
                }}
              />
              <div className="grid grid-cols-2 gap-4 relative z-10">
                <div className="rounded-2xl p-6 border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1" style={{ background: "#080E18", borderColor: "#1E293B", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <Activity size={28} style={{ color: "#00D2FF", marginBottom: "12px" }} />
                  <h4 className="text-white font-bold text-sm">Activity Sync</h4>
                </div>
                <div className="rounded-2xl p-6 border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1" style={{ background: "#080E18", borderColor: "#1E293B", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <Zap size={28} style={{ color: "#00D2FF", marginBottom: "12px" }} />
                  <h4 className="text-white font-bold text-sm">Instant Insights</h4>
                </div>
                <div className="rounded-2xl p-6 border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1" style={{ background: "#080E18", borderColor: "#1E293B", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <Network size={28} style={{ color: "#00D2FF", marginBottom: "12px" }} />
                  <h4 className="text-white font-bold text-sm">Unified Flow</h4>
                </div>
                <div className="rounded-2xl p-6 border flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1" style={{ background: "#080E18", borderColor: "#1E293B", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                  <BarChart3 size={28} style={{ color: "#00D2FF", marginBottom: "12px" }} />
                  <h4 className="text-white font-bold text-sm">Deep Analytics</h4>
                </div>
              </div>
            </div>
          </FadeInWhenVisible>
        </div>
        <div className="flex-1">
          <FadeInWhenVisible delay={0.2} direction="left">
            <span
              className="text-xs font-bold tracking-widest uppercase mb-4 block"
              style={{ color: "#00D2FF" }}
            >
              About TrackHub
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-6 leading-tight">
              More than a tracker. <br />
              <span style={{ color: "#94A3B8" }}>Your command center.</span>
            </h2>
            <p className="text-sm md:text-base mb-6 leading-relaxed" style={{ color: "#64748B" }}>
              TrackHub was born out of a simple need: to cut through the noise and provide a unified system for high performers. We believe that tracking your habits, managing your projects, and maintaining focus shouldn't require juggling five different apps.
            </p>
            <p className="text-sm md:text-base leading-relaxed" style={{ color: "#64748B" }}>
              Our mission is to equip you with a beautiful, distraction-free environment that empowers you to build discipline, monitor your progress, and achieve your goals with surgical precision.
            </p>
          </FadeInWhenVisible>
        </div>
      </div>
    </section>
  );
}

/* ─── Feature Cards ─── */
const features = [
  {
    icon: Clock,
    title: "Focus Tracking",
    desc: "Monitor deep work sessions with silent, unobtrusive timers that respect your flow state.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.2) 0%, rgba(0,128,255,0.1) 100%)",
  },
  {
    icon: Grid3X3,
    title: "Symmetric Planning",
    desc: "Organize life in balanced grid structures with visual clarity and unmatched simplicity.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.15) 0%, rgba(0,64,128,0.1) 100%)",
  },
  {
    icon: BarChart3,
    title: "Project Analytics",
    desc: "Review performance with minimalist charts highlighting progress without noise.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.2) 0%, rgba(0,160,200,0.1) 100%)",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="py-24 px-6" style={{ background: "#0F172A" }}>
      <div className="max-w-6xl mx-auto">
        <FadeInWhenVisible>
          <div className="text-center mb-16">
            <span
              className="text-xs font-bold tracking-widest uppercase mb-4 block"
              style={{ color: "#00D2FF" }}
            >
              Features
            </span>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-4 leading-tight">
              Everything you need. Nothing you don't.
            </h2>
            <p className="text-sm md:text-base max-w-xl mx-auto" style={{ color: "#64748B" }}>
              Designed for the focused mind — every feature is intentional.
            </p>
          </div>
        </FadeInWhenVisible>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feat, i) => (
            <FadeInWhenVisible key={feat.title} delay={i * 0.12}>
              <FeatureCard feat={feat} />
            </FadeInWhenVisible>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ feat }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group relative rounded-2xl p-7 h-full transition-all duration-300"
      style={{
        background: "#1E293B",
        border: `1px solid ${hovered ? "rgba(0,210,255,0.35)" : "#334155"}`,
        boxShadow: hovered ? "0 0 40px rgba(0,210,255,0.1)" : "none",
        transform: hovered ? "translateY(-4px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon badge */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
        style={{
          background: feat.gradient,
          border: "1px solid rgba(0,210,255,0.25)",
        }}
      >
        <feat.icon size={22} style={{ color: "#00D2FF" }} />
      </div>

      <h3 className="text-lg font-bold text-white mb-3">{feat.title}</h3>
      <p className="text-xs leading-relaxed" style={{ color: "#94A3B8" }}>
        {feat.desc}
      </p>

      {/* Hover corner glow */}
      <div
        className="absolute top-0 right-0 w-20 h-20 rounded-tl-full pointer-events-none transition-opacity duration-300"
        style={{
          background: "radial-gradient(circle at top right, rgba(0,210,255,0.08), transparent)",
          opacity: hovered ? 1 : 0,
        }}
      />
    </div>
  );
}

/* ─── Philosophy Section ─── */
function PhilosophySection() {
  return (
    <section
      id="how-it-works"
      className="relative py-32 px-6 overflow-hidden"
      style={{ background: "#080E18" }}
    >
      {/* Dot matrix */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #334155 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse, rgba(0,210,255,0.06) 0%, transparent 70%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <FadeInWhenVisible>
          <span
            className="text-xs font-bold tracking-widest uppercase mb-6 block"
            style={{ color: "#00D2FF" }}
          >
            Philosophy
          </span>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.1}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white mb-8 leading-tight">
            Track.{" "}
            <span
              style={{
                background: "linear-gradient(135deg, #00D2FF, #0080FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Build.
            </span>{" "}
            Improve.
          </h2>
        </FadeInWhenVisible>

        <FadeInWhenVisible delay={0.2}>
          <p
            className="text-sm md:text-base leading-relaxed max-w-2xl mx-auto mb-16"
            style={{ color: "#64748B" }}
          >
            Discipline is not about motivation; it's about systems. TrackHub provides the rigid
            structure necessary for sustained high performance in a chaotic world.
          </p>
        </FadeInWhenVisible>

        {/* Stats row */}
        {/*
        <FadeInWhenVisible delay={0.3}>
          <div className="grid grid-cols-3 gap-8 mb-16">
            {[
              { num: "10K+", label: "Active Users" },
              { num: "98%", label: "Retention Rate" },
              { num: "4.9★", label: "User Rating" },
            ].map((stat) => (
              <div key={stat.label}>
                <div className="text-3xl font-extrabold mb-1" style={{ color: "#00D2FF" }}>
                  {stat.num}
                </div>
                <div className="text-sm" style={{ color: "#64748B" }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </FadeInWhenVisible>
        */}

        {/* Glowing vertical divider */}
        <FadeInWhenVisible delay={0.4}>
          <div className="flex justify-center">
            <div
              className="w-px h-20"
              style={{
                background: "linear-gradient(to bottom, #00D2FF, transparent)",
                boxShadow: "0 0 12px rgba(0,210,255,0.6)",
              }}
            />
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}

/* ─── Bottom CTA Banner ─── */
function CTABanner() {
  return (
    <section id="pricing" className="py-20 px-6" style={{ background: "#0F172A" }}>
      <div className="max-w-5xl mx-auto">
        <FadeInWhenVisible>
          <div
            className="relative rounded-3xl p-10 md:p-14 overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #1E293B 0%, #0F172A 50%, #162032 100%)",
              border: "1px solid #334155",
              boxShadow: "0 0 80px rgba(0,210,255,0.08), inset 0 0 80px rgba(0,210,255,0.03)",
            }}
          >
            {/* Glow spots */}
            <div
              className="absolute top-0 right-0 w-96 h-96 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0,210,255,0.08) 0%, transparent 65%)",
                transform: "translate(30%, -30%)",
              }}
            />
            <div
              className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(0,80,255,0.07) 0%, transparent 65%)",
                transform: "translate(-30%, 30%)",
              }}
            />

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                  <Activity size={18} style={{ color: "#00D2FF" }} />
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: "#00D2FF" }}
                  >
                    Start Today
                  </span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                  Ready to master your routine?
                </h2>
                <p className="text-sm md:text-base" style={{ color: "#94A3B8" }}>
                  Join thousands of high-performers tracking their habits with precision.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-bold transition-all duration-200 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #00D2FF 0%, #0099CC 100%)",
                    color: "#0F172A",
                    boxShadow: "0 8px 32px rgba(0,210,255,0.4)",
                    whiteSpace: "nowrap",
                  }}
                >
                  Get Started Free
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </FadeInWhenVisible>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  const footerLinks = [
    { name: "Product", href: "#" },
    { name: "Features", href: "#features" },
    { name: "About", href: "#about" },
  ];

  return (
    <footer
      id="community"
      className="py-10 px-6"
      style={{ background: "#080E18", borderTop: "1px solid #1E293B" }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="TrackHub" className="w-7 h-7" />
          <div>
            <span className="font-bold text-white text-sm block">TrackHub</span>
            <p className="text-xs" style={{ color: "#475569" }}>
              © 2026 TrackHub. Engineered for discipline.
            </p>
          </div>
        </div>

        {/* Links */}
        <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
          {footerLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-xs transition-colors duration-200"
              style={{ color: "#475569" }}
              onMouseEnter={(e) => (e.target.style.color = "#94A3B8")}
              onMouseLeave={(e) => (e.target.style.color = "#475569")}
            >
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Export ─── */
export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Navbar />
      <HeroSection />
      <AboutSection />
      <FeaturesSection />
      <PhilosophySection />
      <CTABanner />
      <Footer />
    </div>
  );
}
