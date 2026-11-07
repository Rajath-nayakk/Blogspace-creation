import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Heart, MessageSquare } from 'lucide-react';
import CategoryBadge from './CategoryBadge';
import { formatDate } from '../utils/formatDate';

const BlogCard = ({ blog, variant = 'standard' }) => {
  if (!blog) return null;

  const {
    slug,
    _id,
    title,
    description,
    coverImage,
    category,
    author,
    readTime,
    createdAt,
    likesCount = 0,
    commentCount = 0,
  } = blog;

  const destination = `/blog/${slug || _id}`;

  if (variant === 'compact') {
    return (
      <article className="group flex gap-4 items-start py-4 border-b border-gray-100 last:border-b-0">
        <Link to={destination} className="shrink-0 w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5">
            <CategoryBadge category={category} size="xs" />
            <span className="text-xs text-gray-400">•</span>
            <span className="text-xs text-gray-500">{readTime || 3} min read</span>
          </div>
          <Link to={destination}>
            <h4 className="text-base font-semibold text-gray-900 group-hover:text-blue-600 transition line-clamp-2 leading-snug">
              {title}
            </h4>
          </Link>
          <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span>{author?.name || 'Anonymous'}</span>
            <span>•</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md hover:border-gray-200 transition-all duration-300">
      {/* Cover Image */}
      <Link to={destination} className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={coverImage}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute top-3 left-3">
          <CategoryBadge category={category} />
        </div>
      </Link>

      {/* Card Content */}
      <div className="p-6 flex flex-col flex-1">
        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2.5">
          <span className="inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            {readTime || 3} min read
          </span>
          <span>•</span>
          <span>{formatDate(createdAt)}</span>
        </div>

        <Link to={destination} className="mb-2.5">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm line-clamp-2 mb-6 flex-1 leading-relaxed">
          {description}
        </p>

        {/* Footer: Author & Social Metrics */}
        <div className="pt-4 border-t border-gray-100 flex items-center justify-between mt-auto">
          <Link
            to={`/profile/${author?._id}`}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-2.5 group/author"
          >
            <img
              src={author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={author?.name}
              className="w-8 h-8 rounded-full object-cover border border-gray-200"
            />
            <div className="text-xs">
              <p className="font-medium text-gray-900 group-hover/author:text-blue-600 transition">
                {author?.name || 'Anonymous'}
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              {likesCount}
            </span>
            <span className="flex items-center gap-1">
              <MessageSquare className="w-3.5 h-3.5 text-blue-500" />
              {commentCount}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogCard;

