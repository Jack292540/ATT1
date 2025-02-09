const express = require("express");
const fs = require("fs");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const FILE_PATH = "students.txt";

// 读取学生数据
app.get("/students", (req, res) => {
  if (!fs.existsSync(FILE_PATH)) return res.json([]);
  const data = fs.readFileSync(FILE_PATH, "utf-8");
  res.json(data ? JSON.parse(data) : []);
});

// 保存学生数据
app.post("/students", (req, res) => {
  const { students } = req.body;
  fs.writeFileSync(FILE_PATH, JSON.stringify(students, null, 2));
  res.json({ success: true });
});

app.listen(5000, () => console.log("Server running on port 5000"));
