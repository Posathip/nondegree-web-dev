const User = require('../models/user');
const bcrypt = require('bcrypt');    
const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่ามี email ในระบบไหม
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // ตรวจสอบ password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    // สร้าง JWT token
    const token = jwt.sign(
      { id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'your_jwt_secret',
      { expiresIn: '1h' }
    );
     res.cookie("token", token, {
      httpOnly: true,       // ป้องกัน XSS กรณี เอา Javascript อ่าน cookie
      secure: false,        //  HTTPS
      sameSite: "lax",      // กัน CSRF ระดับพื้นฐาน
      maxAge: 3600000,      // 1 ชั่วโมง
      path: "/"
    });

    res.json({
      success: true,
      message: 'Login successful',
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;


    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }


    const hashedPassword = await bcrypt.hash(password, 10);

    // สร้าง user
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'admin' 
    });

    res.status(200).json({
      success: true,
      message: 'User registered successfully',
      data: {
        id: newUser.user_id,
        name: newUser.name,
        email: newUser.email
      }
    });

  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
exports.profile = async (req, res) => {
  try {

    const authHeader = req.headers["authorization"];
    if (!authHeader) return res.status(401).json({ success: false, message: "No token provided" });

    const token = authHeader.split(" ")[1]; // Bearer <token>
    if (!token) return res.status(401).json({ success: false, message: "Invalid token format" });


    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    console.log(req.cookies);
  
    const user = await User.findByPk(decoded.id, { attributes: ["user_id", "name", "email", "role"] });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    res.json({ success: true, user });
  } catch (err) {
    console.error("Profile error:", err);
    res.status(401).json({ success: false, message: "Invalid or expired token" });
  }
};

