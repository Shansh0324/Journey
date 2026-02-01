import { useEffect, useState } from "react";
import axios from "axios";
import "./index.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios
      .get(`${import.meta.env.VITE_BASE_URL}/api/notes`)
      .then((response) => {
        setNotes(response.data.notes); // IMPORTANT
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load notes");
      });
  }, []);

  return (
    <div className="notes">
      {/* <h1>Notes</h1> */}

      {error && <p style={{ color: "red" }}>{error}</p>}

      {notes.map((note, index) => (
        <div className="note" key={index}>
          <h3>{note.title}</h3>
          <p>{note.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
