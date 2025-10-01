import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

const checkAuth = async function authMiddleware(req, res, next) {
  try {
    const token = req.cookies?.token;
    console.log(token);
    if (!token) {
      return res.render("login", { error: undefined, title: "login" });
    }

    // Verify and decode the JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.APP_SECRET);
      console.log(decoded);
    } catch (err) {
      return res.render("login", { error: undefined });
    }

    // Find user by decoded id (assuming JWT payload contains user id)
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.render("login", { error: undefined });
    }

    // Exclude password field
    const { password, ...userWithoutPassword } = user.toObject();
    console.log(user);

    req.authentication = true;
    req.user = user;

    next();
  } catch (err) {
    return res.render("login", { error: undefined });
  }
};

export default checkAuth;
