import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Share2,
  Copy,
  Clock,
  Calendar,
  Eye,
  MessageSquare,
  ArrowLeft,
  Edit,
  Tag,
  Check,
} from 'lucide-react';
import * as blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
import MarkdownRenderer from '../components/MarkdownRenderer';
import CategoryBadge from '../components/CategoryBadge';
import CommentSection from '../components/CommentSection';
import ShareModal from '../components/ShareModal';
import BlogCard from '../components/BlogCard';
import { ArticleDetailSkeleton } from '../components/SkeletonLoader';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const BlogDetailPage = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [relatedBlogs, setRelatedBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiking, setIsLiking] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchBlogDetail = async () => {
      try {
        setLoading(true);
        const res = await blogService.getBlogBySlug(slug);
        if (isMounted && res.success && res.blog) {
          setBlog(res.blog);
          setRelatedBlogs(res.relatedBlogs || []);
          setIsLiked(res.blog.isLiked || false);
          setLikesCount(res.blog.likesCount || 0);
          window.scrollTo({ top: 0, behavior: 'instant' });
        }
      } catch (err) {
        console.error('Error fetching blog detail:', err);
        if (isMounted) {
          toast.error('Article not found');
          navigate('/explore');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (slug) {
      fetchBlogDetail();
    }

    return () => {
      isMounted = false;
    };
  }, [slug, navigate]);

  const handleToggleLike = async () => {
    if (!user) {
      toast.error('Please sign in to like this story');
      navigate('/login');
      return;
    }

    if (isLiking || !blog) return;

    try {
      setIsLiking(true);
      // Optimistic update
      const newStatus = !isLiked;
      setIsLiked(newStatus);
      setLikesCount((prev) => (newStatus ? prev + 1 : Math.max(0, prev - 1)));

      const res = await blogService.toggleLike(blog._id);
      if (res.success) {
        setIsLiked(res.isLiked);
        setLikesCount(res.likesCount);
      }
    } catch (err) {
      // Revert optimistic update
      setIsLiked(!isLiked);
      setLikesCount((prev) => (!isLiked ? prev + 1 : Math.max(0, prev - 1)));
      toast.error('Failed to update like');
    } finally {
      setIsLiking(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (loading) {
    return <ArticleDetailSkeleton />;
  }

  if (!blog) {
    return null;
  }

  const isAuthor = user && blog.author && user._id === blog.author._id;
  const currentUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-16">
      {/* Back button & Category */}
      <div className="flex items-center justify-between mb-8">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Articles</span>
        </Link>
        <CategoryBadge category={blog.category} size="md" />
      </div>

      {/* Article Header */}
      <header className="mb-10">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-gray-900 leading-[1.2] mb-6">
          {blog.title}
        </h1>

        <p className="text-lg sm:text-xl text-gray-600 font-sans leading-relaxed mb-8">
          {blog.description}
        </p>

        {/* Author metadata & Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-5 border-y border-gray-100">
          <Link
            to={`/profile/${blog.author?._id}`}
            className="flex items-center gap-3.5 group"
          >
            <img
              src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={blog.author?.name}
              className="w-12 h-12 rounded-full object-cover border border-gray-200"
            />
            <div>
              <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition">
                {blog.author?.name || 'Anonymous Author'}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{formatDate(blog.createdAt)}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  {blog.readTime || 3} min read
                </span>
                {blog.views > 0 && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" />
                      {blog.views} views
                    </span>
                  </>
                )}
              </div>
            </div>
          </Link>

          {/* Action buttons (Like, Share, Copy Link, Edit if owner) */}
          <div className="flex items-center gap-2">
            {isAuthor && (
              <Link
                to={`/edit/${blog._id}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                <Edit className="w-3.5 h-3.5" />
                Edit Post
              </Link>
            )}

            {/* Like Button */}
            <button
              onClick={handleToggleLike}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border transition cursor-pointer ${
                isLiked
                  ? 'bg-rose-50 border-rose-200 text-rose-600 shadow-2xs'
                  : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
              }`}
              title="Like this story"
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-gray-500'}`}
              />
              <span>{likesCount}</span>
            </button>

            {/* Comments jump */}
            <a
              href="#comments"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition"
              title="Jump to responses"
            >
              <MessageSquare className="w-4 h-4 text-gray-500" />
              <span>{blog.commentCount || 0}</span>
            </a>

            {/* Share Button */}
            <button
              onClick={() => setShareModalOpen(true)}
              className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition cursor-pointer"
              title="Share story"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Copy Link Button */}
            <button
              onClick={handleCopyLink}
              className="p-2 rounded-full border border-gray-200 bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition cursor-pointer"
              title="Copy URL"
            >
              {copiedLink ? (
                <Check className="w-4 h-4 text-emerald-600" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      {blog.coverImage && (
        <div className="mb-12 rounded-3xl overflow-hidden shadow-sm aspect-[16/9] bg-gray-100 border border-gray-100">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Long-form Article Body */}
      <div className="max-w-3xl mx-auto">
        <MarkdownRenderer content={blog.content} />

        {/* Tags */}
        {blog.tags && blog.tags.length > 0 && (
          <div className="mt-12 pt-6 border-t border-gray-100 flex items-center gap-2 flex-wrap">
            <Tag className="w-4 h-4 text-gray-400 mr-1" />
            {blog.tags.map((tag) => (
              <Link
                key={tag}
                to={`/explore?search=${encodeURIComponent(tag)}`}
                className="text-xs px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-full transition font-medium"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Bottom Author Box */}
        <div className="mt-14 p-6 sm:p-8 rounded-3xl bg-gray-50/80 border border-gray-200/60 flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={blog.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={blog.author?.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
          />
          <div className="flex-1 text-center sm:text-left">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
              Written By
            </span>
            <h4 className="text-lg font-bold text-gray-900 mt-0.5">
              {blog.author?.name}
            </h4>
            <p className="text-xs text-gray-500 mb-2">@{blog.author?.username}</p>
            {blog.author?.bio && (
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                {blog.author?.bio}
              </p>
            )}
            <Link
              to={`/profile/${blog.author?._id}`}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2"
            >
              View all stories by {blog.author?.name} &rarr;
            </Link>
          </div>
        </div>

        {/* Comments Section */}
        <CommentSection
          blogId={blog._id}
          blogAuthorId={blog.author?._id}
          currentUser={user}
        />
      </div>

      {/* Related Articles */}
      {relatedBlogs.length > 0 && (
        <section className="mt-20 pt-12 border-t border-gray-200">
          <h3 className="text-2xl font-extrabold text-gray-900 mb-8">
            More in {blog.category}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedBlogs.map((item) => (
              <BlogCard key={item._id} blog={item} />
            ))}
          </div>
        </section>
      )}

      {/* Share Modal */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        title={blog.title}
        url={currentUrl}
      />
    </article>
  );
};

export default BlogDetailPage;

