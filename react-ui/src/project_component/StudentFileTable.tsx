import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { Button } from "../components/ui/button";
import { MoreHorizontal, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { useAuthStore } from "../store/authStore";
import axios from "axios";

type fileType = {
  id: number;
  studentId: number;
  ADMINISTRATION: string;
  EDUCATION: string;
  FINANCE: string;
  comments: null | string;
  documentType: string;
  fileDescription: string;
  fileFormat: string;
  fileName: string;
  fileSize: string;
  submissionDate: string;
};

const isFileTypeKey = (key: string): key is keyof fileType => {
  return ["ADMINISTRATION", "EDUCATION", "FINANCE"].includes(key);
};

const DocumentStatusTable = ({ data }: { data: fileType }) => {
  const [file, setFile] = useState(data);
  const workerDepartment =
    useAuthStore((state) => state.user?.roleDetails.department) ||
    "ADMINISTRATION";
  const currentStatus = file[workerDepartment as keyof fileType];
  const handleAccept = async () => {
    try {
      const URL = "http://localhost:3060/api/work";
      if (isFileTypeKey(workerDepartment)) {
        await axios.post(URL, {
          workerDepartment: workerDepartment,
          fileId: file.id,
          action: "APPROVED",
        });
        const newFile = { ...file, [workerDepartment]: "APPROVED" };
        setFile(newFile);
        console.log(newFile);
        toast.success("File has been accepted");
      } else {
        toast.error("Invalid department");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async () => {
    try {
      const URL = "http://localhost:3060/api/work";
      if (isFileTypeKey(workerDepartment)) {
        await axios.post(URL, {
          workerDepartment: workerDepartment,
          fileId: file.id,
          action: "REJECTED",
        });
        const newFile = { ...file, [workerDepartment]: "REJECTED" };
        setFile(newFile);
        console.log(newFile);
        toast.error("File has been rejected");
      } else {
        toast.error("Invalid department");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="w-full">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Document Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>
              <span className="font-medium">{file.studentId}</span>
            </TableCell>
            <TableCell>
              <span
                className={`inline-flex items-center 
                  px-2.5 py-0.5 rounded-full text-xs font-medium 
                  ${
                    currentStatus == "PENDING" &&
                    "bg-yellow-100 text-yellow-800"
                  }
                  ${
                    currentStatus == "APPROVED" && "bg-green-100 text-green-800"
                  }
                  ${currentStatus == "REJECTED" && "bg-red-100 text-red-800"}
                  `}
              >
                {currentStatus}
              </span>
            </TableCell>
            <TableCell>{file.documentType}</TableCell>
            <TableCell>{file.fileDescription}</TableCell>
            <TableCell className="max-w-xs truncate" title={file.fileName}>
              {file.fileName}
            </TableCell>
            <TableCell>
              {new Date(file.submissionDate).toLocaleDateString()}
            </TableCell>
            <TableCell className="text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={handleAccept}
                    className="text-green-600"
                  >
                    <Check className="mr-2 h-4 w-4" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleReject}
                    className="text-red-600"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="details">
          <AccordionTrigger>View All Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex justify-between flex-wrap gap-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Student ID
                  </p>
                  <p>{file.studentId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Administration
                  </p>
                  <p>{file.ADMINISTRATION}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Education</p>
                  <p>{file.EDUCATION}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Finance</p>
                  <p>{file.FINANCE}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p>{file.comments || "No comments"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    File Format
                  </p>
                  <p>{file.fileFormat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">File Size</p>
                  <p>
                    {Math.round((Number(file.fileSize) / 1024 / 1024) * 100) /
                      100}{" "}
                    MB
                  </p>
                </div>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default DocumentStatusTable;
