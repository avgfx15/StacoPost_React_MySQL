import React from 'react';

// | Import Components
import NavbarComponent from '../Components/NavbarComponent';

// | Import Dependency
import { Outlet } from 'react-router';

// & Main Layout Component
const MainLayout = () => {
  // ^ Render Main Layout
  return (
    <div className='px-4 md:px-8 lg:px-12 xl:px-28 2xl:px-52'>
      <NavbarComponent />
      <Outlet />
    </div>
  );
};

// ~ Main Layout Export
export default MainLayout;
