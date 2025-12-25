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

    const activities = [
        { title: "Finish UI design", category: "Task", progress1: "75%", progress2: "75%", dueDate: "Tomorrow", barWidth: 75 },
        { title: "Meditate 10 min", category: "Habit", progress1: "75%", progress2: "30%", dueDate: "Today", barWidth: 75 },
        { title: "Meditate 10 min", category: "30%", progress1: "100%", progress2: "30%", dueDate: "Weekly", barWidth: 100 },
        { title: "Learn Spanish", category: "30%", progress1: "30%", progress2: "30%", dueDate: "Weekly", barWidth: 45 },
        { title: "Prepare presentation", category: "50%", progress1: "50%", progress2: "50%", dueDate: "Friday", barWidth: 50 }
    ];

    const reminders = [
        { type: "Upcoming", text: "Call Mom (3 PM)", color: "cyan" },
        { type: "Reminder", text: "Pay Bills (Due Fri", color: "cyan" },
        { type: "Reminder", text: "Pay Bills, (Due Fri", color: "cyan" },
        { type: "Task", text: "Grocery Shopping", color: "gray" }
    ];

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Left Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="ml-64 mr-80 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
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
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
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
                        <h1 className="text-3xl font-bold text-white">
                            {greeting}, <span className="text-cyan-400">{userName}</span>
                        </h1>
                    </div>

                    {/* Stats Cards Section */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                        {stats.map((stat) => (
                            <div 
                                key={stat.id} 
                                className="border border-white rounded-2xl p-6 text-center"
                            >
                                <p className="text-sm text-gray-300 mb-2">{stat.label}</p>
                                <p className="text-4xl font-bold text-white">{stat.value}</p>
                            </div>
                        ))}
                    </div>

                    {/* My Activities Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-6">My Activities</h2>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-800">
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Activity title</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Category</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Progress %</th>
                                        <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">Progress %</th>
                                        <th className="text-right py-3 px-4 text-sm font-medium text-gray-400">Due date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {activities.map((activity, index) => (
                                        <tr key={index} className="border-b border-gray-800/50 hover:bg-gray-800/30 transition">
                                            <td className="py-4 px-4 text-sm">{activity.title}</td>
                                            <td className="py-4 px-4 text-sm text-gray-400">{activity.category}</td>
                                            <td className="py-4 px-4 text-sm">{activity.progress1}</td>
                                            <td className="py-4 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm text-gray-400">{activity.progress2}</span>
                                                    <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden max-w-[120px]">
                                                        <div className="h-full bg-gradient-to-r from-cyan-500 to-fuchsia-500" style={{ width: `${activity.barWidth}%` }}></div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-4 px-4 text-sm text-right text-gray-400">{activity.dueDate}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 bg-gray-900/50 border-l border-gray-800 p-6 space-y-6 overflow-y-auto fixed right-0 top-0 h-screen">
                {/* Daily Productivity Trend */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Daily Productivity Trend</h3>
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
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
                        <div className="flex justify-between text-xs text-gray-500 mt-2">
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
                    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-4">
                        <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
                            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                                <div key={day} className="text-gray-500 font-medium">{day}</div>
                            ))}
                        </div>
                        <div className="grid grid-cols-7 gap-1 text-center text-xs">
                            {[...Array(35)].map((_, i) => {
                                const day = i - 3;
                                const isToday = day === 15;
                                if (day < 1 || day > 31) {
                                    return <div key={i} className="py-1"></div>;
                                }
                                return (
                                    <div key={i} className={`py-1 rounded ${isToday ? 'bg-cyan-500 text-white font-semibold' : 'text-gray-400 hover:bg-gray-700'}`}>
                                        {day}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Reminders */}
                <div className="space-y-3">
                    {reminders.map((reminder, index) => (
                        <div key={index} className={`px-4 py-3 rounded-lg border ${reminder.color === 'cyan' ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-gray-700 bg-gray-800/50'}`}>
                            <p className="text-sm">
                                <span className={reminder.color === 'cyan' ? 'text-cyan-400' : 'text-gray-400'}>{reminder.type}: </span>
                                <span className={reminder.color === 'cyan' ? 'text-cyan-300' : 'text-gray-300'}>{reminder.text}</span>
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;