const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/tokenUtils');



router.post('/users/login', async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(400).send({ error: 'Invalid login credentials' });
      }
  
      const isPasswordMatch = await bcrypt.compare(req.body.password, user.password);
      if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
      }
  
      const token = generateToken(user._id);
      res.send({ user, token });
    } catch (error) {
      res.status(500).send();
    }
  });
  router.get('/protected-route', auth, async (req, res) => {
    
    try {
       
        res.json({
            message: "You have accessed a protected route!",
            user: req.user
        });
    } catch (error) {
       
        res.status(500).json({ message: "Internal Server Error" });
    }
});

router.post('/users/enable-2fa', userController.enableTwoFactor);
router.post('/users/verify-2fa', userController.verifyTwoFactor);  
router.post('/users/signin', userController.signIn);
router.get('/users/signout', userController.signOut);
router.post('/users', userController.createUser);
router.get('/users', userController.getAllUsers);
router.get('/users/:id', userController.getUserById);
router.patch('/users/:id', userController.updateUser);
router.delete('/users/:id', userController.deleteUser);

module.exports = router;
