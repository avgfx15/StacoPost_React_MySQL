import React, { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchAllSavedPostsAction } from '../Actions/PostActions';
import { useAuth } from '../AuthContext';
import ImageComponent from '../Components/ImageComponent';
import { NavLink, useNavigate } from 'react-router';
import { format } from 'timeago.js';

// & Saved Posts Page Component
const SavedPostsPage = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // / Fetch saved posts
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['savedPosts'],
    queryFn: async () => {
      const token = await getToken();
      return fetchAllSavedPostsAction(token);
    },
    enabled: !!user,
  });

  const savedPosts = data?.savedPosts || [];

  if (isLoading) return <div>Loading saved posts...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  if (!savedPosts || savedPosts.length === 0) {
    return (
      <div className='flex flex-col items-center justify-center min-h-[50vh]'>
        <h1 className='text-2xl font-bold mb-4'>No Saved Posts</h1>
        <p className='text-gray-600'>You haven't saved any posts yet.</p>
        <NavLink to='/' className='mt-4 text-sky-600 hover:text-sky-800'>
          Browse posts
        </NavLink>
      </div>
    );
  }

  return (
    <div className='mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-8'>My Saved Posts</h1>
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {savedPosts.map((post) => (
          <div
            key={post.id}
            className='bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow'
          >
            <div className='aspect-video'>
              <ImageComponent
                src={post.postImage}
                alt={post.postTitle}
                className='w-full h-full object-cover'
                width='400'
                height='225'
              />
            </div>
            <div className='p-4'>
              <h2 className='text-xl font-semibold mb-2 line-clamp-2'>
                <span dangerouslySetInnerHTML={{ __html: post.postTitle }} />
              </h2>
              <p className='text-gray-600 text-sm mb-2 line-clamp-2'>
                <span dangerouslySetInnerHTML={{ __html: post.subTitle }} />
              </p>
              <div className='flex items-center justify-between text-sm text-gray-500'>
                <span>By {post.author?.username || 'Unknown'}</span>
                <span>{format(post.createdAt)}</span>
              </div>
              <NavLink
                to={`/posts/${post.slug}`}
                className='mt-3 inline-block text-sky-600 hover:text-sky-800 font-medium'
              >
                Read More →
              </NavLink>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedPostsPage;
