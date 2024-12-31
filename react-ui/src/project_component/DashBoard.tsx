import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import StudentFileTable from "./StudentFileTable";
import WorkerDetails from "./WorkerDetails";
import { useAuthStore, useFileStore } from "../store/authStore";
import axios from "axios";
import { useEffect } from "react";

const DashBoard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [studentFiles, setStudentFiles] = useState([]);
  const user = useAuthStore((state) => state.user);
  const addfiles = useFileStore((state) => state.addFiles);

  useEffect(() => {
    const fetchStudentFiles = async () => {
      try {
        const ADMINISTRATION_FILES = "http://localhost:3060/api/files";
        const FINANCE_FILES = "http://localhost:3354/api/files";
        const department = user?.roleDetails.department;
        const response = await axios.get(
          department == "ADMINISTRATION" ? ADMINISTRATION_FILES : FINANCE_FILES
        );
        const data = response.data.data;
        setStudentFiles(data);
        addfiles(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStudentFiles();
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
        {studentFiles.map((submission: any, index: number) => {
          return <StudentFileTable submission={submission} key={index} />;
        })}
      </div>
    </div>
  );
};

export default DashBoard;
