//setup route for auth routes
import { Router } from "express";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
//create an instance
const router = Router();

//create an end point - like url to a page
router.get("/signup", (req, res) => {
  res.status(200);
  res.render("signup", { title: "sign Up", error: undefined });
});

//handle route for post request (form submission)
router.post("/signup", async (req, res) => {
  //process registration process
  const { username, password, gender, email, phonenumber, location } = req.body;

  //implement validation for the provided values;
  const isValidForm = true;

  //check if username or password exits on db
  const exitingUser = await User.findOne({
    $or: [{ username: username }, { email: email }],
  });

  if (exitingUser) {
    return res.status(403).render("signup", {
      title: "sign Up",
      error: "username or email is already taken",
    });
  }

  //hash user password
  const hashedPwd = await bcrypt.hash(password, 10);

  //create new user
  await User.create({ username, email, location, gender, password: hashedPwd });

  //if all things are good redirect
  res.redirect("/auth/login");
});

//set up implementation for login post and get
router.get("/login", (req, res) => {
  res.status(200);
  res.render("login", { title: "login", error: undefined });
});

//implement login submission
router.post("/login", async (req, res) => {
  //retrieve submitted data
  const { email, password } = req.body;

  //check if user name exist
  const existingUser = await User.findOne({ email });

  if (!existingUser) {
    return res.status(403).render("login", {
      title: "login",
      error: "Invalid login credential, Try again",
    });
  }

  //check if password matches hash on db
  const isPasswordValid = await bcrypt.compare(password, existingUser.password);
  if (!isPasswordValid) {
    return res.status(403).render("login", {
      title: "login",
      error: "Invalid login credential, Try again",
    });
  }

  //on successful verification
  const token = jwt.sign(
    { userId: existingUser._id.toString() },
    process.env.APP_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, { secure: false, httpOnly: true });
  res.redirect("/");
});

export default router;
