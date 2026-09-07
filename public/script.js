async function loadNotes() {
try {
const response = await fetch("/notes");

if (!response.ok) {
throw new Error("Could not load notes");
}

const notes = await response.json();

const notesContainer = document.getElementById("notes");
notesContainer.innerHTML = "";

notes.forEach(note => {
const noteDiv = document.createElement("div");
noteDiv.className = "note";
noteDiv.innerHTML = `
<h3>${note.title}</h3>
<p>${note.content}</p>
<button onclick="deleteNote(${note.id})">Delete</button>
`;

notesContainer.appendChild(noteDiv);
});

} catch (error) {
console.error("Load error:", error);
}
}

async function addNote() {
const titleInput = document.getElementById("title");
const contentInput = document.getElementById("content");

const title = titleInput.value.trim();
const content = contentInput.value.trim();

if (!title || !content) {
alert("Please enter title and content");
return;
}

try {
const response = await fetch("/notes", {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
title: title,
content: content
})
});

const result = await response.json();

if (!response.ok) {
console.error("Server error:", result);
alert(result.error || "Failed to add note");
return;
}

titleInput.value = "";
contentInput.value = "";

await loadNotes();

} catch (error) {
console.error("Connection error:", error);
alert("Server connection error");
}
}

async function deleteNote(id) {
try {
const response = await fetch(`/notes/${id}`, {
method: "DELETE"
});

if (!response.ok) {
throw new Error("Delete failed");
}

loadNotes();

} catch (error) {
console.error("Delete error:", error);
}
}

loadNotes();