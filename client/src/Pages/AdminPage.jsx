import React, { useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router';
import {
  useQuery,
  useMutation,
  useQueryClient,
  useQueries,
} from '@tanstack/react-query';
import {
  fetchAllPostsAction,
  fetchAllUsersAction,
} from '../Actions/PostActions';
import { getPostLikeCountsAction } from '../Actions/LikeActions';
import { toast } from 'react-toastify';
import ImageComponent from '../Components/ImageComponent';

// & Admin Page Component
const AdminPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Check if user is admin
  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  // Fetch all posts for admin management
  const {
    data: posts,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['adminPosts'],
    queryFn: () => fetchAllPostsAction(1, new URLSearchParams({ limit: 100 })), // Fetch more posts for admin
    enabled: !!user && user.role === 'admin',
  });

  // Fetch like counts for all posts
  const likeCountsQueries = useQueries({
    queries:
      posts?.allPost?.map((post) => ({
        queryKey: ['postLikes', post.id],
        queryFn: () => getPostLikeCountsAction(post.id),
        enabled: !!posts?.allPost,
      })) || [],
  });

  // Fetch all users for admin management
  const {
    data: usersData,
    isLoading: usersLoading,
    error: usersError,
  } = useQuery({
    queryKey: ['adminUsers'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      return fetchAllUsersAction(token);
    },
    enabled: !!user && user.role === 'admin',
  });

  // Feature post mutation
  const featureMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/posts/feature`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ postId }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to feature post');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success('Post featured status updated');
    },
    onError: (error) => {
      toast.error('Error updating post: ' + error.message);
    },
  });

  // Activate/Deactivate post mutation
  const activateMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/posts/activate`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify({ postId }),
        }
      );
      if (!response.ok) {
        throw new Error('Failed to activate/deactivate post');
      }
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success(data.message);
    },
    onError: (error) => {
      toast.error('Error updating post: ' + error.message);
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async (postId) => {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/posts/${postId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error('Failed to delete post');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['adminPosts'] });
      toast.success('Post deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting post: ' + error.message);
    },
  });

  if (!user || user.role !== 'admin') {
    return <div>Access denied. You must be an admin to view this page.</div>;
  }

  if (isLoading || usersLoading) {
    return <div className='text-center py-8'>Loading...</div>;
  }

  if (error || usersError) {
    return (
      <div className='text-center py-8 text-red-500'>
        Error loading data: {error?.message || usersError?.message}
      </div>
    );
  }

  console.log(posts);
  return (
    <div className='max-w-6xl mx-auto py-8'>
      <h1 className='text-3xl font-bold mb-8'>Admin Dashboard</h1>

      {/* Manage Posts Section */}
      <div className='bg-white rounded-lg shadow-md p-6 mb-8'>
        <h2 className='text-2xl font-semibold mb-4'>Manage Posts</h2>

        {posts?.allPost && posts?.allPost.length > 0 ? (
          <div className='space-y-4'>
            {posts?.allPost.map((post, index) => {
              const likeCounts = likeCountsQueries[index]?.data;
              return (
                <div
                  key={post.id}
                  className='border border-gray-200 rounded-lg p-4 flex justify-between items-center'
                >
                  <div className='flex items-start gap-4 flex-1'>
                    {post.postImage && (
                      <ImageComponent
                        src={post.postImage}
                        alt={post.postTitle}
                        className='w-16 h-16 object-cover rounded-md flex-shrink-0'
                      />
                    )}
                    <div className='flex-1'>
                      <h3 className='text-lg font-medium'>
                        <p
                          dangerouslySetInnerHTML={{ __html: post?.postTitle }}
                        ></p>
                      </h3>
                      <p className='text-gray-600 text-sm'>
                        By{' '}
                        <span className='text-bold'>
                          {post.author?.username}
                        </span>{' '}
                        • {new Date(post.createdAt).toLocaleDateString()}
                      </p>
                      <p className='text-gray-500 text-sm'>
                        Category: {post.category?.name} • Views:{' '}
                        {post.visitorsNo} • Likes: {likeCounts?.likes || 0} •
                        Dislikes: {likeCounts?.dislikes || 0}
                  </div>
                  <div className='flex gap-2'>
                    <button
                      onClick={() => featureMutation.mutate(post.id)}
                      disabled={featureMutation.isPending}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        post.isFeatured
                          ? 'bg-yellow-500 text-white hover:bg-yellow-600'
                          : 'bg-green-500 text-white hover:bg-green-600'
                      }`}
                    >
                      {post.isFeatured ? 'Unfeature' : 'Feature'}
                    </button>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to delete this post?'
                          )
                        ) {
                          deleteMutation.mutate(post.id);
                        }
                      }}
                      disabled={deleteMutation.isPending}
                      className='px-4 py-2 bg-red-500 text-white rounded-md text-sm font-medium hover:bg-red-600'
                    >
                      Delete
                    </button>
                  </div>
                </>
              );
            })}
          </div>
        ) : (
          <p className='text-gray-500'>No posts found.</p>
        )}
      </div>

      {/* Manage Users Section */}
      <div className='bg-white rounded-lg shadow-md p-6'>
        <h2 className='text-2xl font-semibold mb-4'>Manage Users</h2>

        {usersData?.users && usersData?.users.length > 0 ? (
          <div className='space-y-4'>
            {usersData.users.map((user) => (
              <div
                key={user.id}
                className='border border-gray-200 rounded-lg p-4 flex justify-between items-center'
              >
                <div className='flex items-center gap-4 flex-1'>
                  {user.profileImage && (
                    <ImageComponent
                      src={user.profileImage}
                      alt={user.username}
                      className='w-16 h-16 object-cover rounded-full flex-shrink-0'
                    />
                  )}
                  <div className='flex-1'>
                    <h3 className='text-lg font-medium'>{user.username}</h3>
                    <p className='text-gray-600 text-sm'>
                      Email: {user.email} • Mobile: {user.mobileNo || 'N/A'} •
                      Age: {user.age || 'N/A'} • Gender: {user.gender || 'N/A'}
                    </p>
                    <p className='text-gray-500 text-sm'>
                      Role: {user.role} • Total Posts: {user.totalPosts} • Total
                      Comments: {user.totalComments} • Joined:{' '}
                      {new Date(user.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className='flex gap-2'>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      user.role === 'admin'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {user.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className='text-gray-500'>No users found.</p>
        )}
      </div>
    </div>
  );
};

export default AdminPage;
