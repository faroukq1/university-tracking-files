const { PrismaClient } = require("@prisma/client");
const express = require("express");
const multer = require("multer");
const app = express();
const prisma = new PrismaClient();
require("dotenv").config();
app.use(express.json());

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

// handle file upload
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
    res.status(500).send("server error");
  }
});

app.get("/api/get-files/:department", async (req, res) => {
  const DEPARTMENT = {
    ADMINISTRATION: "ADMINISTRATION",
    EDUCATION: "EDUCATION",
    FINANCE: "FINANCE",
  };
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

    // Dynamically build where clause
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

// listening
app.listen(process.env.PORT, () => {
  console.log("server running on port : " + process.env.PORT);
});
