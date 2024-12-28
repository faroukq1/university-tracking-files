const { PrismaClient } = require("@prisma/client");
const express = require("express");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const port = process.env.PORT;
require("dotenv").config();

const app = express();
const prisma = new PrismaClient();
app.use(express.json());

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

// Authentication API
/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: User login
 *     description: Authenticates a user based on email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "user@example.com"
 *               password:
 *                 type: string
 *                 example: "securepassword"
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
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *                     firstName:
 *                       type: string
 *                     lastName:
 *                       type: string
 *                     roleDetails:
 *                       type: object
 *                       properties:
 *                         role:
 *                           type: string
 *                         studentId:
 *                           type: integer
 *                         workerId:
 *                           type: integer
 *                         department:
 *                           type: string
 *       401:
 *         description: Invalid email or password
 *       500:
 *         description: Server error
 */
app.get("/api/auth", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await prisma.person.findUnique({
      where: { email },
    });
    const not_valid = !user || user.password != password;
    if (not_valid) {
      return res.status(401).send({
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
      };
    } else if (role === "WORKER") {
      const worker = await prisma.worker.findUnique({
        where: { personId: user.id },
      });
      roleDetails = {
        workerId: worker?.id,
        role: "WORKER",
        department: worker?.department,
      };
    }

    res.status(200).send({
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
    console.log(error);
    res.status(500).send({
      message: "There is something went wrong...",
    });
  }
});

// Start the server
app.listen(port || 3000, () => {
  console.log("server running on port : " + (port || 3000));
  console.log(`Swagger Docs available at http://localhost:${port}/api-docs`);
});
