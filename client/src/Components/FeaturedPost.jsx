import React from 'react';

import { fetchFeaturedPostAction } from '../Actions/PostActions';

import { format } from 'timeago.js';

// | Image Component
import ImageComponent from './ImageComponent';
import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';

// & Featured Post Component

const FeaturedPost = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['featuredposts'],
    queryFn: async () => fetchFeaturedPostAction(),
  });

  const featuredPosts = data?.allPost;

  if (isPending) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error.message}</div>;
  }
  if (!featuredPosts || featuredPosts.length === 0) {
    return;
  }

  // ^ Render Featured Post Component
  return (
    <div className='mt-2 flex flex-col lg:flex-row gap-8'>
      {/* MOST RECENT POST OR FIRST POST FROM FEATURED POST */}
      <div className='w-full lg:w-1/2 flex flex-col gap-3'>
        {/* IMAGE */}

        {featuredPosts[0]?.postImage && (
          <ImageComponent
            src={featuredPosts[0]?.postImage}
            alt='Logo Img'
            width='700'
            className='rounded-3xl object-cover w-full h-full'
          />
        )}

        {/* DETAILS */}
        <div className='flex items-center gap-3'>
          <h1 className='text-lg font-semibold'>01.</h1>
          <NavLink
            className='text-sky-600 lg:text-lg'
            to={`/posts?category=${featuredPosts[0]?.category?.slug}`}
          >
            {featuredPosts[0]?.category?.name}
          </NavLink>
          <span className='text-gray-500'>
            {format(featuredPosts[0]?.createdAt)}
          </span>
        </div>
        {/* TITLE */}
        <NavLink
          to={`/posts/${featuredPosts[0]?.slug}`}
          className='text-xl lg:text-3xl font-semibold lg:font-bold'
        >
          <p
            className='mb-3'
            dangerouslySetInnerHTML={{ __html: featuredPosts[0]?.postTitle }}
          ></p>
          {/* <p
            className='text-lg lg:text-xl'
            dangerouslySetInnerHTML={{ __html: featuredPosts[0]?.subTitle }}
          ></p> */}
        </NavLink>
      </div>
      {/* REST FEATURED POST */}
      <div className='w-full lg:w-1/2 flex flex-col gap-3'>
        {/* SECOND POST */}
        {featuredPosts[1] && (
          <div className='lg:h-1/3 flex justify-between gap-3 mb-5'>
            {featuredPosts[1]?.postImage && (
              <div className='w-1/3 aspect-video'>
                <ImageComponent
                  src={featuredPosts[1]?.postImage}
                  alt='Logo Img'
                  width='300'
                  className='rounded-3xl object-cover w-full h-full'
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-3 text-sm lg:text-base mb-3'>
                <h1 className='font-semibold'>02.</h1>
                <NavLink
                  className='text-sky-600 lg:text-lg'
                  to={`/posts?category=${featuredPosts[1]?.category?.slug}`}
                >
                  {featuredPosts[1]?.category?.name}
                </NavLink>
                <span className='text-gray-500'>
                  {format(featuredPosts[1]?.createdAt)}
                </span>
              </div>
              {/* TITLE */}
              <NavLink
                to={`/posts/${featuredPosts[1]?.slug}`}
                className='text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium'
              >
                <p
                  className='mb-3'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[1]?.postTitle,
                  }}
                ></p>
                {/* <p
                  className='text-lg lg:text-xl'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[1]?.subTitle,
                  }}
                ></p> */}
              </NavLink>
            </div>
          </div>
        )}
        {/* THIRD POST */}
        {featuredPosts[2] && (
          <div className='lg:h-1/3 flex justify-between gap-3 mb-5'>
            {featuredPosts[2]?.postImage && (
              <div className='w-1/3 aspect-video'>
                <ImageComponent
                  src={featuredPosts[2]?.postImage}
                  alt='Logo Img'
                  width='300'
                  className='rounded-3xl object-cover w-full h-full'
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-3 text-sm lg:text-base mb-3'>
                <h1 className='font-semibold'>03.</h1>
                <NavLink
                  className='text-sky-600 lg:text-lg'
                  to={`/posts?category=${featuredPosts[2]?.category?.slug}`}
                >
                  {featuredPosts[2]?.category?.name}
                </NavLink>
                <span className='text-gray-500'>
                  {format(featuredPosts[2]?.createdAt)}
                </span>
              </div>
              {/* TITLE */}
              <NavLink
                to={`/posts/${featuredPosts[2]?.slug}`}
                className='text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium'
              >
                <p
                  className='mb-3'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[2]?.postTitle,
                  }}
                ></p>
                {/* <p
                  className='text-lg lg:text-xl'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[2]?.subTitle,
                  }}
                ></p> */}
              </NavLink>
            </div>
          </div>
        )}
        {/* FORTH POST */}
        {featuredPosts[3] && (
          <div className='lg:h-1/3 flex justify-between gap-3 mb-5'>
            {featuredPosts[3]?.postImage && (
              <div className='w-1/3 aspect-video'>
                <ImageComponent
                  src={featuredPosts[3]?.postImage}
                  alt='Logo Img'
                  width='300'
                  className='rounded-3xl object-cover w-full h-full'
                />
              </div>
            )}
            <div className='w-2/3'>
              <div className='flex items-center gap-3 text-sm lg:text-base mb-3'>
                <h1 className='font-semibold'>04.</h1>
                <NavLink
                  className='text-sky-600 lg:text-lg'
                  to={`/posts?category=${featuredPosts[3]?.category?.slug}`}
                >
                  {featuredPosts[3]?.category?.name}
                </NavLink>
                <span className='text-gray-500'>
                  {format(featuredPosts[3]?.createdAt)}
                </span>
              </div>
              {/* TITLE */}
              <NavLink
                to={`/posts/${featuredPosts[3]?.slug}`}
                className='text-base sm:text-lg md:text-2xl lg:text-xl xl:text-2xl font-medium'
              >
                <p
                  className='mb-3'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[3]?.postTitle,
                  }}
                ></p>
                {/* <p
                  className='text-lg lg:text-xl'
                  dangerouslySetInnerHTML={{
                    __html: featuredPosts[2]?.subTitle,
                  }}
                ></p> */}
              </NavLink>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FeaturedPost;
