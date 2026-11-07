import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, User } from 'lucide-react';

const AuthorCard = ({ author, postCount, totalLikes }) => {
  if (!author) return null;

  return (
    <div className="bg-white p-5 rounded-2xl border border-gray-100 hover:border-gray-200 transition-all shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3.5 mb-3">
          <img
            src={author.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120'}
            alt={author.name}
            className="w-12 h-12 rounded-full object-cover border border-gray-200 shrink-0"
          />
          <div className="min-w-0">
            <Link
              to={`/profile/${author._id}`}
              className="text-base font-semibold text-gray-900 hover:text-blue-600 transition block truncate"
            >
              {author.name}
            </Link>
            <p className="text-xs text-gray-500 truncate">@{author.username}</p>
          </div>
        </div>

        {author.bio && (
          <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed mb-4">
            {author.bio}
          </p>
        )}
      </div>

      <div className="pt-3 border-t border-gray-50 flex items-center justify-between text-xs text-gray-500">
        <span className="flex items-center gap-1.5 font-medium text-gray-700">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          {postCount || author.postCount || 0} articles
        </span>
        <Link
          to={`/profile/${author._id}`}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 hover:underline"
        >
          View Profile &rarr;
        </Link>
      </div>
    </div>
  );
};

export default AuthorCard;

