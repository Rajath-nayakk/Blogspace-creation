import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, BookOpen, X, ChevronLeft, ChevronRight } from 'lucide-react';
import * as blogService from '../services/blogService';
import BlogCard from '../components/BlogCard';
import { BlogCardSkeleton } from '../components/SkeletonLoader';

const categories = [
  'All',
  'Technology',
  'Programming',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Startups',
  'Productivity',
  'Lifestyle',
];

const ExplorePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // URL state
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialSort = searchParams.get('sort') || 'latest';
  const initialPage = parseInt(searchParams.get('page')) || 1;

  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeCategory, setActiveCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState(initialSort);
  const [currentPage, setCurrentPage] = useState(initialPage);

  const [blogs, setBlogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Sync with searchParams
  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All');
    setSortBy(searchParams.get('sort') || 'latest');
    setSearchInput(searchParams.get('search') || '');
    setCurrentPage(parseInt(searchParams.get('page')) || 1);
  }, [searchParams]);

  // Fetch blogs on param changes
  useEffect(() => {
    let isMounted = true;

    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const params = {
          page: currentPage,
          limit: 9,
          sort: sortBy,
        };

        if (activeCategory && activeCategory !== 'All') {
          params.category = activeCategory;
        }

        const queryTerm = searchParams.get('search');
        if (queryTerm && queryTerm.trim()) {
          params.search = queryTerm.trim();
        }

        const res = await blogService.getBlogs(params);
        if (isMounted && res.success) {
          setBlogs(res.blogs || []);
          setTotal(res.total || 0);
          setTotalPages(res.totalPages || 1);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchBlogs();

    return () => {
      isMounted = false;
    };
  }, [searchParams, activeCategory, sortBy, currentPage]);

  const updateUrlParams = (newParams) => {
    const current = Object.fromEntries(searchParams.entries());
    const merged = { ...current, ...newParams };

    // Clean up empty or default params
    Object.keys(merged).forEach((key) => {
      if (!merged[key] || merged[key] === 'All' || (key === 'page' && merged[key] === 1)) {
        delete merged[key];
      }
    });

    setSearchParams(merged);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateUrlParams({ search: searchInput.trim(), page: 1 });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    updateUrlParams({ search: '', page: 1 });
  };

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
    updateUrlParams({ category, page: 1 });
  };

  const handleSortChange = (e) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    updateUrlParams({ sort: newSort, page: 1 });
  };

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    updateUrlParams({ page: newPage });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
          Explore Articles
        </h1>
        <p className="text-sm sm:text-base text-gray-500 mt-2">
          Browse through {total} insightful perspectives across engineering, design, and ideas.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-gray-100 shadow-xs mb-8 space-y-4">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="relative w-full md:max-w-md">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, topic, or keyword..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-9 py-2.5 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {searchInput && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
            <SlidersHorizontal className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">Sort by:</span>
            <select
              value={sortBy}
              onChange={handleSortChange}
              className="text-xs font-semibold py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer text-gray-800"
            >
              <option value="latest">Latest First</option>
              <option value="popular">Most Popular</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none pt-2 border-t border-gray-50">
          <Filter className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <div className="flex items-center gap-1.5 flex-nowrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active filters indicators */}
      {(searchParams.get('search') || activeCategory !== 'All') && (
        <div className="flex items-center gap-2 mb-6 text-xs text-gray-500">
          <span>Filtering by:</span>
          {searchParams.get('search') && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full font-medium">
              Keyword: "{searchParams.get('search')}"
              <button onClick={handleClearSearch} className="hover:text-blue-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {activeCategory !== 'All' && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
              Category: {activeCategory}
              <button
                onClick={() => handleCategorySelect('All')}
                className="hover:text-gray-900"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}

      {/* Articles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : blogs.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-14 flex items-center justify-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>

              <div className="flex items-center gap-1 px-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`w-9 h-9 rounded-xl text-xs font-bold transition ${
                      currentPage === page
                        ? 'bg-gray-950 text-white'
                        : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-gray-100 p-8">
          <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-gray-900">No matching articles found</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm mx-auto">
            We couldn't find any stories matching your current search criteria. Try modifying your filters or clear them.
          </p>
          <button
            onClick={() => {
              setActiveCategory('All');
              setSearchInput('');
              setSearchParams({});
            }}
            className="mt-6 px-4 py-2 bg-gray-950 text-white text-xs font-semibold rounded-xl hover:bg-gray-800 transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default ExplorePage;

