
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// =====================
// DATASET
// =====================
let students = [
  { id: 1, name: "Monkey D. Luffy", course: "BSIT", year: 2 },
  { id: 2, name: "Roronoa Zoro", course: "BSBA", year: 1 },
  { id: 3, name: "Vinsmoke Sanji", course: "BSCS", year: 3 },
  { id: 4, name: "Uzumaki Naruto", course: "BSIT", year: 4 },
  { id: 5, name: "Uchiha Sasuke", course: "BSCS", year: 2 }
];

// =====================
// BASIC ENDPOINTS
// =====================

// GET all students
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// GET student by ID
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

// ADD student
app.post("/students", (req, res) => {
  const { name, course, year } = req.body;

  if (!name || !course || !year) {
    return res.status(400).json({ message: "Missing fields" });
  }

  const newStudent = {
    id: students.length + 1,
    name,
    course,
    year
  };

  students.push(newStudent);

  res.status(201).json(newStudent);
});

// UPDATE student
app.put("/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  const { name, course, year } = req.body;

  if (!name || !course || !year) {
    return res.status(400).json({ message: "Missing fields" });
  }

  student.name = name;
  student.course = course;
  student.year = year;

  res.status(200).json(student);
});

// DELETE student
app.delete("/students/:id", (req, res) => {
  const index = students.findIndex(s => s.id == req.params.id);

  if (index === -1) {
    return res.status(404).json({ message: "Student not found" });
  }

  students.splice(index, 1);

  res.status(200).json({ message: "Student deleted successfully" });
});

// =====================
// FILTER / SEARCH
// =====================

// Filter by course
app.get("/students/course/:course", (req, res) => {
  const result = students.filter(
    s => s.course.toLowerCase() === req.params.course.toLowerCase()
  );

  res.status(200).json(result);
});

// Filter by year
app.get("/students/year/:year", (req, res) => {
  const result = students.filter(
    s => s.year == req.params.year
  );

  res.status(200).json(result);
});

// Search by name
app.get("/search", (req, res) => {
  const name = req.query.name?.toLowerCase();

  const result = students.filter(s =>
    s.name.toLowerCase().includes(name)
  );

  res.status(200).json(result);
});

// =====================
// EXTRA FEATURES
// =====================

// Count students
app.get("/count", (req, res) => {
  res.status(200).json({
    totalStudents: students.length
  });
});

// Random student
app.get("/random", (req, res) => {
  const random = students[Math.floor(Math.random() * students.length)];
  res.status(200).json(random);
});

// =====================
// SERVER
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});