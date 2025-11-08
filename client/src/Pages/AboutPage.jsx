import React from 'react';
import { NavLink } from 'react-router';

const AboutPage = () => {
  return (
    <div className='flex flex-col gap-8'>
      {/* Breadcrumb Navigation */}
      <div className='flex gap-4'>
        <NavLink to='/' className='text-blue-600 hover:text-blue-800'>
          Home
        </NavLink>
        <span>.</span>
        <span className='text-gray-600'>About Us</span>
      </div>

      {/* Main Title */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl md:text-5xl font-bold mb-4'>
          About Stacodev Blog
        </h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Discover the story behind our platform and our mission to connect
          writers and readers worldwide.
        </p>
      </div>

      {/* About Section */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
        <h2 className='text-2xl font-bold mb-4'>Who We Are</h2>
        <p className='text-gray-700 leading-relaxed mb-6'>
          Stacodev Blog is a modern blogging platform designed to empower
          writers, developers, and content creators to share their ideas,
          knowledge, and experiences with a global audience. Our platform
          combines cutting-edge technology with an intuitive user experience to
          make blogging accessible to everyone.
        </p>
        <p className='text-gray-700 leading-relaxed'>
          Whether you're a seasoned developer sharing technical insights, a
          hobbyist documenting your journey, or a creative mind expressing your
          thoughts, Stacodev provides the tools and community you need to make
          your voice heard.
        </p>
      </div>

      {/* Mission Section */}
      <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8'>
        <h2 className='text-2xl font-bold mb-4 text-center'>Our Mission</h2>
        <p className='text-gray-700 leading-relaxed text-center max-w-3xl mx-auto'>
          To create a vibrant ecosystem where knowledge flows freely, ideas are
          exchanged openly, and creativity knows no bounds. We believe in the
          power of written word to inspire, educate, and transform lives.
        </p>
      </div>

      {/* Features Section */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold mb-6 text-center'>
          What Makes Us Different
        </h2>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-blue-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 10V3L4 14h7v7l9-11h-7z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Lightning Fast</h3>
            <p className='text-gray-600'>
              Built with modern technologies for optimal performance and speed.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-green-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>User-Friendly</h3>
            <p className='text-gray-600'>
              Intuitive interface designed for writers of all skill levels.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-purple-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Community Driven</h3>
            <p className='text-gray-600'>
              Connect with like-minded individuals and build meaningful
              relationships.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-red-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Secure & Private</h3>
            <p className='text-gray-600'>
              Your data and content are protected with industry-standard
              security measures.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-yellow-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Open Source</h3>
            <p className='text-gray-600'>
              Built with love using open-source technologies and best practices.
            </p>
          </div>

          <div className='bg-white rounded-lg shadow-md p-6 text-center'>
            <div className='w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4'>
              <svg
                className='w-6 h-6 text-indigo-600'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M13 7h8m0 0v8m0-8l-8 8-4-4-6 6'
                />
              </svg>
            </div>
            <h3 className='text-lg font-semibold mb-2'>Growing Platform</h3>
            <p className='text-gray-600'>
              Continuously evolving with new features and improvements.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className='bg-white rounded-lg shadow-md p-8 mb-8'>
        <h2 className='text-2xl font-bold mb-6 text-center'>Meet the Team</h2>
        <div className='text-center'>
          <div className='w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4'>
            <span className='text-white text-2xl font-bold'>S</span>
          </div>
          <h3 className='text-xl font-semibold mb-2'>Stacodev</h3>
          <p className='text-gray-600 mb-4'>Founder & Lead Developer</p>
          <p className='text-gray-700 max-w-md mx-auto'>
            Passionate about creating innovative solutions that make a
            difference. Dedicated to building platforms that empower creators
            and foster communities.
          </p>
        </div>
      </div>

      {/* Call to Action */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white'>
        <h2 className='text-2xl font-bold mb-4'>
          Ready to Start Your Journey?
        </h2>
        <p className='mb-6 max-w-2xl mx-auto'>
          Join thousands of writers who have already discovered the power of
          sharing their stories. Create your account today and start writing
          your first blog post.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <NavLink
            to='/register'
            className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
          >
            Get Started
          </NavLink>
          <NavLink
            to='/login'
            className='border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
          >
            Sign In
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
