import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Upload,
  Image as ImageIcon,
  Eye,
  Edit3,
  Tag,
  Sparkles,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import * as blogService from '../services/blogService';
import MarkdownRenderer from '../components/MarkdownRenderer';
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

const CreateBlogPage = () => {
  const navigate = useNavigate();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState('file'); // 'file' | 'url'

  const handleImageFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size must be less than 5MB');
        return;
      }
      setCoverImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setCoverImageUrl('');
    }
  };

  const handleImageUrlChange = (e) => {
    const url = e.target.value;
    setCoverImageUrl(url);
    setImagePreview(url);
    setCoverImageFile(null);
  };

  // Helper for Markdown formatting toolbar
  const insertMarkdown = (prefix, suffix = '') => {
    const textarea = document.getElementById('markdown-editor');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || 'text';
    const replacement = `${prefix}${selectedText}${suffix}`;

    const newContent =
      content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + selectedText.length
      );
    }, 50);
  };

  const handleSubmit = async (status = 'published') => {
    // Form validation
    if (!title.trim()) {
      toast.error('Please provide an article title');
      return;
    }
    if (!description.trim()) {
      toast.error('Please provide a short description or excerpt');
      return;
    }
    if (!content.trim()) {
      toast.error('Please write some content for your story');
      return;
    }

    try {
      setIsSubmitting(true);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      let payload;
      if (coverImageFile) {
        payload = new FormData();
        payload.append('title', title.trim());
        payload.append('description', description.trim());
        payload.append('content', content);
        payload.append('category', category);
        payload.append('status', status);
        payload.append('tags', JSON.stringify(parsedTags));
        payload.append('coverImage', coverImageFile);
      } else {
        payload = {
          title: title.trim(),
          description: description.trim(),
          content,
          category,
          status,
          tags: parsedTags,
          coverImage: coverImageUrl.trim() || undefined,
        };
      }

      const res = await blogService.createBlog(payload);
      if (res.success && res.blog) {
        toast.success(
          status === 'draft' ? 'Draft saved!' : 'Story published successfully!'
        );
        if (status === 'draft') {
          navigate('/dashboard');
        } else {
          navigate(`/blog/${res.blog.slug || res.blog._id}`);
        }
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to publish story';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Top Header & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
            Publishing Studio
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 mt-1">
            Write a New Story
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Write / Preview Tab Switcher */}
          <div className="flex bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setActiveTab('write')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'write'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              Write
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'preview'
                  ? 'bg-white text-gray-900 shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              Preview
            </button>
          </div>

          <button
            type="button"
            onClick={() => handleSubmit('draft')}
            disabled={isSubmitting}
            className="px-4 py-2 text-xs font-semibold rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Save Draft
          </button>

          <button
            type="button"
            onClick={() => handleSubmit('published')}
            disabled={isSubmitting}
            className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
        </div>
      </div>

      {activeTab === 'write' ? (
        /* WRITE MODE */
        <div className="space-y-6">
          {/* Title */}
          <div>
            <input
              type="text"
              placeholder="Article Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-3xl sm:text-4xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0 leading-tight"
            />
          </div>

          {/* Short description */}
          <div>
            <textarea
              rows={2}
              placeholder="Write a compelling 1-2 sentence subtitle or summary..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-base sm:text-lg text-gray-600 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0 resize-none leading-relaxed"
            />
          </div>

          {/* Metadata Controls: Category & Tags & Cover */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
            {/* Category Select */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Tags Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Tags (Comma separated)
              </label>
              <div className="relative">
                <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="e.g. React, Architecture, Cloud"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Cover Image Controls */}
            <div className="md:col-span-2 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  Cover Image
                </label>
                <div className="flex gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('file')}
                    className={`font-semibold ${
                      imageUploadMode === 'file' ? 'text-blue-600 underline' : 'text-gray-400'
                    }`}
                  >
                    Upload File
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('url')}
                    className={`font-semibold ${
                      imageUploadMode === 'url' ? 'text-blue-600 underline' : 'text-gray-400'
                    }`}
                  >
                    Image URL
                  </button>
                </div>
              </div>

              {imageUploadMode === 'file' ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded-2xl cursor-pointer bg-gray-50/50 hover:bg-gray-100/50 transition">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <Upload className="w-6 h-6 text-gray-400 mb-2" />
                      <p className="text-xs text-gray-600">
                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-[11px] text-gray-400">PNG, JPG, WEBP up to 5MB</p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={coverImageUrl}
                  onChange={handleImageUrlChange}
                  className="w-full text-xs px-3.5 py-2.5 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              )}

              {/* Cover Image Preview */}
              {imagePreview && (
                <div className="mt-4 relative aspect-[16/7] rounded-xl overflow-hidden border border-gray-200 max-h-48">
                  <img
                    src={imagePreview}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setImagePreview('');
                      setCoverImageFile(null);
                      setCoverImageUrl('');
                    }}
                    className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-[10px] rounded-md hover:bg-black/80"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Markdown Formatting Toolbar */}
          <div className="sticky top-16 z-30 flex items-center gap-1 p-2 bg-gray-100/90 backdrop-blur-sm rounded-xl border border-gray-200/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n## ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Heading 2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n### ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Heading 3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n> ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n```javascript\n', '\n```\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Code Block"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n- ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Bulleted List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('[', '](https://)')}
              className="p-1.5 text-xs font-mono font-bold text-gray-600 hover:text-gray-900 hover:bg-white rounded-md transition"
              title="Hyperlink"
            >
              URL
            </button>
          </div>

          {/* Main Markdown Textarea */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-6 min-h-[450px]">
            <textarea
              id="markdown-editor"
              rows={18}
              placeholder="Tell your story using Markdown... You can include headers, code blocks, quotes, and links."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-base sm:text-lg font-serif text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 resize-y leading-relaxed"
            />
          </div>
        </div>
      ) : (
        /* PREVIEW MODE */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4">
            {category}
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {title || 'Untitled Story'}
          </h1>

          <p className="text-lg text-gray-600 font-sans leading-relaxed mb-6">
            {description || 'No summary provided.'}
          </p>

          {imagePreview && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8 border border-gray-100">
              <img
                src={imagePreview}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="pt-6 border-t border-gray-100">
            {content ? (
              <MarkdownRenderer content={content} />
            ) : (
              <p className="text-gray-400 italic">No content written yet.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateBlogPage;

