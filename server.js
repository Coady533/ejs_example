//import all the dependecies
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
dotenv.config();

//creat app instance
const app = express();
const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI;

//import custom router
import authrouter from "./routes/auth.route.js";

//configure __dirname
import { fileURLToPath } from "url";
import { title } from "process";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//import dummy post data
import posts from "./data/postData.js";
import connectDB from "./utilities/connectDB.js";

//setup default middle ware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//import auth middle ware
import checkAuth from "./middleware/auth.middleware.js";

//configure static file
app.use(express.static(path.join(__dirname, "public")));

//configure template engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//setup basic route for testing
app.get("/", checkAuth, (req, res) => {
  const data = {
    title: "Home Page - EJS",
    username: req.user.username,
    email: req.user.email,
    location: req.user.location,
    income: "12000",
    isLoggedIn: req.authentication,
    users: ["musa", "john", "steven"],
    posts,
  };
  res.render("index", data);
});

//set up about page
app.get("/about", checkAuth, (req, res) => {
  res.render("about", { isLoggedIn: req.authentication, title: "About us" });
});

//use routers on app instance
app.use("/auth", authrouter);
//
app.get("/healthcheck", (req, res) => {
  res.status(200).json({ message: "Server is running successfully" });
});

//implement logout for get and post that delete the cookie from the user and redirect them to the login page

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

//connect DB and also listen to the server
connectDB(MONGO_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`The server is running on http://localhost:${PORT} ✔✔🐱‍🚀`);
  });
});
