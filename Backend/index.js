const express = require('express')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');

const PORT = process.env.PORT;

connectDB();
app.use(express.json());



const AuthRoutes = require("./routes/auth.js");
const PypRoutes = require("./routes/pypRoutes");

app.get("/signin",AuthRoutes);
app.get("/signup",AuthRoutes);
app.post("/signin",AuthRoutes);
app.post("/signup",AuthRoutes);
app.get("/pyp",PypRoutes);

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})