
import Sidebar from "../components/Sidebar";

const ToDo = () => {
    return (
        <div className="min-h-screen bg-black text-white flex">
            <Sidebar />
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-semibold mb-4">TODO List</h1>
                <p className="text-gray-400">Todo content goes here.</p>
            </div>
        </div>
    );
}

export default ToDo;