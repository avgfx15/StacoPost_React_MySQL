import React, { useState } from 'react';
import { toast } from 'react-toastify';

import {
  FaFacebook,
  FaLinkedin,
  FaWhatsapp,
  FaTwitter,
  FaShare,
} from 'react-icons/fa';

const PostShareComponent = ({ post }) => {
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Share functionality
  const handleShare = async (platform) => {
    const url = globalThis.location.href;
    const title = post?.postTitle
      ? post.postTitle.replaceAll(/<[^>]*>/g, '')
      : 'Check out this post';

    // Always copy link first
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }

    switch (platform) {
      case 'facebook':
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          '_blank'
        );
        break;
      case 'twitter':
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          '_blank'
        );
        break;
      case 'linkedin':
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          '_blank'
        );
        break;
      case 'whatsapp':
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
          '_blank'
        );
        break;
      default:
        break;
    }
  };

  return (
    <div className='relative'>
      <button
        onClick={() => setIsShareOpen(!isShareOpen)}
        className='flex items-center gap-2 px-3 py-1 rounded bg-blue-500 text-white hover:bg-blue-600'
        title='Share'
      >
        <FaShare />
        Share
      </button>
      {isShareOpen && (
        <div className='absolute top-full mt-2 bg-white border border-gray-300 rounded shadow-lg p-2 flex gap-2'>
          <button
            onClick={() => handleShare('facebook')}
            className='flex items-center gap-1 px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700'
            title='Share on Facebook'
          >
            <FaFacebook />
          </button>
          <button
            onClick={() => handleShare('twitter')}
            className='flex items-center gap-1 px-2 py-1 rounded bg-sky-500 text-white hover:bg-sky-600'
            title='Share on Twitter'
          >
            <FaTwitter />
          </button>
          <button
            onClick={() => handleShare('linkedin')}
            className='flex items-center gap-1 px-2 py-1 rounded bg-blue-700 text-white hover:bg-blue-800'
            title='Share on LinkedIn'
          >
            <FaLinkedin />
          </button>
          <button
            onClick={() => handleShare('whatsapp')}
            className='flex items-center gap-1 px-2 py-1 rounded bg-green-500 text-white hover:bg-green-600'
            title='Share on WhatsApp'
          >
            <FaWhatsapp />
          </button>
        </div>
      )}
    </div>
  );
};

export default PostShareComponent;
