import { useEffect, useMemo, useRef, useState } from "react";
import Sidebar from "../components/Sidebar";
import { timetableAPI } from "../services/api";

const TimeTable = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const saveTimersRef = useRef(new Map());

    const normalizeDates = (dates) => {
        if (!dates) return {};
        if (dates instanceof Map) return Object.fromEntries(dates.entries());
        if (Array.isArray(dates)) {
            try {
                return Object.fromEntries(dates);
            } catch {
                return {};
            }
        }
        if (typeof dates === 'object') return dates;
        return {};
    };

    // Generate dates for the week
    const generateWeekDates = () => {
        const dates = [];
        const today = new Date();
        const currentDay = today.getDay();
        const monday = new Date(today);
        monday.setDate(today.getDate() - currentDay + (currentDay === 0 ? -6 : 1));
        monday.setHours(0, 0, 0, 0);

        for (let i = 0; i < 7; i++) {
            const date = new Date(monday);
            date.setDate(monday.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const weekDates = useMemo(() => generateWeekDates(), []);

    const weekStartKey = useMemo(() => {
        const monday = weekDates[0];
        const y = monday.getFullYear();
        const m = String(monday.getMonth() + 1).padStart(2, '0');
        const d = String(monday.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }, [weekDates]);

    const formatDate = (date) => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const day = days[date.getDay()];
        const dateNum = date.getDate();
        const month = date.getMonth() + 1;
        const fullDate = `${date.getFullYear()}-${String(month).padStart(2, '0')}-${String(dateNum).padStart(2, '0')}`;
        return { day, dateNum, month, fullDate };
    };

    useEffect(() => {
        const load = async () => {
            setLoading(true);
            setError("");
            try {
                const res = await timetableAPI.getWeek(weekStartKey);
                const rows = (res.data || []).map((r) => ({
                    id: r._id,
                    time: r.time || "",
                    activity: r.activity || "",
                    dates: normalizeDates(r.dates)
                }));
                setSchedule(rows);
            } catch (e) {
                console.error("Failed to load timetable:", e);
                setError(e?.response?.data?.error || "Failed to load timetable");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [weekStartKey]);

    const queueSave = (rowId, patch) => {
        const existing = saveTimersRef.current.get(rowId);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(async () => {
            try {
                await timetableAPI.updateRow(rowId, patch);
            } catch (e) {
                console.error("Failed to save row:", e);
                setError(e?.response?.data?.error || "Failed to save row");
            } finally {
                saveTimersRef.current.delete(rowId);
            }
        }, 400);
        saveTimersRef.current.set(rowId, timer);
    };

    const toggleCheckbox = async (taskId, dateKey) => {
        const row = schedule.find((t) => t.id === taskId);
        if (!row) return;

        const currentDates = normalizeDates(row.dates);
        const nextDates = {
            ...currentDates,
            [dateKey]: !currentDates[dateKey]
        };

        setSchedule(prev => prev.map(task => (
            task.id === taskId ? { ...task, dates: nextDates } : task
        )));

        try {
            await timetableAPI.updateRow(taskId, { dates: nextDates });
        } catch (e) {
            console.error("Failed to toggle:", e);
            setError(e?.response?.data?.error || "Failed to update checkbox");
            // revert
            setSchedule(prev => prev.map(task => (
                task.id === taskId ? { ...task, dates: currentDates } : task
            )));
        }
    };

    const addNewRow = async () => {
        setError("");
        try {
            const created = await timetableAPI.createRow({
                weekStart: weekStartKey,
                time: "",
                activity: "",
                dates: {}
            });
            const row = created.data;
            setSchedule(prev => [...prev, { id: row._id, time: row.time || "", activity: row.activity || "", dates: row.dates || {} }]);
        } catch (e) {
            console.error("Failed to create row:", e);
            setError(e?.response?.data?.error || "Failed to create row");
        }
    };

    const deleteRow = async (id) => {
        setSchedule(prev => prev.filter(task => task.id !== id));
        try {
            await timetableAPI.deleteRow(id);
        } catch (e) {
            console.error("Failed to delete row:", e);
            setError(e?.response?.data?.error || "Failed to delete row");
        }
    };

    const updateTask = (id, field, value) => {
        setSchedule(prev => prev.map(task =>
            task.id === id ? { ...task, [field]: value } : task
        ));
        if (field === 'time' || field === 'activity') {
            queueSave(id, { [field]: value });
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-900 dark:text-white">
            <Sidebar />
            <div className="ml-64 p-6 h-screen overflow-auto">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold mb-2 text-gray-900 dark:text-white">TimeTable</h1>
                    <p className="text-gray-600 dark:text-gray-400">Manage your weekly schedule</p>
                </div>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                        {error}
                    </div>
                )}

                <div className="bg-gray-100/70 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[900px]">
                            <thead>
                                <tr className="border-b border-gray-200 dark:border-gray-800">
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/70 w-32">
                                        Time
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/70 w-48">
                                        Activity
                                    </th>
                                    {weekDates.map((date, index) => {
                                        const { day, dateNum, month } = formatDate(date);
                                        return (
                                            <th key={index} className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/70 w-24">
                                                <div>{day}</div>
                                                <div className="text-xs text-gray-600 dark:text-gray-500">{month}/{dateNum}</div>
                                            </th>
                                        );
                                    })}
                                    <th className="px-4 py-3 text-center text-sm font-medium text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/70 w-20">
                                        
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={weekDates.length + 3} className="px-4 py-6 text-center text-gray-500">
                                            Loading...
                                        </td>
                                    </tr>
                                ) : schedule.map((task, rowIndex) => (
                                    <tr key={task.id} className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-200/60 dark:hover:bg-gray-800/30 transition">
                                        <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-800">
                                            <input
                                                type="time"
                                                value={task.time}
                                                onChange={(e) => updateTask(task.id, 'time', e.target.value)}
                                                className="w-full bg-transparent text-sm focus:outline-none focus:text-cyan-400 transition cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                                placeholder="Select time"
                                            />
                                        </td>
                                        <td className="px-4 py-3 border-r border-gray-200 dark:border-gray-800">
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
                                                <td key={colIndex} className="px-4 py-3 border-r border-gray-200 dark:border-gray-800 text-center">
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