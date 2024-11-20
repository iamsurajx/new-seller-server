// Importing modules
import User from '../models/user.model.js'; // Import the User model
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



// Login
export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Check if the password is correct
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Create a JWT token
        const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Signup
export const signup = async (req, res) => {
    const { firstName, lastName, email, password, phoneNumber, address } = req.body;

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            phoneNumber,
            address
        });

        const newUser = await user.save();
        res.status(201).json({ message: 'User created successfully', userId: newUser._id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};