import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User";

export const signup = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      res.status(400).json({
        message:
          existingUser.email === email
            ? "This email is registered already"
            : "This username exists already",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "24h",
      }
    );

    const { password: _, ...userObj } = newUser.toObject();

    res.status(201).json({
      message: "User registered successfully",
      user: userObj,
      token: token,
    });
  } catch (err) {
    console.error(`Error registering user: ${err}`);
    res.status(500).json({ message: "Internal server error." });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (!user) {
      res.status(404).json({ message: "Invalid Email" });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid Password" });
      return;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, {
      expiresIn: "24h",
    });

    const { password: _, ...userObj } = user.toObject();

    res.status(200).json({ message: "Login successful", user: userObj, token });
  } catch (err) {
    console.error(`Error login user: ${err}`);
    res.status(500).json({ message: "Internal error" });
  }
};
