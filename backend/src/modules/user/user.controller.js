import { User } from "./user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const userExits = await User.findOne({ email });
    if (userExits) {
      return res.status(400).json({ message: "User already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res
      .status(201)
      .json({ message: "User created successfully", user: newUser });
  } catch (error) {
    const status = 400;
    const message = "Something went wrong during registration";
    next({ status, message });
  }
};

const loginUser = async (req, res, next) => {
  try {
    // Check if already logged in

    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      const status = 400;
      const message = "Invalid email ";
      next({ status, message });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const status = 400;
      const message = "Invalid  password";
      next({ status, message });
    }

    const token = generateToken(user._id, user.name);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({ message: "Login successful", user });
  } catch (error) {
    const status = 400;
    const message = "Something went wrong during login";
    next({ status, message });
  }
};

const logoutUser = async (req, res, next) => {
  try {
    res.cookie("token")
 
    const status = 200;
    const message = "Logout successful";
    res.status(status).json({ status, message });
  } catch (error) {
    const status = 400;
    const message = "Something went wrong during logout";
    next({ status, message });
  }
};

const testApi = async (req, res) => {
  res.json({ message: "Test Api is working" });
};

export { createUser, testApi, loginUser,logoutUser };
