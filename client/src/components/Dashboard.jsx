import React, { useState, useEffect } from 'react';
import { Link, Copy, LogOut, ExternalLink, Zap, BarChart3, Clock } from 'lucide-react';
import Alert from './CustomAlert';
import { api, } from '../api';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL


const Dashboard = ({ user, onLogout }) => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [shortenedUrls, setShortenedUrls] = useState([]);
  const [fetchingUrls, setFetchingUrls] = useState(true);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const handleRedirect = async (shortUrl) => {
    try {
      const urlParts = shortUrl.split('/');
      const code = urlParts[urlParts.length - 1];
      const redirectUrl = `${API_BASE_URL}/urls/redirect/${code}`;

      window.open(redirectUrl, '_blank');

    } catch (error) {
      console.error('Error redirecting URL:', error);
      showAlert('error', 'Failed to redirect to the original URL');
    }
  };

  useEffect(() => {
    const fetchUserUrls = async () => {
      try {
        setFetchingUrls(true);
        const response = await api.getAllUrls(user.token);
        setShortenedUrls(response.data || response.urls || response);
      } catch (error) {
        console.error('Error fetching URLs:', error);
        showAlert('error', 'Failed to load your URLs');
      } finally {
        setFetchingUrls(false);
      }
    };

    if (user?.token) {
      fetchUserUrls();
    }
  }, [user?.token]);
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

    try {
      new URL(originalUrl);
    } catch (e) {
      showAlert('error', 'Please enter a valid URL');
      return;
    }

    setLoading(true);
    try {
      const response = await api.shortenUrl(originalUrl, user.token);
      console.log('Shorten URL response:', response);
      const newUrl = response.data || response;
      setShortenedUrls([newUrl, ...shortenedUrls]);
      setOriginalUrl('');
      showAlert('success', 'URL shortened successfully!');
    } catch (error) {
      console.error('Error shortening URL:', error);
      showAlert('error', error.message || 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showAlert('success', 'Copied to clipboard!');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  if (fetchingUrls) {
    return (
      <div className="w-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your URLs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">

      {/* Header */}
        <header className="w-screen bg-white/80 backdrop-blur-sm border-b border-gray-200/60 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-4">
            <div className="flex justify-between items-center ">
          <div className="flex items-center space-x-2">
            <img className="w-10 h-10 text-white" src='assets/url.png' />

            <h1 className="text-3xl px-1 py-2 font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
              Linkly
            </h1>

          </div>
          <div className="flex items-center space-x-6">

            <div className="flex items-center space-x-3">
              <div className="text-right">
            <p className="text-s font-medium text-gray-900">Welcome back!</p>
            <p className="text-sm text-gray-500">{user.name}</p>
              </div>
              <button
            onClick={onLogout}
            style={{
              background: 'none',
              border: 'none',

              outline: 'none',
              boxShadow: 'none',
              appearance: 'none',
              WebkitAppearance: 'none',
              MozAppearance: 'none'
            }}
            className="flex items-center space-x-4 text-bleu-600 hover:text-red-600 transition-colors rounded-lg hover:bg-white-100"
              >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
            </div>
          </div>
        </header>
        {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {alert && (
          <div className="fixed top-4 right-4 z-50">
            <Alert
              type={alert.type}
              message={alert.message}
              onClose={() => setAlert(null)}
            />
          </div>
        )}
        {/* URL Shortener Form */}
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8 mb-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Shorten Your URL</h2>
            <p className="text-gray-600">Transform long URLs into short, shareable links</p>
          </div>

          <div className="space-y-6">
            <div className="relative">
              <input
                type="url"
                value={originalUrl}
                onChange={(e) => setOriginalUrl(e.target.value)}
                placeholder="https://example.com/very-long-url"
                className="w-full px-6 py-4 bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-lg placeholder-gray-400"
                required
              />
            </div>

            <button
              onClick={handleShorten}
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#02285b] to-[#407BFF] text-white py-4 px-6 rounded-xl font-semibold hover:from-[#407BFF] hover:to-[#02285b] focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Shortening...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <Link className="w-5 h-5" />
                  <span>Shorten URL</span>
                </div>
              )}
            </button>
          </div>
        </div>

        {/* Shortened URLs List */}
        {shortenedUrls.length > 0 ? (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center space-x-2">
              <Link className="w-6 h-6 text-blue-600" />
              <span>Your Shortened URLs</span>
            </h3>

            <div className="space-y-4">
              {shortenedUrls.map((url) => (
                <div key={url._id} className="bg-white/60 backdrop-blur-sm border border-gray-200/60 rounded-xl p-6 hover:bg-white/80 transition-all duration-200 group">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between space-y-3 sm:space-y-0">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3 mb-2">
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            handleRedirect(url.shortUrl);
                          }}
                          href={url.shortUrl}
                          className="text-blue-600 hover:text-blue-800 font-semibold text-lg flex items-center space-x-1 group-hover:underline cursor-pointer"
                        >
                          <span>{url.shortUrl}</span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </a>

                        <button
                          onClick={() => copyToClipboard(url.shortUrl)}
                          className="text-gray-400 hover:text-gray-600 transition-colors rounded-md hover:bg-gray-100"
                          title="Copy to clipboard"
                          style={{
                            background: 'none',
                            border: 'none',
                            margin: 0,
                            padding: 0,
                            outline: 'none',
                            boxShadow: 'none',
                            appearance: 'none',
                            WebkitAppearance: 'none',
                            MozAppearance: 'none'
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <p className="text-gray-600 truncate text-sm mb-2">{url.originalUrl}</p>


                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Link className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No URLs shortened yet</h3>
            <p className="text-gray-600 max-w-md mx-auto">Start by entering a long URL above to create your first short link and track its performance.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;