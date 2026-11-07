import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  ArrowRight,
  BookOpen,
  Search,
  Compass,
  Feather,
} from 'lucide-react';
import * as blogService from '../services/blogService';
import * as userService from '../services/userService';
import BlogCard from '../components/BlogCard';
import AuthorCard from '../components/AuthorCard';
import CategoryBadge from '../components/CategoryBadge';
import { BlogCardSkeleton } from '../components/SkeletonLoader';
import { formatDate } from '../utils/formatDate';

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

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredBlogs, setFeaturedBlogs] = useState([]);
  const [trendingBlogs, setTrendingBlogs] = useState([]);
  const [latestBlogs, setLatestBlogs] = useState([]);
  const [popularAuthors, setPopularAuthors] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [heroSearch, setHeroSearch] = useState('');

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        setLoading(true);
        const [featuredRes, trendingRes, latestRes, authorsRes] =
          await Promise.all([
            blogService.getFeaturedBlogs(),
            blogService.getTrendingBlogs(),
            blogService.getBlogs({ limit: 6 }),
            userService.getPopularAuthors(),
          ]);

        if (isMounted) {
          if (featuredRes.success) setFeaturedBlogs(featuredRes.blogs || []);
          if (trendingRes.success) setTrendingBlogs(trendingRes.blogs || []);
          if (latestRes.success) setLatestBlogs(latestRes.blogs || []);
          if (authorsRes.success) setPopularAuthors(authorsRes.authors || []);
        }
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  // Filter latest by selected category tab
  const handleCategoryChange = async (cat) => {
    setActiveCategory(cat);
    try {
      const params = { limit: 6 };
      if (cat !== 'All') params.category = cat;
      const res = await blogService.getBlogs(params);
      if (res.success) {
        setLatestBlogs(res.blogs || []);
      }
    } catch (err) {
      console.error('Failed to filter category:', err);
    }
  };

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (heroSearch.trim()) {
      navigate(`/explore?search=${encodeURIComponent(heroSearch.trim())}`);
    }
  };

  const heroPost = featuredBlogs[0];
  const sideFeatured = featuredBlogs.slice(1, 4);

  return (
    <div className="space-y-16 lg:space-y-24">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-gray-50/40 to-transparent border-b border-gray-100 py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold border border-blue-200/60 mb-6">
              <Sparkles className="w-3.5 h-3.5" />
              <span>The Editorial Platform for Independent Thought</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.12]">
              Ideas Worth Sharing.{' '}
              <span className="text-gray-500 font-serif italic font-normal">
                Stories Worth Reading.
              </span>
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-2xl mx-auto font-sans">
              Discover in-depth engineering breakdowns, architectural insights, and unfiltered founder lessons from curious builders worldwide.
            </p>

            {/* Hero Search & CTA */}
            <div className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
              <form onSubmit={handleHeroSearch} className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search architecture, AI, system design..."
                  value={heroSearch}
                  onChange={(e) => setHeroSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 text-sm bg-white border border-gray-200 rounded-xl shadow-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </form>
              <Link
                to="/explore"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-sm font-semibold shadow-sm transition"
              >
                <span>Explore Stories</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED ARTICLES SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Curated Selection
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Featured Articles
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-xs sm:text-sm font-semibold text-gray-700 hover:text-blue-600 transition flex items-center gap-1"
          >
            Browse all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BlogCardSkeleton />
            </div>
            <div className="space-y-4">
              <BlogCardSkeleton />
              <BlogCardSkeleton />
            </div>
          </div>
        ) : heroPost ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Primary Hero Feature (8 cols) */}
            <div className="lg:col-span-7 xl:col-span-8 group">
              <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition duration-300 flex flex-col">
                <Link
                  to={`/blog/${heroPost.slug || heroPost._id}`}
                  className="relative aspect-[16/9] overflow-hidden bg-gray-100 block"
                >
                  <img
                    src={heroPost.coverImage}
                    alt={heroPost.title}
                    className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute top-4 left-4">
                    <CategoryBadge category={heroPost.category} />
                  </div>
                </Link>

                <div className="p-6 sm:p-8">
                  <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                    <span>{heroPost.readTime || 3} min read</span>
                    <span>•</span>
                    <span>{formatDate(heroPost.createdAt)}</span>
                  </div>

                  <Link to={`/blog/${heroPost.slug || heroPost._id}`}>
                    <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 group-hover:text-blue-600 transition leading-tight mb-4">
                      {heroPost.title}
                    </h3>
                  </Link>

                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed line-clamp-3 mb-6">
                    {heroPost.description}
                  </p>

                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <Link
                      to={`/profile/${heroPost.author?._id}`}
                      className="flex items-center gap-3"
                    >
                      <img
                        src={heroPost.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={heroPost.author?.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                      />
                      <div>
                        <p className="text-sm font-semibold text-gray-900">
                          {heroPost.author?.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          @{heroPost.author?.username}
                        </p>
                      </div>
                    </Link>

                    <Link
                      to={`/blog/${heroPost.slug || heroPost._id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      Read Story &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Secondary side articles (4 cols) */}
            <div className="lg:col-span-5 xl:col-span-4 bg-white rounded-3xl border border-gray-100 p-6 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 pb-3 border-b border-gray-100">
                Editor's Top Picks
              </h4>
              <div className="divide-y divide-gray-100">
                {sideFeatured.map((blog) => (
                  <BlogCard key={blog._id} blog={blog} variant="compact" />
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </section>

      {/* 3. TRENDING ARTICLES WITH RANK NUMBERS */}
      {trendingBlogs.length > 0 && (
        <section className="bg-gray-50/70 border-y border-gray-100 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900 tracking-tight">
                Trending on BLOGSPACE
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {trendingBlogs.slice(0, 6).map((blog, idx) => (
                <div key={blog._id} className="flex gap-4 items-start group">
                  <span className="text-3xl sm:text-4xl font-extrabold text-gray-200 group-hover:text-blue-600 transition font-serif shrink-0 w-10">
                    0{idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1.5">
                      <img
                        src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                        alt={blog.author?.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-semibold text-gray-700 truncate">
                        {blog.author?.name}
                      </span>
                    </div>

                    <Link to={`/blog/${blog.slug || blog._id}`}>
                      <h4 className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
                        {blog.title}
                      </h4>
                    </Link>

                    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                      <span>{formatDate(blog.createdAt)}</span>
                      <span>•</span>
                      <span>{blog.readTime || 3} min read</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. LATEST ARTICLES WITH CATEGORY TABS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Fresh Perspectives
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Latest Publications
            </h2>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.slice(0, 5).map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryChange(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-gray-900 text-white'
                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {cat}
              </button>
            ))}
            <Link
              to="/explore"
              className="px-3.5 py-1.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 whitespace-nowrap transition"
            >
              More &rarr;
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : latestBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestBlogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-gray-900">No stories found</h3>
            <p className="text-sm text-gray-500 mt-1">
              Be the first to publish an article in this category!
            </p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <Feather className="w-3.5 h-3.5" /> Write Story
            </Link>
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-gray-300 hover:border-gray-900 text-gray-900 text-sm font-semibold transition"
          >
            <span>Explore All Stories</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 5. POPULAR AUTHORS SPOTLIGHT */}
      {popularAuthors.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Community Voices
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
              Popular Writers
            </h2>
            <p className="text-sm text-gray-500 mt-2">
              Follow influential engineers, authors, and industry leaders sharing their craftsmanship on BLOGSPACE.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularAuthors.map((author) => (
              <AuthorCard key={author._id} author={author} />
            ))}
          </div>
        </section>
      )}

      {/* 6. CALL TO ACTION FOR WRITERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-8">
        <div className="relative rounded-3xl overflow-hidden bg-gray-950 text-white p-8 sm:p-14 text-center lg:text-left flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="max-w-xl space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
              Join the Network
            </span>
            <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Have insights worth sharing?
            </h3>
            <p className="text-sm sm:text-base text-gray-400 leading-relaxed font-sans">
              Publish with full markdown support, code highlighting, and clean typography. Reach thousands of developers, researchers, and founders today.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              to="/create"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-lg transition"
            >
              <Feather className="w-4 h-4" />
              <span>Start Writing Now</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;

