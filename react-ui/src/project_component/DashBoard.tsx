import { useState } from "react";
import { Calendar } from "../components/ui/calendar";
import StudentFileTable from "./StudentFileTable";

const DashBoard = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  return (
    <div className="flex-1 flex flex-col gap-4">
      <div className="flex gap-2">
        <div className="flex-1 bg-red-200 rounded-sm"></div>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border w-fit"
        />
      </div>
      <StudentFileTable />
    </div>
  );
};

export default DashBoard;
