import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";
import logo from "../assets/logotrack.png";

// Animated dashboard preview illustration (shared with SignIn)
const DashboardPreview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '460px' }}>
        {/* Metric cards row */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {['Tasks', 'Hours', 'Projects'].map((label, i) => (
                <div key={label} style={{
                    background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.15)',
                    borderRadius: '10px', padding: '14px', animation: `fadeUp 0.6s ease-out ${i * 0.12}s both`,
                }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,210,255,0.1)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(0,210,255,0.5)', animation: 'pulseGlow 2s infinite' }} />
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{['12', '6.5', '4'][i]}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(138,144,158,0.8)' }}>{label}</div>
                    {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#00D2FF', borderRadius: '0 0 10px 10px' }} />}
                </div>
            ))}
        </div>

        {/* Weekly chart block */}
        <div style={{
            background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.12)',
            borderRadius: '10px', padding: '16px', animation: 'fadeUp 0.6s ease-out 0.3s both',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>Weekly Activity</span>
                <span style={{ fontSize: '10px', color: 'rgba(0,210,255,0.7)' }}>This week</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
                {[30, 65, 45, 90, 55, 35, 20].map((h, i) => {
                    const isToday = i === 3;
                    return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%' }}>
                            <div style={{
                                width: '100%', borderRadius: '3px 3px 0 0', marginTop: 'auto',
                                height: `${h}%`,
                                background: isToday ? '#00D2FF' : 'rgba(255,255,255,0.08)',
                                boxShadow: isToday ? '0 0 8px rgba(0,210,255,0.4)' : 'none',
                                animation: `chartGrow 0.9s ease-out ${i * 0.08}s both`,
                            }} />
                            <span style={{ fontSize: '9px', color: isToday ? '#00D2FF' : 'rgba(138,144,158,0.6)' }}>
                                {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Action footer preview */}
        <div style={{
            background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.12)',
            borderRadius: '10px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'fadeUp 0.6s ease-out 0.45s both',
        }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #00D2FF', marginLeft: '2px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>Work Session</div>
                <div style={{ fontSize: '9px', color: 'rgba(138,144,158,0.7)' }}>TrackHub Workspace</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '700', color: '#00D2FF', letterSpacing: '0.05em' }}>
                02:45:12
            </div>
            <div style={{ padding: '5px 10px', background: '#00D2FF', borderRadius: '14px', fontSize: '9px', fontWeight: '700', color: '#0D0E10', letterSpacing: '0.08em' }}>
                LIVE
            </div>
        </div>
    </div>
);

const SignIn = () => {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setError("");
        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally { setLoading(false); }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--canvas)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Inter', sans-serif", padding: '24px', position: 'relative' }}>
            
            {/* Desktop Brand mark - positioned at the bottom left of the entire screen */}
            <div style={{ position: 'absolute', bottom: '40px', left: '40px', alignItems: 'center', gap: '14px', zIndex: 10 }} className="desktop-brand">
                <style>{`.desktop-brand { display: none; } @media (min-width: 1024px) { .desktop-brand { display: flex !important; } }`}</style>
                <img src={logo} alt="TrackHub" style={{ width: '40px', height: '40px', borderRadius: '8px' }} />
                <div>
                    <span style={{ fontSize: '22px', fontWeight: '800', color: 'var(--white)' }}>TrackHub</span>
                    <span style={{ fontSize: '14px', color: 'var(--slate)', marginLeft: '8px' }}>Track. Build. Improve.</span>
                </div>
            </div>

            {/* Main Single Panel Container */}
            <div style={{
                display: 'flex', width: '100%', maxWidth: '1040px', minHeight: '600px',
                background: 'rgba(18, 19, 22, 0.6)', border: '1px solid rgba(255, 255, 255, 0.05)',
                borderRadius: '24px', overflow: 'hidden', boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                position: 'relative'
            }}>
                {/* Left panel — dashboard preview */}
                <div style={{
                    flex: '1', display: 'none', position: 'relative',
                    padding: '60px', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.03)',
                }} className="lg-flex-center">
                    <style>{`.lg-flex-center { display: none; } @media (min-width: 1024px) { .lg-flex-center { display: flex !important; } }`}</style>

                <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
                    <DashboardPreview />
                </div>
                </div>

                {/* Right panel — sign in form */}
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 32px' }}>
                    <div style={{ width: '100%', maxWidth: '360px' }}>
                        {/* Mobile brand */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '40px' }} className="lg-hide">
                            <style>{`.lg-hide { display: flex; } @media (min-width: 1024px) { .lg-hide { display: none !important; } }`}</style>
                            <img src={logo} alt="TrackHub" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--white)' }}>TrackHub</span>
                        </div>

                        {/* Form area */}
                        <div style={{ width: '100%' }}>
                            <div style={{ marginBottom: '32px' }}>
                            <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--white)', margin: '0 0 6px' }}>Welcome back</h1>
                            <p style={{ fontSize: '13px', color: 'var(--slate)', margin: 0 }}>Sign in to your account to continue</p>
                        </div>

                        {error && (
                            <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px' }}>
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>
                                    EMAIL / USERNAME
                                </label>
                                <input
                                    type="text" name="email" value={formData.email} onChange={handleChange}
                                    placeholder="Enter your email or username" required
                                    className="th-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>
                                    PASSWORD
                                </label>
                                <input
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    placeholder="Enter your password" required
                                    className="th-input"
                                />
                            </div>

                            <button
                                type="submit" disabled={loading}
                                style={{
                                    width: '100%', padding: '12px',
                                    border: `1.5px solid ${loading ? 'var(--border)' : 'var(--cyan)'}`,
                                    borderRadius: '8px', background: 'rgba(0, 210, 255, 0.05)',
                                    color: loading ? 'var(--slate)' : 'var(--cyan)',
                                    fontSize: '14px', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer',
                                    transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                    marginTop: '8px',
                                    boxShadow: loading ? 'none' : '0 0 15px rgba(0, 210, 255, 0.25), inset 0 0 10px rgba(0, 210, 255, 0.1)',
                                }}
                                onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.4), inset 0 0 15px rgba(0, 210, 255, 0.2)'; } }}
                                onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.25), inset 0 0 10px rgba(0, 210, 255, 0.1)'; } }}
                            >
                                {loading ? "Signing in..." : "Sign In"}
                            </button>
                        </form>

                            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                                <Link to="/forgot-password" style={{ color: 'var(--slate)', textDecoration: 'none', transition: 'color 0.15s' }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--cyan)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}>
                                    Forgot password?
                                </Link>
                                <span style={{ color: 'var(--slate)' }}>
                                    No account?{' '}
                                    <Link to="/signup" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>
                                        Sign Up
                                    </Link>
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;