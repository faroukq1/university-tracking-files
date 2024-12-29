import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import StudentFileTable from "./StudentFileTable";
import WorkerDetails from "./WorkerDetails";

const DashBoard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex gap-2">
        <WorkerDetails />
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-fit"
        />
      </div>
      <div className="max-h-[50vh] overflow-auto">
        <StudentFileTable />
      </div>
    </div>
  );
};

export default DashBoard;
