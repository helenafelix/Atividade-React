const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Hashtag = sequelize.define('Hashtag', {
  nome: { type: DataTypes.STRING, allowNull: false, unique: true }
}, { tableName: 'Hashtags' });

module.exports = Hashtag;
