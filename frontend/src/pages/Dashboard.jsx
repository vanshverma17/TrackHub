import { useState } from "react";

const Dashboard = () => {
    const [searchQuery, setSearchQuery] = useState("");

    const habitCards = [
        { id: 1, label: "Repetitive", title: "Workout Routine", progress: 60 },
        { id: 2, label: "Repetitive", title: "Workout Routine", progress: 45 },
        { id: 3, label: "Remedies", title: "Read 30 pages", progress: 80 }
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
        <div className="min-h-screen bg-black text-white flex">
            {/* Left Sidebar */}
            <div className="w-64 bg-gray-900/50 border-r border-gray-800 flex flex-col">
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
                <nav className="flex-1 p-4 space-y-2">
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-cyan-400 bg-cyan-500/10 rounded-lg">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="7" height="7"></rect>
                            <rect x="14" y="3" width="7" height="7"></rect>
                            <rect x="14" y="14" width="7" height="7"></rect>
                            <rect x="3" y="14" width="7" height="7"></rect>
                        </svg>
                        Dashboard
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Daily Overview Panel
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path>
                        </svg>
                        Streak Counter
                    </a>
                    <div className="px-4 py-2 text-xs text-gray-500">
                        Calendar / Activity Timeline<br/>
                        Habit Recommendations /<br/>
                        AI Suggestions
                    </div>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M6 9l6 6 6-6"></path>
                        </svg>
                        Achievements
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"></circle>
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
                            <line x1="12" y1="17" x2="12.01" y2="17"></line>
                        </svg>
                        Help
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="3"></circle>
                            <path d="M12 1v6m0 6v6m5.66-13a9 9 0 0 1 0 12m-11.31 0a9 9 0 0 1 0-12"></path>
                        </svg>
                        Settings
                    </a>
                    <a href="#" className="flex items-center gap-3 px-4 py-2.5 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded-lg transition">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Log Out
                    </a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
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
                    {/* See Calendar Section */}
                    <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6">
                        <h2 className="text-xl font-semibold mb-6">See Calendar</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {habitCards.map((habit) => (
                                <div key={habit.id} className="bg-gray-800/50 border border-cyan-500/30 rounded-xl p-4 hover:border-cyan-500/50 transition">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <p className="text-xs text-gray-400 mb-1">{habit.label}</p>
                                            <h3 className="text-sm font-semibold">{habit.title}</h3>
                                        </div>
                                        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center">
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <polyline points="20 6 9 17 4 12"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-gradient-to-r from-fuchsia-500 to-pink-500" style={{ width: `${habit.progress}%` }}></div>
                                    </div>
                                </div>
                            ))}
                        </div>
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
            <div className="w-80 bg-gray-900/50 border-l border-gray-800 p-6 space-y-6 overflow-y-auto">
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