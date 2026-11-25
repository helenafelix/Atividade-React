const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Usuario = sequelize.define('Usuario', {
  nome: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  senha: { type: DataTypes.STRING, allowNull: false },
  perfil: { type: DataTypes.STRING, allowNull: false, defaultValue: 'usuario' }
}, { tableName: 'Usuarios' });

module.exports = Usuario;
