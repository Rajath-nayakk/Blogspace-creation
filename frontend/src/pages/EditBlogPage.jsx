import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Upload,
  Eye,
  Edit3,
  Tag,
  Bold,
  Italic,
  Heading2,
  Heading3,
  Quote,
  Code,
  List,
  ArrowLeft,
} from 'lucide-react';
import * as blogService from '../services/blogService';
import { useAuth } from '../hooks/useAuth';
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

const EditBlogPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Technology');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [status, setStatus] = useState('published');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  // UI state
  const [activeTab, setActiveTab] = useState('write');
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageUploadMode, setImageUploadMode] = useState('file');

  useEffect(() => {
    let isMounted = true;

    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await blogService.getBlogBySlug(id);
        if (isMounted && res.success && res.blog) {
          const blog = res.blog;

          // Verify ownership
          if (user && blog.author && user._id !== blog.author._id) {
            toast.error('You are not authorized to edit this article');
            navigate('/dashboard');
            return;
          }

          setTitle(blog.title || '');
          setDescription(blog.description || '');
          setCategory(blog.category || 'Technology');
          setContent(blog.content || '');
          setStatus(blog.status || 'published');
          setTagsInput(blog.tags ? blog.tags.join(', ') : '');
          if (blog.coverImage) {
            setCoverImageUrl(blog.coverImage);
            setImagePreview(blog.coverImage);
          }
        }
      } catch (err) {
        console.error('Failed to load blog:', err);
        if (isMounted) {
          toast.error('Could not load blog post');
          navigate('/dashboard');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }

    return () => {
      isMounted = false;
    };
  }, [id, user, navigate]);

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

  const handleUpdate = async (overrideStatus) => {
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!description.trim()) {
      toast.error('Description is required');
      return;
    }
    if (!content.trim()) {
      toast.error('Content is required');
      return;
    }

    try {
      setIsSubmitting(true);

      const parsedTags = tagsInput
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);

      const finalStatus = overrideStatus || status;

      let payload;
      if (coverImageFile) {
        payload = new FormData();
        payload.append('title', title.trim());
        payload.append('description', description.trim());
        payload.append('content', content);
        payload.append('category', category);
        payload.append('status', finalStatus);
        payload.append('tags', JSON.stringify(parsedTags));
        payload.append('coverImage', coverImageFile);
      } else {
        payload = {
          title: title.trim(),
          description: description.trim(),
          content,
          category,
          status: finalStatus,
          tags: parsedTags,
          coverImage: coverImageUrl.trim() || undefined,
        };
      }

      const res = await blogService.updateBlog(id, payload);
      if (res.success && res.blog) {
        toast.success('Changes saved successfully!');
        navigate(`/blog/${res.blog.slug || res.blog._id}`);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update article');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500">Loading your article...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-gray-100">
        <div>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-900 transition mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Cancel & Go Back
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            Edit Article
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {/* Tabs */}
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
              Edit
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

          {status === 'draft' ? (
            <button
              type="button"
              onClick={() => handleUpdate('published')}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-xs transition"
            >
              Publish Now
            </button>
          ) : (
            <button
              type="button"
              onClick={() => handleUpdate('published')}
              disabled={isSubmitting}
              className="px-5 py-2 text-xs font-semibold rounded-xl bg-gray-950 hover:bg-gray-800 text-white shadow-xs transition"
            >
              {isSubmitting ? 'Saving...' : 'Update Article'}
            </button>
          )}
        </div>
      </div>

      {activeTab === 'write' ? (
        <div className="space-y-6">
          {/* Title */}
          <input
            type="text"
            placeholder="Article Title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full text-3xl sm:text-4xl font-extrabold text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0"
          />

          {/* Description */}
          <textarea
            rows={2}
            placeholder="Short description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full text-base sm:text-lg text-gray-600 placeholder:text-gray-300 border-none outline-none focus:ring-0 bg-transparent px-0 resize-none"
          />

          {/* Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5 rounded-2xl bg-white border border-gray-100 shadow-xs">
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

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-medium py-2.5 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Tags
              </label>
              <input
                type="text"
                placeholder="Comma separated"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                className="w-full text-xs py-2 px-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Cover image */}
            <div className="md:col-span-3 pt-3 border-t border-gray-100">
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
                    Upload New
                  </button>
                  <span className="text-gray-300">|</span>
                  <button
                    type="button"
                    onClick={() => setImageUploadMode('url')}
                    className={`font-semibold ${
                      imageUploadMode === 'url' ? 'text-blue-600 underline' : 'text-gray-400'
                    }`}
                  >
                    URL
                  </button>
                </div>
              </div>

              {imageUploadMode === 'file' ? (
                <div className="flex items-center justify-center w-full">
                  <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-xs text-gray-600">Choose new cover image</span>
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
                  placeholder="https://..."
                  value={coverImageUrl}
                  onChange={(e) => {
                    setCoverImageUrl(e.target.value);
                    setImagePreview(e.target.value);
                  }}
                  className="w-full text-xs px-3 py-2 border border-gray-200 rounded-xl bg-gray-50"
                />
              )}

              {imagePreview && (
                <div className="mt-3 relative aspect-[16/7] rounded-xl overflow-hidden border border-gray-200 max-h-40">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Formatting Toolbar */}
          <div className="sticky top-16 z-30 flex items-center gap-1 p-2 bg-gray-100/90 backdrop-blur-sm rounded-xl border border-gray-200/80 overflow-x-auto">
            <button
              type="button"
              onClick={() => insertMarkdown('**', '**')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('*', '*')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n## ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="H2"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n### ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="H3"
            >
              <Heading3 className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n> ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="Quote"
            >
              <Quote className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n```javascript\n', '\n```\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="Code"
            >
              <Code className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => insertMarkdown('\n- ', '\n')}
              className="p-1.5 text-gray-600 hover:text-gray-900 hover:bg-white rounded-md"
              title="List"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          {/* Editor */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-xs p-4 sm:p-6 min-h-[450px]">
            <textarea
              id="markdown-editor"
              rows={18}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full text-base sm:text-lg font-serif text-gray-900 placeholder:text-gray-300 border-none outline-none focus:ring-0 resize-y leading-relaxed"
            />
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10">
          <div className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold mb-4">
            {category}
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight mb-4">
            {title || 'Untitled Story'}
          </h1>
          <p className="text-lg text-gray-600 mb-6">{description}</p>
          {imagePreview && (
            <div className="aspect-[16/9] rounded-2xl overflow-hidden mb-8">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="pt-6 border-t border-gray-100">
            <MarkdownRenderer content={content} />
          </div>
        </div>
      )}
    </div>
  );
};

export default EditBlogPage;

