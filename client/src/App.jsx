import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
import Alert from './components/CustomAlert';
import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import EmailVerificationScreen from './components/EmailVerificationScreen';
import EmailVerificationHandler from './components/EmailVerificationHandler';
import { api } from './api';
import { Navigate } from 'react-router-dom';

const AppWrapper = () => {
  return (
    <Router>
      <App />
    </Router>
  );
};

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      if (storedUser.token && (location.pathname === '/login' || location.pathname === '/signup')) {
        navigate('/dashboard');
      }
    }
  }, [location, navigate]);

  const showAlert = (type, message, title = null, duration = 5000) => {
    setAlert({ type, message, title });
    setTimeout(() => setAlert(null), duration);
  };

  const handleAuth = async (formData, isLogin) => {
    setLoading(true);
    try {
      const result = isLogin
        ? await api.login(formData)
        : await api.signup(formData);

      console.log('Authentication result:', result);
      
      if (isLogin && result.token) {
        // Login successful with token
        const userData = {
          _id: result._id,
          name: result.name,
          email: result.email,
          token: result.token,
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('token', result.token);
        navigate('/dashboard');
        showAlert('success', `Welcome back, ${result.name}!`, 'Login Successful');
      } else if (!isLogin) {
        // Signup successful - store user without token for now
        const userData = {
          _id: result._id,
          name: result.name,
          email: result.email,
          token: null, // No token yet, needs email verification
        };
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        showAlert('success', 'Please check your email and click the verification link to complete your registration.', 'Account Created');
      }
    } catch (error) {
      console.error('Authentication error:', error);

      // Handle specific error cases
      let errorMessage = error.message;
      let errorTitle = 'Authentication Error';
      
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Unable to connect to the server. Please check your internet connection and try again.';
        errorTitle = 'Network Error';
      } else if (error.message.includes('401')) {
        errorMessage = 'The email or password you entered is incorrect. Please try again.';
        errorTitle = 'Invalid Credentials';
      } else if (error.message.includes('<!DOCTYPE html>')) {
        errorMessage = 'The server is currently experiencing issues. Please try again in a few minutes.';
        errorTitle = 'Server Error';
      }

      showAlert('error', errorMessage, errorTitle);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
    showAlert('success', 'You have been successfully logged out. See you again soon!', 'Logged Out');
  };

  const handleVerificationComplete = (token, userData) => {
    console.log('Verification complete. Token:', token);
    console.log('User data from verification:', userData);

    // Create complete user object with token
    const completeUserData = {
      _id: userData._id,
      name: userData.name,
      email: userData.email,
      token: token,
    };

    // Update both localStorage and React state
    localStorage.setItem('user', JSON.stringify(completeUserData));
    localStorage.setItem('token', token);
    setUser(completeUserData);
    showAlert('success', 'Your email has been verified and your account is now active. Welcome!', 'Email Verified');
    navigate('/dashboard');
  };

  // Protected route wrapper
  const ProtectedRoute = ({ children }) => {
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    if (!user.token) {
      return <Navigate to="/verify-email" state={{ email: user.email }} replace />;
    }
    
    return children;
  };

  console.log('Current user:', user);

  return (
    <div className="app-container">
      {alert && (
        <div className="fixed top-4 right-4 z-50 max-w-md">
          <Alert
            type={alert.type}
            title={alert.title}
            message={alert.message}
            onClose={() => setAlert(null)}
            dismissible={true}
          />
        </div>
      )}

      <Routes>
        <Route path="/login" element={
          <AuthForm
            isLogin={true}
            onSubmit={(data) => handleAuth(data, true)}
            loading={loading}
          />
        } />
        <Route path="/signup" element={
          <AuthForm
            isLogin={false}
            onSubmit={(data) => handleAuth(data, false)}
            loading={loading}
          />
        } />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        } />
        <Route path="/verify-email" element={
          <EmailVerificationScreen email={user?.email || location.state?.email} />
        } />
        <Route path="/verify/:token" element={
          <EmailVerificationHandler onVerificationComplete={handleVerificationComplete} />
        } />
        <Route path="/" element={<Navigate to={user?.token ? "/dashboard" : "/login"} />} />
      </Routes>
    </div>
  );
};

export default AppWrapper;