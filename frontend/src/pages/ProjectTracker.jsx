import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import { projectsAPI, tasksAPI } from "../services/api";

const ProjectTracker = () => {
    const colorOptions = {
        blue: { bg: 'rgba(59,130,246,0.12)', text: '#60A5FA', border: 'rgba(59,130,246,0.25)' },
        green: { bg: 'rgba(34,197,94,0.12)', text: '#4ADE80', border: 'rgba(34,197,94,0.25)' },
        red: { bg: 'rgba(239,68,68,0.12)', text: '#F87171', border: 'rgba(239,68,68,0.25)' },
        yellow: { bg: 'rgba(234,179,8,0.12)', text: '#FACC15', border: 'rgba(234,179,8,0.25)' },
        purple: { bg: 'rgba(168,85,247,0.12)', text: '#C084FC', border: 'rgba(168,85,247,0.25)' },
        orange: { bg: 'rgba(249,115,22,0.12)', text: '#FB923C', border: 'rgba(249,115,22,0.25)' },
        teal: { bg: 'rgba(20,184,166,0.12)', text: '#2DD4BF', border: 'rgba(20,184,166,0.25)' },
        gray: { bg: 'rgba(107,114,128,0.12)', text: '#9CA3AF', border: 'rgba(107,114,128,0.25)' },
        indigo: { bg: 'rgba(99,102,241,0.12)', text: '#818CF8', border: 'rgba(99,102,241,0.25)' },
        cyan: { bg: 'rgba(0,210,255,0.1)', text: 'var(--cyan)', border: 'rgba(0,210,255,0.25)' },
    };

    const solidColors = {
        blue: '#3B82F6', green: '#22C55E', red: '#EF4444', yellow: '#EAB308',
        purple: '#A855F7', orange: '#F97316', teal: '#14B8A6', gray: '#6B7280',
        indigo: '#6366F1', cyan: '#00D2FF',
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalColumn, setModalColumn] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({ title: "", description: "", tag: "", tagColor: "cyan", startDate: "", dueDate: "" });
    const [tasks, setTasks] = useState({ todo: [], inProgress: [], done: [] });
    const [activeProjectId, setActiveProjectId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (error) { const t = setTimeout(() => setError(""), 5000); return () => clearTimeout(t); }
    }, [error]);

    useEffect(() => {
        const init = async () => {
            setLoading(true); setError("");
            try {
                const projectsRes = await projectsAPI.getAll();
                let project = projectsRes.data?.[0];
                if (!project) {
                    const created = await projectsAPI.create({ name: "My Project", description: "", color: "blue" });
                    project = created.data;
                }
                setActiveProjectId(project._id);
                const tasksRes = await tasksAPI.getAll({ project: project._id });
                const board = { todo: [], inProgress: [], done: [] };
                (tasksRes.data || []).forEach((t) => {
                    const status = t.status || "todo";
                    const uiTask = { ...t, id: t._id };
                    if (board[status]) board[status].push(uiTask);
                });
                setTasks(board);
            } catch (e) {
                console.error("Failed to load project board:", e);
                setError(e?.response?.data?.error || "Failed to load board");
            } finally { setLoading(false); }
        };
        init();
    }, []);

    const [draggingTaskId, setDraggingTaskId] = useState(null);
    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null);

    const handleDragStart = (e, task, column) => {
        e.dataTransfer.effectAllowed = "move";
        const payload = JSON.stringify({ taskId: task.id, sourceColumn: column });
        e.dataTransfer.setData("text/plain", payload);
        e.dataTransfer.setData("application/json", payload);
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("sourceColumn", column);
        try { e.dataTransfer.setDragImage(e.currentTarget, 24, 24); } catch { }
        setDraggingTaskId(task.id); setDraggedTask(task); setDraggedFrom(column);
    };

    const handleDragOver = (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; };

    const handleDrop = async (e, column) => {
        e.preventDefault(); e.stopPropagation();
        let taskId = e.dataTransfer.getData("taskId");
        let sourceColumn = e.dataTransfer.getData("sourceColumn");
        if (!taskId || !sourceColumn) {
            const text = e.dataTransfer.getData("text/plain");
            if (text) { try { const p = JSON.parse(text); taskId = p?.taskId; sourceColumn = p?.sourceColumn; } catch { } }
        }
        if (taskId && sourceColumn) {
            if (sourceColumn === column) { setDraggedTask(null); setDraggedFrom(null); setDraggingTaskId(null); return; }
            let movedTask = null;
            setTasks(prev => {
                const taskToMove = prev[sourceColumn].find(t => t.id === taskId);
                movedTask = taskToMove;
                if (taskToMove) {
                    return {
                        ...prev,
                        [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
                        [column]: [...prev[column], { ...taskToMove, status: column, completed: column === 'done' }]
                    };
                }
                return prev;
            });
            try { await tasksAPI.move(taskId, column); } catch (err) {
                console.error("Failed to move task:", err);
                if (movedTask) {
                    setTasks(prev => {
                        const without = prev[column].filter(t => t.id !== taskId);
                        return { ...prev, [column]: without, [sourceColumn]: [...prev[sourceColumn], movedTask] };
                    });
                }
                setError(err?.response?.data?.error || err?.message || "Failed to move task");
            }
        }
        setDraggedTask(null); setDraggedFrom(null); setDraggingTaskId(null);
    };

    const handleDragEnd = () => { setDraggedTask(null); setDraggedFrom(null); setDraggingTaskId(null); };

    const addNewTask = (column) => {
        setModalColumn(column); setEditingTask(null);
        setFormData({ title: "", description: "", tag: "", tagColor: "cyan", startDate: "", dueDate: "" });
        setShowModal(true);
    };

    const formatDateToDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    const formatDateToInput = (displayDate) => {
        if (!displayDate) return "";
        const date = new Date(displayDate);
        if (isNaN(date.getTime())) return "";
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    };

    const handleEditTask = (task, column) => {
        setModalColumn(column); setEditingTask(task);
        setFormData({
            title: task.title, description: task.description || "",
            tag: task.tag, tagColor: task.tagColor || "cyan",
            startDate: formatDateToInput(task.startDate), dueDate: formatDateToInput(task.dueDate)
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        (async () => {
            if (!activeProjectId) { setError("Project not ready yet"); return; }
            setError("");
            const payload = {
                title: formData.title, description: formData.description,
                tag: formData.tag, tagColor: formData.tagColor,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
                status: modalColumn, project: activeProjectId
            };
            try {
                if (editingTask) {
                    const updated = await tasksAPI.update(editingTask.id, payload);
                    const updatedTask = { ...updated.data, id: updated.data._id };
                    setTasks(prev => ({
                        ...prev,
                        todo: prev.todo.filter(t => t.id !== editingTask.id),
                        inProgress: prev.inProgress.filter(t => t.id !== editingTask.id),
                        done: prev.done.filter(t => t.id !== editingTask.id),
                        [updatedTask.status || modalColumn]: [...prev[updatedTask.status || modalColumn], updatedTask]
                    }));
                } else {
                    const created = await tasksAPI.create(payload);
                    const createdTask = { ...created.data, id: created.data._id };
                    const status = createdTask.status || modalColumn;
                    setTasks(prev => ({ ...prev, [status]: [...prev[status], createdTask] }));
                }
                setShowModal(false); setEditingTask(null);
                setFormData({ title: "", description: "", tag: "", tagColor: "cyan", startDate: "", dueDate: "" });
            } catch (err) {
                console.error("Failed to save task:", err);
                setError(err?.response?.data?.error || "Failed to save task");
            }
        })();
    };

    const handleFormChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));

    const filteredTasks = (columnTasks) => {
        if (!searchQuery) return columnTasks;
        return columnTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (task.tag || "").toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const handleDeleteTask = async (e, taskId, column) => {
        e.stopPropagation();
        if (!window.confirm("Delete this task?")) return;
        try {
            await tasksAPI.delete(taskId);
            setTasks(prev => ({ ...prev, [column]: prev[column].filter(t => t.id !== taskId) }));
        } catch (err) { setError(err?.response?.data?.error || "Failed to delete task"); }
    };

    const columnConfig = [
        { key: 'todo', label: 'TO DO', indicatorColor: 'var(--slate)' },
        { key: 'inProgress', label: 'IN PROGRESS', indicatorColor: 'var(--cyan)' },
        { key: 'done', label: 'DONE', indicatorColor: '#4ADE80' },
    ];

    const TaskCard = ({ task, column }) => (
        <div
            draggable
            onDragStart={(e) => handleDragStart(e, task, column)}
            onDragEnd={handleDragEnd}
            onClick={() => handleEditTask(task, column)}
            style={{
                background: 'var(--canvas)', border: `1px solid ${draggingTaskId === task.id ? 'var(--cyan)' : 'var(--border)'}`,
                borderRadius: '10px', padding: '14px', marginBottom: '8px', cursor: 'pointer',
                opacity: draggingTaskId === task.id ? 0.6 : 1,
                transition: 'border-color 0.15s, opacity 0.15s',
                position: 'relative',
                userSelect: 'none',
            }}
            onMouseEnter={e => { if (draggingTaskId !== task.id) e.currentTarget.style.borderColor = 'rgba(0,210,255,0.3)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = draggingTaskId === task.id ? 'var(--cyan)' : 'var(--border)'; }}
            className="group"
        >
            {/* Delete button */}
            <button
                onClick={(e) => handleDeleteTask(e, task.id, column)}
                style={{
                    position: 'absolute', top: '10px', right: '10px',
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: '5px', padding: '3px', cursor: 'pointer',
                    color: '#F87171', opacity: 0, transition: 'opacity 0.15s',
                }}
                className="group-hover:opacity-100"
                title="Delete task"
            >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
                </svg>
            </button>

            <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--white)', marginBottom: '6px', paddingRight: '20px', lineHeight: '1.4' }}>
                {task.title}
            </h3>
            {task.description && (
                <p style={{ fontSize: '11px', color: 'var(--slate)', marginBottom: '10px', lineHeight: '1.5', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                    {task.description}
                </p>
            )}
            {task.tag && (
                <span style={{
                    display: 'inline-block', padding: '3px 8px', borderRadius: '5px', fontSize: '10px', fontWeight: '600',
                    letterSpacing: '0.05em', marginBottom: '10px',
                    background: colorOptions[task.tagColor || 'cyan']?.bg || colorOptions.cyan.bg,
                    color: colorOptions[task.tagColor || 'cyan']?.text || colorOptions.cyan.text,
                    border: `1px solid ${colorOptions[task.tagColor || 'cyan']?.border || colorOptions.cyan.border}`,
                }}>
                    {task.tag}
                </span>
            )}
            {task.dueDate && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', paddingTop: '8px', borderTop: '1px solid var(--border)' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--slate)" strokeWidth="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span style={{ fontSize: '11px', color: 'var(--slate)' }}>{formatDateToDisplay(task.dueDate)}</span>
                </div>
            )}
        </div>
    );

    const Column = ({ title, count, column, tasks: colTasks, indicatorColor }) => (
        <div
            style={{ flex: 1, minWidth: '260px' }}
            onDragEnter={handleDragOver} onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
        >
            <div
                style={{
                    background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px',
                    padding: '14px', minHeight: '500px', display: 'flex', flexDirection: 'column',
                }}
                onDragEnter={handleDragOver} onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column)}
            >
                {/* Column header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: indicatorColor }} />
                        <span style={{ fontSize: '11px', fontWeight: '700', color: 'var(--slate)', letterSpacing: '0.1em' }}>
                            {title}
                        </span>
                        <span style={{
                            fontSize: '11px', fontWeight: '600', padding: '1px 7px', borderRadius: '20px',
                            background: 'var(--border)', color: 'var(--slate)',
                        }}>
                            {count}
                        </span>
                    </div>
                </div>

                {/* Task cards */}
                <div
                    style={{ flex: 1 }}
                    onDragEnter={handleDragOver} onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column)}
                >
                    {filteredTasks(colTasks).map(task => (
                        <TaskCard key={task.id} task={task} column={column} />
                    ))}
                </div>

                {/* Add Task button */}
                <button
                    onClick={() => addNewTask(column)}
                    style={{
                        width: '100%', padding: '9px', marginTop: '8px',
                        border: '1.5px dashed var(--border)', borderRadius: '8px',
                        background: 'transparent', color: 'var(--slate)', cursor: 'pointer',
                        fontSize: '12px', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--cyan)'; e.currentTarget.style.color = 'var(--cyan)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--slate)'; }}
                >
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Add Task
                </button>
            </div>
        </div>
    );

    return (
        <DashboardLayout title="Project Tracker" tagline="Manage your work streams." noPadding>
            <div style={{ padding: '24px 32px' }}>
                {/* Search bar */}
                <div style={{ marginBottom: '20px', position: 'relative', maxWidth: '320px' }}>
                    <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate)' }}
                        width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
                    </svg>
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="th-input"
                        style={{ paddingLeft: '36px' }}
                    />
                </div>

                {error && (
                    <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '8px', color: '#F87171', fontSize: '13px' }}>
                        {error}
                    </div>
                )}

                {/* Kanban columns */}
                <div style={{ display: 'flex', gap: '14px', overflowX: 'auto', paddingBottom: '16px' }}>
                    {columnConfig.map(({ key, label, indicatorColor }) => (
                        <Column
                            key={key}
                            title={label}
                            count={filteredTasks(tasks[key]).length}
                            column={key}
                            tasks={tasks[key]}
                            indicatorColor={indicatorColor}
                        />
                    ))}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
                        {/* Modal header */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--white)', margin: 0 }}>
                                {editingTask ? "Edit Task" : "New Task"}
                            </h2>
                            <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '4px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>TITLE *</label>
                                <input type="text" required value={formData.title} onChange={e => handleFormChange('title', e.target.value)} placeholder="Task title" className="th-input" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>DESCRIPTION</label>
                                <textarea value={formData.description} onChange={e => handleFormChange('description', e.target.value)} rows={3} placeholder="Optional description" className="th-input" style={{ resize: 'none' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>TAG *</label>
                                    <input type="text" required value={formData.tag} onChange={e => handleFormChange('tag', e.target.value)} placeholder="e.g. Frontend" className="th-input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>TAG COLOR</label>
                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', paddingTop: '2px' }}>
                                        {Object.keys(solidColors).map(color => (
                                            <button
                                                key={color} type="button"
                                                onClick={() => handleFormChange('tagColor', color)}
                                                style={{
                                                    width: '22px', height: '22px', borderRadius: '50%',
                                                    background: solidColors[color], border: `2px solid ${formData.tagColor === color ? 'var(--white)' : 'transparent'}`,
                                                    cursor: 'pointer', transition: 'border-color 0.1s',
                                                }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>START DATE *</label>
                                    <input type="date" required value={formData.startDate} onChange={e => handleFormChange('startDate', e.target.value)} className="th-input" />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>DUE DATE *</label>
                                    <input type="date" required value={formData.dueDate} onChange={e => handleFormChange('dueDate', e.target.value)} className="th-input" />
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                                <button type="button" onClick={() => setShowModal(false)}
                                    style={{ flex: 1, padding: '10px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--slate)', cursor: 'pointer', fontSize: '13px', fontWeight: '500', transition: 'all 0.15s' }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    style={{ flex: 1, padding: '10px', background: 'var(--cyan)', border: 'none', borderRadius: '8px', color: 'var(--canvas)', cursor: 'pointer', fontSize: '13px', fontWeight: '700', transition: 'opacity 0.15s' }}>
                                    {editingTask ? "Update" : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </DashboardLayout>
    );
};

export default ProjectTracker;