import { useState, useRef, useEffect } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { todosAPI } from "../services/api";

const ToDo = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [hoveredTaskId, setHoveredTaskId] = useState(null);
    const dateScrollRef = useRef(null);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);

    useEffect(() => { fetchTasks(); }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await todosAPI.getAll();
            setTasks(response.data);
        } catch (error) { console.error('Error fetching tasks:', error); }
        finally { setLoading(false); }
    };

    const generateDates = () => {
        const dates = [];
        const today = new Date();
        for (let i = 0; i <= 30; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            dates.push(date);
        }
        return dates;
    };
    const dates = generateDates();

    const isToday = (date) => date.toDateString() === new Date().toDateString();
    const isSameDay = (d1, d2) => d1.toDateString() === d2.toDateString();

    const visibleTasks = tasks.filter((task) => {
        if (!task?.dueDate) return true;
        const due = new Date(task.dueDate);
        if (Number.isNaN(due.getTime())) return true;
        return isSameDay(due, selectedDate);
    });

    const scrollDates = (dir) => {
        if (dateScrollRef.current) {
            dateScrollRef.current.scrollBy({ left: dir === 'left' ? -200 : 200, behavior: 'smooth' });
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const response = await todosAPI.update(id, { completed: !task.completed });
            setTasks(tasks.map(t => t._id === id ? response.data : t));
        } catch (error) { console.error('Error toggling task:', error); }
    };

    const deleteTask = async (id) => {
        try {
            await todosAPI.delete(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) { console.error('Error deleting task:', error); }
    };

    const addTask = async () => {
        if (newTaskText.trim()) {
            try {
                const response = await todosAPI.create({
                    title: newTaskText,
                    dueDate: selectedDate.toISOString(),
                    completed: false
                });
                setTasks([...tasks, response.data]);
                setNewTaskText("");
            } catch (error) { console.error('Error adding task:', error); }
        }
    };

    const changeMonth = (offset) => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(calendarMonth.getMonth() + offset);
        setCalendarMonth(newMonth);
    };

    return (
        <DashboardLayout title="To-Do List" tagline="Organize and conquer your day.">
            {/* Date Strip */}
            <div style={{ marginBottom: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {/* Left arrow */}
                    <button
                        onClick={() => scrollDates('left')}
                        aria-label="Scroll left"
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid var(--border)', background: 'transparent',
                            color: 'var(--slate)', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--slate)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>

                    {/* Scrollable dates */}
                    <div
                        ref={dateScrollRef}
                        style={{ flex: 1, minWidth: 0, overflowX: 'auto', overflowY: 'hidden', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                    >
                        <div style={{ display: 'flex', gap: '8px', paddingBottom: '4px' }}>
                            {dates.map((date, idx) => {
                                const selected = isSameDay(date, selectedDate);
                                const today = isToday(date);
                                return (
                                    <button
                                        key={idx}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            flexShrink: 0, minWidth: '60px', padding: '8px 10px',
                                            borderRadius: '8px', border: `1px solid ${selected ? 'var(--cyan)' : today ? 'rgba(0,210,255,0.3)' : 'var(--border)'}`,
                                            background: selected ? 'var(--cyan)' : today ? 'var(--cyan-dim)' : 'var(--surface)',
                                            color: selected ? 'var(--canvas)' : today ? 'var(--cyan)' : 'var(--slate)',
                                            cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                                        }}
                                    >
                                        <div style={{ fontSize: '10px', fontWeight: '500', letterSpacing: '0.05em' }}>
                                            {date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: '18px', fontWeight: '700', lineHeight: '1.1', margin: '2px 0' }}>
                                            {date.getDate()}
                                        </div>
                                        <div style={{ fontSize: '10px', fontWeight: '400' }}>
                                            {date.toLocaleDateString('en-US', { month: 'short' })}
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right arrow */}
                    <button
                        onClick={() => scrollDates('right')}
                        aria-label="Scroll right"
                        style={{
                            width: '32px', height: '32px', borderRadius: '8px',
                            border: '1px solid var(--border)', background: 'transparent',
                            color: 'var(--slate)', cursor: 'pointer', flexShrink: 0,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            transition: 'all 0.15s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--slate)'; }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Main content + Mini calendar */}
            <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-start' }}>
                {/* Task list */}
                <div style={{ flex: 6, minWidth: 0 }}>
                    {/* Date heading */}
                    <div style={{ marginBottom: '16px' }}>
                        <h2 style={{ fontSize: '15px', fontWeight: '600', color: 'var(--white)' }}>
                            {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                        </h2>
                        <p style={{ fontSize: '12px', color: 'var(--slate)', marginTop: '3px' }}>
                            {visibleTasks.filter(t => !t.completed).length} task{visibleTasks.filter(t => !t.completed).length !== 1 ? 's' : ''} remaining
                        </p>
                    </div>

                    {/* Add task input */}
                    <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
                        <input
                            type="text"
                            value={newTaskText}
                            onChange={e => setNewTaskText(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && addTask()}
                            placeholder="Add a new task..."
                            className="th-input"
                        />
                        <button
                            onClick={addTask}
                            className="th-btn-primary"
                            style={{ flexShrink: 0, padding: '10px 18px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', textTransform: 'none', letterSpacing: '0' }}
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                            </svg>
                            Add Task
                        </button>
                    </div>

                    {/* Task list container */}
                    <div className="th-card" style={{ overflow: 'hidden' }}>
                        {loading ? (
                            <div style={{ padding: '48px', textAlign: 'center' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--border)', borderTopColor: 'var(--cyan)', margin: '0 auto 12px', animation: 'spin 1s linear infinite' }} />
                                <p style={{ fontSize: '13px', color: 'var(--slate)' }}>Loading tasks...</p>
                            </div>
                        ) : visibleTasks.length === 0 ? (
                            <div style={{ padding: '48px', textAlign: 'center' }}>
                                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="1.5" style={{ margin: '0 auto 12px', display: 'block', opacity: 0.5 }}>
                                    <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <p style={{ fontSize: '13px', color: 'var(--slate)' }}>No tasks for this day. Add one above!</p>
                            </div>
                        ) : (
                            <div>
                                {visibleTasks.map((task, idx) => (
                                    <div
                                        key={task._id}
                                        onMouseEnter={() => setHoveredTaskId(task._id)}
                                        onMouseLeave={() => setHoveredTaskId(null)}
                                        style={{
                                            display: 'flex', alignItems: 'center', gap: '12px',
                                            padding: '14px 16px',
                                            borderBottom: idx < visibleTasks.length - 1 ? '1px solid var(--border)' : 'none',
                                            background: hoveredTaskId === task._id ? 'rgba(0,210,255,0.03)' : 'transparent',
                                            transition: 'background 0.15s',
                                        }}
                                    >
                                        {/* Custom checkbox */}
                                        <label style={{ cursor: 'pointer', flexShrink: 0 }}>
                                            <input
                                                type="checkbox"
                                                checked={task.completed}
                                                onChange={() => toggleTask(task._id)}
                                                style={{ display: 'none' }}
                                            />
                                            <div style={{
                                                width: '18px', height: '18px', borderRadius: '4px',
                                                border: `2px solid ${task.completed ? 'var(--cyan)' : 'var(--slate-dark)'}`,
                                                background: task.completed ? 'var(--cyan)' : 'transparent',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                transition: 'all 0.15s',
                                            }}>
                                                {task.completed && (
                                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--canvas)" strokeWidth="3">
                                                        <polyline points="20 6 9 17 4 12" />
                                                    </svg>
                                                )}
                                            </div>
                                        </label>

                                        {/* Task text */}
                                        <span style={{
                                            flex: 1, fontSize: '13px', fontWeight: '400',
                                            color: task.completed ? 'var(--slate)' : 'var(--white)',
                                            textDecoration: task.completed ? 'line-through' : 'none',
                                            transition: 'all 0.15s',
                                        }}>
                                            {task.title ?? task.text}
                                        </span>

                                        {/* Delete button */}
                                        <button
                                            onClick={() => deleteTask(task._id)}
                                            style={{
                                                background: 'none', border: 'none', cursor: 'pointer',
                                                color: 'var(--slate)', padding: '4px', borderRadius: '4px',
                                                opacity: hoveredTaskId === task._id ? 1 : 0,
                                                transition: 'opacity 0.15s, color 0.15s',
                                                display: 'flex', alignItems: 'center',
                                            }}
                                            onMouseEnter={e => e.currentTarget.style.color = '#ff4d4d'}
                                            onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}
                                        >
                                            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Mini Calendar */}
                <div className="th-card hidden lg:flex flex-col" style={{ flex: 4, padding: '16px', position: 'sticky', top: 0, height: 'calc(100vh - 200px)' }}>
                    {/* Month header */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                        <span style={{ fontSize: '13px', fontWeight: '600', color: 'var(--white)' }}>
                            {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                        </span>
                        <div style={{ display: 'flex', gap: '4px' }}>
                            {[{ dir: -1, icon: '<' }, { dir: 1, icon: '>' }].map(({ dir, icon }) => (
                                <button
                                    key={dir}
                                    onClick={() => changeMonth(dir)}
                                    style={{
                                        width: '22px', height: '22px', border: 'none',
                                        background: 'transparent', color: 'var(--slate)', cursor: 'pointer',
                                        borderRadius: '4px', fontSize: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.color = 'var(--white)'}
                                    onMouseLeave={e => e.currentTarget.style.color = 'var(--slate)'}
                                >
                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                        {dir === -1
                                            ? <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                                            : <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                                        }
                                    </svg>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Day headers */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '6px' }}>
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                            <div key={i} style={{ textAlign: 'center', fontSize: '10px', color: 'var(--slate)', fontWeight: '600', padding: '2px' }}>
                                {d}
                            </div>
                        ))}
                    </div>

                    {/* Calendar days */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                        {(() => {
                            const year = calendarMonth.getFullYear();
                            const month = calendarMonth.getMonth();
                            const firstDay = new Date(year, month, 1).getDay();
                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                            const cells = [];
                            for (let i = 0; i < firstDay; i++) cells.push(<div key={`e-${i}`} />);
                            for (let day = 1; day <= daysInMonth; day++) {
                                const date = new Date(year, month, day);
                                const isSelected = isSameDay(date, selectedDate);
                                const isT = isToday(date);
                                cells.push(
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDate(date)}
                                        style={{
                                            aspectRatio: '1', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '11px', borderRadius: '4px', border: 'none', cursor: 'pointer',
                                            fontWeight: isSelected || isT ? '600' : '400',
                                            background: isSelected ? 'var(--cyan)' : isT ? 'var(--cyan-dim)' : 'transparent',
                                            color: isSelected ? 'var(--canvas)' : isT ? 'var(--cyan)' : 'var(--slate)',
                                            transition: 'all 0.1s',
                                        }}
                                        onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = 'var(--border)'; }}
                                        onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = isT ? 'var(--cyan-dim)' : 'transparent'; }}
                                    >
                                        {day}
                                    </button>
                                );
                            }
                            return cells;
                        })()}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ToDo;