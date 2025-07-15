import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { api } from '../api';

const EmailVerificationHandler = ({ onVerificationComplete }) => {
    const { token } = useParams(); 
    const [verifying, setVerifying] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                console.log('Verification token from URL:', token);
                const result = await api.verifyEmail(token);
                console.log('Email verification result:', result);

                // Add 2 second delay to show the verification page
                await new Promise(resolve => setTimeout(resolve, 2000));

                if (result.status === 'success') {
                    onVerificationComplete(result.token, result.user);
                } else {
                    setError(result.message || 'Verification failed');
                }
            } catch (error) {
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
            <div className='w-screen h-screen flex'>
                <div className="w-1/2 min-h-screen flex items-center justify-center bg-white p-8">
                    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md text-center">
                        <div className="flex items-center justify-center space-x-2">
                            <img 
                                className="w-10 h-10" 
                                src='/assets/url.png' 
                                alt="Logo"
                                onError={(e) => {
                                    console.error('Logo image failed to load:', e.target.src);
                                    e.target.style.display = 'none';
                                }}
                            />
                            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-1 py-1">
                                Linkly
                            </h1>
                        </div>
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Verifying Your Email</h2>
                        <p className="text-gray-600">Please wait while we verify your email address...</p>
                    </div>
                </div>
                <div className="w-1/2 bg-gradient-to-br from-[#407BFF] to-[#6695FF] flex items-center justify-center p-4">
                    <img
                        src="/assets/www-rafiki.png"
                        alt="Authentication Illustration"
                        className="w-full h-auto max-w-lg object-contain"
                        onError={(e) => {
                            console.error('Illustration image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                        onLoad={() => {
                            console.log('Illustration image loaded successfully');
                        }}
                    />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="w-screen h-screen flex">
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
                <div className="w-1/2 bg-gradient-to-br from-[#407BFF] to-[#6695FF] flex items-center justify-center p-4">
                    <img
                        src="/assets/www-rafiki.png"
                        alt="Authentication Illustration"
                        className="w-full h-auto max-w-lg object-contain"
                        onError={(e) => {
                            console.error('Illustration image failed to load:', e.target.src);
                            e.target.style.display = 'none';
                        }}
                    />
                </div>
            </div>
        );
    }

    return null;
};

export default EmailVerificationHandler;