import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import WorkerDashboard from "./pages/WorkerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthPage />,
  },
  {
    path: "/worker/dashboard",
    element: <WorkerDashboard />,
  },
  {
    path: "/student/dashboard",
    element: <StudentDashboard />,
  },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
};

export default App;
