import './index.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp';
import ProjectTracker from './pages/ProjectTracker';
import TimeTable from './pages/TimeTable';
import ToDo from './pages/ToDo';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          <Route path='/' element={<SignIn/>} />
          <Route path='/signup' element={<SignUp/>} />
          <Route path='/dashboard' element={
            <ProtectedRoute>
              <Dashboard/>
            </ProtectedRoute>
          } />
          <Route path='/project-tracker' element={
            <ProtectedRoute>
              <ProjectTracker/>
            </ProtectedRoute>
          } />
          <Route path='/timetable' element={
            <ProtectedRoute>
              <TimeTable/>
            </ProtectedRoute>
          } />
          <Route path='/todo' element={
            <ProtectedRoute>
              <ToDo/>
            </ProtectedRoute>
          } />
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
