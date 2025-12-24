import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const SignIn = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await authAPI.login(formData);
            const { token, user } = response.data;
            
            // Store token and user data
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
            
            // Redirect to dashboard
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.error || "Login failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex">
            {/* Left Side - Dashboard Graphics */}
            <div className="hidden lg:flex lg:w-1/2 relative items-center justify-center p-12">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/20 via-transparent to-transparent"></div>
                
                {/* TrackHub Text - Fixed at Bottom */}
                <div className="absolute bottom-8 left-8 text-gray-400 text-xl">
                    <span className="text-2xl  font-bold text-white">TrackHub</span> - Track. Build. Improve.
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

            {/* Right Side - Sign In Form */}
            <div className="flex-1 flex items-center justify-center p-8 lg:w-1/2">
                <div className="w-full max-w-md">
                    <div className="bg-gray-900/50 backdrop-blur border border-gray-800 rounded-2xl p-8 shadow-2xl">
                        {/* Header */}
                        <div className="mb-8 text-center">
                            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
                            <p className="text-gray-400 text-sm">
                                Enter your username/email/phone and password
                            </p>
                        </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email/Username Input */}
                            <div>
                                <input
                                    type="text"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Email / Username / Phone Number"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                                />
                            </div>

                            {/* Password Input */}
                            <div>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Password"
                                    required
                                    className="w-full px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition"
                                />
                            </div>

                            {/* Sign In Button */}
                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full py-3 bg-transparent border-2 border-cyan-500 text-cyan-500 rounded-lg font-semibold hover:bg-cyan-500 hover:text-white transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? "Signing In..." : "Sign In"}
                                </button>
                            </div>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 flex justify-between items-center text-sm">
                            <Link to="/forgot-password" className="text-gray-400 hover:text-cyan-500 transition">
                                Forgot Password?
                            </Link>
                            <div className="text-gray-400">
                                Don't have to account?{" "}
                                <Link to="/signup" className="text-cyan-500 hover:text-cyan-400 transition">
                                    Sign Up
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;