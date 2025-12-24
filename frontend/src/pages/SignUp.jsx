import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { authAPI } from "../services/api";

const SignUp = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        agreeToTerms: false
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.agreeToTerms) {
            setError("Please agree to the terms and conditions");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            
            const { token, user } = response.data;
            
            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleSocialSignUp = (provider) => {
        console.log(`Sign up with ${provider}`);
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Left Side - Dashboard Graphics */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent"></div>
                
                {/* TrackHub Text - Fixed at Bottom */}
                <div className="absolute bottom-8 left-8 text-gray-400 text-xl">
                    <span className="text-2xl font-bold text-white">TrackHub</span> - Track. Build. Improve.
                </div>
                
                <div className="relative z-10 w-full max-w-2xl">
                    {/* Futuristic Dashboard Illustration */}
                    <div className="space-y-8">
                        {/* Top Row - Charts */}
                        <div className="flex gap-4 animate-fade-in">
                            <div className="flex-1 border border-cyan-500/30 rounded-lg p-4 bg-gray-900/50 backdrop-blur hover:border-cyan-500/50 transition-all duration-300">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-8 h-8 rounded-full border-2 border-cyan-400/50 animate-pulse"></div>
                                    <div className="flex-1 space-y-1">
                                        <div className="h-1 bg-cyan-500/30 rounded animate-pulse"></div>
                                        <div className="h-1 bg-cyan-500/20 rounded w-3/4 animate-pulse" style={{animationDelay: '0.2s'}}></div>
                                    </div>
                                </div>
                                <div className="flex gap-1 items-end h-20">
                                    <div className="w-2 bg-cyan-500/40 rounded-t animate-chart-grow" style={{height: '40%', animationDelay: '0.1s'}}></div>
                                    <div className="w-2 bg-cyan-500/40 rounded-t animate-chart-grow" style={{height: '70%', animationDelay: '0.2s'}}></div>
                                    <div className="w-2 bg-cyan-500/40 rounded-t animate-chart-grow" style={{height: '50%', animationDelay: '0.3s'}}></div>
                                    <div className="w-2 bg-cyan-500/60 rounded-t animate-chart-grow" style={{height: '90%', animationDelay: '0.4s'}}></div>
                                    <div className="w-2 bg-cyan-500/40 rounded-t animate-chart-grow" style={{height: '60%', animationDelay: '0.5s'}}></div>
                                </div>
                            </div>
                            <div className="w-32 border border-cyan-500/30 rounded-lg p-4 bg-gray-900/50 backdrop-blur hover:border-cyan-500/50 transition-all duration-300">
                                <div className="space-y-2">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" style={{animationDelay: `${i * 0.1}s`}}></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" style={{animationDelay: `${i * 0.1 + 0.5}s`}}></div>
                                        ))}
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <div key={i} className="w-2 h-2 rounded-full bg-cyan-500/30 animate-pulse" style={{animationDelay: `${i * 0.1 + 1}s`}}></div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Middle Row - Graph */}
                        <div className="border border-cyan-500/30 rounded-lg p-6 bg-gray-900/50 backdrop-blur hover:border-cyan-500/50 transition-all duration-300 animate-fade-in" style={{animationDelay: '0.3s'}}>
                            <div className="flex items-end gap-1 h-32">
                                {[30, 60, 45, 80, 50, 90, 70, 85, 60, 75, 55, 95].map((height, i) => (
                                    <div 
                                        key={i} 
                                        className="flex-1 bg-gradient-to-t from-cyan-500/60 to-cyan-500/20 rounded-t animate-chart-grow hover:from-cyan-500/80 hover:to-cyan-500/40 transition-all duration-300"
                                        style={{height: `${height}%`, animationDelay: `${i * 0.1}s`}}
                                    ></div>
                                ))}
                            </div>
                        </div>

                        {/* Bottom Row - Circular & Stats */}
                        <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.5s'}}>
                            <div className="w-32 border border-cyan-500/30 rounded-lg p-4 bg-gray-900/50 backdrop-blur flex items-center justify-center hover:border-cyan-500/50 transition-all duration-300">
                                <div className="relative w-20 h-20">
                                    <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30"></div>
                                    <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-cyan-500 border-r-cyan-500 animate-spin-slow"></div>
                                </div>
                            </div>
                            <div className="flex-1 border border-cyan-500/30 rounded-lg p-4 bg-gray-900/50 backdrop-blur hover:border-cyan-500/50 transition-all duration-300">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-cyan-500/40 rounded animate-progress-bar"></div>
                                        <div className="h-1 w-8 bg-cyan-500/20 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 w-20 bg-cyan-500/30 rounded animate-progress-bar" style={{animationDelay: '0.3s'}}></div>
                                        <div className="h-1 flex-1 bg-cyan-500/20 rounded"></div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-1 flex-1 bg-cyan-500/40 rounded animate-progress-bar" style={{animationDelay: '0.6s'}}></div>
                                        <div className="h-1 w-12 bg-cyan-500/20 rounded"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Sign Up Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold mb-2">Create an Account</h1>
                            <p className="text-gray-400 text-sm">
                                Already have an account?{" "}
                                <Link to="/" className="text-cyan-500 hover:text-cyan-400 transition">
                                    Sign In
                                </Link>
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Full Name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                                    required
                                />
                            </div>

                            {/* Email Input */}
                            <div>
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="Password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300 transition"
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

                            {/* Terms Checkbox */}
                            <label className="flex items-start gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    name="agreeToTerms"
                                    checked={formData.agreeToTerms}
                                    onChange={handleChange}
                                    className="w-4 h-4 mt-0.5 cursor-pointer accent-cyan-500"
                                />
                                <span className="text-sm text-gray-400">
                                    I agree to the Terms & Conditions
                                </span>
                            </label>

                            {/* Sign Up Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-transparent border-2 border-cyan-500 text-cyan-500 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? "Creating Account..." : "Sign Up"}
                            </button>

                            {/* Social Sign Up */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-700"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-gray-900/50 text-gray-400">Or register with</span>
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="button"
                                    onClick={() => handleSocialSignUp('Google')}
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white hover:bg-gray-800 hover:border-gray-600 transition duration-300"
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
                                    className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white hover:bg-gray-800 hover:border-gray-600 transition duration-300"
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