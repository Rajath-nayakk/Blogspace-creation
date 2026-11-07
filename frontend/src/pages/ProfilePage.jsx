import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Calendar,
  BookOpen,
  Edit,
  Camera,
  X,
  Check,
  User,
  Heart,
} from 'lucide-react';
import * as userService from '../services/userService';
import { useAuth } from '../hooks/useAuth';
import BlogCard from '../components/BlogCard';
import { formatDate } from '../utils/formatDate';
import toast from 'react-hot-toast';

const ProfilePage = () => {
  const { id } = useParams();
  const { user: currentUser, updateUser } = useAuth();

  const profileUserId = id || currentUser?._id;
  const isOwnProfile = currentUser && currentUser._id === profileUserId;

  const [profileUser, setProfileUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Edit Modal State
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      if (!profileUserId) return;
      try {
        setLoading(true);
        const [userRes, postsRes] = await Promise.all([
          userService.getUserById(profileUserId),
          userService.getUserPosts(profileUserId),
        ]);

        if (isMounted) {
          if (userRes.success) {
            setProfileUser(userRes.user);
            setName(userRes.user.name || '');
            setBio(userRes.user.bio || '');
            setAvatarPreview(userRes.user.avatar || '');
          }
          if (postsRes.success) {
            setUserPosts(postsRes.posts || []);
          }
        }
      } catch (err) {
        console.error('Failed to load profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, [profileUserId]);

  const handleAvatarFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Avatar file must be less than 5MB');
        return;
      }
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
      setAvatarUrl('');
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error('Full name cannot be blank');
      return;
    }

    try {
      setIsUpdating(true);

      let payload;
      if (avatarFile) {
        payload = new FormData();
        payload.append('name', name.trim());
        payload.append('bio', bio.trim());
        payload.append('avatar', avatarFile);
      } else {
        payload = {
          name: name.trim(),
          bio: bio.trim(),
          avatar: avatarUrl.trim() || undefined,
        };
      }

      const res = await userService.updateProfile(payload);
      if (res.success && res.user) {
        setProfileUser((prev) => ({ ...prev, ...res.user }));
        updateUser(res.user);
        toast.success('Profile updated successfully!');
        setEditModalOpen(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 text-center">
        <div className="w-8 h-8 border-3 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-xs text-gray-500">Loading user profile...</p>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h3 className="text-lg font-bold text-gray-900">User Not Found</h3>
        <p className="text-xs text-gray-500 mt-1">
          The requested profile does not exist or has been deleted.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 sm:p-10 shadow-xs mb-12">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-8 text-center sm:text-left">
          <div className="relative group">
            <img
              src={profileUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={profileUser.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-gray-50 shadow-md"
            />
            {isOwnProfile && (
              <button
                onClick={() => setEditModalOpen(true)}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition cursor-pointer"
                title="Change Avatar"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
                  {profileUser.name}
                </h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  @{profileUser.username}
                </p>
              </div>

              {isOwnProfile && (
                <button
                  onClick={() => setEditModalOpen(true)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-xs font-semibold text-gray-700 transition shadow-2xs self-center sm:self-start cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  Edit Profile
                </button>
              )}
            </div>

            {profileUser.bio ? (
              <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-2xl font-sans">
                {profileUser.bio}
              </p>
            ) : (
              <p className="mt-4 text-xs italic text-gray-400">
                {isOwnProfile
                  ? 'Add a bio to introduce yourself to readers...'
                  : 'No bio provided yet.'}
              </p>
            )}

            {/* Profile Meta Stats */}
            <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap items-center justify-center sm:justify-start gap-6 text-xs text-gray-500">
              <span className="flex items-center gap-1.5 font-medium text-gray-700">
                <BookOpen className="w-4 h-4 text-blue-600" />
                {userPosts.length} Published Articles
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gray-400" />
                Member since {formatDate(profileUser.createdAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Published Articles List */}
      <div>
        <div className="flex items-center justify-between mb-8 pb-3 border-b border-gray-200">
          <h2 className="text-xl sm:text-2xl font-extrabold text-gray-900">
            Published Articles ({userPosts.length})
          </h2>
        </div>

        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userPosts.map((post) => (
              <BlogCard key={post._id} blog={post} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white rounded-3xl border border-gray-100 p-8">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-gray-900">No articles yet</h4>
            <p className="text-xs text-gray-500 mt-1">
              {isOwnProfile
                ? 'You have not published any stories yet. Start writing today!'
                : `${profileUser.name} has not published any stories yet.`}
            </p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-gray-100 relative">
            <button
              onClick={() => setEditModalOpen(false)}
              className="absolute top-5 right-5 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Edit Profile
            </h3>
            <p className="text-xs text-gray-500 mb-6">
              Update your public presence and bio on BLOGSPACE.
            </p>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              {/* Avatar section */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Profile Picture
                </label>
                <div className="flex items-center gap-4">
                  <img
                    src={avatarPreview || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                    alt="Preview"
                    className="w-14 h-14 rounded-full object-cover border border-gray-200"
                  />
                  <div className="flex-1 space-y-1.5">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileChange}
                      className="text-xs text-gray-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                    />
                    <input
                      type="url"
                      placeholder="Or enter direct image URL..."
                      value={avatarUrl}
                      onChange={(e) => {
                        setAvatarUrl(e.target.value);
                        setAvatarPreview(e.target.value);
                        setAvatarFile(null);
                      }}
                      className="w-full text-xs px-3 py-1.5 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Bio */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1.5">
                  Bio (Max 200 characters)
                </label>
                <textarea
                  rows={3}
                  maxLength={200}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Architect, developer, thinker..."
                  className="w-full text-xs sm:text-sm p-3.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <span className="text-[10px] text-gray-400 block text-right">
                  {bio.length}/200
                </span>
              </div>

              {/* Submit buttons */}
              <div className="flex items-center justify-end gap-2 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-xs transition disabled:opacity-50 cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isUpdating ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;

