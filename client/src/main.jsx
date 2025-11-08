import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.jsx';

// In your main entry file or component file

import 'react-quill-new/dist/quill.snow.css';
import './reactQuill.scss'; // Import your custom font styles

import { createBrowserRouter, RouterProvider } from 'react-router';
import HomePage from './Pages/HomePage.jsx';
import AllPostsPage from './Pages/AllPostsPage.jsx';
import WritePage from './Pages/WritePage.jsx';
import LoginPage from './Pages/LoginPage.jsx';
import SinglePostPage from './Pages/SinglePostPage.jsx';
import RegisterPage from './Pages/RegisterPage.jsx';
import SavedPostsPage from './Pages/SavedPostsPage.jsx';
import ProfilePage from './Pages/ProfilePage.jsx';
import AdminPage from './Pages/AdminPage.jsx';
import MainLayout from './LayOuts/MainLayout.jsx';
import AboutPage from './Pages/AboutPage.jsx';
import ContactPage from './Pages/ContactPage.jsx';
import AuthSuccessPage from './Pages/AuthSuccessPage.jsx';

// | Toastify For Message
import { ToastContainer } from 'react-toastify';

// | Import Auth Context
import { AuthProvider } from './AuthContext.jsx';

// ` Configure Tanstack Query
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// ` Configure Router
const router = createBrowserRouter([
  {
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/posts',
        element: <AllPostsPage />,
      },
      {
        path: '/posts/:slug',
        element: <SinglePostPage />,
      },

      {
        path: '/write',
        element: <WritePage />,
      },
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '/contact',
        element: <ContactPage />,
      },
      {
        path: '/login',
        element: <LoginPage />,
      },
      {
        path: '/register',
        element: <RegisterPage />,
      },
      {
        path: '/savedposts',
        element: <SavedPostsPage />,
      },
      {
        path: '/profile',
        element: <ProfilePage />,
      },
      {
        path: '/admin',
        element: <AdminPage />,
      },
      {
        path: '/auth/success',
        element: <AuthSuccessPage />,
      },
    ],
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ToastContainer position='bottom-right' />
      </QueryClientProvider>
    </AuthProvider>
  </StrictMode>
);
