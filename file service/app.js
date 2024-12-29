const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Department constants
const DEPARTMENT = {
  ADMINISTRATION: "ADMINISTRATION",
  EDUCATION: "EDUCATION",
  FINANCE: "FINANCE",
};

// multer configuration
const upload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + "-" + file.originalname);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Handle file upload
app.post("/api/upload", upload.single("file"), async (req, res) => {
  try {
    const { personId, studentId, documentType, fileDescription } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).send("Please upload a file");
    }
    const fileSubmission = await prisma.fileSubmission.create({
      data: {
        personId: parseInt(personId),
        studentId: parseInt(studentId),
        documentType,
        fileName: file.filename,
        fileDescription,
        fileSize: file.size.toString(),
        fileFormat: file.mimetype,
      },
    });
    res.status(201).send({
      message: "File uploaded successfully",
      fileSubmission,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server error");
  }
});

// Get files by department
app.get("/api/files/:department", async (req, res) => {
  const department = req.params.department;
  try {
    const worker_department = DEPARTMENT[department];

    if (!worker_department) {
      res.status(401).send({
        message: "Sorry, there is no department with this name",
      });
      return;
    }

    let department_files = null;

    if (worker_department === "ADMINISTRATION") {
      department_files = await prisma.fileSubmission.findMany({
        where: {
          [worker_department]: "PENDING", // dynamically applied
        },
      });
    } else if (worker_department === "EDUCATION") {
      department_files = await prisma.fileSubmission.findMany({
        where: {
          ADMINISTRATION: "APPROVED",
          EDUCATION: "PENDING",
        },
      });
    } else if (worker_department === "FINANCE") {
      department_files = await prisma.fileSubmission.findMany({
        where: {
          ADMINISTRATION: "APPROVED",
          EDUCATION: "APPROVED",
          FINANCE: "PENDING",
        },
      });
    }

    res.status(200).send({
      message: `${worker_department}'s files`,
      files: department_files,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "There was an error...",
    });
  }
});

// Update file status
app.patch("/api/file", async (req, res) => {
  const { department, fileId, status } = req.body;

  const DEPARTMENT = {
    ADMINISTRATION: "ADMINISTRATION",
    EDUCATION: "EDUCATION",
    FINANCE: "FINANCE",
  };

  const VALID_STATUSES = ["PENDING", "APPROVED", "REJECTED"]; // Enum values

  const CURRENT_DEPARTMENT = DEPARTMENT[department];
  if (!CURRENT_DEPARTMENT) {
    return res.status(400).send({
      message: `Invalid department: ${department}`,
    });
  }

  if (!VALID_STATUSES.includes(status)) {
    return res.status(400).send({
      message: `Invalid status: ${status}. Expected one of ${VALID_STATUSES.join(
        ", "
      )}.`,
    });
  }

  if (!fileId || isNaN(parseInt(fileId))) {
    return res.status(400).send({
      message: `Invalid fileId: ${fileId}`,
    });
  }

  try {
    const file = await prisma.fileSubmission.findUnique({
      where: { id: parseInt(fileId) },
    });

    if (!file) {
      return res.status(404).send({
        message: "File not found.",
      });
    }

    const updateFile = await prisma.fileSubmission.update({
      where: { id: parseInt(fileId) },
      data: { [CURRENT_DEPARTMENT]: status },
    });

    return res.status(200).send({
      message: `File status for department '${CURRENT_DEPARTMENT}' updated to '${status}'.`,
      file: updateFile,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({
      message: "There was an error processing your request.",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port : " + process.env.PORT);
});
