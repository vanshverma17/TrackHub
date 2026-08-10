import { useState } from "react";
import Sidebar from "./Sidebar";
import RightIconBar from "./RightIconBar";

/**
 * DashboardLayout — Universal page wrapper.
 * All protected pages render inside this shell.
 *
 * Props:
 *   title      {string}  — Bold page title ("Overview", "To-Do List", ...)
 *   tagline    {string}  — Muted micro-subtitle ("Stay focused. Track your progress.")
 *   noPadding  {bool}    — Opt out of default content padding (for Kanban/Tables)
 *   noFooter   {bool}    — Hide action footer slot
 *   footer     {node}    — Content for the action footer bar
 *   children   {node}    — Page content
 */
const DashboardLayout = ({ title, tagline, children, noPadding = false, footer }) => {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    // Current date string e.g. "Mon, Aug 10, 2026"
    const dateStr = new Date().toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--canvas)', fontFamily: "'Inter', sans-serif" }}>
            {/* Left Sidebar */}
            <Sidebar mobileOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

            {/* Central Workspace */}
            <main className="th-main" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

                {/* Mobile Header */}
                <div className="md:hidden" style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '12px 16px', borderBottom: '1px solid var(--border)'
                }}>
                    <button
                        onClick={() => setMobileSidebarOpen(true)}
                        aria-label="Open menu"
                        style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '4px' }}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                    <span style={{ fontSize: '15px', fontWeight: '700', color: 'var(--white)' }}>{title}</span>
                </div>

                {/* Page Header — Desktop */}
                {(title || tagline) && (
                    <div className="hidden md:flex" style={{
                        alignItems: 'flex-start', justifyContent: 'space-between',
                        padding: '28px 32px 0',
                        flexShrink: 0,
                    }}>
                        <div>
                            <h1 style={{
                                fontSize: '26px', fontWeight: '800', color: 'var(--white)',
                                letterSpacing: '-0.03em', lineHeight: '1.1', margin: 0
                            }}>
                                {title}
                            </h1>
                            {tagline && (
                                <p style={{ fontSize: '13px', color: 'var(--slate)', marginTop: '4px', fontWeight: '400' }}>
                                    {tagline}
                                </p>
                            )}
                        </div>
                        <div style={{ fontSize: '13px', fontWeight: '500', color: 'var(--slate)', flexShrink: 0, paddingTop: '4px' }}>
                            {dateStr}
                        </div>
                    </div>
                )}

                {/* Page Content */}
                <div style={{
                    flex: 1,
                    padding: noPadding ? '0' : '24px 32px',
                    overflowY: 'auto',
                    overflowX: 'hidden',
                }}>
                    {children}
                </div>

                {/* Action Footer */}
                {footer && (
                    <div style={{
                        padding: '12px 32px',
                        flexShrink: 0,
                    }}>
                        {footer}
                    </div>
                )}
            </main>

            {/* Right Icon Bar */}
            <RightIconBar />
        </div>
    );
};

export default DashboardLayout;
