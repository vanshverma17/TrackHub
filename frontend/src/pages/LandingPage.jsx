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
  CheckSquare,
  Kanban,
  CalendarDays,
  Timer
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
            {["Dashboard", "Focus", "Projects", "Timetable", "Analytics"].map(
              (item, i) => (
                <div
                  key={item}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs cursor-pointer transition-colors hover:bg-[#1E293B]"
                  style={{
                    background: i === 1 ? "rgba(0,210,255,0.1)" : "transparent",
                    color: i === 1 ? "#00D2FF" : "#8A909E",
                  }}
                >
                  <div
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ background: i === 1 ? "#00D2FF" : "#3A3F4A" }}
                  />
                  {item}
                </div>
              )
            )}
          </div>

          {/* Main area */}
          <div className="flex-1 p-5 overflow-hidden flex flex-col gap-4">
            {/* Top Stats & Clock In/Out */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Focus Workspace</h3>
                <p className="text-xs" style={{ color: "#8A909E" }}>Current Session: Deep Work</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="text-xs px-4 py-1.5 rounded-md font-semibold transition-colors"
                  style={{ background: "#1E293B", color: "#F1F5F9" }}
                >
                  Clock Out
                </button>
                <button
                  className="text-xs px-4 py-1.5 rounded-md font-semibold transition-colors"
                  style={{ background: "rgba(0,210,255,0.15)", color: "#00D2FF" }}
                >
                  Clock In
                </button>
              </div>
            </div>

            {/* Central Pomodoro Timer */}
            <div className="flex-1 flex flex-col items-center justify-center rounded-2xl border" style={{ background: "#0F172A", borderColor: "#1E293B" }}>
              <div className="relative flex items-center justify-center mb-6">
                {/* Outer ring */}
                <svg width="180" height="180" viewBox="0 0 200 200" className="rotate-[-90deg]">
                  <circle cx="100" cy="100" r="90" fill="none" stroke="#1E293B" strokeWidth="8" />
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="90"
                    fill="none"
                    stroke="#00D2FF"
                    strokeWidth="8"
                    strokeDasharray="565.48"
                    initial={{ strokeDashoffset: 565.48 }}
                    animate={{ strokeDashoffset: 141.37 }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-4xl font-extrabold tracking-tighter" style={{ color: "#F8FAFC" }}>25:00</div>
                  <div className="text-xs uppercase tracking-widest mt-1 font-semibold" style={{ color: "#00D2FF" }}>Pomodoro</div>
                </div>
              </div>

              <div className="flex gap-3">
                <button className="flex items-center gap-2 px-6 py-2 rounded-md text-sm font-bold" style={{ background: "#00D2FF", color: "#0B0F19" }}>
                  <Play size={14} fill="currentColor" />
                  Start
                </button>
                <button className="px-4 py-2 rounded-md text-sm font-medium border transition-colors hover:bg-[#1E293B]" style={{ borderColor: "#334155", color: "#94A3B8" }}>
                  Skip
                </button>
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
        background: scrolled ? "rgba(11,15,25,0.9)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.05)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <img src={logo} alt="TrackHub" className="w-8 h-8" />
          <span className="font-bold text-lg tracking-tight" style={{ color: "#FFFFFF" }}>
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
              style={{ color: "#94A3B8" }}
              onMouseEnter={(e) => (e.target.style.color = "#FFFFFF")}
              onMouseLeave={(e) => (e.target.style.color = "#94A3B8")}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to="/signin"
            className="text-sm font-semibold px-4 py-2 rounded-md transition-all duration-200 hover:opacity-80"
            style={{ color: "#94A3B8" }}
          >
            Log In
          </Link>
          <Link
            to="/signup"
            className="text-sm font-bold px-5 py-2 rounded-md transition-all duration-200 hover:opacity-85"
            style={{ background: "#00D2FF", color: "#0F172A" }}
          >
            Get Started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2"
          onClick={() => setMobileOpen((v) => !v)}
          style={{ color: "#FFFFFF" }}
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
            background: "rgba(11,15,25,0.97)",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          {[
            { name: "Features", href: "#features" },
            { name: "How It Works", href: "#how-it-works" },
            // { name: "Pricing", href: "#pricing" },
            { name: "Community", href: "#community" },
          ].map((link) => (
            <a key={link.name} href={link.href} className="text-sm font-medium" style={{ color: "#94A3B8" }}>
              {link.name}
            </a>
          ))}
          <div className="flex flex-col gap-2 pt-2">
            <Link
              to="/signin"
              className="text-sm font-semibold text-center py-2 rounded-md border"
              style={{ borderColor: "#334155", color: "#94A3B8" }}
            >
              Log In
            </Link>
            <Link
              to="/signup"
              className="text-sm font-bold text-center py-2 rounded-md"
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
        x: 60,
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
      className="relative flex flex-col items-center justify-center pt-40 pb-40 px-6 md:px-10 overflow-hidden min-h-[90vh]"
      style={{ background: "linear-gradient(to bottom, #0B0F19 0%, #0B0F19 85%, #080E18 100%)" }}
    >
      {/* Radial glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at 50% 0%, rgba(0,210,255,0.15) 0%, transparent 65%)",
        }}
      />
      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 max-w-screen-2xl mx-auto w-full flex flex-col lg:flex-row items-center gap-16 lg:gap-24 xl:gap-32">
        {/* Text Content */}
        <div className="flex-1 text-center lg:text-left">
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
            Built for Focus. Engineered for Productivity.
          </div>

          {/* Headline */}
          <h1
            className="hero-title text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight mb-6 pb-4"
            style={{
              background: "linear-gradient(to right, #FFFFFF, #E2E8F0, #00D2FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Streamline Your Focus.<br />Track Your Progress.
          </h1>

          {/* Subtitle */}
          <p
            className="hero-subtitle text-sm md:text-base max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed lg:text-left text-justify"
            style={{ color: "#94A3B8" }}
          >
            Ditch the fragmented setups. TrackHub unifies your active projects, time tracking timelines, daily task workflows, and an integrated Pomodoro engine inside one cohesive dark-mode workspace.
          </p>

          {/* CTA Buttons */}
          <div
            className="hero-cta flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-16 lg:mb-0"
          >
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-md text-sm font-bold transition-all duration-200 hover:opacity-90"
              style={{
                background: "#00D2FF",
                color: "#0F172A",
              }}
            >
              Start Tracking Free
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {/* Dashboard Mockup */}
        <div className="flex-1 w-full max-w-2xl lg:max-w-none relative">
          <div className="hero-mockup shadow-2xl rounded-2xl" style={{ boxShadow: "0 25px 50px -12px rgba(0,210,255,0.15)" }}>
            <DashboardMockup />
          </div>
        </div>
      </div>

    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="about" className="relative py-24 px-6" style={{ background: "linear-gradient(to bottom, #080E18 0%, #0F172A 100%)" }}>
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 w-full">
          <FadeInWhenVisible direction="right">
            <div
              className="relative p-8 flex items-center justify-center"
              style={{
                minHeight: "420px"
              }}
            >
              {/* Main Glowing Effect */}
              <div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, rgba(0,210,255,0.15) 0%, rgba(0,128,255,0.05) 40%, transparent 70%)",
                  filter: "blur(20px)",
                }}
              />

              {/* Ring Animation Container */}
              <div className="relative w-[280px] h-[280px] flex items-center justify-center z-10">
                {/* Background rings */}
                <div className="absolute inset-0 rounded-full border border-[#1E293B] opacity-50" />
                <motion.div
                  className="absolute inset-6 rounded-full border-2 border-dashed border-[#334155]"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-16 rounded-full border border-[#1E293B] opacity-30" />

                {/* Center Core */}
                <div
                  className="relative z-20 w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,210,255,0.25)] border border-[#00D2FF]"
                  style={{ background: "#080E18" }}
                >
                  <img src={logo} alt="TrackHub" className="w-12 h-12" />
                </div>

                {/* Orbiting Elements */}
                <motion.div
                  className="absolute inset-0"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  {/* Top: Activity Sync */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-20 h-20 rounded-2xl border border-[#334155] flex items-center justify-center shadow-xl bg-[#080E18]"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="flex flex-col items-center">
                        <Activity size={24} style={{ color: "#00D2FF", marginBottom: "4px" }} />
                        <span className="text-[10px] text-white font-bold whitespace-nowrap">Activity Sync</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Right: Instant Insights */}
                  <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-20 h-20 rounded-2xl border border-[#334155] flex items-center justify-center shadow-xl bg-[#080E18]"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="flex flex-col items-center">
                        <Zap size={24} style={{ color: "#00D2FF", marginBottom: "4px" }} />
                        <span className="text-[10px] text-white font-bold whitespace-nowrap">Instant Insights</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Bottom: Unified Flow */}
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
                    <motion.div
                      className="w-20 h-20 rounded-2xl border border-[#334155] flex items-center justify-center shadow-xl bg-[#080E18]"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="flex flex-col items-center">
                        <Network size={24} style={{ color: "#00D2FF", marginBottom: "4px" }} />
                        <span className="text-[10px] text-white font-bold whitespace-nowrap">Unified Flow</span>
                      </div>
                    </motion.div>
                  </div>

                  {/* Left: Deep Analytics */}
                  <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2">
                    <motion.div
                      className="w-20 h-20 rounded-2xl border border-[#334155] flex items-center justify-center shadow-xl bg-[#080E18]"
                      animate={{ rotate: -360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                    >
                      <div className="flex flex-col items-center">
                        <BarChart3 size={24} style={{ color: "#00D2FF", marginBottom: "4px" }} />
                        <span className="text-[10px] text-white font-bold whitespace-nowrap">Deep Analytics</span>
                      </div>
                    </motion.div>
                  </div>
                </motion.div>
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
            <p className="text-sm md:text-base mb-6 leading-relaxed text-justify" style={{ color: "#64748B" }}>
              TrackHub was born out of a simple need: to cut through the noise and provide a unified system for high performers. We believe that tracking your habits, managing your projects, and maintaining focus shouldn't require juggling five different apps.
            </p>
            <p className="text-sm md:text-base leading-relaxed text-justify" style={{ color: "#64748B" }}>
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
    icon: CheckSquare,
    title: "To-Do List",
    desc: "Manage your daily tasks with a streamlined, distraction-free checklist.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.2) 0%, rgba(0,128,255,0.1) 100%)",
  },
  {
    icon: Kanban,
    title: "Kanban Board Project Tracking",
    desc: "Visualize your workflow and track project stages seamlessly with our intuitive drag-and-drop board.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.15) 0%, rgba(0,64,128,0.1) 100%)",
  },
  {
    icon: CalendarDays,
    title: "Time Table Maker",
    desc: "Structurally plan your day, block out focus hours, and stay completely aligned with your goals.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.2) 0%, rgba(0,160,200,0.1) 100%)",
  },
  {
    icon: Timer,
    title: "Dashboard & Pomodoro",
    desc: "Maximize productivity using built-in Pomodoro sessions and custom timers directly on your dashboard.",
    gradient: "linear-gradient(135deg, rgba(0,160,255,0.2) 0%, rgba(0,100,200,0.1) 100%)",
  },
  {
    icon: BarChart3,
    title: "Graph Analytics",
    desc: "Gain deep insights into your progress and productivity over time with minimalist, readable charts.",
    gradient: "linear-gradient(135deg, rgba(0,210,255,0.15) 0%, rgba(0,64,128,0.1) 100%)",
  },
];

function FeaturesSection() {
  return (
    <section id="features" className="relative py-24 px-6" style={{ background: "linear-gradient(to bottom, #0F172A 0%, #080E18 100%)" }}>
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

        <div className="relative flex flex-col gap-12 md:gap-16 max-w-4xl mx-auto mt-20">
          {/* Timeline Line */}
          <div className="absolute top-0 bottom-0 left-[24px] md:left-[40px] w-px bg-[#1E293B]" />

          {features.map((feat, i) => {
            const num = String(i + 1).padStart(2, '0');
            return (
              <div key={feat.title} className="relative pl-[70px] md:pl-[120px]">
                {/* Timeline Node */}
                <div
                  className="absolute left-[24px] md:left-[40px] top-[48px] w-[40px] h-[40px] rounded-full flex items-center justify-center font-bold text-sm transform -translate-x-1/2 -translate-y-1/2"
                  style={{
                    background: "#080E18",
                    border: "2px solid #00D2FF",
                    color: "#00D2FF",
                    boxShadow: "0 0 15px rgba(0,210,255,0.4)"
                  }}
                >
                  {num}
                </div>

                <FadeInWhenVisible direction="left" delay={0.1}>
                  <FeatureCard feat={feat} num={num} />
                </FadeInWhenVisible>
              </div>
            );
          })}
        </div>
      </div>

    </section>
  );
}

function FeatureCard({ feat, num }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="group relative rounded-3xl p-8 md:p-12 transition-all duration-500 overflow-hidden text-left"
      style={{
        background: "#0B1120",
        border: `1px solid ${hovered ? "rgba(0,210,255,0.35)" : "#1E293B"}`,
        boxShadow: hovered ? "0 0 40px rgba(0,210,255,0.1)" : "0 4px 20px rgba(0,0,0,0.5)",
        transform: hovered ? "translateX(8px)" : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Giant faint number watermark */}
      <div
        className="absolute -bottom-6 -left-4 md:-left-2 text-[120px] md:text-[180px] font-black pointer-events-none select-none transition-opacity duration-500"
        style={{
          color: "rgba(255,255,255,0.02)",
          opacity: hovered ? 0.05 : 0.02,
          lineHeight: 1
        }}
      >
        {num}
      </div>

      <div className="relative z-10">
        {/* Feature Icon */}
        <div 
          className="w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center mb-6"
          style={{
            background: feat.gradient || "rgba(0,210,255,0.05)",
            border: "1px solid rgba(0,210,255,0.2)",
          }}
        >
          <feat.icon size={24} style={{ color: "#00D2FF" }} />
        </div>

        <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-4 tracking-tight">
          {feat.title}
        </h3>

        <p className="text-sm md:text-base leading-relaxed max-w-2xl" style={{ color: "#94A3B8" }}>
          {feat.desc}
        </p>
      </div>

      {/* Hover corner glow */}
      <div
        className="absolute top-0 right-0 w-40 h-40 rounded-bl-full pointer-events-none transition-opacity duration-500"
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
      style={{ background: "linear-gradient(to bottom, #080E18 0%, #0F172A 100%)" }}
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
        {/* <FadeInWhenVisible delay={0.4}>
          <div className="flex justify-center">
            <div
              className="w-px h-20"
              style={{
                background: "linear-gradient(to bottom, #00D2FF, transparent)",
                boxShadow: "0 0 12px rgba(0,210,255,0.6)",
              }}
            />
          </div>
        </FadeInWhenVisible> */}
      </div>

    </section>
  );
}

/* ─── Bottom CTA Banner ─── */
function CTABanner() {
  return (
    <section id="pricing" className="relative py-20 px-6" style={{ background: "linear-gradient(to bottom, #0F172A 0%, #080E18 100%)" }}>
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
                <p className="text-sm md:text-base text-justify" style={{ color: "#94A3B8" }}>
                  Join thousands of high-performers tracking their habits with precision.
                </p>
              </div>

              <div className="flex-shrink-0">
                <Link
                  to="/signup"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-md text-sm font-bold transition-all duration-200 hover:opacity-90"
                  style={{
                    background: "#00D2FF",
                    color: "#0F172A",
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
      style={{ background: "#080E18" }}
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
