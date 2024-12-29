import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import WorkerDashboard from "./pages/WorkerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { ToastProvider, ToastViewport } from "./components/ui/toast";
import Layout from "./project_component/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        path: "/worker/dashboard",
        element: <WorkerDashboard />,
      },
      {
        path: "/student/dashboard",
        element: <StudentDashboard />,
      },
    ],
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
]);
const App = () => {
  return (
    <>
      <ToastProvider>
        <RouterProvider router={router} />
        <ToastContainer />
        <ToastViewport className="fixed top-4 right-4 z-50" />
      </ToastProvider>
    </>
  );
};

export default App;
