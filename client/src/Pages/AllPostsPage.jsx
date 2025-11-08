import React, { useState } from 'react';

import SideMenu from '../Components/SideMenu';

import RecentPostsComponent from '../Components/RecentPostsComponent';

const AllPostsPage = () => {
  const [openSideMenu, setOpenSideMenu] = useState(false);
  return (
    <div className=''>
      <h1 className='mb-5 text-2xl'>AllPostsPage</h1>
      <button
        className='mb-5 py-2 px-3 bg-sky-800 text-white rounded-md hover:bg-sky-950 transition-all duration-300 ease-in-out md:hidden'
        onClick={() => setOpenSideMenu(!openSideMenu)}
      >
        {openSideMenu ? 'Close' : 'Open'}
      </button>
      <div className='flex flex-col-reverse md:flex-row gap-5'>
        <div className='flex flex-col gap-4 lg:text-lg text-justify w-9/12'>
          <RecentPostsComponent />
        </div>
        <div className={`${openSideMenu ? 'block' : 'hidden'} md:block`}>
          <SideMenu />
        </div>
      </div>
    </div>
  );
};

export default AllPostsPage;
