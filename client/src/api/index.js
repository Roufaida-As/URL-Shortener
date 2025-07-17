
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type');

    // Check if response is JSON
    if (contentType && contentType.includes('application/json')) {
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }
        return data;
    } else {
        // Handle non-JSON response (like HTML error pages)
        const text = await response.text();
        throw new Error(`Server returned ${response.status}: ${text.slice(0, 100)}`);
    }
};

export const api = {
    signup: async (userData) => {
        try {
            const response = await fetch(`${API_BASE_URL}/signup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });
            console.log('Signup response:', response);
            return await handleResponse(response);
        } catch (error) {
            console.error('Signup error:', error);
            throw error;
        }
    },

    login: async (credentials) => {
        try {
            const response = await fetch(`${API_BASE_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            console.log('Login response:', response);
            return await handleResponse(response);
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    verifyEmail: async (token) => {
        const response = await fetch(`${API_BASE_URL}/verify-email/${token}`, {
            method: 'GET',
        });
        console.log('Email verification response:', response);
        return handleResponse(response);
    },

    shortenUrl: async (originalUrl, token) => {
        const response = await fetch(`${API_BASE_URL}/urls/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ originalUrl }),
        });
        return handleResponse(response);
    },
    getAllUrls: async (token) => {
        const response = await fetch(`${API_BASE_URL}/urls`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });
        return handleResponse(response);
    },
};