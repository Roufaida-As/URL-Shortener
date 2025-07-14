import React, { useState, useEffect } from 'react';
import { Link, Copy, LogOut, ExternalLink } from 'lucide-react';
import Alert from './CustomAlert';
import { api } from '../api';

const Dashboard = ({ user, onLogout }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    // Load user's existing URLs on component mount
    const fetchUserUrls = async () => {
      try {
        // You would need to implement this endpoint in your API
        // const response = await api.getUserUrls(user.token);
        // setShortenedUrls(response.data);
      } catch (error) {
        showAlert('error', 'Failed to load your URLs');
      }
    };

    fetchUserUrls();
  }, [user.token]);

  const showAlert = (type, message) => {
    setAlert({ type, message });
    setTimeout(() => setAlert(null), 5000);
  };

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!originalUrl.trim()) {
      showAlert('error', 'Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(originalUrl);
    } catch (e) {
      showAlert('error', 'Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const result = await api.shortenUrl(originalUrl, user.token);
      setShortenedUrls([result.data, ...shortenedUrls]);
      setOriginalUrl('');
      showAlert('success', 'URL shortened successfully!');
    } catch (error) {
      showAlert('error', error.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('success', 'Copied to clipboard!');
  };

  return (
    <div className="w-screen h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="w-8 h-8 mr-2 bg-gradient-to-r from-[#407BFF] to-[#6695FF] text-white rounded-2xl flex  mx-auto shadow-lg transform hover:scale-105 transition-transform duration-200">
                <Link className="w-8 h-8" />
              </div>       
              <h2 className="text-3xl font-bold text-gray-900"> URL Shortener</h2>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">Welcome, {user.name}!</span>
              <button
                onClick={onLogout}
                className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <Alert
            type={alert.type}
            message={alert.message}
            onClose={() => setAlert(null)}
          />
        )}

        {/* URL Shortener Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Shorten Your URL</h2>
          <form onSubmit={handleShorten} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter your long URL
              </label>
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Shortening...' : 'Shorten URL'}
            </button>
          </form>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Your Shortened URLs</h3>
            <div className="space-y-4">
              {shortenedUrls.map((url) => (
                <div key={url._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-2 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <a
                          href={url.shortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                        >
                          {url.shortUrl}
                          <ExternalLink className="w-4 h-4 ml-1" />
                        </a>
                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-500 hover:text-gray-700 transition-colors"
                          title="Copy to clipboard"
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 truncate">{url.originalUrl}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Link className="w-16 h-16 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No URLs shortened yet</h3>
            <p className="text-gray-600">Start by entering a long URL above to create your first short link.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;