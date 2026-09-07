const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

const notesFile = path.join(__dirname, "notes.json");

app.get("/notes", (req, res) => {
fs.readFile(notesFile, "utf8", (err, data) => {
if (err) {
return res.status(500).json({ error: "Could not read notes" });
}

const notes = data ? JSON.parse(data) : [];
res.json(notes);
  });
});

app.post("/notes", (req, res) => {
const { title, content } = req.body;

if (!title || !content) {
return res.status(400).json({
error: "Title and content are required"
});
}

fs.readFile(notesFile, "utf8", (err, data) => {
const notes = err || !data ? [] : JSON.parse(data);

const newNote = {
id: Date.now(),
title,
content
};

notes.push(newNote);

fs.writeFile(
notesFile,
JSON.stringify(notes, null, 2),
(writeErr) => {
if (writeErr) {
return res.status(500).json({
error: "Could not save note"
});
}

res.status(201).json(newNote);
}
);
});
});

app.delete("/notes/:id", (req, res) => {
fs.readFile(notesFile, "utf8", (err, data) => {
if (err) {
return res.status(500).json({
error: "Could not read notes"
});
}

let notes = data ? JSON.parse(data) : [];
const id = Number(req.params.id);

notes = notes.filter(note => note.id !== id);

fs.writeFile(
notesFile,
JSON.stringify(notes, null, 2),
(writeErr) => {
if (writeErr) {
return res.status(500).json({
error: "Could not delete note"
});
}

res.json({
message: "Note deleted successfully"
});
}
);
});
});

app.listen(PORT, () => {
console.log(`Server running at http://localhost:${PORT}`);
});
