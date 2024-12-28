const { PrismaClient } = require("@prisma/client");
const express = require("express");
const app = express();
require("dotenv").config();

// Prisma instance
const prisma = new PrismaClient();

app.use(express.json());
app.get("/api/auth", async (req, res) => {
  const { email: user_email, password } = req.body;
  try {
    const user = await prisma.person.findUnique({
      where: { email: user_email },
    });
    const not_valid = !user || user.password != password;
    if (not_valid) {
      res.status(401).send({
        message: "Invalid email or password",
      });
    }

    let roleDetails = {};
    const { role } = user;
    if (role == "STUDENT") {
      const student = await prisma.student.findUnique({
        where: { personId: user.id },
      });

      roleDetails = {
        role: "STUDENT",
        studentId: student?.id,
      };
    } else if (role == "WORKER") {
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
app.listen(process.env.PORT || 3000, () => {
  console.log("server running on port : " + process.env.PORT || 3000);
});
