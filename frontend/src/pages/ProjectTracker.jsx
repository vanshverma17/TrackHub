import { useState } from "react";
import Sidebar from "../components/Sidebar";

const ProjectTracker = () => {
    const colorOptions = {
        blue: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30', solid: 'bg-blue-500', selectedBg: 'bg-blue-500/30', selectedBorder: 'border-blue-500' },
        green: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30', solid: 'bg-green-500', selectedBg: 'bg-green-500/30', selectedBorder: 'border-green-500' },
        red: { bg: 'bg-red-500/20', text: 'text-red-400', border: 'border-red-500/30', solid: 'bg-red-500', selectedBg: 'bg-red-500/30', selectedBorder: 'border-red-500' },
        yellow: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', border: 'border-yellow-500/30', solid: 'bg-yellow-500', selectedBg: 'bg-yellow-500/30', selectedBorder: 'border-yellow-500' },
        purple: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30', solid: 'bg-purple-500', selectedBg: 'bg-purple-500/30', selectedBorder: 'border-purple-500' },
        orange: { bg: 'bg-orange-500/20', text: 'text-orange-400', border: 'border-orange-500/30', solid: 'bg-orange-500', selectedBg: 'bg-orange-500/30', selectedBorder: 'border-orange-500' },
        teal: { bg: 'bg-teal-500/20', text: 'text-teal-400', border: 'border-teal-500/30', solid: 'bg-teal-500', selectedBg: 'bg-teal-500/30', selectedBorder: 'border-teal-500' },
        gray: { bg: 'bg-gray-500/20', text: 'text-gray-400', border: 'border-gray-500/30', solid: 'bg-gray-500', selectedBg: 'bg-gray-500/30', selectedBorder: 'border-gray-500' },
        indigo: { bg: 'bg-indigo-500/20', text: 'text-indigo-400', border: 'border-indigo-500/30', solid: 'bg-indigo-500', selectedBg: 'bg-indigo-500/30', selectedBorder: 'border-indigo-500' },
    };

    const [searchQuery, setSearchQuery] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [modalColumn, setModalColumn] = useState(null);
    const [editingTask, setEditingTask] = useState(null);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        tag: "",
        tagColor: "blue",
        startDate: "",
        dueDate: ""
    });
    
    const [tasks, setTasks] = useState({
        todo: [
            { id: "IAT-4", title: "Customer & Item forms", description: "", tag: "FrontEnd", tagColor: "blue", startDate: "Dec 20, 2025", dueDate: "Dec 27, 2025", assignee: null },
            { id: "IAT-5", title: "Auth & Roles (Admin/Staff)", description: "", tag: "BackEnd", tagColor: "purple", startDate: "Dec 21, 2025", dueDate: "Dec 27, 2025", assignee: null },
            { id: "IAT-6", title: "Invoice schema", description: "", tag: "BackEnd", tagColor: "purple", startDate: "Dec 22, 2025", dueDate: "Dec 27, 2025", assignee: null },
            { id: "IAT-7", title: "Customer & item schema", description: "", tag: "BackEnd", tagColor: "purple", startDate: "Dec 23, 2025", dueDate: "Dec 27, 2025", assignee: null },
            { id: "IAT-8", title: "CRUD APIs", description: "", tag: "BackEnd", tagColor: "purple", startDate: "Dec 24, 2025", dueDate: "Dec 27, 2025", assignee: null },
        ],
        inProgress: [
            { id: "IAT-1", title: "Dashboard Layout", description: "", tag: "FrontEnd", tagColor: "blue", startDate: "Dec 15, 2025", dueDate: "Dec 27, 2025", assignee: "W" },
            { id: "IAT-2", title: "Invoice List", description: "", tag: "FrontEnd", tagColor: "blue", startDate: "Dec 18, 2025", dueDate: "Dec 27, 2025", assignee: "W" },
        ],
        done: [
            { id: "IAT-3", title: "Create Invoice UI", description: "", tag: "FrontEnd", tagColor: "blue", startDate: "Dec 10, 2025", dueDate: "Dec 27, 2025", assignee: "W", completed: true },
        ]
    });

    const [draggedTask, setDraggedTask] = useState(null);
    const [draggedFrom, setDraggedFrom] = useState(null);
    const [draggingTaskId, setDraggingTaskId] = useState(null);

    const handleDragStart = (e, task, column) => {
        e.dataTransfer.effectAllowed = "move";

        // Some browsers (notably Firefox) require a text/plain payload
        // for drag to properly initiate on first attempt.
        const payload = JSON.stringify({ taskId: task.id, sourceColumn: column });
        e.dataTransfer.setData("text/plain", payload);
        e.dataTransfer.setData("application/json", payload);
        e.dataTransfer.setData("taskId", task.id);
        e.dataTransfer.setData("sourceColumn", column);

        // Improve visibility of the drag preview
        try {
            e.dataTransfer.setDragImage(e.currentTarget, 24, 24);
        } catch {
            // ignore if browser disallows custom drag image
        }

        setDraggingTaskId(task.id);
        setDraggedTask(task);
        setDraggedFrom(column);
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
    };

    const handleDrop = (e, column) => {
        e.preventDefault();
        let taskId = e.dataTransfer.getData("taskId");
        let sourceColumn = e.dataTransfer.getData("sourceColumn");

        if (!taskId || !sourceColumn) {
            const text = e.dataTransfer.getData("text/plain");
            if (text) {
                try {
                    const parsed = JSON.parse(text);
                    taskId = parsed?.taskId;
                    sourceColumn = parsed?.sourceColumn;
                } catch {
                    // ignore
                }
            }
        }
        
        if (taskId && sourceColumn && sourceColumn !== column) {
            setTasks(prev => {
                const taskToMove = prev[sourceColumn].find(t => t.id === taskId);
                if (taskToMove) {
                    return {
                        ...prev,
                        [sourceColumn]: prev[sourceColumn].filter(t => t.id !== taskId),
                        [column]: [...prev[column], taskToMove]
                    };
                }
                return prev;
            });
        }
        
        setDraggedTask(null);
        setDraggedFrom(null);
        setDraggingTaskId(null);
    };

    const handleDragEnd = () => {
        setDraggedTask(null);
        setDraggedFrom(null);
        setDraggingTaskId(null);
    };

    const addNewTask = (column) => {
        setModalColumn(column);
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            tag: "",
            tagColor: "blue",
            startDate: "",
            dueDate: ""
        });
        setShowModal(true);
    };

    const formatDateToDisplay = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const options = { month: 'short', day: 'numeric', year: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const formatDateToInput = (displayDate) => {
        if (!displayDate) return "";
        // Parse "Dec 27, 2025" format back to "YYYY-MM-DD"
        const date = new Date(displayDate);
        if (isNaN(date.getTime())) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const handleEditTask = (task, column) => {
        setModalColumn(column);
        setEditingTask(task);
        setFormData({
            title: task.title,
            description: task.description || "",
            tag: task.tag,
            tagColor: task.tagColor || "blue",
            startDate: formatDateToInput(task.startDate),
            dueDate: formatDateToInput(task.dueDate)
        });
        setShowModal(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const formattedData = {
            ...formData,
            startDate: formatDateToDisplay(formData.startDate),
            dueDate: formatDateToDisplay(formData.dueDate)
        };
        
        if (editingTask) {
            // Update existing task
            setTasks(prev => ({
                ...prev,
                [modalColumn]: prev[modalColumn].map(t =>
                    t.id === editingTask.id
                        ? { ...t, ...formattedData }
                        : t
                )
            }));
        } else {
            // Add new task
            const newId = `IAT-${Date.now()}`;
            const newTask = {
                id: newId,
                ...formattedData,
                assignee: null,
                completed: modalColumn === 'done'
            };
            setTasks(prev => ({
                ...prev,
                [modalColumn]: [...prev[modalColumn], newTask]
            }));
        }
        
        setShowModal(false);
        setEditingTask(null);
        setFormData({
            title: "",
            description: "",
            tag: "",
            tagColor: "blue",
            startDate: "",
            dueDate: ""
        });
    };

    const handleFormChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const filteredTasks = (columnTasks) => {
        if (!searchQuery) return columnTasks;
        return columnTasks.filter(task =>
            task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            task.tag.toLowerCase().includes(searchQuery.toLowerCase())
        );
    };

    const TaskCard = ({ task, column }) => {
        return (
            <div
                draggable={true}
                onDragStart={(e) => handleDragStart(e, task, column)}
                onDragEnd={handleDragEnd}
                onDoubleClick={() => handleEditTask(task, column)}
                className={`bg-gray-900 border border-gray-800 rounded-lg p-4 mb-3 cursor-move hover:border-cyan-500/50 transition group select-none ${
                    draggingTaskId === task.id ? "opacity-60 border-cyan-500/40" : ""
                }`}
            >
            <h3 className="text-white font-medium mb-2">{task.title}</h3>
            {task.description && (
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{task.description}</p>
            )}
            <span className={`inline-block px-2 py-1 rounded text-xs font-medium mb-3 ${colorOptions[task.tagColor || 'blue']?.bg || 'bg-blue-500/20'} ${colorOptions[task.tagColor || 'blue']?.text || 'text-blue-400'} border ${colorOptions[task.tagColor || 'blue']?.border || 'border-blue-500/30'}`}>
                {task.tag}
            </span>
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-800">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {task.dueDate}
                </div>
            </div>
            <div className="flex items-center gap-2 mt-2">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span className="text-xs text-gray-500">{task.id}</span>
            </div>
        </div>
        );
    };

    const Column = ({ title, count, column, tasks }) => (
        <div
            className="flex-1 min-w-[300px]"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column)}
        >
            <div className="bg-gray-900/50 rounded-lg border border-gray-800 p-4 min-h-[500px]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">{title}</h2>
                        <span className="bg-gray-800 text-gray-400 text-xs font-semibold px-2 py-1 rounded">
                            {count}
                        </span>
                    </div>
                    {column === 'done' && (
                        <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                <div className="space-y-3 min-h-[200px]">
                    {filteredTasks(tasks).map(task => (
                        <TaskCard key={task.id} task={task} column={column} />
                    ))}
                </div>
                <button
                    onClick={() => addNewTask(column)}
                    className="w-full mt-3 py-2 border-2 border-dashed border-gray-800 rounded-lg text-gray-500 hover:border-cyan-500/50 hover:text-cyan-400 transition flex items-center justify-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-64 p-6 overflow-auto">
                {/* Header */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-semibold">Project Tracker</h1>
                        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            New Project
                        </button>
                    </div>
                    
                    {/* Search and Filter Bar */}
                    <div className="flex items-center gap-3">
                        <div className="relative flex-1 max-w-md">
                            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <circle cx="11" cy="11" r="8"></circle>
                                <path d="m21 21-4.35-4.35"></path>
                            </svg>
                            <input
                                type="text"
                                placeholder="Search board"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                            />
                        </div>
                    </div>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-4 overflow-x-auto pb-4">
                    <Column
                        title="TO DO"
                        count={filteredTasks(tasks.todo).length}
                        column="todo"
                        tasks={tasks.todo}
                    />
                    <Column
                        title="IN PROGRESS"
                        count={filteredTasks(tasks.inProgress).length}
                        column="inProgress"
                        tasks={tasks.inProgress}
                    />
                    <Column
                        title="DONE"
                        count={filteredTasks(tasks.done).length}
                        column="done"
                        tasks={tasks.done}
                    />
                </div>

                {/* Modal for Add/Edit Task */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                        <div className="bg-gray-900 border border-gray-800 rounded-lg max-w-lg w-full p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-semibold text-white">
                                    {editingTask ? "Edit Task" : "Add New Task"}
                                </h2>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-400 hover:text-white transition"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Title *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => handleFormChange('title', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                        placeholder="Enter task title"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleFormChange('description', e.target.value)}
                                        rows="3"
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition resize-none"
                                        placeholder="Enter task description"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tag *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.tag}
                                        onChange={(e) => handleFormChange('tag', e.target.value)}
                                        className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                        placeholder="Enter tag (e.g. FrontEnd, BackEnd, Design)"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Tag Color *
                                    </label>
                                    <div className="flex gap-2 flex-wrap">
                                        {['blue', 'green', 'red', 'yellow', 'purple', 'orange', 'teal', 'gray', 'indigo'].map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => handleFormChange('tagColor', color)}
                                                className={`w-10 h-10 rounded-lg border-2 transition ${
                                                    formData.tagColor === color
                                                        ? `${colorOptions[color].selectedBorder} ${colorOptions[color].selectedBg}`
                                                        : 'border-gray-700 hover:border-gray-600'
                                                } ${colorOptions[color].bg}`}
                                                title={color.charAt(0).toUpperCase() + color.slice(1)}
                                            >
                                                <div className={`w-full h-full rounded ${colorOptions[color].solid}`}></div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Start Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.startDate}
                                            onChange={(e) => handleFormChange('startDate', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            Due Date *
                                        </label>
                                        <input
                                            type="date"
                                            required
                                            value={formData.dueDate}
                                            onChange={(e) => handleFormChange('dueDate', e.target.value)}
                                            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500 transition [&::-webkit-calendar-picker-indicator]:invert [&::-webkit-calendar-picker-indicator]:cursor-pointer"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition"
                                    >
                                        {editingTask ? "Update Task" : "Add Task"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProjectTracker;