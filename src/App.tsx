import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import QRCodeGenerator from './components/QRCodeGenerator';
import QRCodeAnalytics from './components/QRCodeAnalytics';
import Pricing from './components/Pricing';
import Profile from './components/Profile';
import Subscription from './components/Subscription';
import ProtectedRoute from './components/ProtectedRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/pricing" element={<Pricing />} />
          
          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <QRCodeGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/qr/:id"
            element={
              <ProtectedRoute>
                <QRCodeAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:id"
            element={
              <ProtectedRoute>
                <QRCodeGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          
          {/* Catch all */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    </AuthProvider>
  );
};

const NotFound: React.FC = () => (
  <div className="container text-center py-5">
    <h1 className="display-1">404</h1>
    <h2>Page Not Found</h2>
    <p className="text-muted">The page you're looking for doesn't exist.</p>
    <a href="/" className="btn btn-primary">
      Go Home
    </a>
  </div>
);

export default App;
