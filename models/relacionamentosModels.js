const Video = require('./video.model');
const Criador = require('./criador.model');
const PerfilCriador = require('./perfilCriador.model');
const Hashtag = require('./hashtag.model');

Criador.hasMany(Video, { foreignKey: 'criadorId', as: 'videos' });
Video.belongsTo(Criador, { foreignKey: 'criadorId', as: 'criador' });

Criador.hasOne(PerfilCriador, { foreignKey: 'criadorId', as: 'perfil' });
PerfilCriador.belongsTo(Criador, { foreignKey: 'criadorId', as: 'criador' });

Video.belongsToMany(Hashtag, { through: 'VideoHashtag', foreignKey: 'videoId', as: 'hashtags' });
Hashtag.belongsToMany(Video, { through: 'VideoHashtag', foreignKey: 'hashtagId', as: 'videos' });

module.exports = { Video, Criador, PerfilCriador, Hashtag };
