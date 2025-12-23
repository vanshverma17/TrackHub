import { useState } from "react";
import Sidebar from "../components/Sidebar";

const TimeTable = () => {
    const [schedule, setSchedule] = useState([
        { id: 1, time: "09:00", activity: "Morning Workout", dates: {} },
        { id: 2, time: "10:00", activity: "Team Meeting", dates: {} },
        { id: 3, time: "11:00", activity: "Project Work", dates: {} },
        { id: 4, time: "12:00", activity: "Lunch Break", dates: {} },
        { id: 5, time: "14:00", activity: "Code Review", dates: {} },
        { id: 6, time: "15:00", activity: "Learning Time", dates: {} },
        { id: 7, time: "16:00", activity: "Documentation", dates: {} },
        { id: 8, time: "17:00", activity: "Exercise", dates: {} },
        { id: 9, time: "18:00", activity: "Personal Time", dates: {} },
    ]);

    // Generate dates for the week
    const generateWeekDates = () => {
        const dates = [];
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = generateWeekDates();

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = days[date.getDay()];
        const dateNum = date.getDate();
        const month = date.getMonth() + 1;
        return { day, dateNum, month, fullDate: `${date.getFullYear()}-${month}-${dateNum}` };
    };

    const toggleCheckbox = (taskId, dateKey) => {
        setSchedule(schedule.map(task => {
            if (task.id === taskId) {
                return {
                    ...task,
                    dates: {
                        ...task.dates,
                        [dateKey]: !task.dates[dateKey]
                    }
                };
            }
            return task;
        }));
    };

    const addNewRow = () => {
        const newId = schedule.length + 1;
        setSchedule([...schedule, { id: newId, time: "", activity: "", dates: {} }]);
    };

    const deleteRow = (id) => {
        setSchedule(schedule.filter(task => task.id !== id));
    };

    const updateTask = (id, field, value) => {
        setSchedule(schedule.map(task =>
            task.id === id ? { ...task, [field]: value } : task
        ));
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-64 p-6 h-screen overflow-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2">TimeTable</h1>
                    <p className="text-gray-400">Manage your weekly schedule</p>
                </div>

                <div className="bg-gray-900/50 rounded-lg border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-800">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 bg-gray-900/70 w-32">
                                        Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-400 bg-gray-900/70 w-48">
                                        Activity
                                    </th>
                                    {weekDates.map((date, index) => {
                                        const { day, dateNum, month } = formatDate(date);
                                        return (
                                            <th key={index} className="px-4 py-3 text-center text-sm font-medium text-gray-400 bg-gray-900/70 w-24">
                                                <div>{day}</div>
                                                <div className="text-xs text-gray-500">{month}/{dateNum}</div>
                                            </th>
                                        );
                                    })}
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-400 bg-gray-900/70 w-20">
                                        
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {schedule.map((task, rowIndex) => (
                                    <tr key={task.id} className="border-b border-gray-800 hover:bg-gray-800/30 transition">
                                        <td className="px-4 py-3 border-r border-gray-800">
                                            <input
                                                type="time"
                                                value={task.time}
                                                onChange={(e) => updateTask(task.id, 'time', e.target.value)}
                                                className="w-full bg-transparent text-sm focus:outline-none focus:text-cyan-400 transition cursor-pointer [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                placeholder="Select time"
                                            />
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-800">
                                            <input
                                                type="text"
                                                value={task.activity}
                                                onChange={(e) => updateTask(task.id, 'activity', e.target.value)}
                                                className="w-full bg-transparent text-sm focus:outline-none focus:text-cyan-400 transition"
                                                placeholder="Enter activity"
                                            />
                                        </td>
                                        {weekDates.map((date, colIndex) => {
                                            const { fullDate } = formatDate(date);
                                            const isChecked = task.dates[fullDate] || false;
                                            return (
                                                <td key={colIndex} className="px-4 py-3 border-r border-gray-800 text-center">
                                                    <div className="flex justify-center">
                                                        <label className="cursor-pointer">
                                                            <input
                                                                type="checkbox"
                                                                checked={isChecked}
                                                                onChange={() => toggleCheckbox(task.id, fullDate)}
                                                                className="w-4 h-4 accent-cyan-500 cursor-pointer"
                                                            />
                                                        </label>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => deleteRow(task.id)}
                                                className="text-gray-500 hover:text-red-400 transition-colors p-1 rounded hover:bg-red-500/10"
                                                title="Delete row"
                                            >
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <button
                    onClick={addNewRow}
                    className="mt-4 px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 rounded-lg transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add New Row
                </button>
            </div>
        </div>
    );
}

export default TimeTable;