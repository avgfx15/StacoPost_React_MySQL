import ImageComponent from '../Components/ImageComponent';
import { useParams, useNavigate } from 'react-router';

import { FaThumbsUp, FaThumbsDown, FaEye } from 'react-icons/fa';

import CommentsComponent from '../Components/CommentsComponent';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSinglePostAction } from '../Actions/PostActions';
import {
  getPostLikeCountsAction,
  getUserPostLikeStatusAction,
  likeOrDislikePostAction,
} from '../Actions/LikeActions';

import { format } from 'timeago.js';
import { useAuth } from '../AuthContext';
import { toast } from 'react-toastify';
import PostSidebarComponent from '../Components/PostSidebarComponent';
import PostRatingComponent from '../Components/PostRatingComponent';
import PostShareComponent from '../Components/PostShareComponent';

// & Single Post Page Component
const SinglePostPage = () => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Get slug from URL params
  const { slug } = useParams();

  // / Fetch post data using the slug
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['post', slug],
    queryFn: () => fetchSinglePostAction(slug),
    enabled: !!slug, // Only run the query if slug is available
  });

  const post = data;

  // / Fetch like counts for the post
  const { data: likeCounts } = useQuery({
    queryKey: ['postLikes', post?.id],
    queryFn: () => getPostLikeCountsAction(post.id),
    enabled: !!post?.id,
  });

  // / Fetch user's like status for the post
  const { data: userLikeStatus } = useQuery({
    queryKey: ['userPostLike', post?.id],
    queryFn: async () => {
      const token = await getToken();
      return getUserPostLikeStatusAction(post.id, token);
    },
    enabled: !!post?.id && !!user,
  });

  // + Like/Dislike mutation
  const likeMutation = useMutation({
    mutationFn: async (type) => {
      const token = await getToken();
      return likeOrDislikePostAction(post.id, type, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postLikes', post.id] });
      queryClient.invalidateQueries({ queryKey: ['userPostLike', post.id] });
      toast.success('Action completed');
    },
    onError: (error) => {
      toast.error('Error: ' + error.message);
    },
  });

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Error: {error.message}</div>;

  if (!data)
    return (
      <div className='flex flex-col gap-4 lg:text-lg text-justify w-9/12'>
        No post found
      </div>
    );

  // ^ Render Single Post Page
  return (
    <div className='flex flex-col gap-8 mb-10'>
      {/* DETAILS */}
      <div className='flex gap-8'>
        {/* TEXT */}
        <div className='lg:w-3/5 flex flex-col gap-8'>
          <h1 className='text-xl md:text-3xl xl:text-4xl 2xl:text-5xl font-bold'>
            <p dangerouslySetInnerHTML={{ __html: post?.postTitle }}></p>
          </h1>
          <div className='flex gap-2 text-gray-400'>
            <span>Written By</span>
            <span
              className='text-sky-600 capitalize cursor-pointer'
              onClick={() =>
                navigate(`/posts?author=${post?.author?.username}`)
              }
            >
              {post?.author?.username}
            </span>
            <span>on</span>
            <span
              className='text-sky-600 capitalize cursor-pointer'
              onClick={() =>
                navigate(`/posts?category=${post?.category?.slug}`)
              }
            >
              {post?.category?.name}
            </span>
            <span>{format(post?.createdAt)}</span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: post?.subTitle }}></p>
          <div className='flex flex-col gap-3'>
            {/* LIKE/DISLIKE BUTTONS */}
            <div className='flex items-center gap-4 mt-4'>
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  likeMutation.mutate('like');
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded ${
                  userLikeStatus?.status === 'like'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={likeMutation.isPending}
              >
                <FaThumbsUp />
                Like ({likeCounts?.likes || 0})
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    navigate('/login');
                    return;
                  }
                  likeMutation.mutate('dislike');
                }}
                className={`flex items-center gap-2 px-3 py-1 rounded ${
                  userLikeStatus?.status === 'dislike'
                    ? 'bg-red-500 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                disabled={likeMutation.isPending}
              >
                <FaThumbsDown />
                Dislike ({likeCounts?.dislikes || 0})
              </button>
              <div className='flex items-center gap-2 px-3 py-1 rounded bg-gray-200 text-gray-700'>
                <FaEye />
                Views ({post?.visitorsNo || 0})
              </div>

              {/* SHARE BUTTON */}
              <PostShareComponent post={post} />
            </div>
            {/* RATING DROPDOWN */}
            <PostRatingComponent post={post} />
          </div>
        </div>
        {/* IMAGE */}
        <div className='hidden lg:block w-2/5 aspect-video'>
          <ImageComponent
            src={post?.postImage}
            alt='Logo Img'
            width='800'
            height='600'
            className='rounded-3xl object-cover'
          />
        </div>
      </div>
      {/* CONTENT */}
      <div className='flex flex-col md:flex-row gap-8'>
        {/* TEXT */}
        <div
          className='flex flex-col gap-4 lg:text-lg text-justify w-9/12'
          dangerouslySetInnerHTML={{ __html: post?.content }}
        ></div>
        {/* SIDE MENU */}
        <PostSidebarComponent post={post} />
      </div>
      <CommentsComponent postId={post?.id} />
    </div>
  );
};

export default SinglePostPage;
