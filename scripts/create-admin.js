const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// User schema (simplified for script)
const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super_admin', 'editor'], default: 'editor' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  loginAttempts: { type: Number, default: 0 },
  lockoutUntil: Date
}, { timestamps: true });

const User = mongoose.model('User', UserSchema);

async function createDefaultAdmin() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pontigramid';
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Check if admin already exists
    const existingAdmin = await User.findOne({ role: { $in: ['admin', 'super_admin'] } });
    if (existingAdmin) {
      console.log('Admin user already exists:', {
        username: existingAdmin.username,
        email: existingAdmin.email,
        role: existingAdmin.role
      });
      return;
    }

    // Create default admin
    const defaultPassword = process.env.DEFAULT_ADMIN_PASSWORD || 'admin123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    const admin = await User.create({
      username: 'admin',
      email: 'admin@pontigramid.com',
      password: hashedPassword,
      name: 'Administrator',
      role: 'super_admin',
      isActive: true
    });

    console.log('✅ Default admin created successfully!');
    console.log('Login credentials:');
    console.log('Username:', admin.username);
    console.log('Email:', admin.email);
    console.log('Password:', defaultPassword);
    console.log('Role:', admin.role);
    console.log('');
    console.log('🔐 Please change the default password after first login!');
    console.log('🌐 Login at: http://localhost:3000/admin/login');

  } catch (error) {
    console.error('Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the script
createDefaultAdmin();
