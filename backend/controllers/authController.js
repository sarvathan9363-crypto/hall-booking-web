import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const generateToken = (id) => {
  if (!process.env.JWT_SECRET) throw new Error('Missing JWT secret');
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });
};

// Signup
export const signup = async (req, res) => {
  try {
    const { name, rollno, email, password } = req.body;
    if (!name || !rollno || !email || !password)
      return res.status(400).json({ message: 'Please provide all fields' });

    const existing = await User.findOne({ $or: [{ email }, { rollno }] });
    if (existing)
      return res.status(409).json({ message: 'User already exists' });

    const user = await User.create({ name, rollno, email, password });
    const token = generateToken(user._id);

    res.status(201).json({
      user: { id: user._id, name: user.name, rollno: user.rollno, email: user.email },
      token
    });
  } catch (err) {
    console.error('❌ Signup Error:', err.message);
    res.status(500).json({ message: 'Server error during signup', error: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: 'Please provide email and password' });

    const user = await User.findOne({ email });
    if (!user || !(await user.matchPassword(password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = generateToken(user._id);
    res.json({
      user: { id: user._id, name: user.name, rollno: user.rollno, email: user.email },
      token
    });
  } catch (err) {
    console.error('❌ Login Error:', err.message);
    res.status(500).json({ message: 'Server error during login', error: err.message });
  }
};

// API to get user details from token (for autofill)
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ email: user.email, name: user.name, rollno: user.rollno });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile' });
  }
};
