import React, { useState } from 'react';

// | Import Component
import ImageComponent from './ImageComponent';

// | Import NavLink
import { NavLink, useNavigate } from 'react-router';

// | Import Dependency
import { format } from 'timeago.js';
import { FaThumbsUp, FaThumbsDown } from 'react-icons/fa';

import { useAuth } from '../AuthContext.jsx';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import {
  deleteCommentForPostAction,
  createCommentForPostAction,
} from '../Actions/PostActions';
import {
  getCommentLikeCountsAction,
  getUserCommentLikeStatusAction,
  likeOrDislikeCommentAction,
} from '../Actions/LikeActions';
import {
  getCommentRatingStatsAction,
  getUserCommentRatingStatusAction,
  rateCommentAction,
} from '../Actions/RatingActions';

// & Single Comment Component

const SingleCommentComponent = ({ comment, postId }) => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [showReplies, setShowReplies] = useState(false);

  const queryClient = useQueryClient();

  // / Fetch like counts for the comment
  const { data: commentLikeCounts } = useQuery({
    queryKey: ['commentLikes', comment.id],
    queryFn: () => getCommentLikeCountsAction(comment.id),
    enabled: !!comment.id,
  });

  // / Fetch user's like status for the comment
  const { data: userCommentLikeStatus } = useQuery({
    queryKey: ['userCommentLike', comment.id],
    queryFn: async () => {
      const token = await getToken();
      return getUserCommentLikeStatusAction(comment.id, token);
    },
    enabled: !!comment.id && !!user,
  });

  // / Fetch rating stats for the comment
  const { data: commentRatingStats } = useQuery({
    queryKey: ['commentRatingStats', comment.id],
    queryFn: () => getCommentRatingStatsAction(comment.id),
    enabled: !!comment.id,
  });

  // / Fetch user's rating status for the comment
  const { data: userCommentRatingStatus } = useQuery({
    queryKey: ['userCommentRating', comment.id],
    queryFn: async () => {
      const token = await getToken();
      return getUserCommentRatingStatusAction(comment.id, token);
    },
    enabled: !!comment.id && !!user,
  });

  // + Like/Dislike mutation for comment
  const commentLikeMutation = useMutation({
    mutationFn: async (type) => {
      const token = await getToken();
      return likeOrDislikeCommentAction(comment.id, type, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['commentLikes', comment.id] });
      queryClient.invalidateQueries({
        queryKey: ['userCommentLike', comment.id],
      });
      toast.success('Action completed');
    },
    onError: (error) => {
      toast.error('Error: ' + error.message);
    },
  });

  // - Delete Comment Functionality can be added here
  const deleteCommentMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      // Call delete comment action here with comment id and token

      return deleteCommentForPostAction(comment.id, token);
    },
    onSuccess: () => {
      // Handle success
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.error('Comment deleted successfully');
    },
    onError: (error) => {
      toast.error('Error deleting comment: ' + error.message);
    },
  });

  // + Reply Comment Functionality
  const replyCommentMutation = useMutation({
    mutationFn: async (replyData) => {
      const token = await getToken();
      return createCommentForPostAction(
        postId,
        replyData.commentDesc,
        token,
        comment.id
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      toast.success('Reply added successfully');
      setReplyText('');
      setShowReplyForm(false);
    },
    onError: (error) => {
      toast.error('Error adding reply: ' + error.message);
    },
  });

  // + Rating mutation for comment
  const commentRatingMutation = useMutation({
    mutationFn: async (rating) => {
      const token = await getToken();
      return rateCommentAction(comment.id, rating, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['commentRatingStats', comment.id],
      });
      queryClient.invalidateQueries({
        queryKey: ['userCommentRating', comment.id],
      });
      toast.success('Rating submitted');
    },
    onError: (error) => {
      toast.error('Error: ' + error.message);
    },
  });

  const handleReplySubmit = (e) => {
    e.preventDefault();
    if (!replyText.trim()) {
      toast.error('Reply cannot be empty');
      return;
    }
    replyCommentMutation.mutate({ commentDesc: replyText });
  };

  // ^ Render Single Comment Component
  return (
    <div className='p-4 bg-sky-100 rounded-xl'>
      <div className='flex items-center gap-3 mb-3'>
        <ImageComponent
          src={comment.commentUser?.profileImage}
          alt='User'
          className='h-10 w-10 rounded-full'
          width='24'
          height='24'
        />
        <NavLink className='text-sky-800 font-bold capitalize'>
          {comment.commentUser.username}
        </NavLink>
        <p className='text-base text-gray-500'>{format(comment?.createdAt)}</p>
        {user &&
          (comment.commentUser.username === user.username ||
            user.role === 'admin') && (
            <span
              className='ml-auto text-red-400 hover:text-red-600 cursor-pointer text-sm font-bold'
              onClick={() => deleteCommentMutation.mutate()}
            >
              Delete
              {deleteCommentMutation.isPending && (
                <span className='pl-3 text-red-700'>Deleting...</span>
              )}
            </span>
          )}
      </div>
      <p className='ml-10'>{comment.commentDesc}</p>
      <div className='ml-10 mt-2'>
        <div className='flex'>
          <button
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              commentLikeMutation.mutate('like');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
              userCommentLikeStatus?.status === 'like'
                ? 'bg-green-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={commentLikeMutation.isPending}
          >
            <FaThumbsUp />
            {commentLikeCounts?.likes || 0}
          </button>
          <button
            onClick={() => {
              if (!user) {
                navigate('/login');
                return;
              }
              commentLikeMutation.mutate('dislike');
            }}
            className={`flex items-center gap-1 px-2 py-1 rounded text-xs ml-2 ${
              userCommentLikeStatus?.status === 'dislike'
                ? 'bg-red-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            disabled={commentLikeMutation.isPending}
          >
            <FaThumbsDown />
            {commentLikeCounts?.dislikes || 0}
          </button>
          {/* RATING DROPDOWN */}
          <div className='flex items-center gap-1 ml-4'>
            <select
              value={userCommentRatingStatus?.rating || ''}
              onChange={(e) => {
                if (!user) {
                  navigate('/login');
                  return;
                }
                const rating = parseInt(e.target.value);
                if (rating) {
                  commentRatingMutation.mutate(rating);
                }
              }}
              className='text-xs px-1 py-0.5 rounded bg-gray-200 text-gray-700 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500'
              disabled={commentRatingMutation.isPending}
              title='Rate this comment'
            >
              <option value=''>Rate</option>
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
            {/* AVERAGE RATING STARS */}
            <div className='flex items-center gap-0.5 ml-1'>
              {[1, 2, 3, 4, 5].map((star) => {
                const average = commentRatingStats?.averageRating || 0;
                const color =
                  average > 3
                    ? 'text-yellow-500'
                    : average > 2
                    ? 'text-orange-500'
                    : 'text-red-500';
                return (
                  <span
                    key={star}
                    className={`text-xl ${
                      star <= Math.floor(average) ? color : 'text-gray-300'
                    }`}
                  >
                    ★
                  </span>
                );
              })}
              <span className='text-xs text-gray-600 ml-1'>
                ({commentRatingStats?.averageRating?.toFixed(1) || 0}) (
                {commentRatingStats?.totalRatings || 0})
              </span>
            </div>
          </div>
          {user && (
            <button
              onClick={() => setShowReplyForm(!showReplyForm)}
              className='ml-4 text-sky-600 hover:text-sky-800 text-sm font-medium'
            >
              Reply
            </button>
          )}
        </div>
        {comment.replies && comment.replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className='ml-4 text-sky-600 hover:text-sky-800 text-sm font-medium'
          >
            {showReplies
              ? 'Hide replies'
              : `View replies (${comment.replies.length})`}
          </button>
        )}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} className='mt-2'>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder='Write your reply...'
              className='w-full p-2 rounded-lg border text-sm'
              rows='2'
            />
            <div className='flex gap-2 mt-1'>
              <button
                type='submit'
                className='bg-sky-600 text-white px-3 py-1 rounded text-sm'
                disabled={replyCommentMutation.isPending}
              >
                {replyCommentMutation.isPending ? 'Replying...' : 'Reply'}
              </button>
              <button
                type='button'
                onClick={() => {
                  setShowReplyForm(false);
                  setReplyText('');
                }}
                className='bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      {showReplies && comment.replies && comment.replies.length > 0 && (
        <div className='ml-10 mt-4 space-y-2'>
          {comment.replies.map((reply) => (
            <SingleCommentComponent
              key={reply.id}
              comment={reply}
              postId={postId}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default SingleCommentComponent;
