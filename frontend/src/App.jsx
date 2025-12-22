import './index.css'
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp';
import ProjectTracker from './pages/ProjectTracker';
import TimeTable from './pages/TimeTable';
import ToDo from './pages/ToDo';

function AppWrapper() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/project-tracker' element={<ProjectTracker/>} />
          <Route path='/timetable' element={<TimeTable/>} />
          <Route path='/todo' element={<ToDo/>} />
        </Routes>
      </main>
    </div>
  );
}

function App() {

  return (
    <BrowserRouter>
      <AppWrapper/>
    </BrowserRouter>
  );
}

export default App;
