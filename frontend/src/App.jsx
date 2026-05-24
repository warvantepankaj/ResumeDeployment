import { createBrowserRouter, Outlet } from "react-router-dom";

import Home from "./builder/pages/Home.jsx";
import Dashboard from "./builder/pages/Dashboard.jsx";
import ResumeScorer from "./score/pages/ResumeScorer";
import Navbar from "./builder/pages/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.jsx";
import ResumeBuilderPage from "./builder/pages/ResumeBuilderPage.jsx";
import toast ,{ Toaster } from "react-hot-toast";

const Layout = () => {
  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />
      <Navbar />
      <Outlet />
    </>
  );
};

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },

      {
        path: "/resume-builder/:id",
        element: (
          <ProtectedRoute>
            <ResumeBuilderPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "/dashboard",
        element: (
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "/score",
        element: (
          <ProtectedRoute>
            <ResumeScorer />
          </ProtectedRoute>
        ),
      },
    ],
  },
]);
