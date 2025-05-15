require('dotenv').config();
const bcryptjs = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const signup = async (req, res) => {
  try {
    const {
      rollNo,
      name,
      gmail,
      password,
      mobileNumber,
      languages,
      skills,
      projectsAchievements,
      interestedSubjects,
      is_private,
    } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    const existingEmail = await User.findOne({ gmail });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create new user
    const newUser = new User({
      rollNo,
      name,
      gmail,
      password: hashedPassword,
      mobileNumber,
      languages,
      skills,
      projectsAchievements,
      interestedSubjects,
      is_private,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, rollNo: newUser.rollNo }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.status(201).json({ message: 'User registered successfully', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error signing up', error });
  }
};

const signin = async (req, res) => {
  const { rollNo, password } = req.body;

  try {
    const existingUser = await User.findOne({ rollNo });
    if (!existingUser) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    if (!existingUser.password) {
      return res.status(400).json({ message: 'Please use Google Sign-In for this account' });
    }

    const isPasswordCorrect = await bcryptjs.compare(password, existingUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: existingUser._id, rollNo: existingUser.rollNo }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.status(200).json({ message: 'User signed in successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Error signing in', error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Strict',
    });
    res.status(200).json({ message: 'User signed out successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error signing out', error });
  }
};

// Google OAuth routes
const googleAuth = passport.authenticate('google', {
  scope: ['profile', 'email'],
});

const googleAuthCallback = (req, res, next) => {
  passport.authenticate('google', { failureRedirect: '/signin' }, (err, user, info) => {
    if (err) {
      console.error('Google auth error:', err);
      return res.redirect('http://localhost:5173/signin?error=google_auth_failed');
    }
    if (!user && info && info.needsRollNo) {
      console.log('New user, redirecting to complete signup:', info);
      const tempToken = jwt.sign(
        { googleId: info.googleId, gmail: info.gmail, name: info.name },
        process.env.SECRET_KEY,
        { expiresIn: '10m' }
      );
      return res.redirect(`http://localhost:5173/complete-signup?tempToken=${tempToken}`);
    }
    if (!user) {
      console.error('No user returned, info:', info);
      return res.redirect('http://localhost:5173/signin?error=google_auth_failed');
    }

    console.log('User authenticated:', user);
    const token = jwt.sign({ userId: user._id, rollNo: user.rollNo }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.redirect('http://localhost:5173/pyp');
  })(req, res, next);
};

// New endpoint to complete Google signup with rollNo
const completeGoogleSignup = async (req, res) => {
  try {
    const { rollNo, tempToken } = req.body;

    // Verify temporary token
    const decoded = jwt.verify(tempToken, process.env.SECRET_KEY);
    const { gmail, name } = decoded;

    // Check if rollNo is taken
    const existingUser = await User.findOne({ rollNo });
    if (existingUser) {
      return res.status(400).json({ message: 'Roll number already exists' });
    }

    // Create user
    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcryptjs.hash(randomPassword, 10);

    const newUser = new User({
      rollNo,
      name,
      gmail,
      password: hashedPassword,
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign({ userId: newUser._id, rollNo: newUser.rollNo }, process.env.SECRET_KEY, {
      expiresIn: '1h',
    });

    res.cookie('token', token, {
      httpOnly: true,
      sameSite: 'Strict',
      maxAge: 3600000,
    });

    res.status(201).json({ message: 'Google signup completed', token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error completing signup', error });
  }
};

module.exports = { signup, signin, logout, googleAuth, googleAuthCallback, completeGoogleSignup };