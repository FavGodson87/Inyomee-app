import userModel from "../models/userModal.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// LOGIN FUNCTION
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User doesn't Exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid Credentials" });
    }

    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ← Crucial for iPhone
      sameSite: "none", // ← Crucial for iPhone
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      success: true,
      token,
      userId: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      rewardProgress: user.rewardProgress,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// CREATE A TOKEN
const createToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// REGISTER
const registerUser = async (req, res) => {
  const { username, name, password, email } = req.body;

  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "User Already Exists" });
    }

    // VALIDATION
    if (!validator.isEmail(email)) {
      res.json({ success: false, message: "Please Enter a Valid Email" });
    }

    if (password.length < 8) {
      return res.json({
        success: false,
        message: "Please Enter a Strong Password",
      });
    }

    if (!name || !username) {
      return res.json({
        success: false,
        message: "Name and Username are required",
      });
    }

    // IF EVERYTHING WORKS
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    // NEW USER
    const newUser = new userModel({
      username: username,
      name: name,
      email: email,
      password: hashedpassword,
    });

    const user = await newUser.save();

    // CREATE TOKEN
    const token = createToken(user);

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // ← Crucial for iPhone
      sameSite: "none", // ← Crucial for iPhone
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({
      success: true,
      token,
      userId: user._id,
      email: user.email,
      name: user.name,
      username: user.username,
      rewardProgress: user.rewardProgress,
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

const validateToken = async (req, res) => {
  try {
    // If middleware passed, token is valid
    res.json({
      success: true,
      user: {
        _id: req.user.id,
        email: req.user.email,
      },
    });
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// GET REWARDS (for logged-in users)
const getRewards = async (req, res) => {
  try {
    const user = await userModel
      .findById(req.user._id)
      .select("rewardProgress");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ rewardProgress: user.rewardProgress });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

export { loginUser, registerUser, getRewards, validateToken };
