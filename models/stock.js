const { DataTypes } = require('sequelize');
const sequelize = require('../config/database.js');

const Stock = sequelize.define(
  'Stock',
  {
    stockId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      field: 'stock_id'
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    color: {
      type: DataTypes.STRING,
    },
    size: {
      type: DataTypes.STRING,
    },
    stock: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    notes: {
      type: DataTypes.STRING,
    },
  },
  {
    tableName: 'stocks',
    timestamps: true,   
  }
);

module.exports = Stock;
