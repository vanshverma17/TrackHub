import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isModal = Boolean(location.state?.backgroundLocation);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            try { setUser(JSON.parse(userData)); }
            catch (error) { console.error('Error parsing user data:', error); }
        }
    }, []);

    const handleClose = () => {
        if (isModal) navigate(-1);
        else navigate('/dashboard');
    };

    const getUserInitials = () => {
        if (!user?.name) return 'U';
        const names = user.name.split(' ');
        if (names.length >= 2) return names[0][0] + names[names.length - 1][0];
        return names[0][0];
    };

    const infoRows = [
        {
            label: 'Username', value: user?.name || 'N/A',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
            ), iconColor: 'var(--cyan)',
        },
        {
            label: 'Email', value: user?.email || 'N/A',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                </svg>
            ), iconColor: '#C084FC',
        },
        {
            label: 'Member Since',
            value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A',
            icon: (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            ), iconColor: '#4ADE80',
        },
    ];

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
            {/* Backdrop */}
            <button
                onClick={handleClose}
                style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)', border: 'none', cursor: 'pointer' }}
                aria-label="Close profile"
            />

            {/* Profile Panel */}
            <div style={{
                position: 'relative', background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: '16px', width: '100%', maxWidth: '420px',
                boxShadow: '0 24px 60px rgba(0,0,0,0.6)', overflow: 'hidden',
                fontFamily: "'Inter', sans-serif",
            }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                    <div>
                        <h2 style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)', margin: 0 }}>Profile</h2>
                        <p style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '2px' }}>Your account details</p>
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

                {/* Avatar section */}
                <div style={{ padding: '24px 22px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div style={{ position: 'relative', marginBottom: '12px' }}>
                        {user?.profilePhoto ? (
                            <img src={user.profilePhoto} alt={user.name || 'User'}
                                style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--cyan)' }} />
                        ) : (
                            <div style={{
                                width: '80px', height: '80px', borderRadius: '50%',
                                background: 'linear-gradient(135deg, var(--cyan) 0%, #0066CC 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                border: '2px solid var(--cyan)', boxShadow: '0 0 20px var(--cyan-glow)',
                            }}>
                                <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--canvas)' }}>
                                    {getUserInitials()}
                                </span>
                            </div>
                        )}
                        {/* Online indicator */}
                        <div style={{
                            position: 'absolute', bottom: '4px', right: '4px',
                            width: '12px', height: '12px', borderRadius: '50%',
                            background: '#4ADE80', border: '2px solid var(--surface)',
                        }} />
                    </div>
                    <h3 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--white)', marginBottom: '4px' }}>
                        {user?.name || 'Loading...'}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--slate)', padding: '3px 10px', background: 'var(--cyan-dim)', borderRadius: '20px', border: '1px solid rgba(0,210,255,0.2)' }}>
                        Active member
                    </span>
                </div>

                {/* Info rows */}
                <div style={{ padding: '18px 22px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {infoRows.map(({ label, value, icon, iconColor }) => (
                        <div key={label} style={{
                            display: 'flex', alignItems: 'center', gap: '12px',
                            padding: '12px 14px', background: 'var(--canvas)',
                            border: '1px solid var(--border)', borderRadius: '8px',
                        }}>
                            <div style={{
                                width: '30px', height: '30px', borderRadius: '7px', flexShrink: 0,
                                background: `${iconColor}18`, color: iconColor,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                                {icon}
                            </div>
                            <div>
                                <div style={{ fontSize: '10px', color: 'var(--slate)', fontWeight: '500', marginBottom: '2px' }}>{label}</div>
                                <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--white)' }}>{value}</div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Footer */}
                <div style={{ padding: '12px 22px', borderTop: '1px solid var(--border)', background: 'rgba(0,0,0,0.2)' }}>
                    <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--slate)' }}>
                        ID: <span style={{ fontWeight: '600', color: 'var(--slate)' }}>{user?.id || user?._id || '—'}</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Profile;
