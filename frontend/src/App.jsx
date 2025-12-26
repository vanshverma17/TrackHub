import './index.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Dashboard from './pages/Dashboard'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp';
import ProjectTracker from './pages/ProjectTracker';
import TimeTable from './pages/TimeTable';
import ToDo from './pages/ToDo';
import Settings from './pages/Settings';
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Routes location={backgroundLocation || location}>
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

          {/* Settings as normal route when accessed directly */}
          {!backgroundLocation && (
            <Route path='/settings' element={
              <ProtectedRoute>
                <Settings/>
              </ProtectedRoute>
            } />
          )}
          
          {/* Catch all - redirect to signin */}
          <Route path='*' element={<Navigate to="/" replace />} />
        </Routes>

        {/* Modal overlay when Settings opened from within app */}
        {backgroundLocation && (
          <Routes>
            <Route path='/settings' element={
              <ProtectedRoute>
                <Settings/>
              </ProtectedRoute>
            } />
          </Routes>
        )}
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
