import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import { ToastContainer } from "react-toastify";
import WorkerDashboard from "./pages/WorkerDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import { ToastProvider, ToastViewport } from "./components/ui/toast";
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
      <ToastProvider>
        <RouterProvider router={router} />
        <ToastContainer />
        <ToastViewport className="fixed top-4 right-4 z-50" />
      </ToastProvider>
    </>
  );
};

export default App;
