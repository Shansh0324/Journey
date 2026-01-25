const express = require("express");

const app = express();
app.use(express.json());
const notes = [
    // {
    //     "id" : 1,
    //     "content" : "HTML is easy",
    //     "important" : true
    // }
]

app.get("/notes", (req, res) => {
    res.send(notes)
})

app.post("/notes",(req, res) => {
    console.log(req.body)
    notes.push(req.body);
    res.send("Notes created successfully")
     console.log(notes)
})

app.delete("/notes/:index" ,(req, res) => {
    const index  = req.params.index;
    // console.log(index)
    delete notes[index];
    res.send("Notes deleted successfully")
})

app.patch("/notes/:index", (req, res) => {
    const index  = req.params.index;
    notes[index].description = req.body.description;
    res.send("Notes updated successfully");
})

module.exports = app;