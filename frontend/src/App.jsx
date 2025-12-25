import './index.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp';
import ProjectTracker from './pages/ProjectTracker';
import TimeTable from './pages/TimeTable';
import ToDo from './pages/ToDo';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  const isAuthenticated = !!localStorage.getItem('token');

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes>
          {/* Public Routes - Redirect to dashboard if already logged in */}
          <Route path='/' element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn/>} />
          <Route path='/signup' element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp/>} />
          
          {/* Protected Routes */}
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
          
          {/* Catch all - redirect to signin */}
          <Route path='*' element={<Navigate to="/" replace />} />
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
