import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Send, CornerDownRight, LogIn } from 'lucide-react';
import * as commentService from '../services/commentService';
import CommentItem from './CommentItem';
import toast from 'react-hot-toast';

const CommentSection = ({ blogId, blogAuthorId, currentUser }) => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchComments = async () => {
      try {
        setLoading(true);
        const data = await commentService.getComments(blogId);
        if (isMounted && data.success) {
          setComments(data.comments || []);
        }
      } catch (error) {
        console.error('Failed to load comments:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (blogId) {
      fetchComments();
    }

    return () => {
      isMounted = false;
    };
  }, [blogId]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const res = await commentService.createComment(blogId, newComment.trim());
      if (res.success && res.comment) {
        // Optimistically prepend comment
        setComments((prev) => [res.comment, ...prev]);
        setNewComment('');
        toast.success('Comment posted!');
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to post comment';
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateComment = async (commentId, updatedContent) => {
    try {
      const res = await commentService.updateComment(commentId, updatedContent);
      if (res.success && res.comment) {
        setComments((prev) =>
          prev.map((c) => (c._id === commentId ? res.comment : c))
        );
        toast.success('Comment updated!');
        return true;
      }
      return false;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update comment');
      return false;
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const res = await commentService.deleteComment(commentId);
      if (res.success) {
        setComments((prev) => prev.filter((c) => c._id !== commentId));
        toast.success('Comment deleted');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <section className="mt-12 pt-10 border-t border-gray-200" id="comments">
      {/* Header with Count */}
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2.5">
          <MessageSquare className="w-6 h-6 text-gray-700" />
          Responses
          <span className="text-base font-normal text-gray-500">
            ({comments.length})
          </span>
        </h3>
      </div>

      {/* Comment Form for Authenticated Users */}
      {currentUser ? (
        <form onSubmit={handleAddComment} className="mb-10 bg-white p-5 rounded-2xl border border-gray-200/80 shadow-sm">
          <div className="flex items-start gap-3">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200 shrink-0 mt-1"
            />
            <div className="flex-1">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows={3}
                placeholder="What are your thoughts on this story? Markdown supported..."
                className="w-full text-sm p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50 resize-y"
              />
              <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Be respectful and constructive in discussion.
                </span>
                <button
                  type="submit"
                  disabled={submitting || !newComment.trim()}
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition disabled:opacity-50 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? 'Posting...' : 'Respond'}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-10 p-6 rounded-2xl bg-gray-50 border border-gray-200/80 text-center">
          <p className="text-sm text-gray-600 mb-3">
            Join the conversation. Sign in to share your thoughts or ask the author questions.
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-gray-800 transition"
          >
            <LogIn className="w-4 h-4" /> Sign In to Comment
          </Link>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="space-y-4 py-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse flex gap-3 py-4 border-b border-gray-100">
              <div className="w-9 h-9 bg-gray-200 rounded-full shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length > 0 ? (
        <div className="divide-y divide-gray-100">
          {comments.map((comment) => (
            <CommentItem
              key={comment._id}
              comment={comment}
              currentUser={currentUser}
              blogAuthorId={blogAuthorId}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 px-4 border border-dashed border-gray-200 rounded-2xl bg-gray-50/50">
          <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h4 className="text-sm font-semibold text-gray-700">No responses yet</h4>
          <p className="text-xs text-gray-500 mt-1">
            Be the first to share your thoughts on this story.
          </p>
        </div>
      )}
    </section>
  );
};

export default CommentSection;

