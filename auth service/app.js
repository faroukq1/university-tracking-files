const { PrismaClient } = require("@prisma/client");
const express = require("express");
const cors = require("cors");
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

app.post("/api/auth", async (req, res) => {
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

app.listen(port || 3000, () => {
  console.log("Server running on port: " + (port || 3000));
});
