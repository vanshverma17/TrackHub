import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/api";
import logo from "../assets/logotrack.png";

// Animated illustration — same as SignIn for brand coherence
const DashboardPreview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%', maxWidth: '460px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
            {['Tasks', 'Hours', 'Projects'].map((label, i) => (
                <div key={label} style={{
                    background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.15)',
                    borderRadius: '10px', padding: '14px', animation: `fadeUp 0.6s ease-out ${i * 0.12}s both`, position: 'relative', overflow: 'hidden',
                }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '6px', background: 'rgba(0,210,255,0.1)', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(0,210,255,0.5)', animation: 'pulseGlow 2s infinite' }} />
                    </div>
                    <div style={{ fontSize: '22px', fontWeight: '800', color: '#fff', marginBottom: '4px' }}>{['12', '6.5', '4'][i]}</div>
                    <div style={{ fontSize: '10px', color: 'rgba(138,144,158,0.8)' }}>{label}</div>
                    {i === 0 && <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '2px', background: '#00D2FF' }} />}
                </div>
            ))}
        </div>
        <div style={{
            background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.12)',
            borderRadius: '10px', padding: '16px', animation: 'fadeUp 0.6s ease-out 0.3s both',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                <span style={{ fontSize: '12px', fontWeight: '600', color: '#fff' }}>Weekly Activity</span>
                <span style={{ fontSize: '10px', color: 'rgba(0,210,255,0.7)' }}>This week</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '70px' }}>
                {[30, 65, 45, 90, 55, 35, 20].map((h, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', height: '100%' }}>
                        <div style={{
                            width: '100%', borderRadius: '3px 3px 0 0', marginTop: 'auto', height: `${h}%`,
                            background: i === 3 ? '#00D2FF' : 'rgba(255,255,255,0.08)',
                            animation: `chartGrow 0.9s ease-out ${i * 0.08}s both`,
                        }} />
                        <span style={{ fontSize: '9px', color: i === 3 ? '#00D2FF' : 'rgba(138,144,158,0.6)' }}>
                            {['M', 'T', 'W', 'T', 'F', 'S', 'S'][i]}
                        </span>
                    </div>
                ))}
            </div>
        </div>
        <div style={{
            background: 'rgba(23,24,28,0.9)', border: '1px solid rgba(0,210,255,0.12)',
            borderRadius: '10px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            animation: 'fadeUp 0.6s ease-out 0.45s both',
        }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1px solid rgba(0,210,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '8px solid #00D2FF', marginLeft: '2px' }} />
            </div>
            <div style={{ flex: 1 }}>
                <div style={{ fontSize: '11px', fontWeight: '600', color: '#fff' }}>Work Session</div>
                <div style={{ fontSize: '9px', color: 'rgba(138,144,158,0.7)' }}>TrackHub Workspace</div>
            </div>
            <div style={{ fontFamily: 'monospace', fontSize: '16px', fontWeight: '700', color: '#00D2FF' }}>02:45:12</div>
            <div style={{ padding: '5px 10px', background: '#00D2FF', borderRadius: '14px', fontSize: '9px', fontWeight: '700', color: '#0D0E10' }}>LIVE</div>
        </div>
    </div>
);

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ name: "", email: "", password: "", agreeToTerms: false });
    
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.agreeToTerms) { setError("Please agree to the terms and conditions"); return; }
        setLoading(true); setError("");
        try {
            const response = await authAPI.register({ name: formData.name, email: formData.email, password: formData.password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
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
                {/* Left panel */}
                <div style={{
                    flex: '1', display: 'none', position: 'relative',
                    padding: '60px', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0, 0, 0, 0.2)', borderRight: '1px solid rgba(255, 255, 255, 0.03)',
                }} className="lg-flex-center-su">
                    <style>{`.lg-flex-center-su { display: none; } @media (min-width: 1024px) { .lg-flex-center-su { display: flex !important; } }`}</style>
                    <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: '460px' }}>
                        <DashboardPreview />
                    </div>
                </div>

                {/* Right panel — sign up form */}
                <div style={{ flex: '1', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 32px' }}>
                    <div style={{ width: '100%', maxWidth: '360px' }}>
                        {/* Mobile brand */}
                        <div className="lg-hide-su" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginBottom: '40px' }}>
                            <style>{`.lg-hide-su { display: flex; } @media (min-width: 1024px) { .lg-hide-su { display: none !important; } }`}</style>
                            <img src={logo} alt="TrackHub" style={{ width: '28px', height: '28px', borderRadius: '6px' }} />
                            <span style={{ fontSize: '18px', fontWeight: '700', color: 'var(--white)' }}>TrackHub</span>
                        </div>

                        {/* Form area */}
                        <div style={{ width: '100%' }}>
                            <div style={{ marginBottom: '32px' }}>
                                <h1 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--white)', margin: '0 0 6px' }}>Create account</h1>
                                <p style={{ fontSize: '13px', color: 'var(--slate)', margin: 0 }}>Get started with TrackHub for free</p>
                            </div>

                            {error && (
                                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px' }}>
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>FULL NAME</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" required className="th-input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>EMAIL</label>
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" required className="th-input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>PASSWORD</label>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password" value={formData.password} onChange={handleChange}
                                            placeholder="Create a password" required
                                            className="th-input" style={{ paddingRight: '40px' }}
                                        />
                                        <button
                                            type="button" onClick={() => setShowPassword(!showPassword)}
                                            style={{
                                                position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                                                background: 'none', border: 'none', cursor: 'pointer', color: 'var(--slate)', padding: '2px',
                                            }}
                                        >
                                            {showPassword ? (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
                                                    <line x1="1" y1="1" x2="23" y2="23" />
                                                </svg>
                                            ) : (
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Terms */}
                                <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer' }}>
                                    <div
                                        style={{
                                            width: '16px', height: '16px', borderRadius: '4px', flexShrink: 0, marginTop: '1px',
                                            border: `1.5px solid ${formData.agreeToTerms ? 'var(--cyan)' : 'var(--slate-dark)'}`,
                                            background: formData.agreeToTerms ? 'var(--cyan)' : 'transparent',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.15s', cursor: 'pointer',
                                        }}
                                    >
                                        {formData.agreeToTerms && (
                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--canvas)" strokeWidth="3.5">
                                                <polyline points="20 6 9 17 4 12" />
                                            </svg>
                                        )}
                                    </div>
                                    <input type="checkbox" name="agreeToTerms" checked={formData.agreeToTerms} onChange={handleChange} style={{ display: 'none' }} />
                                    <span style={{ fontSize: '12px', color: 'var(--slate)', lineHeight: '1.4' }}>
                                        I agree to the{' '}
                                        <a href="#" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" style={{ color: 'var(--cyan)', textDecoration: 'none' }}>Privacy Policy</a>
                                    </span>
                                </label>

                                <button
                                    type="submit" disabled={loading}
                                    style={{
                                        width: '100%', padding: '12px',
                                        border: `1.5px solid ${loading ? 'var(--border)' : 'var(--cyan)'}`,
                                        borderRadius: '8px', background: 'rgba(0, 210, 255, 0.05)',
                                        color: loading ? 'var(--slate)' : 'var(--cyan)',
                                        fontSize: '14px', fontWeight: '700',
                                        cursor: loading ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s', fontFamily: "'Inter', sans-serif",
                                        marginTop: '8px',
                                        boxShadow: loading ? 'none' : '0 0 15px rgba(0, 210, 255, 0.25), inset 0 0 10px rgba(0, 210, 255, 0.1)',
                                    }}
                                    onMouseEnter={e => { if (!loading) { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.15)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.4), inset 0 0 15px rgba(0, 210, 255, 0.2)'; } }}
                                    onMouseLeave={e => { if (!loading) { e.currentTarget.style.background = 'rgba(0, 210, 255, 0.05)'; e.currentTarget.style.boxShadow = '0 0 15px rgba(0, 210, 255, 0.25), inset 0 0 10px rgba(0, 210, 255, 0.1)'; } }}
                                >
                                    {loading ? "Creating account..." : "Create Account"}
                                </button>
                            </form>

                            <p style={{ marginTop: '24px', textAlign: 'center', fontSize: '12px', color: 'var(--slate)' }}>
                                Already have an account?{' '}
                                <Link to="/signin" style={{ color: 'var(--cyan)', textDecoration: 'none', fontWeight: '600' }}>Sign In</Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;