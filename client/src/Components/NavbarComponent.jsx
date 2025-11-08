import React, { useState } from 'react';

// | Auth Context
import { useAuth } from '../AuthContext.jsx';

// | react-icons
import { GiHamburgerMenu } from 'react-icons/gi';
import { GrClose } from 'react-icons/gr';
import ImageComponent from './ImageComponent';
import { NavLink } from 'react-router';

// & Navbar Component
const NavbarComponent = () => {
  const { isAuthenticated, user, logout, loading } = useAuth();

  // @ Open Mobile Menu Declare Variable With State
  const [openMobileMenu, setOpenMobileMenu] = useState(false);

  // @ User Dropdown Menu State
  const [openUserDropdown, setOpenUserDropdown] = useState(false);

  // $ Close Mobile Menu On Select Route
  const closeMenu = () => {
    setOpenMobileMenu(false);
  };

  // $ Close User Dropdown when clicking outside
  const handleClickOutside = (e) => {
    if (!e.target.closest('.user-dropdown')) {
      setOpenUserDropdown(false);
    }
  };

  React.useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  // ^ Render Navbar Component
  return (
    <div className='w-full h-16 md:h-20 flex items-center justify-between'>
      {/* LOGO */}
      <NavLink
        to='/'
        className='flex items-center gap-4 cursor-pointer text-2xl font-bold'
      >
        <ImageComponent
          className='w-12 h-12 rounded-full'
          src='/Logo.png'
          alt='Logo'
        />
        <span>StacoPost</span>
      </NavLink>

      {/* MOBILE MENU */}
      <div className='lg:hidden'>
        {/* OPEN CLOSE MENU BUTTON */}
        <div
          className='cursor-pointer text-3xl'
          onClick={() => setOpenMobileMenu(!openMobileMenu)}
        >
          {openMobileMenu ? <GrClose /> : <GiHamburgerMenu />}
        </div>

        {/* MOBILE MENU LIST */}
        <div
          className={`w-full h-screen flex justify-center items-center flex-col bg-[#e6e6ff] absolute top-16 text-lg font-medium gap-8 teansition-all duration-500 ease-in-out z-10 ${
            openMobileMenu ? '-right-0' : '-right-[100%]'
          }`}
        >
          <NavLink to='/' onClick={closeMenu}>
            Home
          </NavLink>
          <NavLink to='/write' className='block md:hidden relative p-3 z-1'>
            Write Your New Blog
          </NavLink>
          <NavLink to='/' onClick={closeMenu}>
            Trending
          </NavLink>
          <NavLink to='/' onClick={closeMenu}>
            Most Popular
          </NavLink>
          <NavLink to='/about' onClick={closeMenu}>
            About
          </NavLink>
          <NavLink to='/contact' onClick={closeMenu}>
            Contact Us
          </NavLink>
          {loading ? (
            <div className='flex items-center gap-2'>
              <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600'></div>
              <span className='text-sm text-gray-600'>Loading...</span>
            </div>
          ) : isAuthenticated ? (
            <button
              onClick={handleLogout}
              className='py-2 px-4 bg-red-600 text-white rounded-md hover:bg-red-700 transition-all duration-300 ease-in-out'
            >
              Logout
            </button>
          ) : (
            <NavLink to='/login' onClick={closeMenu}>
              <button className='py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-300 ease-in-out'>
                Login
              </button>
            </NavLink>
          )}
        </div>
      </div>

      {/* DESKTOP MENU */}
      <div className='hidden lg:flex items-center gap-6 lg:gap-8 2xl:gap-12 text-base font-medium'>
        <NavLink to='/'>Home</NavLink>
        <NavLink to='/posts?sort=trending'>Trending</NavLink>
        <NavLink to='/posts?sort=mostpopular'>Most Popular</NavLink>
        <NavLink to='/about'>About</NavLink>
        <NavLink to='/contact'>Contact Us</NavLink>

        {loading ? (
          <div className='flex items-center gap-2'>
            <div className='animate-spin rounded-full h-6 w-6 border-b-2 border-amber-600'></div>
            <span className='text-sm text-gray-600'>Loading...</span>
          </div>
        ) : isAuthenticated ? (
          <div className='flex items-center gap-4 mr-3'>
            <div className='relative user-dropdown'>
              <div
                className='flex flex-col items-center gap-2 cursor-pointer'
                onClick={() => setOpenUserDropdown(!openUserDropdown)}
              >
                <ImageComponent
                  src={user?.profileImage}
                  alt='User'
                  className='h-8 w-8 rounded-full hover:opacity-80'
                  width='18'
                  height='18'
                />
                <span className='capitalize text-sm text-teal-800 hover:text-teal-600'>
                  {user?.username || user?.email}
                </span>
              </div>

              {/* User Dropdown Menu */}
              {openUserDropdown && (
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-200'>
                  <NavLink
                    to='/profile'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setOpenUserDropdown(false)}
                  >
                    Profile
                  </NavLink>
                  <NavLink
                    to='/savedposts'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    onClick={() => setOpenUserDropdown(false)}
                  >
                    Saved Posts
                  </NavLink>
                  {user?.role === 'admin' && (
                    <NavLink
                      to='/admin'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                      onClick={() => setOpenUserDropdown(false)}
                    >
                      Admin Dashboard
                    </NavLink>
                  )}
                  <div className='border-t border-gray-100'></div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setOpenUserDropdown(false);
                    }}
                    className='block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100'
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <NavLink to='/login'>
            <button className='py-2 px-4 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-all duration-300 ease-in-out'>
              Login
            </button>
          </NavLink>
        )}
      </div>
    </div>
  );
};

export default NavbarComponent;
