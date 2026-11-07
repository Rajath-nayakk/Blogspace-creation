import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  PenSquare,
  User,
  LayoutDashboard,
  BookOpen,
  LogOut,
  Menu,
  X,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

const categories = [
  'Technology',
  'Programming',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Startups',
  'Productivity',
  'Lifestyle',
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const categoriesRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (categoriesRef.current && !categoriesRef.current.contains(event.target)) {
        setCategoriesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Brand Logo & Main Nav */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2 group">
              <span className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-xs group-hover:bg-blue-600 transition">
                B
              </span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900 group-hover:text-blue-600 transition">
                BLOGSPACE<span className="text-blue-600">.</span>
              </span>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
              <Link
                to="/"
                className={`hover:text-gray-900 transition ${
                  location.pathname === '/' ? 'text-gray-900 font-semibold' : ''
                }`}
              >
                Home
              </Link>
              <Link
                to="/explore"
                className={`hover:text-gray-900 transition ${
                  location.pathname === '/explore' ? 'text-gray-900 font-semibold' : ''
                }`}
              >
                Explore
              </Link>

              {/* Categories Dropdown */}
              <div className="relative" ref={categoriesRef}>
                <button
                  onClick={() => setCategoriesOpen(!categoriesOpen)}
                  className="flex items-center gap-1 hover:text-gray-900 transition py-1"
                >
                  Categories
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>

                {categoriesOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                    {categories.map((cat) => (
                      <Link
                        key={cat}
                        to={`/explore?category=${encodeURIComponent(cat)}`}
                        onClick={() => setCategoriesOpen(false)}
                        className="block px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                )}
              </div>

              <Link
                to="/explore?search="
                className="hover:text-gray-900 transition"
              >
                Topics
              </Link>
            </nav>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-xs xl:max-w-sm">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories, tags, authors..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 text-xs bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition"
              />
            </form>
          </div>

          {/* Right: Actions & User Avatar */}
          <div className="flex items-center gap-3">
            {/* Write Story Button */}
            <Link
              to="/create"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
            >
              <PenSquare className="w-4 h-4 text-gray-500" />
              <span>Write</span>
            </Link>

            {user ? (
              /* Authenticated User Menu */
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-blue-500/20 transition cursor-pointer"
                  aria-label="User profile menu"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-gray-200"
                  />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-4 py-2.5 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-900 truncate">
                        {user.name}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        @{user.username}
                      </p>
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                      >
                        <LayoutDashboard className="w-4 h-4 text-gray-400" />
                        Dashboard
                      </Link>
                      <Link
                        to={`/profile/${user._id}`}
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition"
                      >
                        <User className="w-4 h-4 text-gray-400" />
                        Profile
                      </Link>
                      <Link
                        to="/create"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition sm:hidden"
                      >
                        <PenSquare className="w-4 h-4 text-gray-400" />
                        Write Story
                      </Link>
                    </div>

                    <div className="pt-1 border-t border-gray-100">
                      <button
                        onClick={() => {
                          setDropdownOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Guest Actions */
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 text-xs font-semibold text-gray-700 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-gray-950 hover:bg-gray-800 rounded-full transition shadow-xs"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-4 animate-in slide-in-from-top-2 duration-200">
            <form onSubmit={handleSearchSubmit} className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search stories, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-xs bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </form>

            <nav className="flex flex-col space-y-2 text-sm font-medium text-gray-700">
              <Link to="/" className="px-3 py-2 rounded-lg hover:bg-gray-50">
                Home
              </Link>
              <Link to="/explore" className="px-3 py-2 rounded-lg hover:bg-gray-50">
                Explore Stories
              </Link>
              <Link to="/create" className="px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                <PenSquare className="w-4 h-4 text-blue-600" />
                Write a Story
              </Link>
              <div className="pt-2 border-t border-gray-100">
                <p className="px-3 text-xs uppercase tracking-wider text-gray-400 font-semibold mb-2">
                  Popular Categories
                </p>
                <div className="flex flex-wrap gap-1.5 px-3">
                  {categories.map((c) => (
                    <Link
                      key={c}
                      to={`/explore?category=${encodeURIComponent(c)}`}
                      className="text-xs px-2.5 py-1 bg-gray-100 rounded-md text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                    >
                      {c}
                    </Link>
                  ))}
                </div>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;

