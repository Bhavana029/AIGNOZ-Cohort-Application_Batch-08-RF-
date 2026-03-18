const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");


// ========================
// REGISTER USER
// ========================

exports.register = async (req, res) => {

  try {

    const {
      fullName,
      email,
      password,
      age,
      gender,
      bmi,
      existingDiabetes,
      familyHistory
    } = req.body;


    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        message: "User already exists"
      });
    }


    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);


    // Create new user
    const user = new User({
      fullName,
      email,
      password: hashedPassword,
      age,
      gender,
      bmi,
      existingDiabetes,
      familyHistory
    });


    await user.save();


    res.status(201).json({
      message: "Account created successfully"
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Registration failed"
    });

  }

};



// ========================
// LOGIN USER
// ========================

exports.login = async (req, res) => {

  try {

    const { email, password } = req.body;


    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "User not found"
      });
    }


    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid password"
      });
    }


    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );


    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        bmi: user.bmi,
        existingDiabetes: user.existingDiabetes,
        familyHistory: user.familyHistory
      }
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Login failed"
    });

  }

};


