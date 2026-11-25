import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';

const vazioVideo = { titulo: '', descricao: '', visualizacoes: 0, curtidas: 0, urlVideo: '', urlThumbnail: '', criadorId: '', hashtags: [] };

async function api(url, options = {}) {
  const resposta = await fetch(url, { credentials: 'same-origin', headers: { 'Content-Type': 'application/json', ...(options.headers || {}) }, ...options });
  if (!resposta.ok) throw new Error((await resposta.json().catch(() => ({}))).erro || 'Não foi possível concluir a operação.');
  return resposta.status === 204 ? null : resposta.json();
}

function App() {
  const [sessao, setSessao] = useState(null);
  const [aba, setAba] = useState('videos');
  const [videos, setVideos] = useState([]);
  const [criadores, setCriadores] = useState([]);
  const [hashtags, setHashtags] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [video, setVideo] = useState(vazioVideo);
  const [criador, setCriador] = useState({ nome: '', nomeUsuario: '', seguidores: 0, bio: '', fotoUrl: '', linkRedeSocial: '' });
  const [novaHashtag, setNovaHashtag] = useState('');
  const [mensagem, setMensagem] = useState('');

  async function carregar() {
    try {
      const estado = await api('/api/sessao');
      setSessao(estado);
      if (estado.autenticado) {
        const [listaVideos, listaCriadores, listaHashtags, listaUsuarios] = await Promise.all([api('/api/videos'), api('/api/criadores'), api('/api/hashtags'), api('/api/usuarios')]);
        setVideos(listaVideos); setCriadores(listaCriadores); setHashtags(listaHashtags); setUsuarios(listaUsuarios);
        setVideo((atual) => ({ ...atual, criadorId: atual.criadorId || listaCriadores[0]?.id || '' }));
      }
    } catch (erro) { setMensagem(erro.message); }
  }

  useEffect(() => { carregar(); }, []);

  async function cadastrarVideo(evento) {
    evento.preventDefault();
    try { await api('/api/videos', { method: 'POST', body: JSON.stringify(video) }); setVideo({ ...vazioVideo, criadorId: criadores[0]?.id || '' }); setMensagem('Vídeo cadastrado com sucesso.'); carregar(); } catch (erro) { setMensagem(erro.message); }
  }

  async function excluirVideo(id) {
    if (!window.confirm('Excluir este vídeo?')) return;
    try { await api(`/api/videos/${id}`, { method: 'DELETE' }); setMensagem('Vídeo excluído.'); carregar(); } catch (erro) { setMensagem(erro.message); }
  }

  async function cadastrarCriador(evento) {
    evento.preventDefault();
    try { await api('/api/criadores', { method: 'POST', body: JSON.stringify(criador) }); setCriador({ nome: '', nomeUsuario: '', seguidores: 0, bio: '', fotoUrl: '', linkRedeSocial: '' }); setMensagem('Criador cadastrado.'); carregar(); } catch (erro) { setMensagem(erro.message); }
  }

  async function cadastrarHashtag(evento) {
    evento.preventDefault();
    try { await api('/api/hashtags', { method: 'POST', body: JSON.stringify({ nome: novaHashtag }) }); setNovaHashtag(''); setMensagem('Hashtag cadastrada.'); carregar(); } catch (erro) { setMensagem(erro.message); }
  }

  if (!sessao) return <main><p>Carregando...</p></main>;
  if (!sessao.autenticado) return <main><h1>Atividade React</h1><p>Você precisa fazer login.</p><a href="/login">Ir para o login</a></main>;

  return <main>
    <header>
      <h1>Vídeos da turma</h1>
      <p>Olá, {sessao.usuario.nome}. Este é um exemplo simples usando React na interface e Express no servidor.</p>
      <form action="/logout" method="POST"><button type="submit">Sair</button></form>
    </header>

    <nav aria-label="Navegação principal">
      <button onClick={() => setAba('videos')}>Vídeos</button>{' '}
      <button onClick={() => setAba('criadores')}>Criadores</button>{' '}
      <button onClick={() => setAba('hashtags')}>Hashtags</button>{' '}
      <button onClick={() => setAba('usuarios')}>Usuários</button>
    </nav>
    <p>{mensagem}</p>

    {aba === 'videos' && <section>
      <h2>Cadastrar vídeo</h2>
      <form onSubmit={cadastrarVideo}>
        <p><label>Título<br /><input required value={video.titulo} onChange={e => setVideo({ ...video, titulo: e.target.value })} /></label></p>
        <p><label>Descrição<br /><textarea value={video.descricao} onChange={e => setVideo({ ...video, descricao: e.target.value })} /></label></p>
        <p><label>Criador<br /><select required value={video.criadorId} onChange={e => setVideo({ ...video, criadorId: e.target.value })}><option value="">Escolha</option>{criadores.map(c => <option key={c.id} value={c.id}>{c.nome} (@{c.nomeUsuario})</option>)}</select></label></p>
        <p><label>Hashtags<br /><select multiple value={video.hashtags.map(String)} onChange={e => setVideo({ ...video, hashtags: Array.from(e.target.selectedOptions, option => option.value) })}>{hashtags.map(h => <option key={h.id} value={h.id}>{h.nome}</option>)}</select></label></p>
        <p><label>Visualizações <input type="number" min="0" value={video.visualizacoes} onChange={e => setVideo({ ...video, visualizacoes: e.target.value })} /></label></p>
        <p><label>Curtidas <input type="number" min="0" value={video.curtidas} onChange={e => setVideo({ ...video, curtidas: e.target.value })} /></label></p>
        <p><label>URL do vídeo<br /><input value={video.urlVideo} onChange={e => setVideo({ ...video, urlVideo: e.target.value })} /></label></p>
        <p><label>URL da thumbnail<br /><input value={video.urlThumbnail} onChange={e => setVideo({ ...video, urlThumbnail: e.target.value })} /></label></p>
        <button type="submit">Cadastrar vídeo</button>
      </form>
      <h2>Lista de vídeos</h2>
      {videos.length === 0 ? <p>Nenhum vídeo cadastrado ainda.</p> : <ul>{videos.map(item => <li key={item.id}>
        <strong>{item.titulo}</strong> — por {item.criador?.nome || 'criador removido'}<br />
        {item.descricao}<br />Visualizações: {item.visualizacoes} | Curtidas: {item.curtidas}<br />
        Hashtags: {item.hashtags?.map(h => h.nome).join(', ') || 'nenhuma'}<br />
        {item.urlVideo && <a href={item.urlVideo} target="_blank" rel="noreferrer">Abrir vídeo</a>} {' '}
        <button onClick={() => excluirVideo(item.id)}>Excluir</button>
      </li>)}</ul>}
    </section>}

    {aba === 'criadores' && <section>
      <h2>Cadastrar criador</h2>
      <form onSubmit={cadastrarCriador}>
        {['nome', 'nomeUsuario', 'bio', 'fotoUrl', 'linkRedeSocial'].map(campo => <p key={campo}><label>{campo}<br />{campo === 'bio' ? <textarea value={criador[campo]} onChange={e => setCriador({ ...criador, [campo]: e.target.value })} /> : <input required={campo === 'nome' || campo === 'nomeUsuario'} value={criador[campo]} onChange={e => setCriador({ ...criador, [campo]: e.target.value })} />}</label></p>)}
        <p><label>seguidores<br /><input type="number" min="0" value={criador.seguidores} onChange={e => setCriador({ ...criador, seguidores: e.target.value })} /></label></p>
        <button type="submit">Cadastrar criador</button>
      </form>
      <h2>Lista de criadores</h2><ul>{criadores.map(c => <li key={c.id}><strong>{c.nome}</strong> (@{c.nomeUsuario}) — {c.seguidores} seguidores. {c.perfil?.bio}</li>)}</ul>
    </section>}

    {aba === 'hashtags' && <section><h2>Cadastrar hashtag</h2><form onSubmit={cadastrarHashtag}><input required value={novaHashtag} onChange={e => setNovaHashtag(e.target.value)} placeholder="#react" /> <button type="submit">Cadastrar</button></form><h2>Lista de hashtags</h2><ul>{hashtags.map(h => <li key={h.id}>{h.nome}</li>)}</ul></section>}
    {aba === 'usuarios' && <section><h2>Usuários cadastrados</h2><ul>{usuarios.map(u => <li key={u.id}>{u.nome} — {u.email} ({u.perfil})</li>)}</ul></section>}
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
