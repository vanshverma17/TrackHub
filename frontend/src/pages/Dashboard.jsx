import { useState, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { projectsAPI, tasksAPI, timeEntriesAPI, todosAPI } from "../services/api";

const Dashboard = () => {
    const TIME_TRACKER_STORAGE_KEY = 'trackhub.timeTracker';
    const [userName, setUserName] = useState("");
    const [sessionName, setSessionName] = useState("");

    // Pomodoro State
    const [pomodoroMode, setPomodoroMode] = useState("Work"); // "Work", "Short Break", "Long Break"
    const [pomodoroTime, setPomodoroTime] = useState(25 * 60);
    const [isPomodoroActive, setIsPomodoroActive] = useState(false);

    // Time Tracker State
    const [isTracking, setIsTracking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [startTime, setStartTime] = useState(null);
    const [timeEntries, setTimeEntries] = useState([]);
    const [weeklyData, setWeeklyData] = useState([]);
    const [totalHoursToday, setTotalHoursToday] = useState(0);
    const [totalHoursWeek, setTotalHoursWeek] = useState(0);

    // Stats State
    const [todaysTodosCompleted, setTodaysTodosCompleted] = useState(0);
    const [todaysTodosTotal, setTodaysTodosTotal] = useState(0);
    const [activeProjects, setActiveProjects] = useState(0);

    const persistTimeTrackerState = (next) => {
        try { localStorage.setItem(TIME_TRACKER_STORAGE_KEY, JSON.stringify(next)); } catch { }
    };
    const clearTimeTrackerState = () => {
        try { localStorage.removeItem(TIME_TRACKER_STORAGE_KEY); } catch { }
    };
    const restoreTimeTrackerState = () => {
        try {
            const raw = localStorage.getItem(TIME_TRACKER_STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            const restoredIsTracking = !!parsed?.isTracking;
            const restoredIsPaused = !!parsed?.isPaused;
            const restoredStartTime = typeof parsed?.startTime === 'number' ? parsed.startTime : null;
            const restoredElapsed = typeof parsed?.elapsedTime === 'number' ? parsed.elapsedTime : 0;
            setIsTracking(restoredIsTracking);
            setIsPaused(restoredIsPaused);
            setStartTime(restoredStartTime);
            if (restoredIsTracking && restoredStartTime) {
                setElapsedTime(Date.now() - restoredStartTime);
            } else {
                setElapsedTime(restoredElapsed);
            }
        } catch { }
    };

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        setUserName(user.name || 'User');
        fetchDashboardData();
        restoreTimeTrackerState();
    }, []);

    useEffect(() => {
        let interval;
        if (isTracking) {
            interval = setInterval(() => { setElapsedTime(Date.now() - startTime); }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking, startTime]);

    useEffect(() => {
        persistTimeTrackerState({ isTracking, isPaused, startTime, elapsedTime });
    }, [isTracking, isPaused, startTime, elapsedTime]);

    useEffect(() => {
        let interval;
        if (isPomodoroActive && pomodoroTime > 0) {
            interval = setInterval(() => { setPomodoroTime(prev => prev - 1); }, 1000);
        } else if (pomodoroTime === 0 && isPomodoroActive) {
            setIsPomodoroActive(false);
        }
        return () => clearInterval(interval);
    }, [isPomodoroActive, pomodoroTime]);

    const formatPomodoroTime = (seconds) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    const setPomodoro = (mode) => {
        setIsPomodoroActive(false);
        setPomodoroMode(mode);
        if (mode === "Work") setPomodoroTime(25 * 60);
        else if (mode === "Short Break") setPomodoroTime(5 * 60);
        else if (mode === "Long Break") setPomodoroTime(15 * 60);
    };

    const fetchDashboardData = async () => {
        try {
            const now = new Date();
            const weekStart = new Date(now);
            weekStart.setDate(now.getDate() - now.getDay());
            weekStart.setHours(0, 0, 0, 0);
            const weekEnd = new Date(weekStart);
            weekEnd.setDate(weekStart.getDate() + 6);
            weekEnd.setHours(23, 59, 59, 999);

            const [entriesRes, todosRes, tasksRes, projectsRes] = await Promise.all([
                timeEntriesAPI.getAll({ startDate: weekStart.toISOString(), endDate: weekEnd.toISOString() }),
                todosAPI.getAll(),
                tasksAPI.getAll(),
                projectsAPI.getAll(),
            ]);

            const entries = entriesRes.data || [];
            setTimeEntries(entries);
            calculateWeeklyData(entries);

            const todos = todosRes.data || [];
            const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();
            const todayDate = new Date();
            const todaysTodos = todos.filter((t) => {
                if (!t?.dueDate) return true;
                const due = new Date(t.dueDate);
                if (Number.isNaN(due.getTime())) return true;
                return isSameDay(due, todayDate);
            });
            setTodaysTodosTotal(todaysTodos.length);
            setTodaysTodosCompleted(todaysTodos.filter((t) => !!t.completed).length);

            const tasks = tasksRes.data || [];
            const inProgressProjectIds = new Set(
                tasks.filter((t) => (t?.status || "todo") === "inProgress")
                    .map((t) => (typeof t.project === "string" ? t.project : t?.project?._id))
                    .filter(Boolean)
            );
            const projects = projectsRes.data || [];
            const projectIds = new Set(projects.map((p) => p?._id).filter(Boolean));
            let active = 0;
            inProgressProjectIds.forEach((id) => { if (projectIds.has(id)) active += 1; });
            setActiveProjects(active);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        }
    };

    const calculateWeeklyData = (entries) => {
        const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weekData = daysOfWeek.map(day => ({ day, hours: 0 }));
        const now = new Date();
        const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);
        const tomorrowStart = new Date(todayStart); tomorrowStart.setDate(todayStart.getDate() + 1);
        let todayHours = 0, weekHours = 0;
        entries.forEach(entry => {
            const entryDate = new Date(entry.date);
            const dayIndex = entryDate.getDay();
            weekData[dayIndex].hours += entry.hours || 0;
            weekHours += entry.hours || 0;
            if (entryDate >= todayStart && entryDate < tomorrowStart) { todayHours += entry.hours || 0; }
        });
        setWeeklyData(weekData);
        setTotalHoursToday(todayHours);
        setTotalHoursWeek(weekHours);
    };

    const handleClockIn = () => {
        const now = Date.now();
        setIsTracking(true); setIsPaused(false); setStartTime(now); setElapsedTime(0);
        persistTimeTrackerState({ isTracking: true, isPaused: false, startTime: now, elapsedTime: 0 });
    };

    const handleClockOut = async () => {
        setIsTracking(false); setIsPaused(false);
        const hours = elapsedTime / (1000 * 60 * 60);
        try {
            const now = new Date();
            const startTimeObj = new Date(startTime);
            await timeEntriesAPI.create({
                date: now.toISOString(),
                startTime: startTimeObj.toTimeString().slice(0, 5),
                endTime: now.toTimeString().slice(0, 5),
                hours: parseFloat(hours.toFixed(2)),
                description: sessionName || 'Work Session'
            });
            fetchDashboardData();
        } catch (error) { console.error('Error saving time entry:', error); }
        clearTimeTrackerState(); setElapsedTime(0); setStartTime(null);
    };

    const formatTime = (ms) => {
        const totalSeconds = Math.floor(ms / 1000);
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
    };

    // Re-order weekly data to start from MON
    const orderedDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chartData = orderedDays.map(day => weeklyData.find(d => d.day === day) || { day, hours: 0 });
    const maxHours = Math.max(...chartData.map(d => d.hours), 1);
    const todayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'][new Date().getDay()];

    const metrics = [
        {
            id: 1,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
            ),
            topLabel: 'TODAY',
            value: todaysTodosCompleted,
            valueSuffix: `/${todaysTodosTotal}`,
            bottomLabel: 'Tasks Completed',
            active: todaysTodosCompleted > 0,
            isActive: true,
        },
        {
            id: 2,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                </svg>
            ),
            topLabel: 'ACTIVE',
            value: totalHoursToday.toFixed(1),
            valueSuffix: 'h',
            bottomLabel: 'Hours Today',
            active: isTracking,
        },
        {
            id: 3,
            icon: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z" />
                </svg>
            ),
            topLabel: 'THIS WEEK',
            value: activeProjects,
            valueSuffix: '',
            bottomLabel: 'Active Projects',
            active: false,
        },
    ];

    // Action footer
    const actionFooter = (
        <div className="th-action-footer" style={{
            display: 'flex', alignItems: 'center', gap: '16px',
            padding: '14px 20px',
        }}>
            {/* Play/Pause button */}
            <button
                onClick={() => {
                    if (!isTracking) {
                        if (isPaused) { setIsTracking(true); setIsPaused(false); setStartTime(Date.now() - elapsedTime); }
                        else handleClockIn();
                    } else { setIsTracking(false); setIsPaused(true); }
                }}
                style={{
                    width: '38px', height: '38px', borderRadius: '50%', border: '1px solid var(--border)',
                    background: isTracking ? 'var(--cyan-dim)' : 'transparent',
                    color: isTracking ? 'var(--cyan)' : 'var(--slate)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                    flexShrink: 0, transition: 'all 0.15s ease',
                }}
                aria-label={isTracking ? 'Pause' : 'Play'}
            >
                {isTracking ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                    </svg>
                ) : (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z" />
                    </svg>
                )}
            </button>

            {/* Session info */}
            <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <input
                    type="text"
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    placeholder="What are you working on?"
                    style={{
                        background: 'transparent',
                        border: 'none',
                        color: 'var(--white)',
                        fontSize: '13px',
                        fontWeight: '600',
                        outline: 'none',
                        padding: 0,
                        width: '100%',
                        textOverflow: 'ellipsis'
                    }}
                />
                <div style={{ fontSize: '11px', color: 'var(--slate)' }}>
                    {isTracking ? 'Tracking time...' : isPaused ? 'Session Paused' : 'TrackHub Workspace'}
                </div>
            </div>

            {/* Timer display */}
            <div className="th-timer" style={{ fontSize: '24px', flexShrink: 0 }}>
                <span style={{ color: 'var(--cyan)' }}>{formatTime(elapsedTime).split(':')[0]}</span>
                <span style={{ color: 'var(--slate)' }}>:</span>
                <span style={{ color: 'var(--cyan)' }}>{formatTime(elapsedTime).split(':')[1]}</span>
                <span style={{ color: 'var(--slate)' }}>:</span>
                <span style={{ color: 'var(--cyan)' }}>{formatTime(elapsedTime).split(':')[2]}</span>
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                <button
                    onClick={handleClockOut}
                    disabled={!isTracking && !isPaused}
                    className="th-btn-ghost"
                    style={{ opacity: (!isTracking && !isPaused) ? 0.4 : 1 }}
                >
                    CLOCK OUT
                </button>
                <button
                    onClick={() => {
                        if (!isTracking) {
                            if (isPaused) { setIsTracking(true); setIsPaused(false); setStartTime(Date.now() - elapsedTime); }
                            else handleClockIn();
                        }
                    }}
                    disabled={isTracking}
                    className="th-btn-primary"
                    style={{ opacity: isTracking ? 0.4 : 1 }}
                >
                    CLOCK IN
                </button>
            </div>
        </div>
    );

    return (
        <DashboardLayout
            title="Dashboard"
            tagline="Stay focused. Track your progress."
        >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                {/* Metrics Row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    {metrics.map((metric) => (
                        <div key={metric.id} className={`th-metric-card${metric.active ? ' active' : ''}`}>
                            {/* Top row: icon + label */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                <div className="th-icon-box" style={{ color: 'var(--cyan)' }}>
                                    {metric.icon}
                                </div>
                                <span style={{
                                    fontSize: '10px', fontWeight: '600', letterSpacing: '0.1em',
                                    color: metric.active ? 'var(--cyan)' : 'var(--slate)',
                                    display: 'flex', alignItems: 'center', gap: '4px'
                                }}>
                                    {metric.active && (
                                        <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--cyan)', display: 'inline-block', flexShrink: 0 }} />
                                    )}
                                    {metric.topLabel}
                                </span>
                            </div>
                            {/* Value */}
                            <div style={{ marginBottom: '8px' }}>
                                <span style={{ fontSize: '40px', fontWeight: '800', color: 'var(--white)', letterSpacing: '-0.03em', lineHeight: '1' }}>
                                    {metric.value}
                                </span>
                                {metric.valueSuffix && (
                                    <span style={{ fontSize: '20px', fontWeight: '600', color: 'var(--slate)', marginLeft: '2px' }}>
                                        {metric.valueSuffix}
                                    </span>
                                )}
                            </div>
                            {/* Bottom label */}
                            <div style={{ fontSize: '12px', color: 'var(--slate)', fontWeight: '400' }}>
                                {metric.bottomLabel}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Clock In / Out Panel */}
                {actionFooter}

                {/* Bottom Row: Recent Activity & Pomodoro */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Recent Sessions */}
                    <div className="th-card" style={{ padding: '20px' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--white)', marginBottom: '14px' }}>
                            Recent Sessions
                        </h2>
                        {timeEntries.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {timeEntries.slice(0, 4).map((entry, idx) => (
                                    <div key={idx} style={{
                                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                        padding: '10px 12px', borderRadius: '8px', background: 'var(--canvas)',
                                        border: '1px solid var(--border)',
                                    }}>
                                        <div>
                                            <div style={{ fontSize: '12px', fontWeight: '500', color: 'var(--white)' }}>
                                                {entry.description || 'Work Session'}
                                            </div>
                                            <div style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '2px' }}>
                                                {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} · {entry.startTime}–{entry.endTime}
                                            </div>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: 'var(--cyan)' }}>
                                            {entry.hours}h
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div style={{ fontSize: '13px', color: 'var(--slate)' }}>No recent sessions.</div>
                        )}
                    </div>

                    {/* Pomodoro Timer */}
                    <div className="th-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                        <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--white)', marginBottom: '14px', alignSelf: 'flex-start' }}>
                            Pomodoro Timer
                        </h2>

                        <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', background: 'var(--canvas)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            {['Work', 'Short Break', 'Long Break'].map(mode => (
                                <button
                                    key={mode}
                                    onClick={() => setPomodoro(mode)}
                                    style={{
                                        background: pomodoroMode === mode ? 'var(--surface)' : 'transparent',
                                        color: pomodoroMode === mode ? 'var(--cyan)' : 'var(--slate)',
                                        border: pomodoroMode === mode ? '1px solid var(--border)' : '1px solid transparent',
                                        padding: '6px 12px', borderRadius: '6px', fontSize: '11px', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s'
                                    }}
                                >
                                    {mode}
                                </button>
                            ))}
                        </div>

                        <div style={{ fontSize: '56px', fontWeight: '800', color: 'var(--white)', letterSpacing: '0.05em', lineHeight: 1, marginBottom: '24px', fontFamily: "'Inter', monospace" }}>
                            {formatPomodoroTime(pomodoroTime)}
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                            <button
                                onClick={() => setIsPomodoroActive(!isPomodoroActive)}
                                className="th-btn-primary"
                                style={{ padding: '10px 24px', fontSize: '14px' }}
                            >
                                {isPomodoroActive ? 'PAUSE' : 'START'}
                            </button>
                            <button
                                onClick={() => setPomodoro(pomodoroMode)}
                                className="th-btn-ghost"
                                style={{ padding: '10px 24px', fontSize: '14px' }}
                            >
                                RESET
                            </button>
                        </div>
                    </div>
                </div>

                {/* Weekly Activity Chart — full width */}
                <div className="th-chart-block">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <div>
                            <h2 style={{ fontSize: '14px', fontWeight: '600', color: 'var(--white)', margin: 0 }}>Weekly Activity</h2>
                            <p style={{ fontSize: '11px', color: 'var(--slate)', marginTop: '3px' }}>
                                {totalHoursWeek.toFixed(1)}h total this week
                            </p>
                        </div>
                        <button style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '4px' }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="5" r="1" fill="currentColor" />
                                <circle cx="12" cy="12" r="1" fill="currentColor" />
                                <circle cx="12" cy="19" r="1" fill="currentColor" />
                            </svg>
                        </button>
                    </div>

                    {/* Chart */}
                    <div style={{ height: '160px', display: 'flex', alignItems: 'flex-end', gap: '10px', paddingBottom: '4px', marginTop: '16px' }}>
                        {chartData.map((data, idx) => {
                            const heightPct = (data.hours / maxHours) * 100;
                            const isToday = data.day === todayName;
                            return (
                                <div key={data.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', height: '100%' }}>
                                    <div style={{ flex: 1, width: '100%', display: 'flex', alignItems: 'flex-end' }}>
                                        <div
                                            style={{
                                                width: '100%',
                                                height: data.hours > 0 ? `${heightPct}%` : '4px',
                                                minHeight: data.hours > 0 ? '8px' : '4px',
                                                borderRadius: '4px 4px 0 0',
                                                background: isToday ? 'var(--cyan)' : data.hours > 0 ? '#2A2D35' : '#1E2026',
                                                boxShadow: isToday && data.hours > 0 ? '0 0 10px var(--cyan-glow)' : 'none',
                                                transition: 'height 0.8s ease-out',
                                            }}
                                        />
                                    </div>
                                    <span style={{
                                        fontSize: '10px', fontWeight: '500',
                                        color: isToday ? 'var(--cyan)' : 'var(--slate)',
                                        letterSpacing: '0.05em',
                                    }}>
                                        {data.day.toUpperCase()}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;