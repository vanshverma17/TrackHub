import './index.css'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Suspense, lazy } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const SignIn = lazy(() => import('./pages/SignIn'));
const SignUp = lazy(() => import('./pages/SignUp'));
const LandingPage = lazy(() => import('./pages/LandingPage'));
const ProjectTracker = lazy(() => import('./pages/ProjectTracker'));
const TimeTable = lazy(() => import('./pages/TimeTable'));
const ToDo = lazy(() => import('./pages/ToDo'));
const Settings = lazy(() => import('./pages/Settings'));
const Profile = lazy(() => import('./pages/Profile'));

const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: 'var(--cyan)' }}></div>
  </div>
);
import ProtectedRoute from './components/ProtectedRoute';

function AppWrapper() {
  const isAuthenticated = !!localStorage.getItem('token');
  const location = useLocation();
  const backgroundLocation = location.state?.backgroundLocation;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={backgroundLocation || location}>
            {/* Public Routes */}
            <Route path='/' element={<LandingPage />} />
            <Route path='/signin' element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />} />
            <Route path='/signup' element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />} />

            {/* Protected Routes */}
            <Route path='/dashboard' element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path='/project-tracker' element={
              <ProtectedRoute>
                <ProjectTracker />
              </ProtectedRoute>
            } />
            <Route path='/timetable' element={
              <ProtectedRoute>
                <TimeTable />
              </ProtectedRoute>
            } />
            <Route path='/todo' element={
              <ProtectedRoute>
                <ToDo />
              </ProtectedRoute>
            } />

            {/* Settings as normal route when accessed directly */}
            {!backgroundLocation && (
              <Route path='/settings' element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } />
            )}

            {/* Profile as normal route when accessed directly */}
            {!backgroundLocation && (
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
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
                  <Settings />
                </ProtectedRoute>
              } />
              <Route path='/profile' element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } />
            </Routes>
          )}
        </Suspense>
      </main>
    </div>
  );
}

function App() {

  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}

export default App;
