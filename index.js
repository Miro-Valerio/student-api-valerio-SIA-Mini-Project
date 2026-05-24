const express = require("express");
const cors    = require("cors");
const app = express();
app.use(cors());
app.use(express.json());


// ================================================
// SUPABASE CLIENT
// ================================================
const supabase = require("./supabase");


// ================================================
// HELPER — convert Supabase row (snake_case)
//          to frontend shape (camelCase)
// ================================================
function toFrontend(row) {
    return {
        id:        row.id,
        text:      row.text,
        category:  row.category  || "work",
        priority:  row.priority  || "medium",
        status:    row.status    || "todo",
        assignTo:  row.assign_to || "",
        startDate: row.start_date ? row.start_date.slice(0, 10) : "",
        deadline:  row.deadline   ? row.deadline.slice(0, 10)   : "",
        remarks:   row.remarks   || "",
        subtasks:  row.subtasks  || [],
        completed: row.completed || false,
        createdAt: row.created_at,
    };
}

// ================================================
// HELPER — convert frontend body (camelCase)
//          to Supabase columns (snake_case)
// ================================================
function toSupabase(body) {
    const row = {};
    if (body.text      !== undefined) row.text       = body.text;
    if (body.category  !== undefined) row.category   = body.category;
    if (body.priority  !== undefined) row.priority   = body.priority;
    if (body.status    !== undefined) row.status     = body.status;
    if (body.assignTo  !== undefined) row.assign_to  = body.assignTo;
    if (body.startDate !== undefined) row.start_date = body.startDate || null;
    if (body.deadline  !== undefined) row.deadline   = body.deadline  || null;
    if (body.remarks   !== undefined) row.remarks    = body.remarks;
    if (body.subtasks  !== undefined) row.subtasks   = body.subtasks;
    if (body.completed !== undefined) row.completed  = body.completed;
    return row;
}


// ================================================
// HOME
// ================================================
app.get("/", (req, res) => {
    res.json({ message: "Taskr API is running with Supabase!" });
});


// ================================================
// GET all tasks
// ================================================
app.get("/tasks", async (req, res) => {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ message: error.message });
    res.json(data.map(toFrontend));
});


// ================================================
// GET one task
// ================================================
app.get("/tasks/:id", async (req, res) => {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("id", req.params.id)
        .single();

    if (error) return res.status(404).json({ message: "Task not found" });
    res.json(toFrontend(data));
});


// ================================================
// POST — create new task
// ================================================
app.post("/tasks", async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Task name (text) is required" });

    const row = toSupabase(req.body);

    const { data, error } = await supabase
        .from("tasks")
        .insert([row])
        .select()
        .single();

    if (error) return res.status(500).json({ message: error.message });
    res.status(201).json(toFrontend(data));
});


// ================================================
// PUT — update existing task
// ================================================
app.put("/tasks/:id", async (req, res) => {
    const row = toSupabase(req.body);

    const { data, error } = await supabase
        .from("tasks")
        .update(row)
        .eq("id", req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json(toFrontend(data));
});


// ================================================
// DELETE — remove a task
// ================================================
app.delete("/tasks/:id", async (req, res) => {
    const { data, error } = await supabase
        .from("tasks")
        .delete()
        .eq("id", req.params.id)
        .select()
        .single();

    if (error) return res.status(500).json({ message: error.message });
    res.json({ message: "Task deleted", task: toFrontend(data) });
});


// ================================================
// GET — summary/stats
// ================================================
app.get("/summary", async (req, res) => {
    const { data, error } = await supabase
        .from("tasks")
        .select("*");

    if (error) return res.status(500).json({ message: error.message });

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const total     = data.length;
    const completed = data.filter(t => t.completed).length;
    const pending   = data.filter(t => !t.completed).length;
    const overdue   = data.filter(t => {
        if (!t.deadline || t.completed) return false;
        return new Date(t.deadline) < today;
    }).length;

    res.json({ total, completed, pending, overdue });
});


// ================================================
// SERVER
// ================================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Taskr server running on port ${PORT} — connected to Supabase`);
});