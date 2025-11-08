import React, { useState } from 'react';
import { NavLink } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchAllCategoriesAction } from '../Actions/PostActions';
import SearchComponent from './SearchComponent';

// & Main Categories Navbar Component
const MainCategoriesNav = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchAllCategoriesAction,
  });

  const [showDropdown, setShowDropdown] = useState(false);

  const displayedCategories = categories?.slice(0, 4) || [];
  const remainingCategories = categories?.slice(4) || [];

  // ^ Render Main Categories Component
  return (
    <div className='hidden md:flex items-center justify-center rounded-2xl md:rounded-full bg-white p-4 shadow-lg gap-8'>
      {/* CATEGORIES NAV LINKS */}
      <div className='flex-1 flex items-center justify-between flex-wrap'>
        <NavLink
          to='/posts'
          className='bg-blue-900 text-white px-4 py-2 rounded-full'
        >
          All Posts
        </NavLink>
        {!isLoading &&
          displayedCategories.map((category) => (
            <NavLink
              key={category.id}
              to={`/posts?category=${category.slug}`}
              className='hover:bg-blue-50 px-4 py-2 rounded-full'
            >
              {category.name}
            </NavLink>
          ))}
        {remainingCategories.length > 0 && (
          <div className='relative'>
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className='hover:bg-blue-50 px-4 py-2 rounded-full'
            >
              More ▼
            </button>
            {showDropdown && (
              <div className='absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-max'>
                {remainingCategories.map((category) => (
                  <NavLink
                    key={category.id}
                    to={`/posts?category=${category.slug}`}
                    className='block px-4 py-2 hover:bg-blue-50 first:rounded-t-lg last:rounded-b-lg'
                    onClick={() => setShowDropdown(false)}
                  >
                    {category.name}
                  </NavLink>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      {/* DIVIDER LINE */}
      <span className='text-xl font-medium'>|</span>

      {/* SEARCH */}
      <SearchComponent />
    </div>
  );
};

// ~ Export Main Categories Nav Component
export default MainCategoriesNav;
