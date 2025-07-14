import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { api } from '../api';

const EmailVerificationHandler = ({ onVerificationComplete }) => {
    const { token } = useParams(); // Get token from URL parameters
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log('Verification token from URL:', token);
                const result = await api.verifyEmail(token);
                console.log('Email verification result:', result);

                if (result.status === 'success') {
                    // Pass both token and user data to the parent component
                    onVerificationComplete(result.token, result.user);
                } else {
                    // Pass the actual error message from the server to the user
                    setError(result.message || 'Verification failed');
                }
            } catch (error) {
                console.error('Email verification error:', error);
                // Check if the error object contains a specific server message
                setError(error.message || 'Network error. Please try again.');
            } finally {
                setVerifying(false);
            }
        };

        if (token) {
            verifyEmail();
        } else {
            setError('No verification token found');
            setVerifying(false);
        }
    }, [token, onVerificationComplete]);

    if (verifying) {
        return (
            <div className='w-screen h-screen flex '>
                <div className="w-1/2 min-h-screen flex items-center justify-center bg-white p-8">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
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
    }

    if (error) {
        return (
            <div className="w-1/2 min-h-screen flex items-center justify-center bg-white p-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <AlertCircle className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Verification Failed</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => window.location.href = '/login'}
                        className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Go Back to Login
                    </button>
                </div>
            </div>


        );
    }

    return null;
};

export default EmailVerificationHandler;