const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  user_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user' // หรือ 'admin'
  }
}, {
  tableName: 'users',
  timestamps: true,       // สร้าง createdAt / updatedAt อัตโนมัติ
});

module.exports = User;
