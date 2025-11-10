const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../models/User");

// ----------------------------
// Config
// ----------------------------
const JWT_SECRET = process.env.CLIENT_SECRET_KEY || "CLIENT_SECRET_KEY";
const JWT_EXPIRES = process.env.JWT_EXPIRES || "7d";
const IS_PROD = process.env.NODE_ENV === "production";

// ----------------------------
// Utils
// ----------------------------
const createToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      email: user.email,
      username: user.userName, // include username in JWT
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES }
  );
};

// ----------------------------
// Register
// ----------------------------
const registerUser = async (req, res) => {
  try {
    const { userName, email, password } = req.body;
    if (!userName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists with this email. Please login.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = new User({ userName, email, password: hashedPassword });
    await newUser.save();

    console.log("Register User Response:", {
      id: newUser._id,
      username: newUser.userName,
      email: newUser.email,
      role: newUser.role,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successful",
      user: {
        id: newUser._id,
        username: newUser.userName,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error("Register Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Login
// ----------------------------
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ success: false, message: "Incorrect password" });

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: IS_PROD,
      sameSite: IS_PROD ? "none" : "lax",
      path: "/",
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });

    console.log("Login User Response:", {
      id: user._id,
      username: user.userName,
      email: user.email,
      role: user.role,
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};

// ----------------------------
// Check Auth
// ----------------------------
const checkAuth = async (req, res) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.id).select("userName email role");
    console.log("CheckAuth JWT Decoded:", decoded);
    console.log("CheckAuth User Object:", user);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    return res.json({
      success: true,
      user: {
        id: user._id,
        username: user.userName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("CheckAuth Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

// ----------------------------
// Logout
// ----------------------------
const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: IS_PROD,
    sameSite: IS_PROD ? "none" : "lax",
    path: "/",
  }).status(200).json({ success: true, message: "Logged out successfully" });
};

// ----------------------------
// Auth Middleware
// ----------------------------
const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ success: false, message: "Unauthorized" });

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  checkAuth,
  authMiddleware,
};
