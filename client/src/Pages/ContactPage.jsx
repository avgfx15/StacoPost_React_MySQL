import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router';
import { toast } from 'react-toastify';
import { useAuth } from '../AuthContext.jsx';

const ContactPage = () => {
  const { user, getToken } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    content: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (user) {
        try {
          const token = await getToken();
          const response = await fetch(
            `${import.meta.env.VITE_BASE_API_URL}/users/profile`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.ok) {
            const data = await response.json();
            setFormData((prev) => ({
              ...prev,
              email: data.user.email,
              mobile: data.user.mobileNo || '',
            }));
          }
        } catch (error) {
          console.error('Failed to fetch user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user, getToken]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/contact/send`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success('Message sent successfully!');
        setFormData({
          email: '',
          mobile: '',
          content: '',
        });
      } else {
        toast.error(data.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='flex flex-col gap-8'>
      {/* Breadcrumb Navigation */}
      <div className='flex gap-4'>
        <NavLink to='/' className='text-blue-600 hover:text-blue-800'>
          Home
        </NavLink>
        <span>.</span>
        <span className='text-gray-600'>Contact Us</span>
      </div>

      {/* Main Title */}
      <div className='text-center mb-8'>
        <h1 className='text-3xl md:text-5xl font-bold mb-4'>Contact Us</h1>
        <p className='text-lg text-gray-600 max-w-2xl mx-auto'>
          Have questions, feedback, or need support? We'd love to hear from you.
          Send us a message and we'll get back to you as soon as possible.
        </p>
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-2 gap-12'>
        {/* Contact Form */}
        <div className='bg-white rounded-lg shadow-md p-8'>
          <h2 className='text-2xl font-bold mb-6'>Send us a Message</h2>
          <form onSubmit={handleSubmit} className='space-y-6'>
            <div>
              <label
                htmlFor='email'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Email Address *
              </label>
              <input
                type='email'
                id='email'
                name='email'
                value={formData.email}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                placeholder='your.email@example.com'
              />
            </div>

            <div>
              <label
                htmlFor='mobile'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Mobile Number *
              </label>
              <input
                type='tel'
                id='mobile'
                name='mobile'
                value={formData.mobile}
                onChange={handleChange}
                required
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors'
                placeholder='+1 (555) 123-4567'
              />
            </div>

            <div>
              <label
                htmlFor='content'
                className='block text-sm font-medium text-gray-700 mb-2'
              >
                Message *
              </label>
              <textarea
                id='content'
                name='content'
                value={formData.content}
                onChange={handleChange}
                required
                rows={6}
                className='w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical'
                placeholder='Tell us how we can help you...'
              />
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className='w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        {/* Contact Information */}
        <div className='space-y-8'>
          {/* Contact Details */}
          <div className='bg-white rounded-lg shadow-md p-8'>
            <h2 className='text-2xl font-bold mb-6'>Get in Touch</h2>
            <div className='space-y-4'>
              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-blue-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Email</h3>
                  <p className='text-gray-600'>stacodev22@gmail.com</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-green-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Mobile</h3>
                  <p className='text-gray-600'>+91 70160 46462</p>
                </div>
              </div>

              <div className='flex items-start gap-4'>
                <div className='w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0'>
                  <svg
                    className='w-5 h-5 text-purple-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                    />
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                    />
                  </svg>
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900'>Location</h3>
                  <p className='text-gray-600'>Surat, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className='bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8'>
            <h2 className='text-2xl font-bold mb-6'>
              Frequently Asked Questions
            </h2>
            <div className='space-y-4'>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  How quickly do you respond?
                </h3>
                <p className='text-gray-600'>
                  We typically respond to all inquiries within 24 hours during
                  business days.
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  What information should I include?
                </h3>
                <p className='text-gray-600'>
                  Please provide as much detail as possible about your question
                  or issue to help us assist you better.
                </p>
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 mb-2'>
                  Do you offer technical support?
                </h3>
                <p className='text-gray-600'>
                  Yes, we provide technical support for all platform features
                  and can help troubleshoot any issues you encounter.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className='bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center text-white mt-8'>
        <h2 className='text-2xl font-bold mb-4'>Need Immediate Help?</h2>
        <p className='mb-6 max-w-2xl mx-auto'>
          Check out our comprehensive documentation and community forums for
          quick answers to common questions.
        </p>
        <div className='flex flex-col sm:flex-row gap-4 justify-center'>
          <NavLink
            to='/about'
            className='bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors'
          >
            Learn More About Us
          </NavLink>
          <NavLink
            to='/'
            className='border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors'
          >
            Back to Home
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
