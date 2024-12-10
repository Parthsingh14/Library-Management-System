const express = require("express");
const app = express();
const userRouter = require('./routes/user.routes')
const connecttoDb = require('./config/mongoose')
connecttoDb();
const dotenv = require('dotenv');
dotenv.config();
const session = require('express-session');

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

// Routes
app.use(session({
    secret: 'secret_key',
    resave: false,
    saveUninitialized: true,
}))
app.use("/", userRouter);

app.listen(process.env.PORT, () => console.log(`Server running on http://localhost:${process.env.PORT}`));
