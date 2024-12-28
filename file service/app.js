const { PrismaClient } = require("@prisma/client");
const express = require("express");
const multer = require("multer");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());

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
    res.status(500).send("Server error");
  }
});

/**
 * @swagger
 * /api/files:
 *   get:
 *     summary: Get all files for a specific department
 *     description: Retrieves all file submissions for a given department.
 *     parameters:
 *       - in: query
 *         name: department
 *         required: true
 *         schema:
 *           type: string
 *         description: The department name (ADMINISTRATION, EDUCATION, FINANCE).
 *     responses:
 *       200:
 *         description: Successfully retrieved the files.
 *       401:
 *         description: Department not found.
 *       500:
 *         description: Internal server error.
 */
app.get("/api/files", async (req, res) => {
  const department = req.query.department;
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

/**
 * @swagger
 * /api/file:
 *   patch:
 *     summary: Update file status
 *     description: Updates the status of a file submission for a specific department.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               department:
 *                 type: string
 *               fileId:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [ACCEPTED, REJECTED]
 *     responses:
 *       200:
 *         description: File status updated successfully
 *       401:
 *         description: Invalid department or status
 *       500:
 *         description: Internal server error
 */
app.patch("/api/file", async (req, res) => {
  const { department, fileId, status } = req.body;
  const VALID_STATUSES = ["ACCEPTED", "REJECTED"];
  const CURRENT_DEPARTMENT = DEPARTMENT[department];
  try {
    if (!CURRENT_DEPARTMENT) {
      res
        .status(401)
        .send({ message: "There is no department with this name..." });
      return;
    }

    if (!VALID_STATUSES.includes(status)) {
      res.status(401).send({ message: "Invalid status type..." });
      return;
    }

    const file = await prisma.fileSubmission.findUnique({
      where: {
        id: parseInt(fileId),
      },
    });

    if (!file) {
      res.status(401).send({ message: "File not found..." });
      return;
    }

    const updateFile = await prisma.fileSubmission.update({
      where: { id: parseInt(fileId) },
      data: { [CURRENT_DEPARTMENT]: status },
    });
    res.status(200).send({
      message: `File status for department ${CURRENT_DEPARTMENT} is ${status}`,
      file: updateFile,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      message: "There was an error...",
    });
  }
});

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Management API",
      version: "1.0.0",
      description:
        "API for managing file submissions and statuses by different departments",
    },
    servers: [
      {
        url: "http://localhost:3060",
      },
    ],
  },
  apis: ["./app.js"], // Path to the API doc comments
};

// Serve Swagger documentation
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Listening on port 3060
app.listen(process.env.PORT, () => {
  console.log("Server running on port : " + process.env.PORT);
  console.log("Swagger Docs available at http://localhost:3030/api-docs");
});
