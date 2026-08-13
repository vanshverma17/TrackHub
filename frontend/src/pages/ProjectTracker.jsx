import { useEffect, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
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
    const [projects, setProjects] = useState([]);
    const [selectedProjectId, setSelectedProjectId] = useState(null);
    const [selectedProject, setSelectedProject] = useState(null);
    const [currentView, setCurrentView] = useState('projects');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [tasksByProject, setTasksByProject] = useState({});
    const [showProjectModal, setShowProjectModal] = useState(false);
    const [editingProject, setEditingProject] = useState(null);
    const [projectForm, setProjectForm] = useState({ name: '', description: '', color: 'cyan' });

    useEffect(() => {
        if (error) { const t = setTimeout(() => setError(""), 5000); return () => clearTimeout(t); }
    }, [error]);

    const buildBoardFromTasks = (rawTasks = []) => {
        const board = { todo: [], inProgress: [], done: [] };
        (rawTasks || []).forEach((t) => {
            const status = t.status || "todo";
            const uiTask = { ...t, id: t._id };
            if (board[status]) board[status].push(uiTask);
        });
        return board;
    };

    const loadProjects = async () => {
        setLoading(true); setError("");
        try {
            const projectsRes = await projectsAPI.getAll();
            let projectList = projectsRes.data || [];
            if (!projectList.length) {
                const created = await projectsAPI.create({ name: "My Project", description: "Workspace overview", color: "blue" });
                projectList = [created.data];
            }
            setProjects(projectList);
        } catch (e) {
            console.error("Failed to load projects:", e);
            setError(e?.response?.data?.error || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjectBoard = async (projectId) => {
        if (!projectId) return;
        setLoading(true); setError("");
        try {
            const tasksRes = await tasksAPI.getAll({ project: projectId });
            const board = buildBoardFromTasks(tasksRes.data || []);
            setTasks(board);
            setTasksByProject(prev => ({ ...prev, [projectId]: board }));
        } catch (e) {
            console.error("Failed to load project board:", e);
            setError(e?.response?.data?.error || "Failed to load board");
        } finally {
            setLoading(false);
        }
    };

    const openProject = async (project) => {
        const projectId = project?._id || project?.id;
        if (!projectId) return;

        setSelectedProject(project);
        setSelectedProjectId(projectId);
        setCurrentView('board');

        if (tasksByProject[projectId]) {
            setTasks(tasksByProject[projectId]);
            return;
        }

        await loadProjectBoard(projectId);
    };

    const backToProjects = () => {
        setCurrentView('projects');
        setSelectedProject(null);
        setSelectedProjectId(null);
        setTasks({ todo: [], inProgress: [], done: [] });
    };

    const openProjectModal = (project = null) => {
        setEditingProject(project);
        setProjectForm({
            name: project?.name || '',
            description: project?.description || '',
            color: project?.color || 'cyan',
        });
        setShowProjectModal(true);
    };

    const handleProjectFormChange = (field, value) => setProjectForm(prev => ({ ...prev, [field]: value }));

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        if (!projectForm.name.trim()) {
            setError('Project name is required');
            return;
        }

        try {
            setLoading(true); setError('');
            if (editingProject) {
                const updated = await projectsAPI.update(editingProject._id || editingProject.id, {
                    name: projectForm.name.trim(),
                    description: projectForm.description.trim(),
                    color: projectForm.color,
                });
                setProjects(prev => prev.map(project => {
                    const projectId = project._id || project.id;
                    const updatedId = updated.data?._id || updated.data?.id;
                    return (projectId === updatedId) ? { ...project, ...updated.data } : project;
                }));
                if (selectedProjectId === (updated.data?._id || updated.data?.id)) {
                    setSelectedProject({ ...selectedProject, ...updated.data });
                }
            } else {
                const created = await projectsAPI.create({
                    name: projectForm.name.trim(),
                    description: projectForm.description.trim(),
                    color: projectForm.color,
                });
                setProjects(prev => [created.data, ...prev]);
            }
            setShowProjectModal(false);
            setEditingProject(null);
            setProjectForm({ name: '', description: '', color: 'cyan' });
        } catch (err) {
            console.error('Failed to save project:', err);
            setError(err?.response?.data?.error || 'Failed to save project');
        } finally {
            setLoading(false);
        }
    };

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
        if (!selectedProjectId || !taskId || !sourceColumn) {
            setDraggedTask(null); setDraggedFrom(null); setDraggingTaskId(null); return;
        }
        if (sourceColumn === column) { setDraggedTask(null); setDraggedFrom(null); setDraggingTaskId(null); return; }

        let movedTask = null;
        setTasks(prev => {
            const taskToMove = prev[sourceColumn].find(t => t.id === taskId);
            movedTask = taskToMove;
            if (taskToMove) {
                const nextBoard = {
                    ...prev,
                    [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
                    [column]: [...prev[column], { ...taskToMove, status: column, completed: column === 'done' }]
                };
                setTasksByProject(current => ({ ...current, [selectedProjectId]: nextBoard }));
                return nextBoard;
            }
            return prev;
        });

        try { await tasksAPI.move(taskId, column); } catch (err) {
            console.error("Failed to move task:", err);
            if (movedTask) {
                setTasks(prev => {
                    const without = prev[column].filter(t => t.id !== taskId);
                    const reverted = { ...prev, [column]: without, [sourceColumn]: [...prev[sourceColumn], movedTask] };
                    setTasksByProject(current => ({ ...current, [selectedProjectId]: reverted }));
                    return reverted;
                });
            }
            setError(err?.response?.data?.error || err?.message || "Failed to move task");
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
            if (!selectedProjectId) { setError("Project not ready yet"); return; }
            setError("");
            const payload = {
                title: formData.title, description: formData.description,
                tag: formData.tag, tagColor: formData.tagColor,
                startDate: formData.startDate ? new Date(formData.startDate).toISOString() : undefined,
                dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : undefined,
                status: modalColumn, project: selectedProjectId
            };
            try {
                if (editingTask) {
                    const updated = await tasksAPI.update(editingTask.id, payload);
                    const updatedTask = { ...updated.data, id: updated.data._id };
                    setTasks(prev => {
                        const nextBoard = {
                            ...prev,
                            todo: prev.todo.filter(t => t.id !== editingTask.id),
                            inProgress: prev.inProgress.filter(t => t.id !== editingTask.id),
                            done: prev.done.filter(t => t.id !== editingTask.id),
                            [updatedTask.status || modalColumn]: [...prev[updatedTask.status || modalColumn], updatedTask]
                        };
                        setTasksByProject(current => ({ ...current, [selectedProjectId]: nextBoard }));
                        return nextBoard;
                    });
                } else {
                    const created = await tasksAPI.create(payload);
                    const createdTask = { ...created.data, id: created.data._id };
                    const status = createdTask.status || modalColumn;
                    setTasks(prev => {
                        const nextBoard = { ...prev, [status]: [...prev[status], createdTask] };
                        setTasksByProject(current => ({ ...current, [selectedProjectId]: nextBoard }));
                        return nextBoard;
                    });
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
            setTasks(prev => {
                const nextBoard = { ...prev, [column]: prev[column].filter(t => t.id !== taskId) };
                setTasksByProject(current => ({ ...current, [selectedProjectId]: nextBoard }));
                return nextBoard;
            });
        } catch (err) { setError(err?.response?.data?.error || "Failed to delete task"); }
    };

    const projectSummary = (projectId) => {
        const board = tasksByProject[projectId] || { todo: [], inProgress: [], done: [] };
        const total = board.todo.length + board.inProgress.length + board.done.length;
        const done = board.done.length;
        const progress = total ? Math.round((done / total) * 100) : 0;

        return { total, done, progress };
    };

    const handleDeleteProject = async (projectId) => {
        if (!projectId) return;
        const project = projects.find(item => (item._id || item.id) === projectId);
        if (!window.confirm(`Delete project "${project?.name || 'this project'}"? This will also remove its tasks.`)) return;

        try {
            await projectsAPI.delete(projectId);
            setProjects(prev => prev.filter(item => (item._id || item.id) !== projectId));
            setTasksByProject(prev => {
                const next = { ...prev };
                delete next[projectId];
                return next;
            });
            if (selectedProjectId === projectId) {
                backToProjects();
            }
        } catch (err) {
            setError(err?.response?.data?.error || 'Failed to delete project');
        }
    };

    const columnConfig = [
        { key: 'todo', label: 'TO DO', indicatorColor: 'var(--slate)' },
        { key: 'inProgress', label: 'IN PROGRESS', indicatorColor: 'var(--cyan)' },
        { key: 'done', label: 'DONE', indicatorColor: '#4ADE80' },
    ];

    const TaskCard = ({ task, column }) => {
        const [isHovered, setIsHovered] = useState(false);

        return (
            <div
                draggable
                onDragStart={(e) => handleDragStart(e, task, column)}
                onDragEnd={handleDragEnd}
                onClick={() => handleEditTask(task, column)}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    background: 'var(--canvas)', border: `1px solid ${draggingTaskId === task.id ? 'var(--cyan)' : 'var(--border)'}`,
                    borderRadius: '10px', padding: '14px', marginBottom: '8px', cursor: 'pointer',
                    opacity: draggingTaskId === task.id ? 0.6 : 1,
                    transition: 'border-color 0.15s, opacity 0.15s, transform 0.15s',
                    position: 'relative',
                    userSelect: 'none',
                    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
                    boxShadow: isHovered ? '0 10px 18px rgba(0, 0, 0, 0.18)' : 'none',
                }}
            >
                <button
                    onClick={(e) => handleDeleteTask(e, task.id, column)}
                    aria-label={`Delete ${task.title}`}
                    style={{
                        position: 'absolute', top: '10px', right: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        width: '28px', height: '28px',
                        background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)',
                        borderRadius: '8px', padding: '0', cursor: 'pointer',
                        color: '#F87171',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'scale(1)' : 'scale(0.9)',
                        transition: 'opacity 0.15s ease, transform 0.15s ease, background 0.15s ease',
                        boxShadow: isHovered ? '0 8px 18px rgba(239,68,68,0.18)' : 'none',
                    }}
                    title="Delete task"
                >
                    <FaTrashAlt size={12} />
                </button>

                <h3 style={{ fontSize: '13px', fontWeight: '600', color: 'var(--white)', marginBottom: '6px', paddingRight: '36px', lineHeight: '1.4' }}>
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
    };

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

                <div
                    style={{ flex: 1 }}
                    onDragEnter={handleDragOver} onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, column)}
                >
                    {filteredTasks(colTasks).map(task => (
                        <TaskCard key={task.id} task={task} column={column} />
                    ))}
                </div>

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
                {currentView === 'projects' ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px', gap: '12px', flexWrap: 'wrap' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '17px', fontWeight: '700', color: 'var(--white)' }}>Projects</h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => openProjectModal()}
                                style={{
                                    background: 'var(--cyan)', color: 'var(--canvas)', border: 'none', borderRadius: '8px',
                                    cursor: 'pointer', fontSize: '12px', fontWeight: '700', padding: '9px 14px',
                                    boxShadow: '0 10px 20px rgba(0,210,255,0.25)',
                                }}
                            >
                                + Add Project
                            </button>
                        </div>

                        {loading && !projects.length ? (
                            <div style={{ color: 'var(--slate)', fontSize: '14px' }}>Loading projects...</div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '16px' }}>
                                {projects.map(project => {
                                    const palette = colorOptions[project.color || 'cyan'] || colorOptions.cyan;
                                    const stats = projectSummary(project._id || project.id);
                                    const projectId = project._id || project.id;

                                    return (
                                        <div
                                            key={projectId}
                                            onMouseEnter={(e) => {
                                                const deleteButton = e.currentTarget.querySelector('[data-delete-project]');
                                                if (deleteButton) deleteButton.style.opacity = '1';
                                            }}
                                            onMouseLeave={(e) => {
                                                const deleteButton = e.currentTarget.querySelector('[data-delete-project]');
                                                if (deleteButton) deleteButton.style.opacity = '0';
                                            }}
                                            style={{
                                                position: 'relative', border: `1px solid ${palette.border}`,
                                                borderRadius: '14px', background: 'var(--surface)', padding: '18px',
                                                color: 'var(--white)', transition: 'all 0.15s ease', boxShadow: '0 8px 26px rgba(0,0,0,0.12)',
                                            }}
                                        >
                                            <button
                                                type="button"
                                                data-delete-project
                                                onClick={() => handleDeleteProject(projectId)}
                                                title="Delete project"
                                                style={{
                                                    position: 'absolute', top: '12px', right: '12px',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    width: '28px', height: '28px', borderRadius: '8px',
                                                    background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.28)',
                                                    color: '#F87171', cursor: 'pointer', opacity: 0,
                                                    transition: 'opacity 0.15s ease, transform 0.15s ease, background 0.15s ease',
                                                    boxShadow: '0 8px 18px rgba(239,68,68,0.12)'
                                                }}
                                            >
                                                <FaTrashAlt size={12} />
                                            </button>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', gap: '8px', paddingRight: '32px' }}>
                                                <button
                                                    type="button"
                                                    onClick={() => openProject(project)}
                                                    style={{
                                                        flex: 1, textAlign: 'left', background: 'transparent', border: 'none', color: 'var(--white)',
                                                        cursor: 'pointer', padding: 0, fontSize: '14px', fontWeight: '700'
                                                    }}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{
                                                            width: '12px', height: '12px', display: 'inline-block', borderRadius: '50%',
                                                            background: solidColors[project.color || 'cyan'] || solidColors.cyan,
                                                            boxShadow: `0 0 0 4px ${palette.bg}`
                                                        }} />
                                                        <span>{project.name || 'Untitled Project'}</span>
                                                    </div>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        openProjectModal(project);
                                                    }}
                                                    style={{
                                                        background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '7px',
                                                        color: 'var(--slate)', cursor: 'pointer', fontSize: '11px', fontWeight: '600', padding: '6px 8px'
                                                    }}
                                                >
                                                    Rename
                                                </button>
                                            </div>

                                            <p style={{ margin: '0 0 12px', color: 'var(--slate)', fontSize: '12px', lineHeight: '1.6', minHeight: '40px' }}>
                                                {project.description || 'No description provided for this project.'}
                                            </p>

                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '10px', marginBottom: '14px' }}>
                                                <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--slate)', marginBottom: '4px' }}>Tasks</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--white)' }}>{stats.total}</div>
                                                </div>
                                                <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--slate)', marginBottom: '4px' }}>Done</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '700', color: '#4ADE80' }}>{stats.done}</div>
                                                </div>
                                                <div style={{ background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 10px' }}>
                                                    <div style={{ fontSize: '10px', color: 'var(--slate)', marginBottom: '4px' }}>Progress</div>
                                                    <div style={{ fontSize: '16px', fontWeight: '700', color: 'var(--cyan)' }}>{stats.progress}%</div>
                                                </div>
                                            </div>

                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--slate)', fontSize: '11px', borderTop: '1px solid var(--border)', paddingTop: '12px' }}>
                                                <span>{project.createdAt ? new Date(project.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'New'}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px', flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                                <button
                                    type="button"
                                    onClick={backToProjects}
                                    style={{
                                        background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px',
                                        color: 'var(--slate)', cursor: 'pointer', padding: '9px 12px', fontSize: '12px', fontWeight: '600'
                                    }}
                                >
                                    ← Projects
                                </button>
                                <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: 'var(--white)' }}>
                                    {selectedProject?.name || 'Project Board'}
                                </h2>
                            </div>
                            <button
                                type="button"
                                onClick={() => openProjectModal(selectedProject)}
                                style={{
                                    background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px',
                                    color: 'var(--slate)', cursor: 'pointer', padding: '9px 12px', fontSize: '12px', fontWeight: '600'
                                }}
                            >
                                Rename Project
                            </button>
                        </div>

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

                        {loading ? (
                            <div style={{ color: 'var(--slate)', fontSize: '14px' }}>Loading board...</div>
                        ) : (
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
                        )}
                    </>
                )}
            </div>

            {showModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', width: '100%', maxWidth: '480px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
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

            {showProjectModal && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 60, padding: '16px' }}>
                    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', width: '100%', maxWidth: '460px', overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 22px', borderBottom: '1px solid var(--border)' }}>
                            <h2 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--white)', margin: 0 }}>
                                {editingProject ? 'Rename Project' : 'Add Project'}
                            </h2>
                            <button onClick={() => { setShowProjectModal(false); setEditingProject(null); setProjectForm({ name: '', description: '', color: 'cyan' }); }} style={{ background: 'none', border: 'none', color: 'var(--slate)', cursor: 'pointer', padding: '4px' }}>
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M18 6L6 18M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleProjectSubmit} style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>PROJECT NAME *</label>
                                <input
                                    type="text"
                                    required
                                    value={projectForm.name}
                                    onChange={e => handleProjectFormChange('name', e.target.value)}
                                    placeholder="Project name"
                                    className="th-input"
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>DESCRIPTION</label>
                                <textarea
                                    rows={3}
                                    value={projectForm.description}
                                    onChange={e => handleProjectFormChange('description', e.target.value)}
                                    placeholder="Project overview"
                                    className="th-input"
                                    style={{ resize: 'none' }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '11px', fontWeight: '600', color: 'var(--slate)', marginBottom: '6px', letterSpacing: '0.06em' }}>COLOR</label>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                                    {Object.keys(solidColors).map(color => (
                                        <button
                                            key={color}
                                            type="button"
                                            onClick={() => handleProjectFormChange('color', color)}
                                            style={{
                                                width: '24px', height: '24px', borderRadius: '50%', border: `2px solid ${projectForm.color === color ? 'var(--white)' : 'transparent'}`,
                                                background: solidColors[color], cursor: 'pointer'
                                            }}
                                            title={color}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', paddingTop: '4px' }}>
                                <button type="button" onClick={() => { setShowProjectModal(false); setEditingProject(null); setProjectForm({ name: '', description: '', color: 'cyan' }); }}
                                    style={{ flex: 1, padding: '10px', background: 'var(--canvas)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--slate)', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }}>
                                    Cancel
                                </button>
                                <button type="submit"
                                    style={{ flex: 1, padding: '10px', background: 'var(--cyan)', border: 'none', borderRadius: '8px', color: 'var(--canvas)', cursor: 'pointer', fontSize: '13px', fontWeight: '700' }}>
                                    {editingProject ? 'Save' : 'Create'}
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