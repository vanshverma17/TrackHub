import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [greeting, setGreeting] = useState("");
    const [userName, setUserName] = useState("");

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
    }, []);

    const stats = [
        { 
            id: 1, 
            label: "Tasks completed today", 
            value: "7/12"
        },
        { 
            id: 2, 
            label: "Hours tracked this week", 
            value: "25.5h"
        },
        { 
            id: 3, 
            label: "Weekly task goal", 
            value: "40 tasks"
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
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center">
                            <span className="text-sm font-semibold">U</span>
                        </div>
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
                    <div className="mb-4">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {greeting}, <span className="text-cyan-400">{userName}</span>
                        </h1>
                    </div>

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {stats.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="border border-gray-200 dark:border-white/20 rounded-2xl p-6 text-center"
                            >
                                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{stat.label}</p>
                                <p className="text-4xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* Today's Focus Section */}
                    <div className="bg-gray-100/70 dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
                        <div className="flex items-start justify-between gap-8">
                            {/* Today's Focus List */}
                            <div className="flex-1">
                                <h2 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Today's Focus</h2>
                                <div className="space-y-4">
                                    {todaysFocus.map((task) => (
                                        <div key={task.id} className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-cyan-500/30 border-2 border-cyan-500 flex-shrink-0 mt-0.5"></div>
                                            <div>
                                                <p className="text-gray-900 dark:text-white font-medium">{task.text}</p>
                                                {task.time && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">({task.time})</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Habit Streaks */}
                            <div className="w-64">
                                <h3 className="text-xl font-semibold mb-6 text-gray-900 dark:text-white">Habit Streaks</h3>
                                <div className="flex gap-6">
                                    {habitStreaks.map((habit) => (
                                        <div key={habit.id} className="text-center">
                                            <div className="relative w-24 h-24 mb-2">
                                                <svg className="transform -rotate-90" viewBox="0 0 100 100">
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="none"
                                                        stroke="#374151"
                                                        strokeWidth="8"
                                                    />
                                                    <circle
                                                        cx="50"
                                                        cy="50"
                                                        r="40"
                                                        fill="none"
                                                        stroke={habit.color === 'cyan' ? '#06b6d4' : '#fb923c'}
                                                        strokeWidth="8"
                                                        strokeDasharray={`${habit.progress * 2.51} 251`}
                                                        strokeLinecap="round"
                                                    />
                                                </svg>
                                            </div>
                                            <p className="text-sm text-white font-medium">{habit.name}</p>
                                            <p className="text-xs text-gray-400">({habit.days} days)</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-gray-100/70 dark:bg-gray-900/50 border-l border-gray-200 dark:border-gray-800 p-6 space-y-6 overflow-y-auto fixed right-0 top-0 h-screen">
                {/* Daily Productivity Trend */}
                <div>
                    <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Daily Productivity Trend</h3>
                    <div className="bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 rounded-xl p-4">
                        <svg viewBox="0 0 300 150" className="w-full">
                            <defs>
                                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" style={{ stopColor: '#06b6d4', stopOpacity: 1 }} />
                                    <stop offset="100%" style={{ stopColor: '#22d3ee', stopOpacity: 1 }} />
                                </linearGradient>
                            </defs>
                            <path d="M 10 140 L 40 130 L 70 110 L 100 100 L 130 80 L 160 60 L 190 40 L 220 30 L 250 20 L 280 10" 
                                  fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round"/>
                            {[10, 40, 70, 100, 130, 160, 190, 220, 250, 280].map((x, i) => (
                                <circle key={i} cx={x} cy={140 - i * 13} r="3" fill="#06b6d4"/>
                            ))}
                        </svg>
                        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-500 mt-2">
                            <span>Mon</span>
                            <span>Tue</span>
                            <span>Wed</span>
                            <span>Thu</span>
                            <span>Fri</span>
                            <span>Sat</span>
                            <span>Sun</span>
                        </div>
                    </div>
                </div>

                {/* Mini Calendar */}
                <div>
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
                                
                                // Get first day of month and total days in month
                                const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
                                const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
                                
                                const calendar = [];
                                
                                // Empty cells before month starts
                                for (let i = 0; i < firstDayOfMonth; i++) {
                                    calendar.push(<div key={`empty-${i}`} className="py-1"></div>);
                                }
                                
                                // Days of the month
                                for (let day = 1; day <= daysInMonth; day++) {
                                    const isToday = day === currentDay;
                                    calendar.push(
                                        <div 
                                            key={day} 
                                            className={`py-1 rounded ${isToday ? 'bg-cyan-500 text-white font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
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

                {/* Reminders */}
                <div className="space-y-3">
                    {reminders.map((reminder, index) => (
                        <div key={index} className={`px-4 py-3 rounded-lg border ${reminder.color === 'cyan' ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50'}`}>
                            <p className="text-sm">
                                <span className={reminder.color === 'cyan' ? 'text-cyan-400' : 'text-gray-400'}>{reminder.type}: </span>
                                <span className={reminder.color === 'cyan' ? 'text-cyan-300' : 'text-gray-700 dark:text-gray-300'}>{reminder.text}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;