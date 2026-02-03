const noteModel = require('./models/note.model');
const path = require('path');
const express = require('express');
const cors =  require('cors');
const app =  express();

app.use(cors());
app.use(express.json());
app.use(express.static("./public"));
/**
 * - POST/api/notes
 * Create new note and save data in mongodb
 * -req.body = {title, description}
 */


app.post('/api/notes', async(req, res) => {
    //Destructuring req.body
    const {title, description} = req.body;

    const note = await noteModel.create({title, description});

    res.status(201).json({
        message : "Note created successfully",
        note : note
    })
})

/**
 * -GET api/notes
 * -Fetch all notes from mongodb and send to response
 */

app.get("/api/notes", async(req, res) => {
    const notes =  await noteModel.find();
    res.status(200).json({
        message : "Notes fetched successfully",
        notes : notes
    })
})

/**
 * - Delete /api/notes/:id
 * - Delete mote from the database based on the id passed in the request params
 */

app.delete("/api/notes/:id", async(req, res) => {
    const {id} = req.params;
    const deleteNote = await noteModel.findByIdAndDelete(id);

    res.status(200).json({
        message : "Note deleted successfully",
        note : deleteNote
    })
})


/**
 * -PATCH /api/notes/:id
 * - Update the description of the note based on the id passed in the request params
 */

app.patch("/api/notes/:id", async(req, res) => {
    const id = req.params.id;
    const {description} = req.body;

    const updatedNote = await noteModel.findByIdAndUpdate(id, {description}, {new : true});

    res.status(200).json({
        messsage : "Note updated successfully",
        note : updatedNote
    })
})



app.use('*name', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '/public/index.html'));
});

module.exports = app;