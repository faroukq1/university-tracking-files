const { default: axios } = require("axios");
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

const URL = "http://localhost:3030/api/file";

const DEPARTMENT = {
  ADMINISTRATION: "ADMINISTRATION",
  EDUCATION: "EDUCATION",
  FINANCE: "FINANCE",
};

const VALID_ACTIONS = ["APPROVED", "REJECTED"];

// Swagger options
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "File Management API",
      version: "1.0.0",
      description:
        "API for managing file status (Accepted/Rejected) by workers",
    },
    servers: [
      {
        url: `http://localhost:${process.env.PORT || 3060}`,
      },
    ],
  },
  apis: ["./app.js"],
};

// Setup Swagger
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/work:
 *   post:
 *     summary: Update file status by workers
 *     description: Allows workers to update file status (Accepted/Rejected) based on the department.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               workerDepartment:
 *                 type: string
 *                 description: The department of the worker (ADMINISTRATION, EDUCATION, FINANCE).
 *                 example: "ADMINISTRATION"
 *               fileId:
 *                 type: integer
 *                 description: The ID of the file to update.
 *                 example: 123
 *               action:
 *                 type: string
 *                 description: The action to take (ACCEPTED or REJECTED).
 *                 example: "ACCEPTED"
 *     responses:
 *       200:
 *         description: File status updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File status updated successfully."
 *                 file:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 123
 *                     status:
 *                       type: string
 *                       example: "ACCEPTED"
 *       401:
 *         description: Invalid request or department/file not found.
 *       500:
 *         description: Internal server error.
 */
app.post("/api/work", async (req, res) => {
  const { workerDepartment, fileId, action } = req.body;
  const URL = "http://localhost:3030/api/file";
  try {
    const CURRENT_DEPARTMENT = DEPARTMENT[workerDepartment];
    if (!CURRENT_DEPARTMENT) {
      return res.status(401).send({
        message: "There is no department with this name...",
      });
    }

    if (!VALID_ACTIONS.includes(action)) {
      return res.status(401).send({
        message: "Invalid action...",
      });
    }

    const response = await axios.patch(URL, {
      department: CURRENT_DEPARTMENT,
      fileId,
      status: action,
    });

    res.status(200).send({
      message: response.data.message,
      file: response.data.file,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({
      message: "There was an error processing your request.",
      error: error.message,
    });
  }
});

app.listen(process.env.PORT, () => {
  console.log("Server running on port: " + process.env.PORT);
});
