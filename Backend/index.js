const express = require('express')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');

const PORT = process.env.PORT;

connectDB();
app.use(express.json());




app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})