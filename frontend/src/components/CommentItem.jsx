import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit2, Trash2, Check, X, ShieldAlert } from 'lucide-react';
import { timeAgo } from '../utils/formatDate';

const CommentItem = ({
  comment,
  currentUser,
  blogAuthorId,
  onUpdate,
  onDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(comment.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isCommentAuthor =
    currentUser && comment.author && currentUser._id === comment.author._id;
  const isBlogAuthor =
    currentUser && blogAuthorId && currentUser._id === blogAuthorId;
  const canDelete = isCommentAuthor || isBlogAuthor;
  const canEdit = isCommentAuthor;

  const handleSaveEdit = async () => {
    if (!editedContent.trim()) return;
    setIsSubmitting(true);
    const success = await onUpdate(comment._id, editedContent.trim());
    setIsSubmitting(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(comment.content);
    setIsEditing(false);
  };

  return (
    <div className="py-5 border-b border-gray-100 last:border-b-0 group">
      <div className="flex items-start justify-between gap-4">
        {/* Author details */}
        <div className="flex items-center gap-3">
          <Link to={`/profile/${comment.author?._id}`}>
            <img
              src={comment.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={comment.author?.name}
              className="w-9 h-9 rounded-full object-cover border border-gray-200"
            />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <Link
                to={`/profile/${comment.author?._id}`}
                className="text-sm font-semibold text-gray-900 hover:text-blue-600 transition"
              >
                {comment.author?.name || 'Anonymous User'}
              </Link>
              {isBlogAuthor && comment.author?._id === blogAuthorId && (
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-200">
                  Author
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400">{timeAgo(comment.createdAt)}</p>
          </div>
        </div>

        {/* Action buttons (Edit & Delete) */}
        {!isEditing && canDelete && (
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            {canEdit && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-1.5 text-gray-400 hover:text-blue-600 rounded-md hover:bg-gray-100 transition"
                title="Edit comment"
              >
                <Edit2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={() => onDelete(comment._id)}
              className="p-1.5 text-gray-400 hover:text-rose-600 rounded-md hover:bg-rose-50 transition"
              title={
                isBlogAuthor && !isCommentAuthor
                  ? 'Moderate / delete comment (Post Owner)'
                  : 'Delete comment'
              }
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Content or Edit Form */}
      <div className="mt-3 pl-12">
        {isEditing ? (
          <div className="space-y-2">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows={3}
              className="w-full text-sm p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50/50"
              placeholder="Edit your comment..."
            />
            <div className="flex items-center gap-2 justify-end">
              <button
                onClick={handleCancelEdit}
                disabled={isSubmitting}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-800 rounded-md hover:bg-gray-100 transition"
              >
                <X className="w-3.5 h-3.5" /> Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isSubmitting || !editedContent.trim()}
                className="inline-flex items-center gap-1 px-3.5 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition disabled:opacity-50"
              >
                <Check className="w-3.5 h-3.5" /> {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
            {comment.content}
          </p>
        )}
      </div>
    </div>
  );
};

export default CommentItem;

