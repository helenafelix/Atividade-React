require('dotenv').config();
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const methodOverride = require('method-override');
const passport = require('./config/passport');
const sessionStore = require('./config/bdSessao');
const sequelize = require('./config/bd');
const { Video, Criador, PerfilCriador, Hashtag } = require('./models/relacionamentosModels');
const { autenticado } = require('./middlewares/auth');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.engine('handlebars', exphbs.engine({ defaultLayout: false, helpers: {
  eq: (a, b) => a === b,
  json: (valor) => JSON.stringify(valor)
} }));
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'client', 'dist')));
app.use(session({ name: 'sid', store: sessionStore, secret: process.env.SESSION_SECRET || 'chave-de-desenvolvimento', resave: false, saveUninitialized: false, cookie: { httpOnly: true, maxAge: 86400000, sameSite: 'lax' } }));
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => { res.locals.usuario = req.user || null; next(); });
app.use(authRoutes);

app.get('/api/sessao', (req, res) => {
  const usuario = req.user ? { id: req.user.id, nome: req.user.nome, email: req.user.email, perfil: req.user.perfil } : null;
  res.json({ autenticado: req.isAuthenticated(), usuario });
});

app.get('/api/videos', autenticado, async (req, res, next) => {
  try {
    const videos = await Video.findAll({ include: [
      { model: Criador, as: 'criador', include: [{ model: PerfilCriador, as: 'perfil' }] },
      { model: Hashtag, as: 'hashtags' }
    ], order: [['createdAt', 'DESC']] });
    res.json(videos);
  } catch (erro) { next(erro); }
});

app.post('/api/videos', autenticado, async (req, res, next) => {
  try {
    const { titulo, descricao, visualizacoes, curtidas, urlVideo, urlThumbnail, criadorId, hashtags = [] } = req.body;
    if (!titulo || !criadorId) return res.status(400).json({ erro: 'Título e criador são obrigatórios.' });
    const video = await Video.create({ titulo, descricao, visualizacoes: Number(visualizacoes) || 0, curtidas: Number(curtidas) || 0, urlVideo, urlThumbnail, criadorId });
    await video.setHashtags(hashtags);
    res.status(201).json(await Video.findByPk(video.id, { include: [{ model: Criador, as: 'criador' }, { model: Hashtag, as: 'hashtags' }] }));
  } catch (erro) { next(erro); }
});

app.put('/api/videos/:id', autenticado, async (req, res, next) => {
  try {
    const video = await Video.findByPk(req.params.id);
    if (!video) return res.status(404).json({ erro: 'Vídeo não encontrado.' });
    await video.update(req.body);
    if (Array.isArray(req.body.hashtags)) await video.setHashtags(req.body.hashtags);
    res.json(video);
  } catch (erro) { next(erro); }
});

app.delete('/api/videos/:id', autenticado, async (req, res, next) => {
  try {
    const removido = await Video.destroy({ where: { id: req.params.id } });
    if (!removido) return res.status(404).json({ erro: 'Vídeo não encontrado.' });
    res.status(204).end();
  } catch (erro) { next(erro); }
});

app.get('/api/criadores', autenticado, async (req, res, next) => {
  try { res.json(await Criador.findAll({ include: [{ model: PerfilCriador, as: 'perfil' }], order: [['nome', 'ASC']] })); } catch (erro) { next(erro); }
});
app.post('/api/criadores', autenticado, async (req, res, next) => {
  try {
    const { nome, nomeUsuario, seguidores, bio, fotoUrl, linkRedeSocial } = req.body;
    const criador = await Criador.create({ nome, nomeUsuario, seguidores: Number(seguidores) || 0 });
    await criador.createPerfil({ bio, fotoUrl, linkRedeSocial });
    res.status(201).json(await Criador.findByPk(criador.id, { include: [{ model: PerfilCriador, as: 'perfil' }] }));
  } catch (erro) { next(erro); }
});

app.get('/api/hashtags', autenticado, async (req, res, next) => {
  try { res.json(await Hashtag.findAll({ order: [['nome', 'ASC']] })); } catch (erro) { next(erro); }
});
app.post('/api/hashtags', autenticado, async (req, res, next) => {
  try { res.status(201).json(await Hashtag.create({ nome: req.body.nome })); } catch (erro) { next(erro); }
});

app.get('/api/usuarios', autenticado, async (req, res, next) => {
  try { res.json(await require('./models/usuario.model').findAll({ attributes: ['id', 'nome', 'email', 'perfil'] })); } catch (erro) { next(erro); }
});

app.get('/api/*', (req, res) => res.status(404).json({ erro: 'Rota da API não encontrada.' }));
app.get('/login', (req, res, next) => next());
app.get('*', (req, res) => {
  if (req.isAuthenticated()) return res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  res.redirect('/login');
});

app.use((erro, req, res, next) => { console.error(erro); res.status(500).json({ erro: 'Ocorreu um erro no servidor.' }); });

async function iniciar() {
  await sequelize.sync();
  app.listen(PORT, () => console.log(`Servidor executando em http://localhost:${PORT}`));
}

if (require.main === module) iniciar().catch((erro) => { console.error(erro); process.exit(1); });
module.exports = app;
