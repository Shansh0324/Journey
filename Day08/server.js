const express = require("express")
const app = express()
app.listen(3000, () => {
    console.log("Server is running on port 3000")
})

app.use(express.json())

const notes = []
app.post("/notes", (req, res) => {
    notes.push(req.body);
    res.send("Note created successfully");
})

app.get("/notes", (req, res) => {
    res.send(notes);
})