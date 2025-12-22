
import { Link } from "react-router-dom";
import { useState } from "react";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        password: "",
        agreeToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Sign up:", formData);
    };

    const handleSocialSignUp = (provider) => {
        console.log(`Sign up with ${provider}`);
    };

    return (
        <div className="min-h-screen bg-black flex justify-center items-center p-5">
            <div className="flex w-full max-w-[1200px] h-[600px] bg-gradient-to-br from-[#0a1628] to-[#0d1b2a] rounded-3xl overflow-hidden border border-teal-500/20 shadow-[0_20px_60px_rgba(0,0,0,0.8),0_0_100px_rgba(20,184,166,0.1)]">
                
                {/* Left Panel - Dashboard Preview */}
                <div className="flex-1 bg-gradient-to-br from-[#0a1a28] to-[#0d1520] p-10 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex-1 flex flex-col gap-5">
                        {/* Top Row */}
                        <div className="flex gap-5 flex-1">
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                                <div className="w-12 h-12 rounded-full border-[3px] border-teal-500 border-t-transparent border-r-transparent rotate-45 mx-auto my-2"></div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <div className="h-0.5 bg-teal-500/40 rounded"></div>
                                    <div className="h-0.5 bg-teal-500/40 rounded"></div>
                                    <div className="h-0.5 bg-teal-500/40 rounded"></div>
                                </div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex items-center justify-center">
                                <div className="w-14 h-14 rounded-full border-4 border-teal-500/20 border-t-teal-500 border-r-teal-500"></div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 relative">
                                {[...Array(25)].map((_, i) => (
                                    <div 
                                        key={i} 
                                        className="absolute w-1 h-1 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]"
                                        style={{
                                            left: `${Math.random() * 80 + 10}%`,
                                            top: `${Math.random() * 80 + 10}%`,
                                        }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        
                        {/* Middle Row */}
                        <div className="flex gap-5 flex-1">
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex items-center justify-center">
                                <div className="w-0 h-0 border-l-[30px] border-l-transparent border-r-[30px] border-r-transparent border-b-[50px] border-b-teal-500 opacity-60"></div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                                <div className="flex items-end justify-around h-full gap-1.5 py-2">
                                    {[...Array(8)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="flex-1 bg-gradient-to-t from-teal-500 to-teal-500/30 rounded-t min-h-[20%]"
                                            style={{ height: `${Math.random() * 60 + 20}%` }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                                <div className="flex flex-col gap-2 justify-center h-full">
                                    {[...Array(6)].map((_, i) => (
                                        <div key={i} className="h-0.5 bg-gradient-to-r from-teal-500 to-teal-500/20 rounded"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Bottom Row */}
                        <div className="flex gap-5 flex-1">
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 flex items-center justify-center">
                                <div className="w-14 h-7 border-4 border-teal-500 border-b-0 rounded-t-full"></div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4 relative">
                                <div className="flex items-end h-full">
                                    {[...Array(10)].map((_, i) => (
                                        <div 
                                            key={i} 
                                            className="absolute w-0.5 bg-teal-500 rounded"
                                            style={{
                                                height: `${Math.random() * 60 + 20}%`,
                                                left: `${i * 10}%`
                                            }}
                                        ></div>
                                    ))}
                                </div>
                            </div>
                            <div className="flex-1 bg-teal-500/5 border border-teal-500/20 rounded-xl p-4">
                                <div className="flex flex-col gap-2 justify-center h-full">
                                    {[...Array(4)].map((_, i) => (
                                        <div key={i} className="h-1.5 bg-teal-500/20 rounded overflow-hidden">
                                            <div 
                                                className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded"
                                                style={{ width: `${Math.random() * 60 + 30}%` }}
                                            ></div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="text-white/70 text-base mt-5 tracking-wide">
                        TrackHub - Track. Build. Improve.
                    </div>
                </div>

                {/* Right Panel - Sign Up Form */}
                <div className="flex-[0.8] bg-[#0f172a]/60 flex items-center justify-center p-10">
                    <div className="w-full max-w-md">
                        <h1 className="text-[32px] font-bold text-white mb-2 text-center">Create an account</h1>
                        <p className="text-[13px] text-white/50 mb-7 text-center">
                            Already have account? <Link to="/signin" className="text-teal-500 font-semibold no-underline hover:text-teal-400 transition-colors">Log in</Link>
                        </p>
                        
                        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
                            <input
                                type="text"
                                name="firstName"
                                placeholder="First Name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="w-full px-4 py-3.5 text-sm text-white bg-slate-700/80 border border-slate-500/30 rounded-lg outline-none transition-all duration-300 placeholder:text-white/40 focus:border-teal-500/50 focus:bg-slate-700"
                                required
                            />

                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3.5 text-sm text-white bg-slate-700/80 border border-slate-500/30 rounded-lg outline-none transition-all duration-300 placeholder:text-white/40 focus:border-teal-500/50 focus:bg-slate-700"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none text-white/50 cursor-pointer p-1 flex items-center outline-none hover:text-white/70 transition-colors"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                                            <line x1="1" y1="1" x2="23" y2="23" />
                                        </svg>
                                    ) : (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                                            <circle cx="12" cy="12" r="3" />
                                        </svg>
                                    )}
                                </button>
                            </div>

                            <label className="flex items-center gap-2.5 cursor-pointer mt-1">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="w-[18px] h-[18px] cursor-pointer accent-teal-500"
                                    required
                                />
                                <span className="text-[13px] text-white/70">I agree to the Terms & Conditions</span>
                            </label>

                            <p className="text-center text-white/50 text-[13px] my-2">Or register with</p>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignUp('Google')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-500/30 border border-slate-500/40 rounded-lg text-white cursor-pointer transition-all duration-300 text-sm font-medium hover:bg-slate-500/40 hover:border-slate-400/50"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                    </svg>
                                    <span>Google</span>
                                </button>
                                
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignUp('Apple')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-slate-500/30 border border-slate-500/40 rounded-lg text-white cursor-pointer transition-all duration-300 text-sm font-medium hover:bg-slate-500/40 hover:border-slate-400/50"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" fill="currentColor"/>
                                    </svg>
                                    <span>Apple</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;