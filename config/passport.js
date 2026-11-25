const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario.model');

passport.use(new LocalStrategy({ usernameField: 'email', passwordField: 'senha' }, async (email, senha, done) => {
  try {
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario || !(await bcrypt.compare(senha, usuario.senha))) {
      return done(null, false);
    }
    return done(null, usuario);
  } catch (erro) {
    return done(erro);
  }
}));

passport.serializeUser((usuario, done) => done(null, usuario.id));
passport.deserializeUser(async (id, done) => {
  try { done(null, await Usuario.findByPk(id)); } catch (erro) { done(erro); }
});

module.exports = passport;
