const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const port = process.env.PORT;
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Authentication API",
      version: "1.0.0",
      description: "API documentation for the authentication system",
    },
    servers: [
      {
        url: `http://localhost:${port}`,
      },
    ],
  },
  apis: ["./app.js"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

// Serve Swagger UI
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: User login
 *     description: Authenticates a user based on email and password
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: securepassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       example: 1
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     firstName:
 *                       type: string
 *                       example: John
 *                     lastName:
 *                       type: string
 *                       example: Doe
 *                     roleDetails:
 *                       type: object
 *                       properties:
 *                         role:
 *                           type: string
 *                           enum: [STUDENT, WORKER]
 *                           example: STUDENT
 *                         studentId:
 *                           type: integer
 *                           example: 123
 *                         workerId:
 *                           type: integer
 *                           example: null
 *                         department:
 *                           type: string
 *                           example: null
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid email or password
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: There is something went wrong...
 */
app.use("/api/auth", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await prisma.person.findUnique({
      where: {
        email: email,
      },
    });

    if (!user || user.password !== password) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    let roleDetails = {};
    const { role } = user;

    if (role === "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { personId: user.id },
      });
      roleDetails = {
        role: "STUDENT",
        studentId: student?.id,
        workerId: null,
        department: null,
      };
    } else if (role === "WORKER") {
      const worker = await prisma.worker.findUnique({
        where: { personId: user.id },
      });
      roleDetails = {
        role: "WORKER",
        studentId: null,
        workerId: worker?.id,
        department: worker?.department,
      };
    }

    // Send successful response
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleDetails,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "There is something went wrong...",
    });
  }
});

// Start the server
app.listen(port || 3000, () => {
  console.log("Server running on port: " + (port || 3000));
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
