import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../AuthContext.jsx';
import { toast } from 'react-toastify';
import ImageComponent from '../Components/ImageComponent';
import UplaodFileComponent from '../Components/UploadFileComponent';
import { format } from 'timeago.js';
import { useNavigate } from 'react-router';

// & Profile Page Component
const ProfilePage = () => {
  const { user, getToken, setUser } = useAuth();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const [isEditing, setIsEditing] = useState(false);
  const [imageSource, setImageSource] = useState('url'); // 'url' or 'upload'
  const [uploadedImage, setUploadedImage] = useState(null);
  const [formData, setFormData] = useState({
    profileImage: '',
    mobileNo: '',
    gender: '',
    age: '',
    facebook: '',
    linkedin: '',
    instagram: '',
    whatsapp: '',
  });

  // / Get User Profile
  const { data, isLoading, error } = useQuery({
    queryKey: ['userProfile'],
    queryFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/users/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to fetch profile');
      return response.json();
    },
    enabled: !!user,
  });

  const profile = data?.user;

  // + Update Profile Mutation
  const updateProfileMutation = useMutation({
    mutationFn: async (profileData) => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/users/profile`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(profileData),
        }
      );
      if (!response.ok) throw new Error('Failed to update profile');
      return response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(['userProfile']);
      // Update user data in AuthContext to update navbar
      setUser(data.user);
      toast.success('Profile updated successfully');
      setIsEditing(false);
    },
    onError: (error) => {
      toast.error('Error updating profile: ' + error.message);
    },
  });

  // - Delete Account Mutation
  const deleteAccountMutation = useMutation({
    mutationFn: async () => {
      const token = await getToken();
      const response = await fetch(
        `${import.meta.env.VITE_BASE_API_URL}/users/account`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) throw new Error('Failed to delete account');
      return response.json();
    },
    onSuccess: () => {
      toast.success('Account deleted successfully');
      // Redirect to login or home page
      window.location.href = '/login';
    },
    onError: (error) => {
      toast.error('Error deleting account: ' + error.message);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  console.log(profile?.profileImage);

  const handleEdit = () => {
    if (profile) {
      setFormData({
        profileImage: profile.profileImage || '',
        mobileNo: profile.mobileNo || '',
        gender: profile.gender || '',
        age: profile.age || '',
        facebook: profile.facebook || '',
        linkedin: profile.linkedin || '',
        instagram: profile.instagram || '',
        whatsapp: profile.whatsapp || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    const processedData = { ...formData };
    // Convert empty age to null to avoid database error
    if (processedData.age === '') {
      processedData.age = null;
    }
    updateProfileMutation.mutate(processedData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      profileImage: '',
      mobileNo: '',
      gender: '',
      age: '',
      facebook: '',
      linkedin: '',
      instagram: '',
      whatsapp: '',
    });
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete your account? This action cannot be undone. All your posts, comments, and likes will be transferred to guest user. You will not have any rights to claim these posts after deletion.'
      )
    ) {
      deleteAccountMutation.mutate();
    }
  };

  if (isLoading)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Loading...
      </div>
    );
  if (error)
    return (
      <div className='flex justify-center items-center min-h-screen'>
        Error: {error.message}
      </div>
    );

  return (
    <div className='max-full mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-8'>My Profile</h1>

      <div className='bg-white rounded-lg shadow-md p-6'>
        {/* Profile Header */}
        <div className='flex items-center gap-6 mb-8'>
          <ImageComponent
            src={profile?.profileImage}
            alt={profile?.username}
            className='w-24 h-24 rounded-full object-cover'
          />
          <div>
            <h2 className='text-2xl font-semibold capitalize'>
              {profile?.username}
            </h2>
            <p className='text-gray-600'>{profile?.email}</p>
            <p className='text-sm text-gray-500'>
              Member since {format(profile?.createdAt)}
            </p>
            <p className='text-sm text-blue-600 capitalize'>{profile?.role}</p>
          </div>
        </div>

        {/* Profile Form */}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
          {/* Profile Image */}
          <div className='md:col-span-2'>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Profile Image
            </label>
            {isEditing ? (
              <>
                <div className='flex gap-4 mb-4'>
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
                </div>
                {imageSource === 'url' ? (
                  <input
                    type='url'
                    name='profileImage'
                    value={formData.profileImage}
                    onChange={handleInputChange}
                    className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                    placeholder='https://example.com/image.jpg'
                  />
                ) : (
                  <div className='flex items-center gap-4'>
                    <UplaodFileComponent
                      type='image'
                      setProgress={() => {}}
                      setData={(data) => {
                        setUploadedImage(data);
                        setFormData((prev) => ({
                          ...prev,
                          profileImage: data.filePath,
                        }));
                      }}
                    >
                      <button
                        type='button'
                        className='px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600'
                      >
                        Choose Image
                      </button>
                    </UplaodFileComponent>
                    {uploadedImage && (
                      <span className='text-sm text-gray-600'>
                        {uploadedImage.name}
                      </span>
                    )}
                  </div>
                )}
                {/* Preview */}
                <div className='mt-4'>
                  <p className='text-sm text-gray-600 mb-2'>Preview:</p>
                  <ImageComponent
                    src={formData.profileImage}
                    alt='Profile preview'
                    className='w-16 h-16 rounded-full object-cover'
                  />
                </div>
              </>
            ) : (
              <div className='flex items-center gap-4'>
                <ImageComponent
                  src={profile?.profileImage}
                  alt='Profile'
                  className='w-16 h-16 rounded-full object-cover'
                />
                <p className='text-gray-900 bg-gray-50 p-3 rounded-lg overflow-x-scroll px-2 flex-1'>
                  {profile?.profileImage || 'Not set'}
                </p>
              </div>
            )}
          </div>

          {/* Mobile Number */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Mobile Number
            </label>
            {isEditing ? (
              <input
                type='tel'
                name='mobileNo'
                value={formData.mobileNo}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='+1234567890'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.mobileNo || 'Not set'}
              </p>
            )}
          </div>

          {/* Gender */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Gender
            </label>
            {isEditing ? (
              <select
                name='gender'
                value={formData.gender}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
              >
                <option value=''>Select Gender</option>
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg capitalize'>
                {profile?.gender || 'Not set'}
              </p>
            )}
          </div>

          {/* Age */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Age
            </label>
            {isEditing ? (
              <input
                type='number'
                name='age'
                value={formData.age}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='25'
                min='1'
                max='120'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.age || 'Not set'}
              </p>
            )}
          </div>

          {/* Facebook */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Facebook Profile
            </label>
            {isEditing ? (
              <input
                type='url'
                name='facebook'
                value={formData.facebook}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='https://facebook.com/username'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.facebook ? (
                  <a
                    href={profile.facebook}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {profile.facebook}
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>

          {/* LinkedIn */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              LinkedIn Profile
            </label>
            {isEditing ? (
              <input
                type='url'
                name='linkedin'
                value={formData.linkedin}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='https://linkedin.com/in/username'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.linkedin ? (
                  <a
                    href={profile.linkedin}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {profile.linkedin}
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>

          {/* Instagram */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              Instagram Profile
            </label>
            {isEditing ? (
              <input
                type='url'
                name='instagram'
                value={formData.instagram}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='https://instagram.com/username'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.instagram ? (
                  <a
                    href={profile.instagram}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-blue-600 hover:underline'
                  >
                    {profile.instagram}
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className='block text-sm font-medium text-gray-700 mb-2'>
              WhatsApp Number
            </label>
            {isEditing ? (
              <input
                type='tel'
                name='whatsapp'
                value={formData.whatsapp}
                onChange={handleInputChange}
                className='w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent'
                placeholder='+1234567890'
              />
            ) : (
              <p className='text-gray-900 bg-gray-50 p-3 rounded-lg'>
                {profile?.whatsapp ? (
                  <a
                    href={`https://wa.me/${profile.whatsapp.replace(
                      /\D/g,
                      ''
                    )}`}
                    target='_blank'
                    rel='noopener noreferrer'
                    className='text-green-600 hover:underline'
                  >
                    {profile.whatsapp}
                  </a>
                ) : (
                  'Not set'
                )}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className='flex gap-4 mt-8'>
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={updateProfileMutation.isPending}
                className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50'
              >
                {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className='bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400'
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className='bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700'
            >
              Edit Profile
            </button>
          )}
        </div>

        {/* Delete Account Section */}
        <div className='mt-12 pt-8 border-t border-gray-200'>
          <h3 className='text-xl font-semibold text-red-600 mb-4'>
            Danger Zone
          </h3>
          <p className='text-gray-600 mb-4'>
            Once you delete your account, there is no going back. This will
            permanently delete your account. All your posts, comments, and likes
            will be transferred to guest user. You will not have any rights to
            claim these posts after deletion.
          </p>
          <div className='flex gap-4'>
            <button
              onClick={handleDeleteAccount}
              disabled={deleteAccountMutation.isPending}
              className='bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50'
            >
              {deleteAccountMutation.isPending
                ? 'Deleting...'
                : 'Delete Account'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
