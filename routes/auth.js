const express = require('express');
const passport = require('../config/passport');
const { naoAutenticado } = require('../middlewares/auth');

const router = express.Router();

router.get('/login', naoAutenticado, (req, res) => res.render('usuarios/login', { erro: null }));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (erro, usuario) => {
    if (erro) return next(erro);
    if (!usuario) return res.status(401).render('usuarios/login', { erro: 'Email ou senha inválidos.' });
    req.login(usuario, (loginErro) => {
      if (loginErro) return next(loginErro);
      res.redirect('/');
    });
  })(req, res, next);
});

router.post('/logout', (req, res, next) => {
  req.logout((erro) => {
    if (erro) return next(erro);
    req.session.destroy((sessionErro) => {
      if (sessionErro) return next(sessionErro);
      res.clearCookie('sid');
      res.redirect('/login');
    });
  });
});

module.exports = router;
