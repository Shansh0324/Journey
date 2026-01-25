const express = require('express'); 
const app = express();
app.use(express.json());

const notes = []
app.get('/', (req, res) => {  
    console.log("Hello World");
    res.send("Hello World");
 })

 app.post("/notes",(req, res) => {
    notes.push(req.body);
    res.status(201).json({
        message : "Note added Succesfully",
    })
 })

 app.get("/notes", (req, res) => {
    // res.send(notes);
    res.status(200).json({
        notes : notes,
    })
 })

 app.delete("/notes/:id", (req, res) =>{
    delete notes[req.params.id];
    res.status(200).json({
        message : "Note deleted Succesfully",
    })
 })

 app.patch("/notes/:id", (req, res) => {
    notes[req.params.id].description = req.body.description;
    res.status(200).json({
        message : "Note updated Succesfully",
    })
 })
module.exports = app;