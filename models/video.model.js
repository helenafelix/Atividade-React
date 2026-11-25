const { DataTypes } = require('sequelize');
const sequelize = require('../config/bd');

const Video = sequelize.define('Video', {
  titulo: { type: DataTypes.STRING, allowNull: false },
  descricao: { type: DataTypes.TEXT },
  visualizacoes: { type: DataTypes.INTEGER, defaultValue: 0 },
  curtidas: { type: DataTypes.INTEGER, defaultValue: 0 },
  urlVideo: { type: DataTypes.STRING },
  urlThumbnail: { type: DataTypes.STRING }
}, { tableName: 'Videos' });

module.exports = Video;
