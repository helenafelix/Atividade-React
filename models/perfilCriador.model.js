const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const PerfilCriador = sequelize.define('PerfilCriador', {
  bio: { type: DataTypes.TEXT },
  fotoUrl: { type: DataTypes.STRING },
  linkRedeSocial: { type: DataTypes.STRING }
}, { tableName: 'PerfisCriadores' });

module.exports = PerfilCriador;
