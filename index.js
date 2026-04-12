
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());



// DATASET
let students = [];

// GET all students - once na gusto nimo sya makita sa local host u just add /students sa url
app.get("/students", (req, res) => {
  res.status(200).json(students);
});

// GET student by ID once na gusto nimo sya pangitaon sa local host u just add /students/1 or 2 or 3 depende sa id sa student nga gusto nimo makita
app.get("/students/:id", (req, res) => {
  const student = students.find(s => s.id == req.params.id);

  if (!student) {
    return res.status(404).json({ message: "Student not found" });
  }

  res.status(200).json(student);
});

// ADD student - once na gusto nimo sya idugang sa local host u just add /students sa url then i input nimo ang name, course, year sa body sa postman
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

// UPDATE student - once na gusto nimo sya iupdate sa local host u just add /students/1 or 2 or 3 depende sa id sa student nga gusto nimo iupdate then i input nimo ang name, course, year sa body sa postman
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


// SERVER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});