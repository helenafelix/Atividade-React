function autenticado(req, res, next) {
  if (req.isAuthenticated()) return next();
  if (req.path.startsWith('/api/')) return res.status(401).json({ erro: 'Faça login para continuar.' });
  return res.redirect('/login');
}

function naoAutenticado(req, res, next) {
  if (req.isAuthenticated()) return res.redirect('/');
  next();
}

module.exports = { autenticado, naoAutenticado };
