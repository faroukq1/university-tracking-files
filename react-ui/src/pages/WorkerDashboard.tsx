import DashBoard from "../project_component/DashBoard";
import DisplayPdf from "../project_component/DisplayPdf";
import { toast } from "react-toastify";
import useAuthStore from "../store/authStore";
import axios from "axios";
import { useEffect } from "react";

const WorkerDashboard = () => {
  const user = useAuthStore((state) => state.user);
  const department = user?.roleDetails?.department;
  const URL = `http://localhost:3030/api/files/${department}`;
  const fetchDashboardData = async () => {
    try {
      const response = await axios(URL);
      console.log(response.data.files);
    } catch (error) {
      if (typeof console !== "undefined" && console.error) {
        console.error(error);
      }
      toast.error("There was an error fetching the data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  const pdfUrl = "https://www.orimi.com/pdf-test.pdf";
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <DisplayPdf initialPdfUrl={pdfUrl} />
      </div>
      <DashBoard />
    </div>
  );
};

export default WorkerDashboard;
