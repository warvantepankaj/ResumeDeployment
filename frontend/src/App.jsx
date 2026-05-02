import { createBrowserRouter, Outlet } from "react-router-dom";

// Pages
import Home from "./builder/app/Home.jsx";
import Dashboard from "./builder/app/Dashboard";
import ResumeBuilder from "./builder/components/ResumeBuilder/ResumeBuilder";
import ResumeScorer from "./score/pages/ResumeScorer";
import Navbar from "./builder/app/Navbar.jsx";

const Layout = () => {
  return (
    <>
      <Navbar />   {/* ✅ visible on ALL pages */}
      <Outlet />   {/* pages render here */}
    </>
  );
};

// ✅ Define routes here
export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/resume-builder/:id", element: <ResumeBuilder /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/score", element: <ResumeScorer /> }
    ]
  }
]);