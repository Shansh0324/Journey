import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [editDescriptions, setEditDescriptions] = useState({});

  // Fetch all notes
  async function fetchNotes() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/notes`
      );
      setNotes(response.data.notes);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch notes");
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);

  // Create note
  async function handleSubmit(e) {
    e.preventDefault();

    const { title, description } = e.target.elements;

    try {
      await axios.post(`${import.meta.env.VITE_BASE_URL}/api/notes`, {
        title: title.value,
        description: description.value,
      });

      title.value = "";
      description.value = "";

      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to create note");
    }
  }

  // Delete note
  async function handleDelete(noteId) {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/notes/${noteId}`
      );
      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to delete note");
    }
  }

  // Handle edit input change
  function handleEditChange(noteId, value) {
    setEditDescriptions((prev) => ({
      ...prev,
      [noteId]: value,
    }));
  }

  // Update description
  async function onUpdateDescription(noteId) {
    const newDescription = editDescriptions[noteId];
    if (!newDescription) return;

    try {
      await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/api/notes/${noteId}`,
        { description: newDescription }
      );

      // Clear input after update
      setEditDescriptions((prev) => ({
        ...prev,
        [noteId]: "",
      }));

      fetchNotes();
    } catch (err) {
      console.error(err);
      setError("Failed to update note");
    }
  }

  return (
    <div className="notes">
      {/* Create Note */}
      <form className="note-create-form" onSubmit={handleSubmit}>
        <input name="title" type="text" placeholder="Enter Title" required />
        <input
          name="description"
          type="text"
          placeholder="Enter Description"
          required
        />
        <button>Create note</button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Notes List */}
      {notes.map((note) => (
        <div className="note" key={note._id}>
          <h3>{note.title}</h3>
          <p>{note.description}</p>

          <button onClick={() => handleDelete(note._id)}>Delete</button>

          {/* Update section */}
          <div style={{ marginTop: "8px" }}>
            <input
              type="text"
              placeholder="Update description"
              value={editDescriptions[note._id] || ""}
              onChange={(e) =>
                handleEditChange(note._id, e.target.value)
              }
            />
            <button onClick={() => onUpdateDescription(note._id)}>
              Update
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default App;
