import bcryptjs from "bcryptjs";
import User from "../models/user.models.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // console.log(req.body, "req body");
    const hashedPassword = bcryptjs.hashSync(password, 10);

    const exisitingUser = await User.findOne({ email });

    if (exisitingUser) {
      return res
        .status(400)
        .json({ success: false, message: "User already exists!" });
    }

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const { password: pass, ...rest } = newUser._doc;

    return res.status(201).json({
      success: true,
      data: rest,
      message: "User Created Successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const signin = async (req, res) => {
  // console.log(req.body, "user");
  try {
    const { email, password } = req.body;

    const validUser = await User.findOne({ email });
    if (!validUser)
      return res
        .status(401)
        .json({ success: false, message: "User Not Found!" });

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword)
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials!" });

    const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET);
    const {
      password: pass,
      _id: id,
      createdAt: created,
      updatedAt: updated,
      ...rest
    } = validUser._doc;
    res.cookie("access_token", token, { httpOnly: true }).status(200).json({
      success: true,
      user: rest,
      message: "User Logged in Successfully!",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const signout = async (req, res) => {
  try {
    const user = req.user;
    res
      .clearCookie("access_token")
      .status(200)
      .json({ success: true, message: "User Logged out Successfully!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const profile = async (req, res) => {
  try {
    const user = req.user;
    const userDetails = await User.findById(user.id);
    // console.log(userDetails, "userDetails");
    const {
      password: pass,
      createdAt: created,
      updatedAt: updated,
      ...rest
    } = userDetails._doc;
    res.status(200).json({ success: true, user: rest });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
