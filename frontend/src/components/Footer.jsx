import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Heart, Globe, Share2, Code } from 'lucide-react';
import toast from 'react-hot-toast';

const categories = [
  'Technology',
  'Programming',
  'Artificial Intelligence',
  'Cybersecurity',
  'Web Development',
  'Startups',
  'Productivity',
  'Lifestyle',
];

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please provide a valid email address');
      return;
    }
    toast.success('Thank you for subscribing to the BLOGSPACE Digest!');
    setEmail('');
  };

  return (
    <footer className="bg-white border-t border-gray-100 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2 group inline-block">
              <span className="w-8 h-8 rounded-lg bg-gray-950 flex items-center justify-center text-white font-extrabold text-sm tracking-wider shadow-xs">
                B
              </span>
              <span className="text-xl font-extrabold tracking-tight text-gray-900">
                BLOGSPACE<span className="text-blue-600">.</span>
              </span>
            </Link>
            <p className="text-sm text-gray-600 max-w-sm leading-relaxed">
              Ideas worth sharing. Stories worth reading. An open, editorial blogging platform for software architects, researchers, thinkers, and builders worldwide.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition"
                aria-label="X / Twitter"
              >
                <Share2 className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-gray-900 hover:bg-gray-200 transition"
                aria-label="GitHub Code"
              >
                <Code className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:text-blue-700 hover:bg-blue-50 transition"
                aria-label="Community"
              >
                <Globe className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-600">
              <li>
                <Link to="/" className="hover:text-blue-600 transition">
                  Featured Stories
                </Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-blue-600 transition">
                  All Articles
                </Link>
              </li>
              <li>
                <Link to="/explore?sort=popular" className="hover:text-blue-600 transition">
                  Trending Posts
                </Link>
              </li>
              <li>
                <Link to="/create" className="hover:text-blue-600 transition">
                  Write a Story
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-4">
              Categories
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              {categories.slice(0, 6).map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/explore?category=${encodeURIComponent(cat)}`}
                    className="hover:text-blue-600 transition"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-900 mb-2">
              Weekly Digest
            </h4>
            <p className="text-xs text-gray-500 leading-relaxed">
              Curated articles, engineering architectures, and deep thoughts directly to your inbox.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@work.com"
                  className="w-full text-xs px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                />
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-gray-950 hover:bg-gray-800 text-white text-xs font-semibold rounded-xl transition cursor-pointer"
              >
                <span>Subscribe</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} BLOGSPACE Platform. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Crafted for thoughtful minds with
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            and clean code.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
