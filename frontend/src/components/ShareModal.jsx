import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ShareModal = ({ isOpen, onClose, title, url }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    {
      name: 'X (Twitter)',
      color: 'bg-black text-white hover:bg-neutral-800',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'LinkedIn',
      color: 'bg-[#0077b5] text-white hover:bg-[#006396]',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
          '_blank'
        );
      },
    },
    {
      name: 'WhatsApp',
      color: 'bg-[#25D366] text-white hover:bg-[#1EBE5D]',
      action: () => {
        window.open(
          `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`,
          '_blank'
        );
      },
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 text-gray-900 mb-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-bold">Share this story</h3>
        </div>
        <p className="text-xs text-gray-500 mb-6 line-clamp-1">{title}</p>

        {/* Copy Link Input */}
        <div className="flex items-center gap-2 mb-6 p-2 rounded-xl border border-gray-200 bg-gray-50">
          <input
            type="text"
            readOnly
            value={url}
            className="flex-1 bg-transparent text-xs text-gray-700 outline-none px-2 select-all"
          />
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Social Buttons */}
        <div className="grid grid-cols-3 gap-2.5">
          {shareOptions.map((opt) => (
            <button
              key={opt.name}
              onClick={opt.action}
              className={`py-2 px-3 text-xs font-semibold rounded-xl text-center transition ${opt.color}`}
            >
              {opt.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;

