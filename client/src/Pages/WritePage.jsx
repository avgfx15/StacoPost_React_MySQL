import React, { useState } from 'react';
import ReactQuillComponent from '../Components/ReactQuillComponent';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'react-toastify';
import UplaodFileComponent from '../Components/UploadFileComponent';
import ImageComponent from '../Components/ImageComponent';
import { useAuth } from '../AuthContext.jsx';
import {
  fetchAllCategoriesAction,
  createCategoryAction,
  createNewPostAction,
} from '../Actions/PostActions';

// & Write Post Component

const WritePage = () => {
  // / Get Token from Auth Context
  const { getToken } = useAuth();

  // ^ State for Cover Image, Post Image, Video, Progress
  const [cover, setCover] = useState('');
  const [progress, setProgress] = useState(0);
  const [imageSource, setImageSource] = useState('upload'); // 'upload' or 'url'
  const [coverUrl, setCoverUrl] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [showAddCategory, setShowAddCategory] = useState(false);

  const navigate = useNavigate();

  // Fetch categories
  const { data: categories, refetch: refetchCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoriesAction,
  });

  // + Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async (categoryName) => {
      const token = await getToken();

      return createCategoryAction(categoryName, token);
    },
    onSuccess: (newCategory) => {
      toast.success('Category created successfully');
      setNewCategory('');
      setShowAddCategory(false);
      refetchCategories();
      setSelectedCategory(newCategory.name);
    },
    onError: (error) => {
      toast.error('Failed to create category: ' + error.message);
    },
  });

  // ` Use Mutation from TanStackQuery for New Post
  const mutation = useMutation({
    mutationFn: async (newPost) => {
      const token = await getToken();

      return createNewPostAction(newPost, token);
    },
    onError: (error) => {
      toast.error('Error creating post: ' + error.message);
    },
    onSuccess: (res) => {
      toast.success('Post Created Successfully');

      navigate(`/posts/${res.slug}`);
    },
  });

  // @ Declare values for ReactQuill components
  const [titleValue, setTitleValue] = useState('<h1><strong></strong></h1>');
  const [subTitleValue, setSubTitleValue] = useState(
    '<h2><strong></strong></h2>'
  );
  const [contentValue, setContentValue] = useState('');

  // 1. Define the whitelist for Quill (must match the names used in SCSS)
  const CUSTOM_FONT_NAMES = [
    'CascadiaCode',
    'GoogleSansCode',
    'IBMPlexMono',
    'Lato',
    'MontserratAlternates',
    'Raleway',
    'Roboto',
    'Rubik',
    'Sixtyfour',
    'SofiaSans',
  ];

  // Define modules for different editors
  const titleModules = {
    toolbar: [[{ font: CUSTOM_FONT_NAMES }], [{ header: 1 }], ['bold']],
  };
  const subTitleModules = {
    toolbar: [
      [{ font: CUSTOM_FONT_NAMES }],
      [{ header: 2 }],
      ['bold', 'italic', 'underline', 'strike'],
    ],
  };

  // @ Check if user is authenticated
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className=''>Loading</div>;
  }

  if (!isAuthenticated) {
    navigate('/login');
    return <div className=''>Please Sign In first</div>;
  }

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    const newPostData = {
      postImage: imageSource === 'upload' ? cover.filePath || '' : coverUrl,
      category: selectedCategory || formData.get('category'),
      postTitle: titleValue,
      subTitle: subTitleValue,
      content: contentValue,
    };

    mutation.mutate(newPostData);
  };

  // ^ Render Write New Post Component
  return (
    <div className='h-[calc(100vh-64px)] md:h-[calc(100vh-80px)] flex flex-col gap-5'>
      <h1 className='text-xl font-light'>Create A New Post</h1>
      <form
        className='flex flex-col gap-5 flex-1 mb-5'
        onSubmit={handleFormSubmit}
      >
        <div className='flex flex-col gap-4'>
          <label className='text-sm font-medium text-gray-700'>
            Cover Image
          </label>
          <div className='flex gap-4'>
            <label className='flex items-center'>
              <input
                type='radio'
                name='imageSource'
                value='upload'
                checked={imageSource === 'upload'}
                onChange={(e) => setImageSource(e.target.value)}
                className='mr-2'
              />
              Upload from Device
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                name='imageSource'
                value='url'
                checked={imageSource === 'url'}
                onChange={(e) => setImageSource(e.target.value)}
                className='mr-2'
              />
              Enter URL
            </label>
          </div>
          {imageSource === 'upload' ? (
            <div className='flex flex-col gap-2'>
              <UplaodFileComponent
                type='image'
                setProgress={setProgress}
                setData={setCover}
              >
                <button
                  type='button'
                  className='w-max p-2 rounded-xl text-sm shadow-md text-gray-500 bg-white'
                >
                  Choose Image
                </button>
              </UplaodFileComponent>
              {'Progress:' + progress}
            </div>
          ) : (
            <input
              type='url'
              value={coverUrl}
              onChange={(e) => setCoverUrl(e.target.value)}
              className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              placeholder='https://example.com/image.jpg'
            />
          )}
          {/* Preview */}
          <div className='mt-2'>
            <p className='text-sm text-gray-600 mb-2'>Preview:</p>
            <ImageComponent
              src={imageSource === 'upload' ? cover.filePath || '' : coverUrl}
              alt='Cover preview'
              className='w-32 h-20 object-cover rounded-lg'
            />
          </div>
        </div>

        <div className='flex flex-col justify-start mb-3'>
          <label htmlFor='title' className='text-xl mb-3'>
            Title
          </label>
          <ReactQuillComponent
            modules={titleModules}
            value={titleValue}
            onChange={(v) => {
              setTitleValue(v);
            }}
            className='title-editor text-4xl outline-none font-semibold bg-sky-100 rounded-xl p-3'
            placeholder='My Awesome Story Title...'
          />
        </div>
        <div className='flex items-center gap-3'>
          <label htmlFor='category' className='text-sm'>
            Choose a category :{' '}
          </label>
          <div className='relative flex items-center gap-2'>
            <select
              name='category'
              id='category'
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className='p-2 rounded-xl shadow-md bg-white'
            >
              <option value=''>Select a category</option>
              {categories?.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
            <button
              type='button'
              onClick={() => setShowAddCategory(!showAddCategory)}
              className='px-3 py-2 bg-green-500 text-white rounded-lg text-sm hover:bg-green-600'
            >
              {showAddCategory ? 'Cancel' : 'Add New'}
            </button>
          </div>
        </div>
        {showAddCategory && (
          <div className='flex items-center gap-3'>
            <input
              type='text'
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder='Enter new category name'
              className='p-2 rounded-xl shadow-md bg-white flex-1'
            />
            <button
              type='button'
              onClick={() => createCategoryMutation.mutate(newCategory)}
              disabled={!newCategory.trim() || createCategoryMutation.isPending}
              className='px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:bg-gray-400'
            >
              {createCategoryMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        )}
        <div className='flex flex-col mb-3'>
          <label htmlFor='title' className='text-xl mb-3'>
            Sub Title
          </label>
          <ReactQuillComponent
            modules={subTitleModules}
            value={subTitleValue}
            onChange={(v) => {
              setSubTitleValue(v);
            }}
            className='subTitle-editor p-4 rounded-xl shadow-md bg-purple-100'
            placeholder='A Sub Title For Post...'
          />
        </div>
        <ReactQuillComponent
          value={contentValue}
          onChange={(v) => {
            setContentValue(v);
          }}
          className='flex-1 rounded-xl shadow-md bg-white p-3'
        />
        <button
          type='submit'
          disabled={mutation.isPending || (0 < progress && progress < 100)}
          className='py-2 px-3 w-28 bg-sky-800 text-white rounded-xl font-medium my-3 disabled:bg-sky-300 disabled:cursor-not-allowed disabled:text-gray-400 disabled:opacity-75'
        >
          {mutation.isPending ? 'Loading...' : 'Publish'}
        </button>

        {mutation.isError && (
          <div>An error occurred: {mutation.error.message}</div>
        )}
      </form>
    </div>
  );
};

export default WritePage;
