// const loginText = document.querySelector(".title-text .login");
// const loginForm = document.querySelector("form.login");
// const loginBtn = document.querySelector("label.login");
// const signupBtn = document.querySelector("label.signup");
// const signupLink = document.querySelector("form .signup-link a");
// signupBtn.onclick = (()=>{
//   loginForm.style.marginLeft = "-50%";
//   loginText.style.marginLeft = "-50%";
// });
// loginBtn.onclick = (()=>{
//   loginForm.style.marginLeft = "0%";
//   loginText.style.marginLeft = "0%";
// });
// signupLink.onclick = (()=>{
//   signupBtn.click();
//   return false;
// });
const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
mongoose.connect('mongodb://localhost/myapp', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));
  const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });
  const User = mongoose.model('User', userSchema);
  const app = express();
  app.use(express.json());
  app.post('/register', async (req, res) => {
    const { email, password } = req.body;
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({ email, password: hashedPassword });
    try {
      await user.save();
      res.json({ message: 'User registered' });
    } catch (error) {
      res.status(400).json({ message: 'User registration failed' });
    }
  });
  app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect password' });
    }
    const token = jwt.sign({ userId: user._id }, 'mysecretkey');
    res.json({ token });
  });
  app.listen(3000, () => console.log('Server running on port 3000'));
  