const API = "http://localhost:3000/students";


// LOAD STUDENTS
function loadStudents() {
  fetch(API)
    .then(res => res.json())
    .then(data => displayStudents(data));
}


// DISPLAY
function displayStudents(data) {
  let html = "";

  if (data.length === 0) {
    html = `
      <div class="card">
         No students found
      </div>
    `;
  } else {
    data.forEach(s => {
      html += `
        <div class="card">
          <b>${s.name}</b><br>
          Course: ${s.course}<br>
          Year: ${s.year}<br>

          <button onclick="deleteStudent(${s.id})">Delete</button>
          <button onclick="editStudent(${s.id}, '${s.name}', '${s.course}', ${s.year})">Edit</button>
        </div>
      `;
    });
  }

  document.getElementById("list").innerHTML = html;
}


// ADD STUDENT
function addStudent() {
  fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: document.getElementById("name").value,
      course: document.getElementById("course").value,
      year: document.getElementById("year").value
    })
  })
  .then(res => res.json())
  .then(() => loadStudents());
}


// DELETE
function deleteStudent(id) {
  fetch(`${API}/${id}`, {
    method: "DELETE"
  })
  .then(() => loadStudents());
}


// EDIT (PUT)
function editStudent(id, name, course, year) {
  const newName = prompt("New name:", name);
  const newCourse = prompt("New course:", course);
  const newYear = prompt("New year:", year);

  fetch(`${API}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newName,
      course: newCourse,
      year: newYear
    })
  })
  .then(() => loadStudents());
}


// SEARCH
function searchStudent() {
  const name = document.getElementById("searchInput").value;

  fetch(`http://localhost:3000/search?name=${name}`)
    .then(res => res.json())
    .then(data => displayStudents(data));
}