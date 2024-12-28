const { default: axios } = require("axios");
const express = require("express");
require("dotenv").config();
const app = express();
app.use(express.json());

const URL = "";
const DEPARTMENT = {
  ADMINISTRATION: "ADMINISTRATION",
  EDUCATION: "EDUCATION",
  FINANCE: "FINANCE",
};

const VALID_ACTIONS = ["ACCEPTED", "REJECTED"];
app.post("/api/work", async (req, res) => {
  const { workerDepartment, fileId, action } = req.body;
  try {
    const CURRENT_DEPARTMENT = DEPARTMENT[workerDepartment];
    if (!CURRENT_DEPARTMENT) {
      res.status(401).send({
        message: "There is not department with this name...",
      });
      return;
    }
    if (!VALID_ACTIONS.includes(action)) {
      res.status(401).send({
        message: "Invalid action...",
      });
      return;
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
  } catch (erorr) {
    console.log(erorr);
    res.status(500).send({
      message: "There was en error...",
    });
  }
});
app.listen(process.env.PORT, () => {
  console.log("server running on port : " + process.env.PORT);
});
