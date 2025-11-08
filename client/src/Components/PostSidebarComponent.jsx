import React from 'react';
import { NavLink } from 'react-router';
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaWhatsapp,
} from 'react-icons/fa';
import ImageComponent from './ImageComponent';
import PostMenuActionsComponent from './PostMenuActionsComponent';
import CategoriesComponent from './CategoriesComponent';
import SearchComponent from './SearchComponent';
import { useAuth } from '../AuthContext';

// & Post Sidebar Component
const PostSidebarComponent = ({ post }) => {
  const { user } = useAuth();

  return (
    <div className='px-4 h-max sticky top-8 w-3/12 gap-4'>
      <h1>Author</h1>
      <div className=''>
        <div className='flex items-center gap-5 mb-3'>
          <ImageComponent
            src={post?.author?.profileImage}
            alt='User'
            className='h-12 w-12 rounded-full'
            width='48'
            height='48'
          />
          <NavLink
            className='text-sky-600 capitalize'
            to={`/posts?author=${post?.author?.username}`}
          >
            {post?.author?.username}
          </NavLink>
        </div>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit.</p>
        <div className='flex gap-4 my-3'>
          {post?.author?.facebook && (
            <a
              href={post.author.facebook}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-600 hover:text-blue-800'
            >
              <FaFacebook className='text-3xl' />
            </a>
          )}
          {post?.author?.linkedin && (
            <a
              href={post.author.linkedin}
              target='_blank'
              rel='noopener noreferrer'
              className='text-blue-700 hover:text-blue-900'
            >
              <FaLinkedin className='text-3xl' />
            </a>
          )}
          {post?.author?.instagram && (
            <a
              href={post.author.instagram}
              target='_blank'
              rel='noopener noreferrer'
              className='text-pink-600 hover:text-pink-800'
            >
              <FaInstagram className='text-3xl' />
            </a>
          )}
          {post?.author?.whatsapp && (
            <a
              href={`https://wa.me/${post.author.whatsapp.replaceAll(
                /\D/g,
                ''
              )}`}
              target='_blank'
              rel='noopener noreferrer'
              className='text-green-600 hover:text-green-800'
            >
              <FaWhatsapp className='text-3xl' />
            </a>
          )}
        </div>
        {user && <PostMenuActionsComponent post={post} />}
        <h1 className='mb-3 font-bold'>Categories</h1>
        <CategoriesComponent />
        <h1 className='mb-3 font-bold mt-5'>Search</h1>
        <SearchComponent />
      </div>
    </div>
  );
};

export default PostSidebarComponent;
