const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Criador = sequelize.define('Criador', {
  nome: { type: DataTypes.STRING, allowNull: false },
  nomeUsuario: { type: DataTypes.STRING, allowNull: false },
  seguidores: { type: DataTypes.INTEGER, defaultValue: 0 }
}, { tableName: 'Criadores' });

module.exports = Criador;
