# Atividade React

Aplicação feita a partir do tutorial de Express, Handlebars, Sequelize, SQLite e Passport. A interface principal foi implementada em React, sem CSS, para deixar o exemplo direto e fácil de acompanhar.

## O que foi implementado

- Express com rotas HTTP e API JSON.
- React com Vite para a interface.
- Handlebars na tela de login.
- Sequelize com SQLite em arquivo local.
- CRUD de vídeos.
- Relacionamento 1:N entre `Criador` e `Video`.
- Relacionamento 1:1 entre `Criador` e `PerfilCriador`.
- Relacionamento N:N entre `Video` e `Hashtag`.
- Sessão persistida em SQLite.
- Login com Passport Local e senha protegida com bcrypt.
- Script `criarUsuario.js` para criar o primeiro usuário.

## Como executar

```bash
cp .env.example .env
npm install
npm run build
npm run criar-usuario
npm start
```

Acesse `http://localhost:3000/login`. O usuário padrão é `admin@atividade-react.local` e a senha padrão é `admin123`, caso `ADMIN_EMAIL` e `ADMIN_PASSWORD` não sejam definidos no `.env`.

O arquivo `.env`, o banco SQLite e as sessões ficam fora do versionamento. Para desenvolvimento, também é possível usar `npm run dev` depois de gerar o build do cliente.
