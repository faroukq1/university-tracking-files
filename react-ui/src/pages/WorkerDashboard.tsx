import DashBoard from "../project_component/DashBoard";
import DisplayPdf from "../project_component/DisplayPdf";
import { useFileIdStore, useFileStore } from "../store/authStore";
const WorkerDashboard = () => {
  const fileId = useFileIdStore((state) => state.fileId);
  const files = useFileStore((state) => state.files);
  const current_file = files.filter((file) => file.id == fileId);
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        {current_file.length ? (
          <div className="w-full">
            <img
              src={`http://localhost:3060/${current_file[0].financePictureUrl}`}
              alt="administration picture"
            />
            <img
              src={`http://localhost:3060/${current_file[0].adminPictureUrl}`}
              alt="administration picture"
            />
          </div>
        ) : (
          <DisplayPdf initialPdfUrl={""} />
        )}
      </div>
      <DashBoard />
    </div>
  );
};

export default WorkerDashboard;
