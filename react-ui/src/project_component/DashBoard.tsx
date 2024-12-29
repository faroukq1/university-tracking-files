import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import StudentFileTable from "./StudentFileTable";
import WorkerDetails from "./WorkerDetails";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import axios from "axios";
import { useEffect } from "react";

type FileType = {
  ADMINISTRATION: "PENDING";
  EDUCATION: "PENDING";
  FINANCE: "PENDING";
  comments: string | null;
  documentType: "passport" | string;
  fileDescription: string;
  fileFormat: string;
  fileName: string;
  fileSize: string;
  id: number;
  personId: number;
  studentId: number;
  submissionDate: string;
};

const DashBoard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [studentsFiles, setStudentsFiles] = useState<FileType[] | null>(null);
  const user = useAuthStore((state) => state.user);
  const department = user?.roleDetails?.department;
  const URL = `http://localhost:3030/api/files/${department}`;
  const fetchDashboardData = async () => {
    try {
      const response = await axios(URL);
      const data = response.data.files;
      setStudentsFiles(data);
    } catch (error) {
      toast.error("There was an error fetching the data");
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex gap-2">
        <WorkerDetails />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-sm border w-fit"
        />
      </div>
      <div className="px-3 max-h-[50vh] overflow-auto shadow-md border rounded-sm">
        {studentsFiles?.map((file: any) => (
          <StudentFileTable data={file} key={file.id} />
        ))}
      </div>
    </div>
  );
};

export default DashBoard;
