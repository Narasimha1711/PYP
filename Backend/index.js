const express = require('express')
const app = express();
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/dbConnection');
const errorMiddleware = require('./middleware/errorMiddleware');
const PORT = process.env.PORT;
const cookieParser = require('cookie-parser');
const cors = require('cors')
const session = require('express-session');
const passport = require('passport');
const PypRoutes = require("./routes/pypRoutes");
const gradeRoutes = require('./routes/gradeRoutes.js')
const TimeTableRoutes = require("./routes/timeTableRoutes.js");
const UserTimeTableRoutes = require("./routes/userTimeTableRoutes.js");
const uploadRoutes = require("./routes/upload");
const AuthRoutes = require("./routes/auth.js");
require('./config/passport'); // Add this line to load the Google strategy

connectDB();

app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
    })
  );
  
  app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    })
  );
  
app.use(passport.initialize());
app.use(passport.session());
app.use(express.json());
app.use(errorMiddleware);
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());





app.use("/auth", AuthRoutes);
// app.use("/auth", AuthRoutes);

// app.use("/auth", AuthRoutes);
// app.use("/auth", AuthRoutes);
app.use("/pyp", PypRoutes);

app.use("/tt", TimeTableRoutes);
app.use("/utt", UserTimeTableRoutes);

app.get("/", (req, res)=>{
    res.send("Welcome to the Backend");
});

app.use("/grade", gradeRoutes);





app.use("/api", uploadRoutes); 

app.listen(PORT, () => {
    console.log(`Server is listening on PORT ${PORT}`);
})