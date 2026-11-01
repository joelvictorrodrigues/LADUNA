import { PortalApi } from './api.js';
import { DEFAULT_MODULES, MODULES, emptyDashboard } from './data.js';

const app = document.getElementById('portalApp');
const toastRegion = document.getElementById('toastRegion');

const state = {
  api: null,
  profile: null,
  organizations: [],
  profiles: [],
  organization: null,
  dashboard: null,
  requests: [],
  view: 'overview',
  previewMode: false,
  adminReturnView: 'admin-overview',
  adminOrganizationId: null,
  editorDraft: null,
  editorTab: 'overview'
};

const icons = {
  'layout-dashboard': '<path d="M4 4h6v6H4zM14 4h6v4h-6zM14 12h6v8h-6zM4 14h6v6H4z"/>',
  'chart-column': '<path d="M4 20V10h4v10M10 20V4h4v16M16 20v-7h4v7M3 20h18"/>',
  megaphone: '<path d="M3 11v2a2 2 0 0 0 2 2h2l3 4h2l-2-4 9-4V5L7 9H5a2 2 0 0 0-2 2Z"/><path d="M19 8a3 3 0 0 1 0 6"/>',
  target: '<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><path d="m15 9 5-5M16 4h4v4"/>',
  calendar: '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/>',
  'file-chart': '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 18v-4M12 18v-7M16 18v-2"/>',
  messages: '<path d="M21 15a4 4 0 0 1-4 4H8l-5 3 1.7-5.1A7 7 0 0 1 3 12V8a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z"/>',
  clients: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  key: '<circle cx="7.5" cy="15.5" r="5.5"/><path d="m12 12 8-8M15 7l2 2M18 4l2 2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  edit: '<path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z"/>',
  eye: '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/>',
  'eye-off': '<path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8M9.9 5.1A10 10 0 0 1 12 5c6.5 0 10 7 10 7a15 15 0 0 1-2.1 3.1M6.6 6.6C3.5 8.4 2 12 2 12s3.5 7 10 7a10 10 0 0 0 3.4-.6"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="m6 6 12 12M18 6 6 18"/>',
  logout: '<path d="M10 17l5-5-5-5M15 12H3M21 19V5a2 2 0 0 0-2-2h-6"/>',
  building: '<path d="M3 21h18M6 21V4h9v17M15 9h4v12M9 8h3M9 12h3M9 16h3"/>',
  refresh: '<path d="M20 11a8 8 0 1 0-2.3 5.7M20 4v7h-7"/>',
  trash: '<path d="M4 7h16M9 7V4h6v3M7 7l1 14h8l1-14M10 11v6M14 11v6"/>',
  download: '<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>',
  arrow: '<path d="M5 12h14M14 7l5 5-5 5"/>',
  lock: '<rect x="4" y="10" width="16" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>'
};

function icon(name, size = 18) {
  return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${icons[name] || icons['layout-dashboard']}</svg>`;
}

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function slugify(value = '') {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function safeExternalUrl(value = '') {
  if (!value || value === '#') return '';
  try {
    const url = new URL(value, window.location.origin);
    return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
  } catch (error) {
    return '';
  }
}

function formatDate(value, withTime = false) {
  if (!value) return 'Sem atualização';
  const options = withTime
    ? { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' };
  return new Intl.DateTimeFormat('pt-BR', options).format(new Date(value));
}

function initials(name = '') {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase() || 'CL';
}

function notify(message, type = 'success') {
  const element = document.createElement('div');
  element.className = `toast ${type}`;
  element.innerHTML = `${icon(type === 'error' ? 'close' : 'target', 17)}<span>${escapeHtml(message)}</span>`;
  toastRegion.appendChild(element);
  window.setTimeout(() => element.remove(), 4200);
}

function setLoading(label = 'Carregando portal') {
  app.innerHTML = `<div class="portal-loading"><span><i class="spinner"></i>${escapeHtml(label)}</span></div>`;
}

function setupScreen(message) {
  const localPreview = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  app.innerHTML = `
    <main class="setup-state">
      <section class="setup-box">
        <img class="official-wordmark" src="/assets/laduna-logo-horizontal.png" alt="LADUNA Studio">
        <p class="section-kicker">Área do cliente</p>
        <h1>${localPreview ? 'Conexão pendente' : 'Portal em configuração'}</h1>
        <p>${localPreview ? escapeHtml(message || 'A infraestrutura segura do portal ainda não foi conectada.') : 'O acesso depende da ativação pela LADUNA. Fale com a equipe para confirmar a disponibilidade do seu painel.'}</p>
        ${localPreview ? '<p>O portal já pode ser revisado em modo demonstração. Nenhum dado dessa visualização é real ou será salvo.</p><a class="button button-primary" href="/portal/?demo=1">Abrir demonstração</a>' : ''}
        <a class="button button-secondary" href="/">Voltar ao site</a>
      </section>
    </main>`;
}

function loginScreen(errorMessage = '') {
  app.innerHTML = `
    <main class="login-page">
      <section class="login-panel">
        <a class="login-brand" href="/">
          <img class="official-wordmark" src="/assets/laduna-logo-horizontal.png" alt="LADUNA Studio">
        </a>
        <p class="login-kicker">Portal do cliente</p>
        <h1>Acesso reservado</h1>
        <p class="login-intro">Entre com o e-mail e a senha fornecidos pela equipe LADUNA.</p>
        <form class="login-form" id="loginForm">
          <div class="field">
            <label for="loginEmail">E-mail</label>
            <input id="loginEmail" name="email" type="email" autocomplete="username" required>
          </div>
          <div class="field">
            <label for="loginPassword">Senha</label>
            <div class="password-wrap">
              <input id="loginPassword" name="password" type="password" autocomplete="current-password" required>
              <button class="password-toggle" type="button" aria-label="Mostrar senha" data-password-toggle>${icon('eye')}</button>
            </div>
          </div>
          <p class="login-error" id="loginError">${escapeHtml(errorMessage)}</p>
          <button class="button button-primary login-submit" type="submit">Entrar ${icon('arrow')}</button>
        </form>
        ${state.api.demo ? `
          <p class="login-meta">Demonstração local com dados fictícios. As alterações não são salvas.</p>
          <div class="demo-actions">
            <button class="button button-secondary button-small" type="button" data-demo-login="admin">Ver administração</button>
            <button class="button button-secondary button-small" type="button" data-demo-login="client">Ver área do cliente</button>
          </div>` : ''}
        <p class="login-meta">Problemas com o acesso? Solicite uma nova senha diretamente à LADUNA.</p>
      </section>
      <aside class="login-art" aria-hidden="true">
        <div class="login-art-lines"></div>
        <div class="login-art-copy">
          <strong>Direção clara.<br>Decisões melhores.</strong>
          <p>Um espaço central para acompanhar resultados, prioridades e entregas da sua empresa.</p>
        </div>
      </aside>
    </main>`;

  document.querySelector('[data-password-toggle]').addEventListener('click', (event) => {
    const input = document.getElementById('loginPassword');
    const showing = input.type === 'text';
    input.type = showing ? 'password' : 'text';
    event.currentTarget.innerHTML = icon(showing ? 'eye' : 'eye-off');
    event.currentTarget.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Ocultar senha');
  });

  document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button[type="submit"]');
    const data = new FormData(event.currentTarget);
    button.disabled = true;
    button.textContent = 'Entrando...';
    try {
      await state.api.login(String(data.get('email')), String(data.get('password')));
      await startAuthenticated();
    } catch (error) {
      document.getElementById('loginError').textContent = error.message;
      button.disabled = false;
      button.innerHTML = `Entrar ${icon('arrow')}`;
    }
  });

  document.querySelectorAll('[data-demo-login]').forEach((button) => {
    button.addEventListener('click', async () => {
      const role = button.dataset.demoLogin;
      await state.api.login(role === 'client' ? 'cliente@empresa.demo' : 'admin@laduna.demo', 'demonstracao');
      await startAuthenticated();
    });
  });
}

function clientAvatar(organization, sizeClass = '') {
  const logoUrl = safeExternalUrl(organization.logo_url);
  const content = logoUrl
    ? `<img src="${escapeHtml(logoUrl)}" alt="">`
    : escapeHtml(initials(organization.name));
  return `<span class="client-avatar ${sizeClass}" style="--client-accent:${escapeHtml(organization.accent_color || '#6B4A7D')}">${content}</span>`;
}

const adminNav = [
  { id: 'admin-overview', label: 'Visão geral', icon: 'layout-dashboard' },
  { id: 'admin-clients', label: 'Clientes', icon: 'clients' },
  { id: 'admin-users', label: 'Acessos', icon: 'key' },
  { id: 'admin-requests', label: 'Solicitações', icon: 'messages' }
];

function renderShell() {
  const adminAccount = state.profile.role === 'admin';
  const isAdmin = adminAccount && !state.previewMode;
  const organization = state.organization || { name: 'Gestão LADUNA', segment: 'Administração', accent_color: '#6B4A7D', logo_url: '' };
  const navItems = isAdmin
    ? adminNav
    : MODULES.filter((item) => organization.modules?.[item.id] !== false);

  document.documentElement.style.setProperty('--client-accent', organization.accent_color || '#6B4A7D');
  app.innerHTML = `
    <div class="app-shell">
      <aside class="sidebar" id="sidebar">
        <a class="sidebar-brand" href="/">
          <img class="official-wordmark" src="/assets/laduna-logo-horizontal.png" alt="LADUNA Studio">
        </a>
        <button class="sidebar-close" id="sidebarClose" type="button" aria-label="Fechar menu">${icon('close')}</button>
        <div class="sidebar-client">
          <div class="client-identity">
            ${clientAvatar(organization)}
            <div><strong>${escapeHtml(organization.name)}</strong><span>${escapeHtml(organization.segment || 'Cliente LADUNA')}</span></div>
          </div>
        </div>
        <nav class="sidebar-nav" aria-label="Navegação do portal">
          ${navItems.map((item) => `
            <button class="nav-button ${state.view === item.id ? 'is-active' : ''}" type="button" data-view="${item.id}">
              ${icon(item.icon)}<span>${escapeHtml(item.label)}</span>
            </button>`).join('')}
        </nav>
        <div class="sidebar-footer">
          <div class="profile-chip">
            <span class="profile-initials">${escapeHtml(initials(state.profile.full_name))}</span>
            <div><strong>${escapeHtml(state.profile.full_name)}</strong><span>${state.previewMode ? 'Prévia do cliente' : isAdmin ? 'Administrador' : 'Acesso do cliente'}</span></div>
          </div>
          ${state.previewMode ? `<button class="nav-button" type="button" id="exitPreviewSidebar">${icon('arrow')}<span>Voltar à administração</span></button>` : ''}
          <button class="nav-button logout-button" type="button" id="logoutButton">${icon('logout')}<span>Sair</span></button>
        </div>
      </aside>
      <main class="app-main">
        <header class="topbar">
          <div style="display:flex;align-items:center;gap:12px;min-width:0">
            <button class="mobile-menu" id="mobileMenu" type="button" aria-label="Abrir menu">${icon('menu')}</button>
            <div class="topbar-title"><h1 id="topbarHeading">Portal</h1><p>${escapeHtml(state.dashboard?.periodLabel || 'Gestão de clientes')}</p></div>
          </div>
          <div class="topbar-actions">
            <span class="sync-status"><i class="sync-dot"></i>${state.previewMode ? 'Modo de prévia' : 'Dados atualizados'}</span>
            ${state.previewMode ? `<button class="button button-secondary button-small" type="button" id="exitPreview">Voltar à administração</button>` : isAdmin ? `<button class="button button-primary button-small" type="button" data-action="new-client">${icon('plus', 16)} Novo cliente</button>` : ''}
          </div>
        </header>
        <div class="app-content" id="pageContent"></div>
      </main>
    </div>`;

  bindShellEvents();
  renderCurrentPage();
}

function bindShellEvents() {
  document.querySelectorAll('[data-view]').forEach((button) => {
    button.addEventListener('click', () => {
      state.view = button.dataset.view;
      document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('is-active', item === button));
      document.getElementById('sidebar').classList.remove('is-open');
      renderCurrentPage();
    });
  });
  document.getElementById('logoutButton').addEventListener('click', async () => {
    await state.api.logout();
    state.profile = null;
    loginScreen();
  });
  document.getElementById('mobileMenu').addEventListener('click', () => document.getElementById('sidebar').classList.toggle('is-open'));
  document.getElementById('sidebarClose').addEventListener('click', () => document.getElementById('sidebar').classList.remove('is-open'));
  document.getElementById('exitPreview')?.addEventListener('click', exitClientPreview);
  document.getElementById('exitPreviewSidebar')?.addEventListener('click', exitClientPreview);
  document.querySelector('[data-action="new-client"]')?.addEventListener('click', () => openOrganizationModal());
}

function setPageHeading(title) {
  document.getElementById('topbarHeading').textContent = title;
  document.title = `${title} | Portal LADUNA`;
}

function pageHead(kicker, title, description, actions = '') {
  return `<div class="page-head"><div><p class="section-kicker">${escapeHtml(kicker)}</p><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p></div>${actions ? `<div class="page-actions">${actions}</div>` : ''}</div>`;
}

function metrics(items = []) {
  if (!items.length) return '';
  return `<div class="metric-grid">${items.map((item) => `
    <article class="metric">
      <div class="metric-label"><span>${escapeHtml(item.label)}</span>${item.delta ? `<span class="delta ${escapeHtml(item.tone || '')}">${escapeHtml(item.delta)}</span>` : ''}</div>
      <strong class="metric-value">${escapeHtml(item.value)}</strong>
      <span class="metric-context">${escapeHtml(item.context || '')}</span>
    </article>`).join('')}</div>`;
}

function chart(series = []) {
  if (!series.length) return `<div class="empty-state">${icon('chart-column', 28)}<strong>Dados ainda não publicados</strong><span>A LADUNA está preparando esta visualização.</span></div>`;
  const max = Math.max(...series.flatMap((item) => [Number(item.value) || 0, Number(item.target) || 0]), 1);
  return `<div class="chart"><div class="chart-legend"><span>${max}</span><span>${Math.round(max / 2)}</span><span>0</span></div><div class="bar-chart">
    ${series.map((item) => {
      const valueHeight = Math.max(3, ((Number(item.value) || 0) / max) * 100);
      const targetTop = 100 - (((Number(item.target) || 0) / max) * 100);
      return `<div class="chart-column"><span class="chart-bar" style="height:${valueHeight}%;--target-top:${targetTop}%"><b class="chart-value">${escapeHtml(item.value)}</b></span><span class="chart-label">${escapeHtml(item.label)}</span></div>`;
    }).join('')}
  </div></div>`;
}

function alerts(items = []) {
  if (!items.length) return `<div class="empty-state"><strong>Sem alertas no momento</strong><span>Novas recomendações aparecerão aqui.</span></div>`;
  return `<div class="alert-list">${items.map((item) => `<article class="alert-item"><i class="alert-mark ${escapeHtml(item.tone || '')}"></i><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.description)}</p></div></article>`).join('')}</div>`;
}

function renderCurrentPage() {
  const isAdmin = state.profile.role === 'admin' && !state.previewMode;
  if (isAdmin) renderAdminPage();
  else renderClientPage();
}

function renderClientPage() {
  const content = document.getElementById('pageContent');
  const dashboard = state.dashboard || emptyDashboard(state.organization.name);
  const page = state.view;
  if (page === 'overview') content.innerHTML = renderOverview(dashboard);
  else if (page === 'sales') content.innerHTML = renderSales(dashboard.sales);
  else if (page === 'marketing') content.innerHTML = renderMarketing(dashboard.marketing);
  else if (page === 'goals') content.innerHTML = renderGoals(dashboard.goals);
  else if (page === 'content') content.innerHTML = renderCalendar(dashboard.content);
  else if (page === 'reports') content.innerHTML = renderReports(dashboard.reports);
  else if (page === 'requests') content.innerHTML = renderClientRequests();
  bindClientPageEvents();
}

function renderOverview(dashboard) {
  setPageHeading('Visão geral');
  const data = dashboard.overview;
  return `${pageHead(state.dashboard.periodLabel, data.title, data.summary)}${metrics(data.kpis)}
    <div class="dashboard-grid">
      <section class="panel"><header class="panel-header"><div><h3>Evolução do período</h3><p>Realizado por etapa, com referência de meta.</p></div></header>${chart(data.series)}</section>
      <section class="panel"><header class="panel-header"><div><h3>Pontos de atenção</h3><p>Leituras prioritárias para tomada de decisão.</p></div></header><div class="panel-body">${alerts(data.alerts)}</div></section>
    </div>`;
}

function renderSales(data) {
  setPageHeading('Vendas e receita');
  return `${pageHead('Desempenho comercial', data.title, data.summary)}${metrics(data.kpis)}
    <div class="split-grid">
      <section class="panel"><header class="panel-header"><div><h3>Resultado por categoria</h3><p>Progresso em relação à meta definida.</p></div></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Categoria</th><th>Realizado</th><th>Meta</th><th>Progresso</th></tr></thead><tbody>${(data.categories || []).map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.target)}</td><td><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Number(item.progress) || 0)}%"></div></div></td></tr>`).join('')}</tbody></table></div></section>
      <section class="panel"><header class="panel-header"><div><h3>Canais de venda</h3><p>Participação estimada no resultado.</p></div></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Canal</th><th>Receita</th><th>Participação</th></tr></thead><tbody>${(data.channels || []).map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.value)}</td><td>${escapeHtml(item.share)}</td></tr>`).join('')}</tbody></table></div></section>
    </div>
    <section class="panel" style="margin-top:24px"><header class="panel-header"><div><h3>Desempenho da equipe</h3><p>Consolidado comercial informado para o período.</p></div></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Equipe</th><th>Vendas</th><th>Receita</th><th>Ticket</th></tr></thead><tbody>${(data.team || []).map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td>${escapeHtml(item.sales)}</td><td>${escapeHtml(item.revenue)}</td><td>${escapeHtml(item.ticket)}</td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderMarketing(data) {
  setPageHeading('Leads e marketing');
  return `${pageHead('Aquisição e campanhas', data.title, data.summary)}${metrics(data.kpis)}
    <section class="panel"><header class="panel-header"><div><h3>Funil de aquisição</h3><p>Da audiência alcançada até o resultado comercial.</p></div></header><div class="panel-body"><div class="funnel">${(data.funnel || []).map((item) => `<div class="funnel-row"><span class="funnel-label">${escapeHtml(item.label)}</span><div class="funnel-bar"><span style="width:${Math.min(100, Number(item.percent) || 0)}%"></span></div><strong class="funnel-value">${escapeHtml(item.value)}</strong></div>`).join('')}</div></div></section>
    <section class="panel" style="margin-top:24px"><header class="panel-header"><div><h3>Campanhas</h3><p>Investimento, geração de demanda e retorno atribuído.</p></div></header><div class="table-wrap"><table class="data-table"><thead><tr><th>Campanha</th><th>Status</th><th>Investimento</th><th>Leads</th><th>Receita</th><th>Retorno</th></tr></thead><tbody>${(data.campaigns || []).map((item) => `<tr><td><strong>${escapeHtml(item.name)}</strong></td><td><span class="status ${item.status === 'Ativa' ? '' : 'warning'}">${escapeHtml(item.status)}</span></td><td>${escapeHtml(item.investment)}</td><td>${escapeHtml(item.leads)}</td><td>${escapeHtml(item.result)}</td><td><strong>${escapeHtml(item.return)}</strong></td></tr>`).join('')}</tbody></table></div></section>`;
}

function renderGoals(data) {
  setPageHeading('Metas');
  return `${pageHead('Prioridades e progresso', data.title, data.summary)}
    <section class="goal-summary"><div><p>Resultado alcançado</p><strong>${escapeHtml(data.achieved)}</strong><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Number(data.progress) || 0)}%"></div></div></div><div><p>Meta definida</p><strong class="goal-percentage">${escapeHtml(data.target)}</strong></div></section>
    <div class="goal-list">${(data.items || []).map((item) => `<article class="goal-item"><span>${escapeHtml(item.label)}</span><strong>${escapeHtml(item.value)}</strong><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, Number(item.progress) || 0)}%"></div></div></article>`).join('')}</div>`;
}

function renderCalendar(data) {
  setPageHeading('Calendário');
  return `${pageHead('Planejamento', data.title, data.summary)}<section class="panel"><div class="panel-body"><div class="calendar-list">${(data.items || []).map((item) => `<article class="calendar-item"><span class="calendar-date">${escapeHtml(item.date)}</span><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.channel)}</p></div><span class="status ${item.status === 'Aprovado' ? '' : item.status === 'Planejado' ? 'neutral' : 'warning'}">${escapeHtml(item.status)}</span></article>`).join('') || '<div class="empty-state"><strong>Nenhum conteúdo agendado</strong></div>'}</div></div></section>`;
}

function renderReports(data) {
  setPageHeading('Relatórios');
  return `${pageHead('Documentos', data.title, data.summary)}<div class="report-list">${(data.items || []).map((item) => { const reportUrl = safeExternalUrl(item.url); return `<article class="report-item"><span class="report-icon">${icon('file-chart')}</span><strong>${escapeHtml(item.title)}</strong><span>${escapeHtml(item.period)}</span>${reportUrl ? `<a href="${escapeHtml(reportUrl)}" target="_blank" rel="noopener">Abrir relatório</a>` : '<span style="margin-top:auto">Em preparação</span>'}</article>`; }).join('') || '<section class="panel"><div class="empty-state"><strong>Nenhum relatório publicado</strong></div></section>'}</div>`;
}

function requestStatus(status) {
  const map = { open: ['Aberta', 'warning'], in_progress: ['Em andamento', 'neutral'], done: ['Concluída', ''] };
  return map[status] || map.open;
}

function renderClientRequests() {
  setPageHeading('Solicitações');
  return `${pageHead('Contato com a LADUNA', 'Solicitações e ajustes', 'Registre pedidos, correções e novas necessidades para a equipe responsável.')}
    <div class="split-grid">
      <section class="panel"><header class="panel-header"><div><h3>Nova solicitação</h3><p>Descreva o que sua empresa precisa.</p></div></header><div class="panel-body"><form class="request-form" id="requestForm"><div class="field"><label for="requestTitle">Assunto</label><input id="requestTitle" name="title" required maxlength="120"></div><div class="field"><label for="requestMessage">Detalhes</label><textarea id="requestMessage" name="message" required maxlength="1500"></textarea></div><button class="button button-primary" type="submit">Enviar solicitação</button></form></div></section>
      <section class="panel"><header class="panel-header"><div><h3>Histórico</h3><p>Acompanhamento dos pedidos enviados.</p></div></header><div class="panel-body"><div class="request-history">${state.requests.map((item) => { const status = requestStatus(item.status); return `<article class="request-item"><div><strong>${escapeHtml(item.title)}</strong><p>${escapeHtml(item.message)}</p><span class="request-meta">${formatDate(item.created_at, true)}</span></div><span class="status ${status[1]}">${status[0]}</span></article>`; }).join('') || '<div class="empty-state"><strong>Nenhuma solicitação enviada</strong></div>'}</div></div></section>
    </div>`;
}

function bindClientPageEvents() {
  document.getElementById('requestForm')?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const button = event.currentTarget.querySelector('button');
    button.disabled = true;
    try {
      await state.api.createRequest({ organization_id: state.organization.id, created_by: state.profile.id, title: String(data.get('title')), message: String(data.get('message')) });
      state.requests = await state.api.listRequests(state.organization.id);
      notify('Solicitação enviada para a LADUNA.');
      renderClientPage();
    } catch (error) {
      notify(error.message, 'error');
      button.disabled = false;
    }
  });
}

function renderAdminPage() {
  const content = document.getElementById('pageContent');
  if (state.view === 'admin-clients') content.innerHTML = renderAdminClients();
  else if (state.view === 'admin-users') content.innerHTML = renderAdminUsers();
  else if (state.view === 'admin-requests') content.innerHTML = renderAdminRequests();
  else content.innerHTML = renderAdminOverview();
  bindAdminEvents();
}

function renderAdminOverview() {
  setPageHeading('Visão geral');
  const activeClients = state.organizations.filter((item) => item.status === 'active').length;
  const clientUsers = state.profiles.filter((item) => item.role === 'client' && item.active).length;
  const openRequests = state.requests.filter((item) => item.status !== 'done').length;
  return `${pageHead('Administração LADUNA', 'Controle da área do cliente', 'Gerencie empresas, acessos, indicadores, metas, entregas e solicitações a partir de um único lugar.', `<button class="button button-primary" type="button" data-action="new-client">${icon('plus')} Cadastrar cliente</button>`)}
    <div class="admin-summary"><article><span>Clientes ativos</span><strong>${activeClients}</strong></article><article><span>Acessos liberados</span><strong>${clientUsers}</strong></article><article><span>Solicitações abertas</span><strong>${openRequests}</strong></article></div>
    <div class="admin-layout">
      <section class="panel"><header class="panel-header"><div><h3>Clientes recentes</h3><p>Painéis e informações disponíveis no portal.</p></div><button class="button button-quiet button-small" data-action="view-clients">Ver todos</button></header>${clientRows(state.organizations.slice(0, 6))}</section>
      <section class="panel quick-panel"><header class="panel-header"><div><h3>Ações rápidas</h3><p>Operações frequentes do portal.</p></div></header><div class="panel-body"><button class="quick-button" data-action="new-client">${icon('building')}<span><strong>Novo cliente</strong><span>Criar empresa e módulos</span></span></button><button class="quick-button" data-action="new-user">${icon('key')}<span><strong>Novo acesso</strong><span>Definir e-mail e senha</span></span></button><button class="quick-button" data-action="view-requests">${icon('messages')}<span><strong>Solicitações</strong><span>Acompanhar pedidos</span></span></button></div></section>
    </div>`;
}

function clientRows(items) {
  if (!items.length) return '<div class="empty-state"><strong>Nenhum cliente cadastrado</strong><span>Cadastre a primeira empresa para começar.</span></div>';
  return `<div class="client-list">${items.map((organization) => `<article class="client-row"><div class="client-name">${clientAvatar(organization)}<div><strong>${escapeHtml(organization.name)}</strong><span>${escapeHtml(organization.segment || 'Segmento não informado')}</span></div></div><div><strong>${Object.values(organization.modules || {}).filter(Boolean).length}</strong><span class="client-cell-label">módulos ativos</span></div><div><span class="status ${organization.status === 'active' ? '' : 'neutral'}">${organization.status === 'active' ? 'Ativo' : 'Pausado'}</span></div><div class="client-row-actions"><button class="icon-button" type="button" data-preview-client="${organization.id}" aria-label="Visualizar como cliente" title="Visualizar como cliente">${icon('eye', 16)}</button><button class="icon-button" type="button" data-edit-dashboard="${organization.id}" aria-label="Editar painel" title="Editar painel">${icon('chart-column', 16)}</button><button class="icon-button" type="button" data-edit-client="${organization.id}" aria-label="Editar cliente" title="Editar cliente">${icon('edit', 16)}</button></div></article>`).join('')}</div>`;
}

function renderAdminClients() {
  setPageHeading('Clientes');
  return `${pageHead('Empresas atendidas', 'Clientes e painéis', 'Configure identidade, módulos e informações apresentadas para cada empresa.', `<button class="button button-primary" type="button" data-action="new-client">${icon('plus')} Cadastrar cliente</button>`)}<section class="panel">${clientRows(state.organizations)}</section>`;
}

function renderAdminUsers() {
  setPageHeading('Acessos');
  const clients = state.profiles.filter((item) => item.role === 'client');
  return `${pageHead('Controle de acesso', 'Usuários do portal', 'Crie credenciais, redefina senhas e bloqueie acessos sem alterar os dados do cliente.', `<button class="button button-primary" type="button" data-action="new-user">${icon('plus')} Criar acesso</button>`)}
    <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Usuário</th><th>Empresa</th><th>Status</th><th>Ações</th></tr></thead><tbody>${clients.map((profile) => { const organization = state.organizations.find((item) => item.id === profile.organization_id); return `<tr><td><strong>${escapeHtml(profile.full_name)}</strong><br><span style="color:var(--muted);font-size:11px">${escapeHtml(profile.email)}</span></td><td>${escapeHtml(organization?.name || 'Sem empresa')}</td><td><span class="status ${profile.active ? '' : 'danger'}">${profile.active ? 'Ativo' : 'Bloqueado'}</span></td><td><div style="display:flex;gap:7px"><button class="button button-secondary button-small" data-reset-password="${profile.id}">${icon('key', 15)} Nova senha</button><button class="button button-quiet button-small" data-toggle-user="${profile.id}" data-active="${profile.active}">${profile.active ? 'Bloquear' : 'Liberar'}</button></div></td></tr>`; }).join('') || '<tr><td colspan="4"><div class="empty-state"><strong>Nenhum acesso de cliente criado</strong></div></td></tr>'}</tbody></table></div></section>`;
}

function renderAdminRequests() {
  setPageHeading('Solicitações');
  return `${pageHead('Atendimento', 'Solicitações dos clientes', 'Acompanhe pedidos enviados pelo portal e mantenha o cliente informado sobre o andamento.')}
    <section class="panel"><div class="table-wrap"><table class="data-table"><thead><tr><th>Cliente</th><th>Solicitação</th><th>Recebida</th><th>Status</th></tr></thead><tbody>${state.requests.map((item) => { const organization = state.organizations.find((org) => org.id === item.organization_id); return `<tr><td><strong>${escapeHtml(organization?.name || 'Cliente')}</strong></td><td><strong>${escapeHtml(item.title)}</strong><br><span style="color:var(--muted);font-size:11px">${escapeHtml(item.message)}</span></td><td>${formatDate(item.created_at, true)}</td><td><select class="table-input" data-request-status="${item.id}" style="min-height:36px;padding:6px 8px"><option value="open" ${item.status === 'open' ? 'selected' : ''}>Aberta</option><option value="in_progress" ${item.status === 'in_progress' ? 'selected' : ''}>Em andamento</option><option value="done" ${item.status === 'done' ? 'selected' : ''}>Concluída</option></select></td></tr>`; }).join('') || '<tr><td colspan="4"><div class="empty-state"><strong>Nenhuma solicitação recebida</strong></div></td></tr>'}</tbody></table></div></section>`;
}

function bindAdminEvents() {
  document.querySelectorAll('[data-action="new-client"]').forEach((button) => button.addEventListener('click', () => openOrganizationModal()));
  document.querySelectorAll('[data-action="new-user"]').forEach((button) => button.addEventListener('click', openUserModal));
  document.querySelectorAll('[data-action="view-clients"]').forEach((button) => button.addEventListener('click', () => switchAdminView('admin-clients')));
  document.querySelectorAll('[data-action="view-requests"]').forEach((button) => button.addEventListener('click', () => switchAdminView('admin-requests')));
  document.querySelectorAll('[data-edit-client]').forEach((button) => button.addEventListener('click', () => openOrganizationModal(state.organizations.find((item) => item.id === button.dataset.editClient))));
  document.querySelectorAll('[data-edit-dashboard]').forEach((button) => button.addEventListener('click', () => openDashboardEditor(button.dataset.editDashboard)));
  document.querySelectorAll('[data-preview-client]').forEach((button) => button.addEventListener('click', () => openClientPreview(button.dataset.previewClient)));
  document.querySelectorAll('[data-reset-password]').forEach((button) => button.addEventListener('click', () => openPasswordModal(button.dataset.resetPassword)));
  document.querySelectorAll('[data-toggle-user]').forEach((button) => button.addEventListener('click', async () => {
    try {
      await state.api.setUserActive(button.dataset.toggleUser, button.dataset.active !== 'true');
      state.profiles = await state.api.listProfiles();
      notify(button.dataset.active === 'true' ? 'Acesso bloqueado.' : 'Acesso liberado.');
      renderAdminPage();
    } catch (error) { notify(error.message, 'error'); }
  }));
  document.querySelectorAll('[data-request-status]').forEach((select) => select.addEventListener('change', async () => {
    try {
      await state.api.updateRequest(select.dataset.requestStatus, select.value);
      state.requests = await state.api.listRequests();
      notify('Status atualizado.');
    } catch (error) { notify(error.message, 'error'); }
  }));
}

function switchAdminView(view) {
  state.view = view;
  document.querySelectorAll('[data-view]').forEach((item) => item.classList.toggle('is-active', item.dataset.view === view));
  renderAdminPage();
}

async function openClientPreview(organizationId) {
  state.adminReturnView = state.view;
  setLoading('Preparando a prévia do cliente');
  try {
    state.organization = state.organizations.find((item) => item.id === organizationId) || await state.api.getOrganization(organizationId);
    state.dashboard = await state.api.getDashboard(organizationId);
    state.requests = await state.api.listRequests(organizationId);
    state.previewMode = true;
    state.view = Object.entries(state.organization.modules || DEFAULT_MODULES).find(([, enabled]) => enabled)?.[0] || 'overview';
    renderShell();
  } catch (error) {
    state.previewMode = false;
    state.organization = null;
    state.dashboard = null;
    notify(error.message, 'error');
    await reloadAdmin();
  }
}

async function exitClientPreview() {
  setLoading('Voltando à administração');
  state.previewMode = false;
  state.organization = null;
  state.dashboard = null;
  state.view = state.adminReturnView || 'admin-overview';
  await reloadAdmin();
}

async function reloadAdmin() {
  [state.organizations, state.profiles, state.requests] = await Promise.all([
    state.api.listOrganizations(),
    state.api.listProfiles(),
    state.api.listRequests()
  ]);
  renderShell();
}

function openModal({ title, subtitle = '', body, footer = '', wide = false }) {
  const backdrop = document.createElement('div');
  backdrop.className = 'modal-backdrop';
  backdrop.innerHTML = `<section class="modal ${wide ? 'modal-wide' : ''}" role="dialog" aria-modal="true"><header class="modal-header"><div><h2>${escapeHtml(title)}</h2>${subtitle ? `<p>${escapeHtml(subtitle)}</p>` : ''}</div><button class="modal-close" type="button" data-close-modal aria-label="Fechar">${icon('close')}</button></header>${body}<footer class="modal-footer">${footer}</footer></section>`;
  document.body.appendChild(backdrop);
  const close = () => backdrop.remove();
  backdrop.querySelector('[data-close-modal]').addEventListener('click', close);
  backdrop.addEventListener('click', (event) => { if (event.target === backdrop) close(); });
  document.addEventListener('keydown', function escapeModal(event) { if (event.key === 'Escape') { close(); document.removeEventListener('keydown', escapeModal); } });
  return { backdrop, close };
}

function openOrganizationModal(organization = null) {
  const current = organization || { name: '', slug: '', segment: '', logo_url: '', accent_color: '#6B4A7D', status: 'active', modules: { ...DEFAULT_MODULES } };
  const modal = openModal({
    title: organization ? 'Editar cliente' : 'Cadastrar cliente',
    subtitle: 'Identidade, acesso ao portal e módulos disponíveis.',
    body: `<form class="modal-body form-grid" id="organizationForm">
      <div class="field"><label for="orgName">Nome da empresa</label><input id="orgName" name="name" value="${escapeHtml(current.name)}" required></div>
      <div class="field"><label for="orgSlug">Identificador</label><input id="orgSlug" name="slug" value="${escapeHtml(current.slug)}" required pattern="[a-z0-9-]+"></div>
      <div class="field"><label for="orgSegment">Segmento</label><input id="orgSegment" name="segment" value="${escapeHtml(current.segment || '')}"></div>
      <div class="field"><label for="orgAccent">Cor de destaque</label><input id="orgAccent" name="accent_color" type="color" value="${escapeHtml(current.accent_color || '#6B4A7D')}"></div>
      <div class="field field-full"><label for="orgLogo">Endereço da logo</label><input id="orgLogo" name="logo_url" type="url" value="${escapeHtml(current.logo_url || '')}" placeholder="https://..."></div>
      <div class="field"><label for="orgStatus">Status</label><select id="orgStatus" name="status"><option value="active" ${current.status === 'active' ? 'selected' : ''}>Ativo</option><option value="paused" ${current.status === 'paused' ? 'selected' : ''}>Pausado</option></select></div>
      <div class="field field-full"><span class="field-label">Módulos liberados</span><div class="check-grid">${MODULES.map((item) => `<label class="check-option"><input type="checkbox" name="module_${item.id}" ${current.modules?.[item.id] !== false ? 'checked' : ''}>${icon(item.icon, 16)} ${escapeHtml(item.label)}</label>`).join('')}</div></div>
    </form>`,
    footer: '<button class="button button-secondary" type="button" data-cancel>Cancelar</button><button class="button button-primary" type="submit" form="organizationForm">Salvar cliente</button>'
  });
  const nameInput = modal.backdrop.querySelector('#orgName');
  const slugInput = modal.backdrop.querySelector('#orgSlug');
  if (!organization) nameInput.addEventListener('input', () => { slugInput.value = slugify(nameInput.value); });
  modal.backdrop.querySelector('[data-cancel]').addEventListener('click', modal.close);
  modal.backdrop.querySelector('#organizationForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const input = {
      name: String(data.get('name')).trim(),
      slug: String(data.get('slug')).trim(),
      segment: String(data.get('segment')).trim(),
      logo_url: String(data.get('logo_url')).trim(),
      accent_color: String(data.get('accent_color')),
      status: String(data.get('status')),
      modules: Object.fromEntries(MODULES.map((item) => [item.id, data.get(`module_${item.id}`) === 'on']))
    };
    const save = modal.backdrop.querySelector('button[type="submit"]');
    save.disabled = true;
    try {
      if (organization) await state.api.updateOrganization(organization.id, input);
      else await state.api.createOrganization(input);
      state.organizations = await state.api.listOrganizations();
      notify(organization ? 'Cliente atualizado.' : 'Cliente cadastrado.');
      modal.close();
      renderAdminPage();
    } catch (error) { notify(error.message, 'error'); save.disabled = false; }
  });
}

function openUserModal() {
  if (!state.organizations.length) return notify('Cadastre uma empresa antes de criar o acesso.', 'error');
  const modal = openModal({
    title: 'Criar acesso de cliente',
    subtitle: 'A senha será definida agora e poderá ser alterada por você depois.',
    body: `<form class="modal-body form-grid" id="userForm"><div class="field field-full"><label for="userOrganization">Empresa</label><select id="userOrganization" name="organizationId" required>${state.organizations.map((item) => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('')}</select></div><div class="field"><label for="userName">Nome do usuário</label><input id="userName" name="fullName" required></div><div class="field"><label for="userEmail">E-mail</label><input id="userEmail" name="email" type="email" autocomplete="off" required></div><div class="field field-full"><label for="userPassword">Senha inicial</label><input id="userPassword" name="password" type="password" minlength="10" autocomplete="new-password" required></div><p class="form-note field-full">Use pelo menos 10 caracteres. Envie a credencial ao cliente por um canal privado.</p></form>`,
    footer: '<button class="button button-secondary" type="button" data-cancel>Cancelar</button><button class="button button-primary" type="submit" form="userForm">Criar acesso</button>'
  });
  modal.backdrop.querySelector('[data-cancel]').addEventListener('click', modal.close);
  modal.backdrop.querySelector('#userForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const save = modal.backdrop.querySelector('button[type="submit"]');
    save.disabled = true;
    try {
      await state.api.createClientUser(Object.fromEntries(data));
      state.profiles = await state.api.listProfiles();
      notify('Acesso criado com segurança.');
      modal.close();
      renderAdminPage();
    } catch (error) { notify(error.message, 'error'); save.disabled = false; }
  });
}

function openPasswordModal(userId) {
  const profile = state.profiles.find((item) => item.id === userId);
  const modal = openModal({
    title: 'Definir nova senha',
    subtitle: profile ? `Acesso de ${profile.full_name}` : 'Acesso do cliente',
    body: '<form class="modal-body" id="passwordForm"><div class="field"><label for="newPassword">Nova senha</label><input id="newPassword" name="password" type="password" minlength="10" autocomplete="new-password" required></div><p class="form-note">A sessão atual do cliente poderá permanecer ativa até expirar. A nova senha será exigida no próximo login.</p></form>',
    footer: '<button class="button button-secondary" type="button" data-cancel>Cancelar</button><button class="button button-primary" type="submit" form="passwordForm">Atualizar senha</button>'
  });
  modal.backdrop.querySelector('[data-cancel]').addEventListener('click', modal.close);
  modal.backdrop.querySelector('#passwordForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const password = new FormData(event.currentTarget).get('password');
    try {
      await state.api.resetClientPassword(userId, String(password));
      notify('Senha atualizada.');
      modal.close();
    } catch (error) { notify(error.message, 'error'); }
  });
}

const editorFields = {
  kpis: [['label', 'Indicador'], ['value', 'Valor'], ['context', 'Contexto'], ['delta', 'Variação'], ['tone', 'Tom']],
  series: [['label', 'Etapa'], ['value', 'Realizado'], ['target', 'Meta']],
  alerts: [['title', 'Título'], ['description', 'Descrição'], ['status', 'Status'], ['tone', 'Tom']],
  categories: [['name', 'Categoria'], ['value', 'Realizado'], ['target', 'Meta'], ['progress', '%']],
  channels: [['name', 'Canal'], ['value', 'Valor'], ['share', 'Participação']],
  team: [['name', 'Equipe'], ['sales', 'Vendas'], ['revenue', 'Receita'], ['ticket', 'Ticket']],
  funnel: [['label', 'Etapa'], ['value', 'Valor'], ['percent', 'Largura %']],
  campaigns: [['name', 'Campanha'], ['status', 'Status'], ['investment', 'Investimento'], ['leads', 'Leads'], ['result', 'Receita'], ['return', 'Retorno']],
  goals: [['label', 'Meta'], ['value', 'Valor'], ['progress', 'Progresso %']],
  calendar: [['date', 'Data'], ['title', 'Conteúdo'], ['channel', 'Canal'], ['status', 'Status']],
  reports: [['title', 'Relatório'], ['period', 'Período'], ['url', 'Link']]
};

function repeatGroup(key, rows = []) {
  const fields = editorFields[key];
  return `<div class="repeat-group" data-repeat="${key}">${rows.map((row) => repeatRow(key, row)).join('')}</div>`;
}

function repeatRow(key, row = {}) {
  const fields = editorFields[key];
  const className = fields.length >= 5 ? 'is-five' : fields.length === 4 ? 'is-four' : '';
  return `<div class="repeat-row ${className}">${fields.map(([field, label]) => {
    if (field === 'tone') {
      const current = row[field] || 'neutral';
      return `<select name="tone" aria-label="Tom do indicador"><option value="neutral" ${current === 'neutral' ? 'selected' : ''}>Neutro</option><option value="success" ${current === 'success' ? 'selected' : ''}>Positivo</option><option value="warning" ${current === 'warning' ? 'selected' : ''}>Atenção</option><option value="danger" ${current === 'danger' ? 'selected' : ''}>Crítico</option></select>`;
    }
    return `<input name="${field}" value="${escapeHtml(row[field] ?? '')}" placeholder="${escapeHtml(label)}" aria-label="${escapeHtml(label)}">`;
  }).join('')}<button class="icon-button remove-row" type="button" aria-label="Remover linha">${icon('trash', 15)}</button></div>`;
}

function editorSection(title, description, key, rows) {
  return `<section class="editor-section"><div class="editor-section-head"><div><h3>${escapeHtml(title)}</h3><p>${escapeHtml(description)}</p></div><button class="button button-secondary button-small" type="button" data-add-row="${key}">${icon('plus', 14)} Adicionar</button></div>${repeatGroup(key, rows)}</section>`;
}

function dashboardEditorBody(tab) {
  const draft = state.editorDraft;
  const section = draft[tab];
  const intro = tab !== 'overview' ? `<div class="form-grid" style="margin-bottom:26px"><div class="field"><label>Título da página</label><input name="section_title" value="${escapeHtml(section.title || '')}"></div><div class="field"><label>Descrição</label><input name="section_summary" value="${escapeHtml(section.summary || '')}"></div></div>` : '';
  if (tab === 'overview') return `<div class="form-grid" style="margin-bottom:26px"><div class="field"><label>Período exibido</label><input name="periodLabel" value="${escapeHtml(draft.periodLabel || '')}"></div><div class="field"><label>Título executivo</label><input name="overview_title" value="${escapeHtml(section.title || '')}"></div><div class="field field-full"><label>Resumo executivo</label><textarea name="overview_summary">${escapeHtml(section.summary || '')}</textarea></div></div>${editorSection('Indicadores', 'Até quatro indicadores principais.', 'kpis', section.kpis)}${editorSection('Gráfico do período', 'Valores numéricos de realizado e meta.', 'series', section.series)}${editorSection('Pontos de atenção', 'Recomendações e alertas prioritários.', 'alerts', section.alerts)}`;
  if (tab === 'sales') return `${intro}${editorSection('Indicadores', 'Resumo comercial do período.', 'kpis', section.kpis)}${editorSection('Categorias', 'Resultado e meta por categoria.', 'categories', section.categories)}${editorSection('Canais', 'Participação dos canais de venda.', 'channels', section.channels)}${editorSection('Equipe', 'Desempenho comercial consolidado.', 'team', section.team)}`;
  if (tab === 'marketing') return `${intro}${editorSection('Indicadores', 'Resumo de mídia e aquisição.', 'kpis', section.kpis)}${editorSection('Funil', 'Etapas e proporção visual do funil.', 'funnel', section.funnel)}${editorSection('Campanhas', 'Resultados atribuídos por campanha.', 'campaigns', section.campaigns)}`;
  if (tab === 'goals') return `${intro}<div class="form-grid" style="margin-bottom:26px"><div class="field"><label>Meta total</label><input name="goal_target" value="${escapeHtml(section.target || '')}"></div><div class="field"><label>Resultado alcançado</label><input name="goal_achieved" value="${escapeHtml(section.achieved || '')}"></div><div class="field"><label>Progresso geral %</label><input name="goal_progress" type="number" min="0" max="100" value="${escapeHtml(section.progress || 0)}"></div></div>${editorSection('Metas detalhadas', 'Prioridades acompanhadas no ciclo.', 'goals', section.items)}`;
  if (tab === 'content') return `${intro}${editorSection('Publicações e campanhas', 'Itens programados no calendário.', 'calendar', section.items)}`;
  if (tab === 'reports') return `${intro}${editorSection('Documentos publicados', 'Use links públicos ou protegidos para os arquivos.', 'reports', section.items)}`;
  return '';
}

function collectRows(root, key) {
  const fields = editorFields[key];
  return [...root.querySelectorAll(`[data-repeat="${key}"] .repeat-row`)].map((row) => Object.fromEntries(fields.map(([field]) => [field, row.querySelector(`[name="${field}"]`)?.value.trim() || '']))).filter((row) => Object.values(row).some(Boolean));
}

function collectEditorTab(root, tab) {
  const draft = state.editorDraft;
  const section = draft[tab];
  if (tab === 'overview') {
    draft.periodLabel = root.querySelector('[name="periodLabel"]')?.value.trim() || '';
    section.title = root.querySelector('[name="overview_title"]')?.value.trim() || '';
    section.summary = root.querySelector('[name="overview_summary"]')?.value.trim() || '';
    section.kpis = collectRows(root, 'kpis');
    section.series = collectRows(root, 'series').map((item) => ({ ...item, value: Number(item.value) || 0, target: Number(item.target) || 0 }));
    section.alerts = collectRows(root, 'alerts');
  } else {
    section.title = root.querySelector('[name="section_title"]')?.value.trim() || '';
    section.summary = root.querySelector('[name="section_summary"]')?.value.trim() || '';
    if (tab === 'sales') {
      section.kpis = collectRows(root, 'kpis'); section.categories = collectRows(root, 'categories'); section.channels = collectRows(root, 'channels'); section.team = collectRows(root, 'team');
    } else if (tab === 'marketing') {
      section.kpis = collectRows(root, 'kpis'); section.funnel = collectRows(root, 'funnel').map((item) => ({ ...item, percent: Number(item.percent) || 0 })); section.campaigns = collectRows(root, 'campaigns');
    } else if (tab === 'goals') {
      section.target = root.querySelector('[name="goal_target"]')?.value.trim() || ''; section.achieved = root.querySelector('[name="goal_achieved"]')?.value.trim() || ''; section.progress = Number(root.querySelector('[name="goal_progress"]')?.value) || 0; section.items = collectRows(root, 'goals').map((item) => ({ ...item, progress: Number(item.progress) || 0 }));
    } else if (tab === 'content') section.items = collectRows(root, 'calendar');
    else if (tab === 'reports') section.items = collectRows(root, 'reports');
  }
}

async function openDashboardEditor(organizationId) {
  const organization = state.organizations.find((item) => item.id === organizationId);
  setLoading('Abrindo painel do cliente');
  try {
    state.editorDraft = await state.api.getDashboard(organizationId);
    state.editorTab = 'overview';
    renderShell();
  } catch (error) {
    renderShell();
    return notify(error.message, 'error');
  }
  const tabs = ['overview', 'sales', 'marketing', 'goals', 'content', 'reports'];
  const labels = { overview: 'Visão geral', sales: 'Vendas', marketing: 'Marketing', goals: 'Metas', content: 'Calendário', reports: 'Relatórios' };
  const modal = openModal({
    title: `Painel de ${organization.name}`,
    subtitle: 'As alterações ficam visíveis somente para os usuários desta empresa.',
    wide: true,
    body: `<div class="editor-tabs">${tabs.map((tab) => `<button class="editor-tab ${tab === state.editorTab ? 'is-active' : ''}" type="button" data-editor-tab="${tab}">${labels[tab]}</button>`).join('')}</div><form class="modal-body" id="dashboardForm">${dashboardEditorBody(state.editorTab)}</form>`,
    footer: '<button class="button button-secondary" type="button" data-cancel>Cancelar</button><button class="button button-primary" type="submit" form="dashboardForm">Publicar alterações</button>'
  });
  const form = modal.backdrop.querySelector('#dashboardForm');
  form.addEventListener('click', (event) => {
    const addButton = event.target.closest('[data-add-row]');
    if (addButton) {
      form.querySelector(`[data-repeat="${addButton.dataset.addRow}"]`).insertAdjacentHTML('beforeend', repeatRow(addButton.dataset.addRow));
      return;
    }
    const removeButton = event.target.closest('.remove-row');
    if (removeButton) removeButton.closest('.repeat-row').remove();
  });
  modal.backdrop.querySelectorAll('[data-editor-tab]').forEach((button) => button.addEventListener('click', () => {
    collectEditorTab(form, state.editorTab);
    state.editorTab = button.dataset.editorTab;
    modal.backdrop.querySelectorAll('[data-editor-tab]').forEach((tabButton) => tabButton.classList.toggle('is-active', tabButton === button));
    form.innerHTML = dashboardEditorBody(state.editorTab);
  }));
  modal.backdrop.querySelector('[data-cancel]').addEventListener('click', modal.close);
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    collectEditorTab(form, state.editorTab);
    const save = modal.backdrop.querySelector('button[type="submit"]');
    save.disabled = true;
    try {
      await state.api.saveDashboard(organizationId, state.editorDraft);
      state.organizations = await state.api.listOrganizations();
      notify('Painel publicado para o cliente.');
      modal.close();
      renderAdminPage();
    } catch (error) { notify(error.message, 'error'); save.disabled = false; }
  });
}

async function startAuthenticated() {
  setLoading('Validando acesso');
  try {
    state.profile = await state.api.getProfile();
    if (!state.profile || !state.profile.active) {
      await state.api.logout();
      return loginScreen('Este acesso está indisponível. Fale com a LADUNA.');
    }
    if (state.profile.role === 'admin') {
      state.previewMode = false;
      state.view = 'admin-overview';
      [state.organizations, state.profiles, state.requests] = await Promise.all([
        state.api.listOrganizations(),
        state.api.listProfiles(),
        state.api.listRequests()
      ]);
      state.organization = null;
      state.dashboard = null;
    } else {
      const membership = await state.api.getMembership(state.profile.id);
      if (!membership) throw new Error('Nenhuma empresa foi vinculada a este acesso.');
      state.organization = await state.api.getOrganization(membership.organization_id);
      if (!state.organization || state.organization.status !== 'active') throw new Error('O portal desta empresa está temporariamente indisponível.');
      state.dashboard = await state.api.getDashboard(state.organization.id);
      state.requests = await state.api.listRequests(state.organization.id);
      state.view = Object.entries(state.organization.modules || DEFAULT_MODULES).find(([, enabled]) => enabled)?.[0] || 'overview';
    }
    renderShell();
  } catch (error) {
    await state.api.logout();
    loginScreen(error.message);
  }
}

async function boot() {
  setLoading();
  state.api = await PortalApi.initialize();
  if (!state.api.isConfigured()) return setupScreen(state.api.config?.message);
  if (state.api.session) await startAuthenticated();
  else loginScreen();
}

boot();
