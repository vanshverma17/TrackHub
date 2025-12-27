import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import axios from 'axios';

const Dashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("");
    
    // Time Tracker State
    const [isTracking, setIsTracking] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeEntries, setTimeEntries] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [totalHoursToday, setTotalHoursToday] = useState(0);
    const [totalHoursWeek, setTotalHoursWeek] = useState(0);
    
    // Stats State
    const [tasksCompleted, setTasksCompleted] = useState(0);
    const [totalTasks, setTotalTasks] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);

    useEffect(() => {
        // Get user name from localStorage
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserName(user.name || 'User');

        // Set greeting based on time
        const hour = new Date().getHours();
        if (hour >= 5 && hour < 12) {
            setGreeting('Good Morning');
        } else if (hour >= 12 && hour < 17) {
            setGreeting('Good Afternoon');
        } else if (hour >= 17 && hour < 21) {
            setGreeting('Good Evening');
        } else {
            setGreeting('Good Night');
        }
        
        // Load data
        fetchDashboardData();
    }, []);
    
    // Timer effect
    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking, startTime]);

    // Timer effect
    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(() => {
                setElapsedTime(Date.now() - startTime);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking, startTime]);
    
    const fetchDashboardData = async () => {
        try {
            const token = localStorage.getItem('token');
            const config = {
                headers: { Authorization: `Bearer ${token}` }
            };
            
            // Fetch time entries for the week
            const today = new Date();
            const weekStart = new Date(today);
            weekStart.setDate(today.getDate() - today.getDay());
            weekStart.setHours(0, 0, 0, 0);
            
            const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000';
            
            const entriesRes = await axios.get(
                `${API_BASE_URL}/api/time-entries?startDate=${weekStart.toISOString()}`,
                config
            );
            
            setTimeEntries(entriesRes.data || []);
            
            // Calculate weekly data
            calculateWeeklyData(entriesRes.data || []);
            
            // Fetch tasks
            const tasksRes = await axios.get(`${API_BASE_URL}/api/tasks`, config);
            const tasks = tasksRes.data || [];
            setTotalTasks(tasks.length);
            setTasksCompleted(tasks.filter(t => t.completed).length);
            
            // Fetch projects
            const projectsRes = await axios.get(`${API_BASE_URL}/api/projects`, config);
            setActiveProjects((projectsRes.data || []).length);
            
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };
    
    const calculateWeeklyData = (entries) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = daysOfWeek.map(day => ({ day, hours: 0 }));
        
        const today = new Date();
        const todayStart = new Date(today.setHours(0, 0, 0, 0));
        let todayHours = 0;
        let weekHours = 0;
        
        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const dayIndex = entryDate.getDay();
            weekData[dayIndex].hours += entry.hours || 0;
            weekHours += entry.hours || 0;
            
            if (entryDate >= todayStart) {
                todayHours += entry.hours || 0;
            }
        });
        
        setWeeklyData(weekData);
        setTotalHoursToday(todayHours);
        setTotalHoursWeek(weekHours);
    };
    
    const handleClockIn = () => {
        setIsTracking(true);
        setStartTime(Date.now());
        setElapsedTime(0);
    };
    
    const handleClockOut = async () => {
        setIsTracking(false);
        
        // Calculate hours
        const hours = elapsedTime / (1000 * 60 * 60);
        
        // Save to backend
        try {
            const token = localStorage.getItem('token');
            const API_BASE_URL = import.meta.env.VITE_API_URL?.replace(/\/+$/, '') || 'http://localhost:5000';
            
            const now = new Date();
            const startTimeObj = new Date(startTime);
            
            await axios.post(
                `${API_BASE_URL}/api/time-entries`,
                {
                    date: now.toISOString(),
                    startTime: startTimeObj.toTimeString().slice(0, 5),
                    endTime: now.toTimeString().slice(0, 5),
                    hours: parseFloat(hours.toFixed(2)),
                    description: 'Work session'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );
            
            // Refresh data
            fetchDashboardData();
        } catch (error) {
            console.error('Error saving time entry:', error);
        }
        
        setElapsedTime(0);
        setStartTime(null);
    };
    
    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const seconds = totalSeconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    };

    const stats = [
        { 
            id: 1, 
            label: "Tasks Completed", 
            value: `${tasksCompleted}/${totalTasks}`,
            percentage: totalTasks > 0 ? Math.round((tasksCompleted / totalTasks) * 100) : 0
        },
        { 
            id: 2, 
            label: "Hours Today", 
            value: `${totalHoursToday.toFixed(1)}h`
        },
        { 
            id: 3, 
            label: "Active Projects", 
            value: activeProjects
        }
    ];

    const todaysFocus = [
        { id: 1, text: "Finalize Project Proposal", time: "9am-11:24", completed: false },
        { id: 2, text: "Client Meeting", time: "", completed: false },
        { id: 3, text: "Deep Work: Code Feature X", time: "2pm-4pm", completed: false }
    ];

    const habitStreaks = [
        { id: 1, name: "Morning Yoga", days: 5, progress: 36, color: "cyan" },
        { id: 2, name: "Meditate", days: 13, progress: 76, color: "orange" }
    ];

    const reminders = [
        { type: "Upcoming", text: "Call Mom (3 PM)", color: "cyan" },
        { type: "Reminder", text: "Pay Bills (Due Fri", color: "cyan" },
        { type: "Reminder", text: "Pay Bills, (Due Fri", color: "cyan" },
        { type: "Task", text: "Grocery Shopping", color: "gray" }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 mr-80 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between flex-shrink-0">
                    <div className="flex-1 max-w-md">
                        <div className="relative">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search habits, or analytics..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-100 dark:bg-gray-800/80 border border-gray-200 dark:border-gray-700 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => navigate('/profile', { state: { backgroundLocation: location } })}
                            className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center hover:ring-2 hover:ring-cyan-500 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-black transition cursor-pointer"
                            aria-label="Open profile"
                        >
                            <span className="text-sm font-semibold text-white">{userName.charAt(0).toUpperCase()}</span>
                        </button>
                        <button className="text-gray-400 hover:text-white transition">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {/* Greeting */}
                    <div className="mb-6">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Welcome in, <span className="text-cyan-400">{userName}</span>
                        </h1>
                    </div>

                    {/* Stats Row */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {stats.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{stat.label}</p>
                                <div className="flex items-end justify-between">
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                                    {stat.percentage !== undefined && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-500 flex items-center justify-center">
                                                <span className="text-lg font-bold text-white">{stat.percentage}%</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Progress - Weekly Hours Bar Chart */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Progress</h2>
                            </div>
                            <div className="mb-4">
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalHoursWeek.toFixed(1)}h</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Work Time this week</p>
                            </div>
                            <div className="flex items-end justify-between h-48 gap-2">
                                {weeklyData.map((data, index) => {
                                    const maxHours = Math.max(...weeklyData.map(d => d.hours), 1);
                                    const heightPercent = (data.hours / maxHours) * 100;
                                    const isToday = index === new Date().getDay();
                                    
                                    return (
                                        <div key={data.day} className="flex-1 flex flex-col items-center gap-2">
                                            <div className="w-full flex flex-col justify-end h-40">
                                                <div 
                                                    className={`w-full rounded-t-lg transition-all duration-500 ${
                                                        isToday 
                                                            ? 'bg-gradient-to-t from-yellow-400 to-yellow-500' 
                                                            : data.hours > 0 
                                                                ? 'bg-gray-300 dark:bg-gray-700' 
                                                                : 'bg-gray-200 dark:bg-gray-800'
                                                    }`}
                                                    style={{ height: `${heightPercent}%`, minHeight: data.hours > 0 ? '8px' : '4px' }}
                                                >
                                                    {data.hours > 0 && (
                                                        <div className="text-xs text-center text-gray-900 dark:text-white font-semibold mt-2">
                                                            {data.hours.toFixed(1)}h
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                                                {data.day.charAt(0)}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Time Tracker */}
                        <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Time Tracker</h2>
                                <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </button>
                            </div>
                            
                            <div className="flex flex-col items-center justify-center">
                                {/* Circular Timer */}
                                <div className="relative w-48 h-48 mb-6">
                                    <svg className="transform -rotate-90 w-full h-full" viewBox="0 0 100 100">
                                        {/* Background circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="currentColor"
                                            className="text-gray-200 dark:text-gray-700"
                                            strokeWidth="6"
                                        />
                                        {/* Progress circle */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="42"
                                            fill="none"
                                            stroke="url(#timerGradient)"
                                            strokeWidth="6"
                                            strokeDasharray={`${(elapsedTime / 1000 / 3600) * 26.4} 264`}
                                            strokeLinecap="round"
                                            className="transition-all duration-1000"
                                        />
                                        <defs>
                                            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stopColor="#fbbf24" />
                                                <stop offset="100%" stopColor="#f59e0b" />
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                    
                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                        <div className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {formatTime(elapsedTime)}
                                        </div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Work Time</p>
                                    </div>
                                </div>
                                
                                {/* Control Buttons */}
                                <div className="flex gap-4">
                                    {!isTracking ? (
                                        <button
                                            onClick={handleClockIn}
                                            className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z"/>
                                            </svg>
                                            Clock In
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setIsTracking(false)}
                                                className="px-6 py-3 bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-semibold hover:bg-gray-400 dark:hover:bg-gray-600 transition-all duration-200 flex items-center gap-2"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                                                </svg>
                                                Pause
                                            </button>
                                            <button
                                                onClick={handleClockOut}
                                                className="px-6 py-3 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-200 flex items-center gap-2 shadow-lg"
                                            >
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M6 6h12v12H6z"/>
                                                </svg>
                                                Clock Out
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Additional Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-cyan-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {tasksCompleted + Math.floor(Math.random() * 50)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Team Members</p>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {activeProjects + Math.floor(Math.random() * 150)}
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
                            </div>
                        </div>
                        
                        <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4 flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {Math.round(totalHoursWeek * 10)}%
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Productivity</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-gray-50 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 p-6 space-y-6 overflow-y-auto fixed right-0 top-0 h-screen">
                {/* Quick Actions */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Quick Actions</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => navigate('/todos')}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center mb-2 group-hover:bg-cyan-500/20">
                                <svg className="w-5 h-5 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Tasks</p>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/projects')}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-blue-500 dark:hover:border-blue-500 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center mb-2 group-hover:bg-blue-500/20">
                                <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Projects</p>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/timetable')}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-yellow-500 dark:hover:border-yellow-500 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-yellow-500/10 flex items-center justify-center mb-2 group-hover:bg-yellow-500/20">
                                <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Schedule</p>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/settings')}
                            className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 hover:border-purple-500 dark:hover:border-purple-500 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mb-2 group-hover:bg-purple-500/20">
                                <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">Settings</p>
                        </button>
                    </div>
                </div>

                {/* Mini Calendar */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
                        {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-gray-600 dark:text-gray-500 font-medium">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {(() => {
                                const today = new Date();
                                const currentDay = today.getDate();
                                const currentMonth = today.getMonth();
                                const currentYear = today.getFullYear();
                                
                                const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                
                                const calendar = [];
                                
                                for (let i = 0; i < firstDayOfMonth; i++) {
                                    calendar.push(<div key={`empty-${i}`} className="py-1"></div>);
                                }
                                
                                for (let day = 1; day <= daysInMonth; day++) {
                                    const isToday = day === currentDay;
                                    calendar.push(
                                        <div 
                                            key={day} 
                                            className={`py-1 rounded cursor-pointer ${
                                                isToday 
                                                    ? 'bg-gradient-to-br from-yellow-400 to-yellow-500 text-white font-bold' 
                                                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                            }`}
                                        >
                                            {day}
                                        </div>
                                    );
                                }
                                
                                return calendar;
                            })()}
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Recent Activity</h3>
                    <div className="space-y-3">
                        {timeEntries.slice(0, 5).map((entry, index) => (
                            <div key={index} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-3">
                                <div className="flex items-start justify-between mb-1">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                                        {entry.description || 'Work Session'}
                                    </p>
                                    <span className="text-xs text-cyan-500 font-semibold">{entry.hours}h</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
                                    {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    {' • '}
                                    {entry.startTime} - {entry.endTime}
                                </p>
                            </div>
                        ))}
                        {timeEntries.length === 0 && (
                            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                                <svg className="w-12 h-12 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm">No recent activity</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;