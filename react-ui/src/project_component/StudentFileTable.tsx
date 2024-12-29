import React from "react";
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

interface DocumentStatusProps {
  studentId: string;
}

const DocumentStatusTable = () => {
  const data = {
    studentId: 10,
    ADMINISTRATION: "PENDING",
    EDUCATION: "PENDING",
    FINANCE: "PENDING",
    comments: null,
    documentType: "passport",
    fileDescription: "Student ID Document",
    fileFormat: "application/pdf",
    fileName: "1735332079640-Chapitre2-SOA-Klai.pdf",
    fileSize: "2044802",
    submissionDate: "2024-12-27T20:41:19.673Z",
  };

  const handleAccept = () => {
    toast.success("File has been accepted");
  };

  const handleReject = () => {
    toast.error("File has been regected");
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
              <span className="font-medium">{data.studentId}</span>
            </TableCell>
            <TableCell>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                {data.ADMINISTRATION}
              </span>
            </TableCell>
            <TableCell>{data.documentType}</TableCell>
            <TableCell>{data.fileDescription}</TableCell>
            <TableCell className="max-w-xs truncate" title={data.fileName}>
              {data.fileName}
            </TableCell>
            <TableCell>
              {new Date(data.submissionDate).toLocaleDateString()}
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
                  <p>{data.studentId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Administration
                  </p>
                  <p>{data.ADMINISTRATION}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Education</p>
                  <p>{data.EDUCATION}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Finance</p>
                  <p>{data.FINANCE}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Comments</p>
                  <p>{data.comments || "No comments"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    File Format
                  </p>
                  <p>{data.fileFormat}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">File Size</p>
                  <p>
                    {Math.round((Number(data.fileSize) / 1024 / 1024) * 100) /
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
