import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!identifier.trim() || !password) {
      setErrorMessage('Please fill in both fields.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await login({
        emailOrUsername: identifier.trim(),
        password,
      });

      if (res.success) {
        navigate(from, { replace: true });
      } else {
        setErrorMessage(res.message);
      }
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Demo user quick login
  const handleQuickDemo = async (demoEmail) => {
    setIdentifier(demoEmail);
    setPassword('Password123!');
    setIsSubmitting(true);
    const res = await login({
      emailOrUsername: demoEmail,
      password: 'Password123!',
    });
    setIsSubmitting(false);
    if (res.success) {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-gray-100 shadow-sm">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2 group mb-4">
            <span className="w-9 h-9 rounded-xl bg-gray-950 flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-xs">
              B
            </span>
            <span className="text-2xl font-extrabold tracking-tight text-gray-900">
              BLOGSPACE<span className="text-blue-600">.</span>
            </span>
          </Link>
          <h2 className="text-2xl font-extrabold text-gray-900">
            Welcome back
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Sign in to continue sharing and discovering stories
          </p>
        </div>

        {/* Error notification */}
        {errorMessage && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Email or Username
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="you@domain.com or username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold shadow-xs transition disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{isSubmitting ? 'Signing in...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Sign-in for smooth evaluation */}
        <div className="pt-4 border-t border-gray-100">
          <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2.5 text-center flex items-center justify-center gap-1.5">
            <UserCheck className="w-3.5 h-3.5 text-blue-600" />
            Quick Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('elena@blogspace.io')}
              className="py-1.5 px-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 text-[11px] font-medium text-gray-600 transition"
            >
              Elena (Staff Arch)
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('marcus@blogspace.io')}
              className="py-1.5 px-2 rounded-lg bg-gray-50 hover:bg-blue-50 hover:text-blue-700 border border-gray-200 text-[11px] font-medium text-gray-600 transition"
            >
              Marcus (AI Author)
            </button>
          </div>
        </div>

        {/* Footer link to Register */}
        <p className="text-center text-xs text-gray-500">
          Don't have an account yet?{' '}
          <Link
            to="/register"
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;

