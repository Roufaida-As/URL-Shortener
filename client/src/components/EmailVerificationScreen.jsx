const EmailVerificationScreen = ({ email }) => {
    return (
        <div className='w-screen h-screen flex'>
            <div className="w-1/2 min-h-screen flex items-center justify-center bg-white p-8">
                <div className="bg-white p-6 rounded-2xl shadow-xl w-full text-center">
                    <div className="flex items-center justify-center space-x-2">
                        <img className="w-10 h-10" src='assets/url.png' alt="Logo" />
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent px-1 py-1">
                            Linkly
                        </h1>

                    </div>

                    <h2 className="text-2xl mt-4 font-bold text-gray-900 mb-4">Check Your Email</h2>
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
