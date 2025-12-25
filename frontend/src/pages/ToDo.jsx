
import { useState, useRef, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { todosAPI } from "../services/api";

const ToDo = () => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [tasks, setTasks] = useState([]);
    const [newTaskText, setNewTaskText] = useState("");
    const [hoveredTaskId, setHoveredTaskId] = useState(null);
    const dateScrollRef = useRef(null);
    const [calendarMonth, setCalendarMonth] = useState(new Date());
    const [loading, setLoading] = useState(false);

    // Fetch tasks on component mount
    useEffect(() => {
        fetchTasks();
    }, []);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const response = await todosAPI.getAll();
            setTasks(response.data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoading(false);
        }
    };

    // Generate dates for the scrollable date picker
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

    const formatDate = (date) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return date.toLocaleDateString('en-US', options);
    };

    const isToday = (date) => {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    };

    const isSameDay = (date1, date2) => {
        return date1.toDateString() === date2.toDateString();
    };

    const scrollDates = (direction) => {
        if (dateScrollRef.current) {
            const scrollAmount = direction === 'left' ? -200 : 200;
            dateScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    const toggleTask = async (id) => {
        try {
            const task = tasks.find(t => t._id === id);
            const response = await todosAPI.update(id, {
                completed: !task.completed
            });
            setTasks(tasks.map(t => t._id === id ? response.data : t));
        } catch (error) {
            console.error('Error toggling task:', error);
        }
    };

    const deleteTask = async (id) => {
        try {
            await todosAPI.delete(id);
            setTasks(tasks.filter(task => task._id !== id));
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const addTask = async () => {
        if (newTaskText.trim()) {
            try {
                const response = await todosAPI.create({
                    text: newTaskText,
                    date: selectedDate.toISOString(),
                    completed: false
                });
                setTasks([...tasks, response.data]);
                setNewTaskText("");
            } catch (error) {
                console.error('Error adding task:', error);
            }
        }
    };

    const changeMonth = (offset) => {
        const newMonth = new Date(calendarMonth);
        newMonth.setMonth(calendarMonth.getMonth() + offset);
        setCalendarMonth(newMonth);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            <Sidebar />
            <div className="ml-64 flex flex-col h-screen">
                {/* Header */}
                <div className="p-6 border-b border-gray-800">
                    <h1 className="text-2xl font-semibold mb-6">TODO List</h1>
                    
                    {/* Scrollable Date Picker with Arrows */}
                    <div className="flex items-center gap-2">
                        {/* Left Arrow */}
                        <button
                            onClick={() => scrollDates('left')}
                            className="flex-shrink-0 p-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-200"
                            aria-label="Scroll left"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                        </button>

                        {/* Date Picker */}
                        <div 
                            ref={dateScrollRef}
                            className="overflow-x-auto overflow-y-hidden flex-1" 
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            <style jsx>{`
                                div::-webkit-scrollbar {
                                    display: none;
                                }
                            `}</style>
                            <div className="flex gap-3 pb-2">
                                {dates.map((date, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedDate(date)}
                                        className={`flex-shrink-0 px-4 py-3 rounded-lg border transition-all duration-200 min-w-[100px] ${
                                            isSameDay(date, selectedDate)
                                                ? 'bg-cyan-500 border-cyan-500 text-white'
                                                : isToday(date)
                                                ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                                : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-gray-600'
                                        }`}
                                    >
                                        <div className="text-xs">{date.toLocaleDateString('en-US', { weekday: 'short' })}</div>
                                        <div className="text-lg font-semibold">{date.getDate()}</div>
                                        <div className="text-xs">{date.toLocaleDateString('en-US', { month: 'short' })}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Right Arrow */}
                        <button
                            onClick={() => scrollDates('right')}
                            className="flex-shrink-0 p-2 bg-gray-800/50 hover:bg-gray-700 border border-gray-700 rounded-lg transition-all duration-200"
                            aria-label="Scroll right"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1 overflow-y-auto p-6">
                    <div className="flex gap-6">
                        {/* Main Content */}
                        <div className="flex-1 max-w-4xl">
                            {/* Current Date Display */}
                            <div className="mb-6">
                                <h2 className="text-xl font-semibold text-gray-300">
                                    {selectedDate.toLocaleDateString('en-US', { 
                                        weekday: 'long', 
                                        year: 'numeric', 
                                        month: 'long', 
                                        day: 'numeric' 
                                    })}
                                </h2>
                                <p className="text-sm text-gray-500 mt-1">{tasks.filter(t => !t.completed).length} tasks remaining</p>
                            </div>

                            {/* Add New Task */}
                            <div className="mb-6">
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={newTaskText}
                                        onChange={(e) => setNewTaskText(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                        placeholder="Add a new task..."
                                        className="flex-1 px-4 py-3 bg-gray-800/80 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition"
                                    />
                                    <button
                                        onClick={addTask}
                                        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg font-semibold transition duration-200 flex items-center gap-2"
                                    >
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="12" y1="5" x2="12" y2="19"></line>
                                            <line x1="5" y1="12" x2="19" y2="12"></line>
                                        </svg>
                                        Add Task
                                    </button>
                                </div>
                            </div>

                            {/* Tasks List */}
                            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl overflow-hidden">
                                {loading ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <div className="animate-spin mx-auto mb-4 h-12 w-12 border-4 border-cyan-500/30 border-t-cyan-500 rounded-full"></div>
                                        <p>Loading tasks...</p>
                                    </div>
                                ) : tasks.length === 0 ? (
                                    <div className="p-12 text-center text-gray-500">
                                        <svg className="mx-auto mb-4 opacity-50" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                                        </svg>
                                        <p>No tasks yet. Add one to get started!</p>
                                    </div>
                                ) : (
                                    <div className="divide-y divide-gray-800">
                                        {tasks.map((task) => (
                                            <div
                                                key={task._id}
                                                onMouseEnter={() => setHoveredTaskId(task._id)}
                                                onMouseLeave={() => setHoveredTaskId(null)}
                                                className="flex items-center gap-4 px-6 py-4 hover:bg-gray-800/50 transition-all duration-200 group"
                                            >
                                                {/* Checkbox */}
                                                <label className="flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={task.completed}
                                                        onChange={() => toggleTask(task._id)}
                                                        className="w-5 h-5 rounded border-2 border-gray-600 bg-transparent checked:bg-cyan-500 checked:border-cyan-500 cursor-pointer transition-all duration-200 appearance-none flex items-center justify-center"
                                                        style={{
                                                            backgroundImage: task.completed ? 
                                                                `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='3'%3E%3Cpolyline points='20 6 9 17 4 12'%3E%3C/polyline%3E%3C/svg%3E")` 
                                                                : 'none',
                                                            backgroundSize: '80%',
                                                            backgroundPosition: 'center',
                                                            backgroundRepeat: 'no-repeat'
                                                        }}
                                                    />
                                                </label>

                                                {/* Task Text */}
                                                <span className={`flex-1 text-base transition-all duration-200 ${
                                                    task.completed 
                                                        ? 'text-gray-500 line-through' 
                                                        : 'text-white'
                                                }`}>
                                                    {task.text}
                                                </span>

                                                {/* Delete Button - Only visible on hover */}
                                                <button
                                                    onClick={() => deleteTask(task._id)}
                                                    className={`p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-200 ${
                                                        hoveredTaskId === task._id ? 'opacity-100 visible' : 'opacity-0 invisible'
                                                    }`}
                                                >
                                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                        <polyline points="3 6 5 6 21 6"></polyline>
                                                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                                        <line x1="10" y1="11" x2="10" y2="17"></line>
                                                        <line x1="14" y1="11" x2="14" y2="17"></line>
                                                    </svg>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Mini Calendar Widget */}
                        <div className="flex-shrink-0 w-64">
                            <div className="bg-gray-900/50 border border-cyan-500/30 rounded-xl p-5 sticky top-0">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-semibold text-white">
                                        {calendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                                    </h3>
                                    <div className="flex gap-1">
                                        <button
                                            onClick={() => changeMonth(-1)}
                                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                                            aria-label="Previous month"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <button
                                            onClick={() => changeMonth(1)}
                                            className="p-1 hover:bg-gray-800 rounded transition-colors"
                                            aria-label="Next month"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                                
                                {/* Calendar Grid */}
                                <div className="space-y-2">
                                    {/* Day Headers */}
                                    <div className="grid grid-cols-7 gap-1 mb-2">
                                        {['Sun', 'Mon', 'Tu', 'Wed', 'Th', 'Fri', 'Sat'].map(day => (
                                            <div key={day} className="text-center text-xs text-gray-500 font-medium">
                                                {day}
                                            </div>
                                        ))}
                                    </div>
                                    
                                    {/* Calendar Days */}
                                    <div className="grid grid-cols-7 gap-1">
                                        {(() => {
                                            const year = calendarMonth.getFullYear();
                                            const month = calendarMonth.getMonth();
                                            const firstDay = new Date(year, month, 1).getDay();
                                            const daysInMonth = new Date(year, month + 1, 0).getDate();
                                            const days = [];
                                            
                                            // Empty cells for days before month starts
                                            for (let i = 0; i < firstDay; i++) {
                                                days.push(<div key={`empty-${i}`} className="aspect-square"></div>);
                                            }
                                            
                                            // Days of the month
                                            for (let day = 1; day <= daysInMonth; day++) {
                                                const date = new Date(year, month, day);
                                                const isSelected = isSameDay(date, selectedDate);
                                                const isTodayDate = isToday(date);
                                                
                                                days.push(
                                                    <button
                                                        key={day}
                                                        onClick={() => setSelectedDate(date)}
                                                        className={`aspect-square flex items-center justify-center text-sm rounded-lg transition-all ${
                                                            isSelected
                                                                ? 'bg-cyan-500 text-white font-semibold'
                                                                : isTodayDate
                                                                ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                                                                : 'text-gray-400 hover:bg-gray-800/50'
                                                        }`}
                                                    >
                                                        {day}
                                                    </button>
                                                );
                                            }
                                            
                                            return days;
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ToDo;