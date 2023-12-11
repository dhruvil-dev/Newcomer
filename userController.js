const bcrypt = require('bcryptjs');
const User = require('../models/User'); 
const jwt = require('jsonwebtoken');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

exports.signIn = async (req, res) => {
    try {
        // Find user by email
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Compare provided password with hashed password using bcrypt
        const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }
        
        // Check if 2FA is enabled and verify the token
        if (user.twoFactorEnabled) {
            const token = req.body.token; // Get the 2FA token from the request
            if (!token) {
                return res.status(401).json({ message: 'Two-factor authentication token is required' });
            }

            // Verify 2FA token
            const verified = speakeasy.totp.verify({
                secret: user.twoFactorSecret,
                encoding: 'base32',
                token: token
            });

            if (!verified) {
                return res.status(401).json({ message: 'Invalid two-factor authentication token' });
            }
        }

        // Log for debugging
        console.log("Received email:", req.body.email);
        console.log("Received password:", req.body.password);
        console.log("User email from DB:", user.email);
        console.log("User hashed password from DB:", user.password);

        // Generate JWT token
        const jwtToken = jwt.sign({ userId: user._id }, 'g_r_o_u_p', { expiresIn: '1h' });
        return res.json({ message: 'User signed in successfully', token: jwtToken });

    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: 'Server error' });
    }
};

exports.generateTwoFactorSecret = async (req, res) => {
    const secret = speakeasy.generateSecret({ length: 20 });
    try {
        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);
        res.json({ secret: secret.base32, qrCodeUrl });
    } catch (error) {
        res.status(500).json({ message: 'Error generating QR Code' });
    }
};

exports.enableTwoFactor = async (req, res) => {
    const userId = req.body.userId; 
    const secret = speakeasy.generateSecret({ length: 20 });
    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url);

        
        user.twoFactorSecret = secret.base32;
        user.twoFactorEnabled = false;
        await user.save();

        res.json({ secret: secret.base32, qrCodeUrl });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.verifyTwoFactor = async (req, res) => {
    const { userId, token } = req.body;
    const user = await User.findById(userId);
    const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token: token
    });

    if (verified) {
        user.twoFactorEnabled = true;
        await user.save();
        res.json({ message: "Two-factor authentication enabled successfully" });
    } else {
        res.status(400).json({ message: "Invalid token" });
    }
};

// User sign-out
exports.signOut = (req, res) => {
    
    res.send('Sign-out successful');
};

// Create a new user
exports.createUser = async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};



// Get all users
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a user by ID
exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Update a user
exports.updateUser = async (req, res) => {
    try {
        const updates = Object.keys(req.body);
        const allowedUpdates = ['name', 'email', 'password']; // Add other fields as necessary
        const isValidOperation = updates.every(update => allowedUpdates.includes(update));

        if (!isValidOperation) {
            return res.status(400).send({ error: 'Invalid updates!' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }

        updates.forEach(update => user[update] = req.body[update]);
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Delete a user
exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};
