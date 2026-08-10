import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTheme, setTheme } from '../utils/theme';

const Settings = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isModal = Boolean(location.state?.backgroundLocation);
    const [theme, setThemeState] = useState(getTheme());

    const handleThemeChange = (newTheme) => {
        setTheme(newTheme);
        setThemeState(newTheme);
    };

    const handleClose = () => {
        if (isModal) navigate(-1);
        else navigate('/dashboard');
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            {/* Backdrop */}
            <button
                onClick={handleClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer' }}
                aria-label="Close settings"
            />

            {/* Settings Panel */}
            <div style={{
                position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '16px', width: '100%', maxWidth: '440px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)', margin: 0 }}>Settings</h2>
                        <p style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '2px' }}>Customize your TrackHub experience</p>
                    </div>
                    <button
                        onClick={handleClose}
                        style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '6px', borderRadius: '6px', transition: 'color 0.15s' }}
                        aria-label="Close"
                        onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                        onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}
                    >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M18 6L6 18M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {/* Theme Setting */}
                    <div>
                        <h3 style={{ fontSize: '12px', fontWeight: '600', color: 'var(--slate)', marginBottom: '12px', letterSpacing: '0.08em' }}>
                            APPEARANCE
                        </h3>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            {[
                                {
                                    value: 'dark', label: 'Dark', desc: 'Deep canvas',
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
                                        </svg>
                                    )
                                },
                                {
                                    value: 'light', label: 'Light', desc: 'Clean & bright',
                                    icon: (
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="5" />
                                            <line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                                            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                                            <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                                            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                                        </svg>
                                    )
                                }
                            ].map(({ value, label, desc, icon }) => {
                                const active = theme === value;
                                return (
                                    <button
                                        key={value}
                                        onClick={() => handleThemeChange(value)}
                                        style={{
                                            flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center',
                                            gap: '8px', padding: '16px 12px',
                                            border: `1.5px solid ${active ? 'var(--cyan)' : 'var(--border)'}`,
                                            borderRadius: '10px',
                                            background: active ? 'var(--cyan-dim)' : 'var(--canvas)',
                                            color: active ? 'var(--cyan)' : 'var(--slate)',
                                            cursor: 'pointer', transition: 'all 0.15s',
                                        }}
                                        onMouseEnter={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--slate-dark)'; e.currentTarget.style.color = 'var(--white)'; } }}
                                        onMouseLeave={e => { if (!active) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--slate)'; } }}
                                    >
                                        {icon}
                                        <span style={{ fontSize: '13px', fontWeight: '600' }}>{label}</span>
                                        <span style={{ fontSize: '10px', opacity: 0.7 }}>{desc}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Info row */}
                    <div style={{ padding: '12px 14px', background: 'var(--canvas)', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <span style={{ fontSize: '12px', color: 'var(--slate)' }}>Active theme</span>
                        <span style={{ fontSize: '12px', fontWeight: '600', color: theme === 'dark' ? 'var(--cyan)' : '#FACC15' }}>
                            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                        </span>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 22px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                    <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--slate)' }}>
                        Changes apply immediately site-wide
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Settings;
