import React from 'react';
import { Mail } from 'lucide-react';

const EmailVerificationScreen = ({ email }) => {
    return (
        <div className='w-screen h-screen flex'>
            <div className="w-1/2 min-h-screen flex items-center justify-center bg-white p-8">
                <div className="bg-white p-8 rounded-2xl shadow-xl w-full text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Mail className="w-8 h-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email</h2>
                    <p className="text-gray-600 mb-6">
                        We've sent a verification link to <strong>{email}</strong>.
                        Please check your inbox and click the link to verify your account.
                    </p>
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

export default EmailVerificationScreen;
