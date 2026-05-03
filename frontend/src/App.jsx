import { createBrowserRouter, Outlet } from "react-router-dom";

import Home from "./builder/pages/Home.jsx";
import Dashboard from "./builder/pages/Dashboard.jsx";
import ResumeScorer from "./score/pages/ResumeScorer";
import Navbar from "./builder/pages/Navbar.jsx";
import ProtectedRoute from "./ProtectedRoutes/ProtectedRoute.jsx";
import ResumeBuilderPage from "./builder/pages/ResumeBuilderPage.jsx";

const Layout = () => {
  return (
    <>
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
            <ResumeBuilderPage/>
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