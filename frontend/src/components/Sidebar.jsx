import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import logo from "../assets/logotrack.png";

const Sidebar = ({ mobileOpen, onClose }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authAPI.logout();
        navigate('/', { replace: true });
    };

    const navItems = [
        {
            to: "/dashboard",
            label: "Dashboard",
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="14" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                </svg>
            )
        },
        {
            to: "/todo",
            label: "To-Do List",
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" />
                    <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
            )
        },
        {
            to: "/project-tracker",
            label: "Project Tracker",
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="7" width="5" height="13" rx="1" />
                    <rect x="9.5" y="3" width="5" height="17" rx="1" />
                    <rect x="17" y="10" width="5" height="10" rx="1" />
                </svg>
            )
        },
        {
            to: "/timetable",
            label: "Time Table",
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        },
        {
            to: "/settings",
            label: "Settings",
            isSettings: true,
            icon: (
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
                </svg>
            )
        },
    ];

    // Get user info
    const user = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
    })();

    const SidebarContent = ({ isMobile = false }) => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div style={{ padding: '20px 16px 16px', borderBottom: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src={logo} alt="TrackHub" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                    <span style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)', letterSpacing: '-0.01em' }}>
                        TrackHub
                    </span>
                </div>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
                <div style={{ marginBottom: '4px' }}>
                    <span style={{ fontSize: '10px', fontWeight: '600', color: 'var(--slate-dark)', textTransform: 'uppercase', letterSpacing: '0.1em', padding: '0 6px', display: 'block', marginBottom: '6px' }}>
                        Menu
                    </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {navItems.slice(0, 4).map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            onClick={isMobile ? onClose : undefined}
                            className={({ isActive }) => `th-nav-item${isActive ? ' active' : ''}`}
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </NavLink>
                    ))}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: 'var(--border)', margin: '12px 6px' }} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <NavLink
                        to="/settings"
                        onClick={isMobile ? onClose : undefined}
                        className={({ isActive }) => `th-nav-item${isActive ? ' active' : ''}`}
                    >
                        {navItems[4].icon}
                        <span>Settings</span>
                    </NavLink>

                    <button
                        onClick={() => {
                            authAPI.logout();
                            if (isMobile) onClose?.();
                            navigate('/', { replace: true });
                        }}
                        className="th-nav-item"
                        style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', cursor: 'pointer' }}
                    >
                        <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Log Out</span>
                    </button>
                </div>
            </nav>

            {/* User Badge */}
            <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)' }}>
                <NavLink
                    to="/profile"
                    onClick={isMobile ? onClose : undefined}
                    style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none', padding: '8px', borderRadius: '8px', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--cyan-dim)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                    <div style={{
                        width: '32px', height: '32px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--cyan) 0%, #0066cc 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, fontSize: '13px', fontWeight: '700', color: '#0D0E10'
                    }}>
                        {(user?.name || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '12px', fontWeight: '600', color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {user?.name || 'User'}
                        </div>
                        <div style={{ fontSize: '10px', color: 'var(--slate)', fontWeight: '500' }}>
                            {user?.email ? user.email.split('@')[0] : 'member'}
                        </div>
                    </div>
                </NavLink>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="th-sidebar hidden md:flex">
                <SidebarContent />
            </div>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex' }}>
                    <div
                        style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}
                        onClick={onClose}
                    />
                    <div style={{
                        width: '200px', background: 'var(--surface)', borderRight: '1px solid var(--border)',
                        height: '100%', position: 'relative', zIndex: 51, display: 'flex', flexDirection: 'column'
                    }}>
                        <button
                            onClick={onClose}
                            style={{
                                position: 'absolute', top: '16px', right: '12px', zIndex: 52,
                                background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '4px'
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        </button>
                        <SidebarContent isMobile={true} />
                    </div>
                </div>
            )}
        </>
    );
};

export default Sidebar;
