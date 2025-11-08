import React from 'react';
import {
  getPostRatingStatsAction,
  getUserPostRatingStatusAction,
  ratePostAction,
} from '../Actions/RatingActions';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';

const PostRatingComponent = ({ post }) => {
  const { user, getToken } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // / Fetch rating stats for the post
  const { data: ratingStats } = useQuery({
    queryKey: ['postRatingStats', post?.id],
    queryFn: () => getPostRatingStatsAction(post.id),
    enabled: !!post?.id,
  });

  // / Fetch user's rating status for the post
  const { data: userRatingStatus } = useQuery({
    queryKey: ['userPostRating', post?.id],
    queryFn: async () => {
      const token = await getToken();
      return getUserPostRatingStatusAction(post.id, token);
    },
    enabled: !!post?.id && !!user,
  });

  // + Rating mutation
  const ratingMutation = useMutation({
    mutationFn: async (rating) => {
      const token = await getToken();
      return ratePostAction(post.id, rating, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['postRatingStats', post.id] });
      queryClient.invalidateQueries({ queryKey: ['userPostRating', post.id] });
      toast.success('Rating submitted');
    },
    onError: (error) => {
      toast.error('Error: ' + error.message);
    },
  });

  return (
    <div className='flex items-center gap-2'>
      {user && (
        <>
          <span>Rate this post</span>
          <select
            value={userRatingStatus?.rating || ''}
            onChange={(e) => {
              if (!user) {
                navigate('/login');
                return;
              }
              const rating = Number.parseInt(e.target.value);
              if (rating) {
                ratingMutation.mutate(rating);
              }
            }}
            className='text-sm px-2 py-1 rounded bg-gray-200 text-gray-700 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500'
            disabled={ratingMutation.isPending}
            title='Rate this post'
          >
            <option value=''>Rate</option>
            {[1, 2, 3, 4, 5].map((num) => (
              <option key={num} value={num}>
                {num}
              </option>
            ))}
          </select>
        </>
      )}

      {/* AVERAGE RATING STARS */}
      <div className='flex items-center gap-1 ml-2'>
        Average Rating
        {[1, 2, 3, 4, 5].map((star) => {
          const average = ratingStats?.averageRating || 0;
          const color =
            average > 3
              ? 'text-yellow-500'
              : average > 2
              ? 'text-orange-500'
              : 'text-red-500';
          return (
            <span
              key={star}
              className={`text-2xl ${
                star <= Math.floor(average) ? color : 'text-gray-300'
              }`}
            >
              ★
            </span>
          );
        })}
        <span className='text-sm text-gray-600 ml-1'>
          ({ratingStats?.averageRating?.toFixed(1) || 0}) (
          {ratingStats?.totalRatings || 0} ratings)
        </span>
      </div>
    </div>
  );
};

export default PostRatingComponent;
