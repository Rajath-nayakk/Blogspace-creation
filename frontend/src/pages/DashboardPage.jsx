import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileText,
  Heart,
  MessageSquare,
  FileEdit,
  Plus,
  Trash2,
  Edit,
  Eye,
  CheckCircle,
  Clock,
  Filter,
} from 'lucide-react';
import * as blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const DashboardPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalPublished: 0,
    totalDrafts: 0,
    totalLikes: 0,
    totalComments: 0,
  });
  const [posts, setPosts] = useState([]);
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'published' | 'draft'
  const [loading, setLoading] = useState(true);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, postsRes] = await Promise.all([
        blogService.getDashboardStats(),
        blogService.getMyPosts(),
      ]);

      if (statsRes.success) {
        setStats(statsRes.stats);
      }
      if (postsRes.success) {
        setPosts(postsRes.posts || []);
      }
    } catch (err) {
      console.error('Failed to load dashboard:', err);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleDeletePost = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await blogService.deleteBlog(id);
      if (res.success) {
        toast.success('Article deleted successfully');
        setPosts((prev) => prev.filter((p) => p._id !== id));
        loadDashboardData(); // Refresh stats
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete article');
    }
  };

  const handleQuickPublishDraft = async (post) => {
    try {
      const res = await blogService.updateBlog(post._id, { status: 'published' });
      if (res.success) {
        toast.success('Draft published successfully!');
        setPosts((prev) =>
          prev.map((p) => (p._id === post._id ? { ...p, status: 'published' } : p))
        );
        loadDashboardData();
      }
    } catch (err) {
      toast.error('Failed to publish draft');
    }
  };

  const filteredPosts = posts.filter((p) => {
    if (filterStatus === 'all') return true;
    return p.status === filterStatus;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Author Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Dashboard
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Welcome back, {user?.name}. Here's an overview of your writing performance.
          </p>
        </div>

        <Link
          to="/create"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        <StatCard
          title="Published Stories"
          value={stats.totalPublished}
          icon={FileText}
          color="blue"
        />
        <StatCard
          title="Total Likes"
          value={stats.totalLikes}
          icon={Heart}
          color="rose"
        />
        <StatCard
          title="Responses Received"
          value={stats.totalComments}
          icon={MessageSquare}
          color="emerald"
        />
        <StatCard
          title="Drafts In Progress"
          value={stats.totalDrafts}
          icon={FileEdit}
          color="amber"
        />
      </div>

      {/* Posts Management Section */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-xs p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-bold text-gray-900">Manage Your Stories</h3>
            <p className="text-xs text-gray-500">Edit, preview, or delete your publications</p>
          </div>

          {/* Filter Status Tabs */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === 'all'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              All ({posts.length})
            </button>
            <button
              onClick={() => setFilterStatus('published')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === 'published'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Published ({stats.totalPublished})
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === 'draft'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Drafts ({stats.totalDrafts})
            </button>
          </div>
        </div>

        {/* Stories Table / List */}
        {loading ? (
          <div className="py-12 text-center text-xs text-gray-400 animate-pulse">
            Loading your articles...
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="divide-y divide-gray-100 overflow-x-auto">
            {filteredPosts.map((post) => (
              <div
                key={post._id}
                className="py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50/60 p-3 rounded-2xl transition"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <img
                    src={post.coverImage || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=100'}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover border border-gray-100 shrink-0 bg-gray-100"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md ${
                          post.status === 'published'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}
                      >
                        {post.status}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {post.category}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-gray-900 truncate">
                      {post.title}
                    </h4>

                    <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                      <span>Updated {formatDate(post.updatedAt || post.createdAt)}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <Heart className="w-3.5 h-3.5 text-rose-500" />
                        {post.likesCount || 0}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
                        {post.commentCount || 0}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right: Action Buttons */}
                <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                  {post.status === 'draft' && (
                    <button
                      onClick={() => handleQuickPublishDraft(post)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold border border-emerald-200 transition"
                      title="Publish this draft immediately"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Publish
                    </button>
                  )}

                  {post.status === 'published' && (
                    <Link
                      to={`/blog/${post.slug || post._id}`}
                      className="p-2 text-gray-500 hover:text-blue-600 hover:bg-gray-100 rounded-lg transition"
                      title="View Live"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  )}

                  <Link
                    to={`/edit/${post._id}`}
                    className="p-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition"
                    title="Edit Story"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDeletePost(post._id, post.title)}
                    className="p-2 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                    title="Delete Story"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-900">No stories found</h4>
            <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto">
              You haven't written any articles matching this filter yet.
            </p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-lg hover:bg-blue-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Write Story
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;

