import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md">
        <span className="text-6xl font-extrabold text-gray-200 font-serif block mb-4">
          404
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mb-2">
          Story Not Found
        </h1>
        <p className="text-sm text-gray-500 mb-8 leading-relaxed">
          The page or article you are looking for has been moved, deleted, or does not exist.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gray-950 hover:bg-gray-800 text-white text-xs sm:text-sm font-semibold transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Homepage</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;

