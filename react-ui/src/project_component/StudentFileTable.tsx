import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../components/ui/table";
import { Button } from "../components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "../components/ui/dropdown-menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../components/ui/accordion";
import { MoreVertical, Check, X } from "lucide-react";
import { useAuthStore, useFileIdStore } from "../store/authStore";
import axios from "axios";
import { toast } from "react-toastify";

interface Submission {
  adminPictureUrl: string;
  adminStatus: string;
  createdAt: string;
  description: string;
  financePictureUrl: string;
  financeStatus: string;
  id: number;
  name: string;
  personId: number;
  studentId: number;
  updatedAt: string;
}

interface SubmissionTableProps {
  submission: Submission;
}

const SubmissionTable: React.FC<SubmissionTableProps> = ({ submission }) => {
  const department = useAuthStore(
    (state) => state.user?.roleDetails.department
  );
  let enableStatus = false;
  if (department === "ADMINISTRATION") {
    enableStatus = submission.adminStatus == "ACCEPTED" ? true : false;
  } else {
    enableStatus = submission.financeStatus == "ACCEPTED" ? true : false;
  }
  const handleStatusChange = async (id: number, status: string) => {
    let URL = "";
    if (department == "ADMINISTRATION") {
      URL = "http://localhost:3060/api/status";
    } else {
      URL = "http://localhost:3354/api/status";
    }
    try {
      await axios.patch(URL, {
        fileId: id,
        workerAction: status,
      });

      if (status == "ACCEPTED") {
        toast.success("File has been accepted");
      } else {
        toast.error("File has been regected");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setFileId = useFileIdStore((state) => state.setFileId);
  const handleFileId = () => {
    setFileId(submission.id);
  };
  return (
    <div className="w-full" onClick={handleFileId}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Administration</TableHead>
            <TableHead>Finance</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>{submission.studentId}</TableCell>
            <TableCell>{submission.name}</TableCell>
            <TableCell>{submission.description}</TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  submission.adminStatus === "ACCEPTED"
                    ? "bg-green-100 text-green-800"
                    : submission.adminStatus === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {submission.adminStatus}
              </span>
            </TableCell>
            <TableCell>
              <span
                className={`px-2 py-1 rounded-full text-sm ${
                  submission.financeStatus === "ACCEPTED"
                    ? "bg-green-100 text-green-800"
                    : submission.financeStatus === "REJECTED"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {submission.financeStatus}
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    disabled={enableStatus}
                    onClick={() =>
                      handleStatusChange(submission.id, "ACCEPTED")
                    }
                  >
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    disabled={enableStatus}
                    onClick={() =>
                      handleStatusChange(submission.id, "REJECTED")
                    }
                  >
                    <X className="mr-2 h-4 w-4 text-red-600" />
                    Reject
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      <Accordion type="single" collapsible className="mt-4">
        <AccordionItem value={`details-${submission.id}`}>
          <AccordionTrigger>Additional Details</AccordionTrigger>
          <AccordionContent>
            <div className="space-y-2">
              <p>
                <strong>Person ID:</strong> {submission.personId}
              </p>
              <p>
                <strong>Created At:</strong>{" "}
                {new Date(submission.createdAt).toLocaleString()}
              </p>
              <p>
                <strong>Updated At:</strong>{" "}
                {new Date(submission.updatedAt).toLocaleString()}
              </p>
              <p>
                <strong>Administration Picture:</strong>{" "}
                {submission.adminPictureUrl}
              </p>
              <p>
                <strong>Finance Picture:</strong> {submission.financePictureUrl}
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default SubmissionTable;
