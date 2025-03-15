const express = require('express')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const errorMiddleware = require('./middleware/errorMiddleware');
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');

connectDB();
app.use(express.json());
app.use(errorMiddleware);
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());


const AuthRoutes = require("./routes/auth.js");
// const PypRoutes = require("./routes/pypRoutes");

app.use("/auth", AuthRoutes);
app.use("/auth", AuthRoutes);

app.use("/auth", AuthRoutes);
app.use("/auth", AuthRoutes);
// app.get("/pyp", PypRoutes);

app.get("/", (req, res)=>{
    res.send("Welcome to the Backend");
});


const uploadRoutes = require("./routes/upload");

app.use(express.json());
app.use("/api", uploadRoutes); 

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})