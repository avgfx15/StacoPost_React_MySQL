import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_API_URL;

// + Like or Dislike a Post Action
export const likeOrDislikePostAction = async (postId, type, token) => {
  const response = await axios.post(
    `${baseUrl}/likes/posts/${postId}`,
    { type },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// + Like or Dislike a Comment Action
export const likeOrDislikeCommentAction = async (commentId, type, token) => {
  const response = await axios.post(
    `${baseUrl}/likes/comments/${commentId}`,
    { type },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// / Get Like Counts for a Post Action
export const getPostLikeCountsAction = async (postId) => {
  const response = await axios.get(`${baseUrl}/likes/posts/${postId}/counts`);
  return response.data;
};

// / Get Like Counts for a Comment Action
export const getCommentLikeCountsAction = async (commentId) => {
  const response = await axios.get(
    `${baseUrl}/likes/comments/${commentId}/counts`
  );
  return response.data;
};

// / Get User's Like Status for a Post Action
export const getUserPostLikeStatusAction = async (postId, token) => {
  const response = await axios.get(`${baseUrl}/likes/posts/${postId}/status`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// / Get User's Like Status for a Comment Action
export const getUserCommentLikeStatusAction = async (commentId, token) => {
  const response = await axios.get(
    `${baseUrl}/likes/comments/${commentId}/status`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};
