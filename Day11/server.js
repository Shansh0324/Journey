const app = require('./src/app');
const mongoose = require('mongoose');

function connectToDatabase() {
    mongoose.connect("mongodb+srv://contactrahulkr1_db_user:Shashank%40231b307@cluster-0.ichkstr.mongodb.net/day-11").then(() => {
        console.log("Connected to database");
    })
}

connectToDatabase();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});