import React from 'react';

export const BlogCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs animate-pulse">
    <div className="aspect-[16/10] bg-gray-200" />
    <div className="p-6 space-y-4">
      <div className="flex gap-2">
        <div className="h-4 bg-gray-200 rounded w-20" />
        <div className="h-4 bg-gray-100 rounded w-16" />
      </div>
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="space-y-2">
        <div className="h-3.5 bg-gray-100 rounded w-full" />
        <div className="h-3.5 bg-gray-100 rounded w-5/6" />
      </div>
      <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200" />
          <div className="h-3.5 bg-gray-200 rounded w-20" />
        </div>
        <div className="h-3.5 bg-gray-100 rounded w-12" />
      </div>
    </div>
  </div>
);

export const ArticleDetailSkeleton = () => (
  <div className="max-w-3xl mx-auto py-12 px-4 animate-pulse space-y-6">
    <div className="h-4 bg-gray-200 rounded w-24" />
    <div className="h-10 bg-gray-200 rounded w-5/6" />
    <div className="h-4 bg-gray-100 rounded w-1/2" />
    <div className="flex items-center gap-3 py-4 border-y border-gray-100">
      <div className="w-12 h-12 rounded-full bg-gray-200" />
      <div className="space-y-1.5 flex-1">
        <div className="h-4 bg-gray-200 rounded w-36" />
        <div className="h-3 bg-gray-100 rounded w-24" />
      </div>
    </div>
    <div className="aspect-[16/9] bg-gray-200 rounded-2xl" />
    <div className="space-y-4 pt-6">
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-4/5" />
      <div className="h-4 bg-gray-100 rounded w-full" />
      <div className="h-4 bg-gray-100 rounded w-3/4" />
    </div>
  </div>
);

