import { NavLink, useNavigate } from "react-router-dom";
import { authAPI } from "../services/api";

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        authAPI.logout();
        navigate('/');
    };

    return (
        <div className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col fixed left-0 top-0 h-screen z-10">
            {/* Logo */}
            <div className="p-6 flex items-center justify-between border-b border-gray-800">
                <h1 className="text-xl font-bold">TrackHub</h1>
                <button className="text-gray-400 hover:text-white transition">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex flex-col flex-1 p-4">
                <div className="space-y-2">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/todo"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                        </svg>
                        ToDo List
                    </NavLink>

                    <NavLink
                        to="/project-tracker"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                            <path d="M12 12h.01M12 16h.01M16 12h.01M16 16h.01M8 12h.01M8 16h.01"></path>
                        </svg>
                        Project Tracker
                    </NavLink>

                    <NavLink
                        to="/timetable"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Time Table
                    </NavLink>
                </div>

                {/* Settings and Logout at bottom */}
                <div className="mt-auto space-y-2">
                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-4 py-2.5 rounded-lg transition ${isActive ? 'text-cyan-400 bg-cyan-500/10' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`
                        }
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6"></path>
                            <path d="M17.66 5a9 9 0 1 1-11.31 0"></path>
                        </svg>
                        Settings
                    </NavLink>

                    <button 
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition w-full"
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Log Out
                    </button>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;
