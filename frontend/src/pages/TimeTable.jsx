import { useEffect, useMemo, useRef, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { timetableAPI } from "../services/api";

const TimeTable = () => {
    const [schedule, setSchedule] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const saveTimersRef = useRef(new Map());

    const normalizeDates = (dates) => {
        if (!dates) return {};
        if (dates instanceof Map) return Object.fromEntries(dates.entries());
        if (Array.isArray(dates)) { try { return Object.fromEntries(dates); } catch { return {}; } }
        if (typeof dates === 'object') return dates;
        return {};
    };

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

    const todayStr = useMemo(() => {
        const t = new Date();
        return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`;
    }, []);

    useEffect(() => {
        const load = async () => {
            setLoading(true); setError("");
            try {
                const res = await timetableAPI.getWeek(weekStartKey);
                const rows = (res.data || []).map((r) => ({
                    id: r._id, time: r.time || "", activity: r.activity || "", dates: normalizeDates(r.dates)
                }));
                setSchedule(rows);
            } catch (e) {
                console.error("Failed to load timetable:", e);
                setError(e?.response?.data?.error || "Failed to load timetable");
            } finally { setLoading(false); }
        };
        load();
    }, [weekStartKey]);

    const queueSave = (rowId, patch) => {
        const existing = saveTimersRef.current.get(rowId);
        if (existing) clearTimeout(existing);
        const timer = setTimeout(async () => {
            try { await timetableAPI.updateRow(rowId, patch); }
            catch (e) { console.error("Failed to save row:", e); setError(e?.response?.data?.error || "Failed to save row"); }
            finally { saveTimersRef.current.delete(rowId); }
        }, 400);
        saveTimersRef.current.set(rowId, timer);
    };

    const toggleCheckbox = async (taskId, dateKey) => {
        const row = schedule.find((t) => t.id === taskId);
        if (!row) return;
        const currentDates = normalizeDates(row.dates);
        const nextDates = { ...currentDates, [dateKey]: !currentDates[dateKey] };
        setSchedule(prev => prev.map(task => task.id === taskId ? { ...task, dates: nextDates } : task));
        try { await timetableAPI.updateRow(taskId, { dates: nextDates }); }
        catch (e) {
            console.error("Failed to toggle:", e);
            setError(e?.response?.data?.error || "Failed to update checkbox");
            setSchedule(prev => prev.map(task => task.id === taskId ? { ...task, dates: currentDates } : task));
        }
    };

    const addNewRow = async () => {
        setError("");
        try {
            const created = await timetableAPI.createRow({ weekStart: weekStartKey, time: "", activity: "", dates: {} });
            const row = created.data;
            setSchedule(prev => [...prev, { id: row._id, time: row.time || "", activity: row.activity || "", dates: row.dates || {} }]);
        } catch (e) { console.error("Failed to create row:", e); setError(e?.response?.data?.error || "Failed to create row"); }
    };

    const deleteRow = async (id) => {
        setSchedule(prev => prev.filter(task => task.id !== id));
        try { await timetableAPI.deleteRow(id); }
        catch (e) { console.error("Failed to delete row:", e); setError(e?.response?.data?.error || "Failed to delete row"); }
    };

    const updateTask = (id, field, value) => {
        setSchedule(prev => prev.map(task => task.id === id ? { ...task, [field]: value } : task));
        if (field === 'time' || field === 'activity') { queueSave(id, { [field]: value }); }
    };

    const cellStyle = {
        padding: '10px 12px',
        borderRight: '1px solid var(--border)',
        fontSize: '12px',
        color: 'var(--white)',
        verticalAlign: 'middle',
    };

    const headerCellStyle = {
        ...cellStyle,
        background: 'var(--canvas)',
        color: 'var(--slate)',
        fontSize: '11px',
        fontWeight: '600',
        letterSpacing: '0.06em',
        padding: '10px 12px',
        borderBottom: '1px solid var(--border)',
    };

    return (
        <DashboardLayout title="Time Table" tagline="Manage your weekly schedule.">
            {error && (
                <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px' }}>
                    {error}
                </div>
            )}

            <div className="th-card" style={{ overflow: 'hidden' }}>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', minWidth: '760px', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ ...headerCellStyle, width: '90px', textAlign: 'left' }}>TIME</th>
                                <th style={{ ...headerCellStyle, width: '180px', textAlign: 'left' }}>ACTIVITY</th>
                                {weekDates.map((date, idx) => {
                                    const { day, dateNum, month, fullDate } = formatDate(date);
                                    const isToday = fullDate === todayStr;
                                    return (
                                        <th key={idx} style={{
                                            ...headerCellStyle,
                                            textAlign: 'center',
                                            color: isToday ? 'var(--cyan)' : 'var(--slate)',
                                            minWidth: '70px',
                                        }}>
                                            <div>{day.toUpperCase()}</div>
                                            <div style={{ fontSize: '10px', opacity: 0.7, marginTop: '1px' }}>{month}/{dateNum}</div>
                                        </th>
                                    );
                                })}
                                <th style={{ ...headerCellStyle, width: '44px', borderRight: 'none' }} />
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={weekDates.length + 3} style={{ ...cellStyle, textAlign: 'center', padding: '40px', color: 'var(--slate)', borderRight: 'none' }}>
                                        <div style={{ width: '24px', height: '24px', borderRadius: '50%', border: '2px solid var(--border)', borderTopColor: 'var(--cyan)', margin: '0 auto 8px', animation: 'spin 1s linear infinite' }} />
                                        Loading...
                                    </td>
                                </tr>
                            ) : schedule.map((task, rowIndex) => (
                                <tr
                                    key={task.id}
                                    style={{
                                        borderBottom: '1px solid var(--border)',
                                        transition: 'background 0.1s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(0,210,255,0.02)'}
                                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                                >
                                    {/* Time */}
                                    <td style={{ ...cellStyle }}>
                                        <input
                                            type="time"
                                            value={task.time}
                                            onChange={(e) => updateTask(task.id, 'time', e.target.value)}
                                            style={{
                                                background: 'transparent', border: 'none', outline: 'none',
                                                color: 'var(--slate)', fontSize: '12px', fontFamily: 'Inter, sans-serif',
                                                cursor: 'pointer', width: '100%',
                                                transition: 'color 0.15s',
                                            }}
                                            onFocus={e => e.target.style.color = 'var(--cyan)'}
                                            onBlur={e => e.target.style.color = 'var(--slate)'}
                                        />
                                    </td>

                                    {/* Activity */}
                                    <td style={{ ...cellStyle }}>
                                        <input
                                            type="text"
                                            value={task.activity}
                                            onChange={(e) => updateTask(task.id, 'activity', e.target.value)}
                                            placeholder="Enter activity"
                                            style={{
                                                background: 'transparent', border: 'none', outline: 'none',
                                                color: 'var(--white)', fontSize: '12px', fontFamily: 'Inter, sans-serif',
                                                width: '100%', transition: 'color 0.15s',
                                            }}
                                            onFocus={e => e.target.style.color = 'var(--cyan)'}
                                            onBlur={e => e.target.style.color = 'var(--white)'}
                                        />
                                    </td>

                                    {/* Day checkboxes */}
                                    {weekDates.map((date, colIdx) => {
                                        const { fullDate } = formatDate(date);
                                        const isChecked = task.dates[fullDate] || false;
                                        const isToday = fullDate === todayStr;
                                        return (
                                            <td key={colIdx} style={{ ...cellStyle, textAlign: 'center' }}>
                                                <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                    <input
                                                        type="checkbox"
                                                        checked={isChecked}
                                                        onChange={() => toggleCheckbox(task.id, fullDate)}
                                                        style={{ display: 'none' }}
                                                    />
                                                    <div
                                                        style={{
                                                            width: '16px', height: '16px', borderRadius: '4px',
                                                            border: `1.5px solid ${isChecked ? 'var(--cyan)' : isToday ? 'rgba(0,210,255,0.4)' : 'var(--border)'}`,
                                                            background: isChecked ? 'var(--cyan)' : 'transparent',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                            transition: 'all 0.15s',
                                                        }}
                                                    >
                                                        {isChecked && (
                                                            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="var(--canvas)" strokeWidth="3.5">
                                                                <polyline points="20 6 9 17 4 12" />
                                                            </svg>
                                                        )}
                                                    </div>
                                                </label>
                                            </td>
                                        );
                                    })}

                                    {/* Delete */}
                                    <td style={{ ...cellStyle, textAlign: 'center', borderRight: 'none' }}>
                                        <button
                                            onClick={() => deleteRow(task.id)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--slate)', padding: '3px', borderRadius: '4px',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'color 0.15s',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#F87171'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}
                                            title="Delete row"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add row button */}
            <button
                onClick={addNewRow}
                style={{
                    marginTop: '14px', padding: '9px 16px',
                    background: 'var(--cyan-dim)', border: '1px solid rgba(0,210,255,0.25)',
                    borderRadius: '8px', color: 'var(--cyan)', cursor: 'pointer',
                    fontSize: '12px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px',
                    transition: 'all 0.15s', fontFamily: 'Inter, sans-serif',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(0,210,255,0.15)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--cyan-dim)'; }}
            >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                Add New Row
            </button>
        </DashboardLayout>
    );
};

export default TimeTable;