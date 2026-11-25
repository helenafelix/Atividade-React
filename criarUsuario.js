require('dotenv').config();
const bcrypt = require('bcrypt');
const sequelize = require('./config/bd');
const Usuario = require('./models/usuario.model');

async function criar() {
  const email = process.env.ADMIN_EMAIL || 'admin@atividade-react.local';
  const senha = process.env.ADMIN_PASSWORD || 'admin123';
  const senhaHash = await bcrypt.hash(senha, 10);
  await sequelize.sync();
  const [usuario] = await Usuario.findOrCreate({ where: { email }, defaults: { nome: 'Administrador', senha: senhaHash, perfil: 'admin' } });
  console.log(`Usuário disponível: ${usuario.email}`);
  console.log('Senha inicial definida pela variável ADMIN_PASSWORD ou, na ausência, admin123.');
  await sequelize.close();
}

criar().catch((erro) => { console.error(erro); process.exit(1); });
