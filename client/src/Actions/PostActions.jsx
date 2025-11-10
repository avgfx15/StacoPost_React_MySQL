import axios from 'axios';

const baseUrl = import.meta.env.VITE_BASE_API_URL;

// / Fetch All Posts Action
export const fetchAllPostsAction = async (pageParams, searchParams) => {
  const searchParamsObject = Object.fromEntries([...searchParams]);

  // Add includeInactive parameter if specified
  if (searchParamsObject.includeInactive) {
    searchParamsObject.includeInactive = true;
  }

  const response = await axios.get(`${baseUrl}/posts`, {
    params: { page: pageParams, ...searchParamsObject },
  });
  return response.data;
};

// / Fetch Single Post Action
export const fetchFeaturedPostAction = async () => {
  const response = await axios.get(
    `${baseUrl}/posts?featuredPost=true&limit=4&sort=newest`
  );

  return response.data;
};

// / Fetch Single Post Action
export const fetchSinglePostAction = async (slug) => {
  const response = await axios.get(`${baseUrl}/posts/${slug}`);

  return response.data;
};

// + Create New Post Action
export const createNewPostAction = async (newPost, token) => {
  const response = await axios.post(`${baseUrl}/posts`, newPost, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// + Feature Post Action
export const featurePostAction = async (postId, token) => {
  const response = await axios.patch(
    `${baseUrl}/posts/feature`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// // - Delete Single Post Action
// export const deleteSinglePostAction = async (postId, token) => {
//   const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return response.data;
// };

// - Remove Post By AuthorAction
export const deletePostByAuthorAction = async (postId, token) => {
  const response = await axios.delete(`${baseUrl}/posts/${postId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// + User Saved Post Action
export const userSaveOrUnSavePostAction = async (postId, token) => {
  const response = await axios.patch(
    `${baseUrl}/users/savepost`,
    { postId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// / Fetch All Saved Posts Action
export const fetchAllSavedPostsAction = async (token) => {
  const response = await axios.get(`${baseUrl}/users/savedposts`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// / Fetch All Categories Action
export const fetchAllCategoriesAction = async () => {
  const response = await axios.get(`${baseUrl}/categories`);
  return response.data;
};

// + Create New Category Action
export const createCategoryAction = async (categoryName, token) => {
  const response = await axios.post(
    `${baseUrl}/categories`,
    { name: categoryName },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// - Delete Category Action
export const deleteCategoryAction = async (categoryId, token) => {
  const response = await axios.delete(`${baseUrl}/categories/${categoryId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// / Fetch All Comments By PostId Action
export const fetchCommentsByPostIdAction = async (postId) => {
  const response = await axios.get(`${baseUrl}/comments/${postId}`);
  return response.data;
};

// + Create New Comment For a Post By PostId Action
export const createCommentForPostAction = async (
  postId,
  commentDesc,
  token,
  parentCommentId = null
) => {
  const response = await axios.post(
    `${baseUrl}/comments/${postId}`,
    { commentDesc, parentCommentId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data;
};

// - Delete Comment Action
export const deleteCommentForPostAction = async (commentId, token) => {
  const response = await axios.delete(`${baseUrl}/comments/${commentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// / Fetch All Users Action (Admin Only)
export const fetchAllUsersAction = async (token) => {
  const response = await axios.get(`${baseUrl}/users/all`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// + Delete User Account Action
export const deleteUserAccountAction = async (token) => {
  const response = await axios.delete(`${baseUrl}/users/account`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
