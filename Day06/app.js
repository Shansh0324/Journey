const express = require('express');
const app = express(); //server created 

app.listen(3000); //server listening on port 3000

app.get('/', (req, res) => {
    res.send('Hello World from Express.js'); //response sent to client
});