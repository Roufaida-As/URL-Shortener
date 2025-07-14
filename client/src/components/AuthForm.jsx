import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Link, AlertCircle, Check } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Alert from './CustomAlert';

const AuthForm = ({ isLogin = true, onSubmit, loading = false }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [alert, setAlert] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [authMode, setAuthMode] = useState(isLogin);

    const showAlert = (type, message, duration = 2000) => {
        setAlert({ type, message });
        setTimeout(() => setAlert(null), duration);
    };

    useEffect(() => {
        const currentPath = location.pathname;
        if (currentPath === '/login') {
            setAuthMode(true);
        } else if (currentPath === '/signup') {
            setAuthMode(false);
        }
    }, [location.pathname]);
    // Modified toggleAuthMode to use navigation
    const toggleAuthMode = () => {
        const newMode = !authMode;
        setAuthMode(newMode);
        navigate(newMode ? '/login' : '/signup');
        setFormData({
            name: '',
            email: '',
            password: '',
        });
        setErrors({});
        setTouched({});
    };
    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const hasLength = password.length >= 8;

        return {
            hasLength,

            isValid: hasLength
        };
    };

    const validateForm = () => {
        const newErrors = {};

        if (!authMode && (!formData.name || formData.name.trim().length < 2)) {
            newErrors.name = 'Name must be at least 2 characters long';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!authMode) {
            const passwordValidation = validatePassword(formData.password);
            if (!passwordValidation.isValid) {
                newErrors.password = 'Password must meet all requirements';
            }
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        if (name === 'email' && formData.email && !validateEmail(formData.email)) {
            setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
        }
    };

    const handleSubmit = () => {
        if (!validateForm()) {
            return;
        }

        const submitData = authMode
            ? { email: formData.email, password: formData.password }
            : {
                name: formData.name.trim(),
                email: formData.email,
                password: formData.password
            };
        console.log(authMode);

        if (!authMode) {
            showAlert('success', isLogin ? 'Login successful!' : 'Account created! Please verify your email.');
            setTimeout(() => {
                console.log('Redirecting to email verification...');
                navigate('/verify-email', { state: { email: formData.email } });
            }, 4000);
            onSubmit?.(submitData);

        } else {
            // For login, just submit as before
            onSubmit?.(submitData);
        }
    };

    const passwordValidation = !authMode ? validatePassword(formData.password) : null;

    return (
        <div className="flex h-screen w-screen">
             {alert && (
                    <div className="fixed top-4 right-4 z-50">
                      <Alert
                        type={alert.type}
                        message={alert.message}
                        onClose={() => setAlert(null)}
                      />
                    </div>
                  )}
            {/* Left Side - Form */}
            <div className="w-1/2 flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-gray-50 p-8">
                <div className="max-w-md w-full">
                    <div className="text-center mb-4 pt-4">
                        <div className="w-16 h-16 bg-gradient-to-r from-[#407BFF] to-[#6695FF] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg transform hover:scale-105 transition-transform duration-200">
                            <Link className="w-8 h-8" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-900 mb-2 mp-4">
                            {authMode ? 'Welcome Back' : 'Get Started'}
                        </h1>
                        <p className="text-gray-600 text-lg">
                            {authMode ? 'Sign in to your account' : 'Create your account'}
                        </p>
                    </div>

                    {  /* Form */}
                    <div className="space-y-5">
                        {!authMode && (
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Full Name *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#407BFF] focus:border-[#407BFF] transition-all duration-200 bg-white ${errors.name ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    placeholder="Enter your full name"
                                    aria-invalid={errors.name ? 'true' : 'false'}
                                    aria-describedby={errors.name ? 'name-error' : undefined}
                                    style={{ WebkitBoxShadow: "0 0 0 30px white inset" }}
                                />
                                {errors.name && (
                                    <p id="name-error" className="mt-2 text-sm text-red-600 flex items-center">
                                        <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                        {errors.name}
                                    </p>
                                )}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Email Address *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                required
                                className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-[#407BFF] focus:border-[#407BFF] transition-all duration-200 bg-white ${errors.email ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                placeholder="Enter your email"
                                aria-invalid={errors.email ? 'true' : 'false'}
                                aria-describedby={errors.email ? 'email-error' : undefined}
                                style={{ WebkitBoxShadow: "0 0 0 30px white inset" }}
                            />
                            {errors.email && (
                                <p id="email-error" className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Password *
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    minLength={authMode ? "6" : "8"}
                                    className={`w-full px-4 py-3 pr-12 border-2 rounded-xl focus:ring-2 focus:ring-[#407BFF] focus:border-[#407BFF] transition-all duration-200 bg-white ${errors.password ? 'border-red-400 bg-red-50' : 'border-gray-200 hover:border-gray-300'}`}
                                    placeholder="Enter your password"
                                    aria-invalid={errors.password ? 'true' : 'false'}
                                    aria-describedby={errors.password ? 'password-error' : undefined}
                                    style={{ WebkitBoxShadow: "0 0 0 30px white inset" }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 transition-colors duration-200"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {errors.password && (
                                <p id="password-error" className="mt-2 text-sm text-red-600 flex items-center">
                                    <AlertCircle className="w-4 h-4 mr-1 flex-shrink-0" />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={handleSubmit}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#407BFF] to-[#6695FF] text-white py-3 px-4 rounded-xl font-semibold focus:ring-[#407BFF] focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5  mr-1"></div>
                                    Please wait...
                                </div>
                            ) : (
                                authMode ? 'Sign In' : 'Create Account'
                            )}
                        </button>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 text-center space-y-4">
                        <button
                            onClick={toggleAuthMode}
                            className="text-[#407BFF] border0 font-medium transition-colors duration-200"
                        >
                            {authMode ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>


            <div className="w-1/2 bg-gradient-to-br from-[#407BFF] to-[#6695FF] flex items-center justify-center p-4">
                <img
                    src="assets/www-rafiki.png"
                    alt="Authentication Illustration"
                    className="w-full h-auto max-w-lg object-contain"
                />
            </div>
        </div>
    );
};

export default AuthForm;