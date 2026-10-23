const bots = [
  { name: 'Music', icon: '♫', description: 'Reliable playback, queue control, and a room that never loses the beat.', image: '' },
  { name: 'Level', icon: '↗', description: 'XP, ranks, role rewards, and a leaderboard your members can follow.', image: '' },
  { name: 'Ticket', icon: '▱', description: 'Private support flows with clean panels, categories, and transcripts.', image: '' },
  { name: 'Guard', icon: '◌', description: 'Protection against raids, spam, and the chaos nobody invited.', image: '' },
  { name: 'Greet', icon: '✦', description: 'Warm welcomes, leave messages, and role automation for every arrival.', image: '' },
  { name: 'Custom', icon: '+', description: 'Add your own bot and keep it in the same command center.', image: '' }
];
const servers = [
  { id: 'arcadia', name: 'Arcadia HQ', initials: 'A', bots: ['Music', 'Level', 'Ticket', 'Guard'] },
  { id: 'nightfall', name: 'Nightfall', initials: 'N', bots: ['Guard', 'Greet'] }
];
const tabs = ['Overview', 'Bot Hub', 'Servers', 'Music', 'Guard', 'Greet', 'Levels', 'Tickets', 'Embeds + Reaction Roles', 'Commands', 'Logs', 'Analytics', 'Team Access', 'Settings'];
const publicSite = document.querySelector('#public-site');
const dashboard = document.querySelector('#dashboard');
const dashboardContent = document.querySelector('#dashboard-content');
const dashboardTitle = document.querySelector('#dashboard-title');
const nav = document.querySelector('#public-nav');
const toast = document.querySelector('#toast');
const modalBackdrop = document.querySelector('#modal-backdrop');
const modalContent = document.querySelector('#modal-content');
let activeTab = 'Overview';
let activeServer = servers[0];
let authenticated = false;

const escapeHtml = (value) => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));
const currentBotState = (botName) => activeServer.bots.includes(botName);
const showToast = (message) => { toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 2600); };
const closeModal = () => modalBackdrop.classList.add('hidden');
const openModal = (title, body, actionLabel = 'Continue', onConfirm = () => {}) => {
  modalContent.innerHTML = `<h2 id="modal-title">${title}</h2>${body}<button class="pill-button primary" data-modal-action>${actionLabel}</button>`;
  modalBackdrop.classList.remove('hidden');
  modalContent.querySelector('[data-modal-action]').addEventListener('click', () => { onConfirm(); closeModal(); });
  modalContent.querySelectorAll('[data-server-choice]').forEach((button) => button.addEventListener('click', () => { selectServer(button.dataset.serverChoice); closeModal(); }));
};
const enterDashboard = () => {
  authenticated = true;
  publicSite.classList.add('hidden');
  nav.classList.add('hidden');
  dashboard.classList.remove('hidden');
  renderDashboard();
  window.scrollTo(0, 0);
  showToast(`Connected to Discord · ${activeServer.name}`);
};
const login = () => openModal('Connect Discord', '<p>Sign in with Discord to view the servers you manage. AUREX will only show servers where you have management permissions.</p><p class="muted">The production version will use Discord OAuth2 with a server-side session.</p>', 'Continue with Discord', enterDashboard);
const publicBotMarkup = () => bots.filter((bot) => bot.name !== 'Custom').map((bot) => `<article class="glass-card bot-card"><div class="bot-card-top"><span class="bot-avatar">${bot.icon}</span><span class="status">Ready</span></div><h3>${bot.name}</h3><p>${bot.description}</p><button class="text-button" data-action="login">Invite ${bot.name} ↗</button></article>`).join('');
document.querySelector('#public-bots').innerHTML = publicBotMarkup();
const renderSideNav = () => {
  document.querySelector('#side-nav').innerHTML = tabs.map((tab) => `<button class="side-link ${activeTab === tab ? 'active' : ''}" data-tab="${escapeHtml(tab)}">${tab}</button>`).join('');
  document.querySelectorAll('[data-tab]').forEach((button) => button.addEventListener('click', () => { activeTab = button.dataset.tab; renderDashboard(); }));
};
const stat = (label, value) => `<article class="glass-card dashboard-stat"><span>${label}</span><strong>${value}</strong></article>`;
const overview = () => `<div class="dashboard-grid">${stat('SERVERS YOU MANAGE', '4')}${stat('BOTS ONLINE', '18')}${stat('ACTIONS TODAY', '247')}${stat('ALERTS', '3')}</div><div class="glass-card panel"><h2>Activity this week</h2><div class="activity-bars">${[34,55,42,78,63,92,70,48,84,67,95,73,52,81].map((height) => `<i style="height:${height}%"></i>`).join('')}</div></div><div class="glass-card panel"><h2>Quick actions</h2><div class="quick-actions"><button class="pill-button primary" data-action="add-bot">Add a bot</button><button class="pill-button secondary" data-action="invite-all">Invite all</button><button class="pill-button secondary" data-action="toast">View audit log</button></div></div><div class="glass-card panel"><h2>Recent logs</h2><div class="spec-list"><div><span>Guard updated automod rules</span><span>2m ago</span></div><div><span>Music joined ${activeServer.name}</span><span>18m ago</span></div><div><span>Alex changed the DJ role</span><span>1h ago</span></div></div></div>`;
const botAvatar = (bot) => bot.image ? `<img src="${bot.image}" alt="${bot.name}" />` : bot.icon;
const botHub = () => `<div class="section-heading"><div><span class="eyebrow">${activeServer.name.toUpperCase()} / BOT HUB</span><h2>Every tool,<br><em>one switch.</em></h2></div><button class="pill-button primary" data-action="add-bot">+ Add bot</button></div><div class="bot-hub-grid">${bots.map((bot) => { const added = currentBotState(bot.name); return `<article class="glass-card hub-card ${added ? 'installed' : 'not-installed'}"><header><span class="bot-avatar">${botAvatar(bot)}</span><span class="bot-state ${added ? 'state-added' : 'state-missing'}">${added ? 'Installed' : 'Not in server'}</span></header><h3>${bot.name}</h3><p>${bot.description}</p><div class="hub-actions">${added ? `<button data-action="configure" data-bot="${bot.name}">Configure</button>` : `<button data-action="invite" data-bot="${bot.name}">Add to server</button>`}</div></article>`; }).join('')}</div>`;
const serverView = () => `<div class="section-heading"><div><span class="eyebrow">SERVER ACCESS</span><h2>Your servers</h2></div><button class="pill-button primary" data-action="switch-server">Switch server</button></div><div class="bot-hub-grid">${servers.map((server) => `<article class="glass-card hub-card"><header><span class="bot-avatar">${server.initials}</span><span class="status">${server.id === activeServer.id ? 'Selected' : 'Available'}</span></header><h3>${server.name}</h3><p>${server.bots.length} AUREX bots are installed in this server.</p><div class="hub-actions"><button data-action="select-server" data-server="${server.id}">${server.id === activeServer.id ? 'Selected' : 'Manage server'}</button></div></article>`).join('')}</div>`;
const genericTab = () => `<div class="section-heading"><div><span class="eyebrow">${activeServer.name.toUpperCase()} / AUREX CONTROL ROOM</span><h2>${escapeHtml(activeTab)}</h2></div></div><div class="glass-card panel"><h2>${escapeHtml(activeTab)} is ready for your server.</h2><p class="muted">This section respects the installed-bot state. Real Discord API and bot settings can be wired here without changing the UI.</p><div class="quick-actions"><button class="pill-button primary" data-action="toast">Save changes</button><button class="pill-button secondary" data-action="toast">View activity</button></div></div>`;
const renderDashboard = () => { dashboardTitle.textContent = activeTab; renderSideNav(); dashboardContent.innerHTML = activeTab === 'Overview' ? overview() : activeTab === 'Bot Hub' ? botHub() : activeTab === 'Servers' ? serverView() : genericTab(); bindActions(); };
const openPublic = () => { authenticated = false; dashboard.classList.add('hidden'); publicSite.classList.remove('hidden'); nav.classList.remove('hidden'); window.location.hash = 'home'; };
const selectServer = (serverId) => { activeServer = servers.find((server) => server.id === serverId) || servers[0]; activeTab = 'Bot Hub'; renderDashboard(); showToast(`Now managing ${activeServer.name}`); };
const bindActions = () => {
  document.querySelectorAll('[data-action]').forEach((element) => element.addEventListener('click', () => {
    const action = element.dataset.action;
    if (action === 'login') login();
    else if (action === 'invite') { if (!currentBotState(element.dataset.bot)) { activeServer.bots.push(element.dataset.bot); renderDashboard(); showToast(`${element.dataset.bot} added to ${activeServer.name}`); } }
    else if (action === 'dashboard') authenticated ? enterDashboard() : login();
    else if (action === 'add-bot') openModal('Add a bot', '<p>Add your bot details and choose a permission preset. Bot artwork can be added later from the bot asset field.</p><input class="mock-input" placeholder="Bot name" /><input class="mock-input" placeholder="Client ID" />', 'Add to workspace', () => showToast('Bot saved to your workspace.'));
    else if (action === 'invite-all') openModal('Invite all bots', `<p>AUREX will guide you through each missing bot for ${activeServer.name}, then confirm when it joins.</p>`, 'Start wizard', () => { bots.filter((bot) => !currentBotState(bot.name) && bot.name !== 'Custom').forEach((bot) => activeServer.bots.push(bot.name)); renderDashboard(); showToast('All selected bots marked as added.'); });
    else if (action === 'configure') openModal(`Configure ${element.dataset.bot}`, `<p>${element.dataset.bot} is installed in ${activeServer.name}. Its settings, roles, channels, and bot-specific controls will appear here.</p>`, 'Open configuration');
    else if (action === 'select-server') selectServer(element.dataset.server);
    else if (action === 'switch-server') openModal('Switch server', servers.map((server) => `<button class="server-choice" data-server-choice="${server.id}">${server.initials} ${server.name}</button>`).join(''), 'Done', () => {});
    else if (action === 'logout') openPublic();
    else showToast('Action saved to the mock workspace.');
  }));
  document.querySelectorAll('[data-server-choice]').forEach((button) => button.addEventListener('click', () => { selectServer(button.dataset.serverChoice); closeModal(); }));
};
modalBackdrop?.addEventListener('click', (event) => { if (event.target === modalBackdrop) closeModal(); });
document.querySelector('.modal-close')?.addEventListener('click', closeModal);
document.querySelectorAll('a[href="#dashboard"]').forEach((element) => element.addEventListener('click', (event) => { event.preventDefault(); authenticated ? enterDashboard() : login(); }));
document.querySelector('.mobile-menu-button')?.addEventListener('click', () => { const open = nav.classList.toggle('nav-open'); document.querySelector('.public-links').style.display = open ? 'flex' : ''; });
document.querySelector('.drawer-button')?.addEventListener('click', () => dashboard.classList.toggle('drawer-open'));
document.querySelectorAll('[data-action="login"]').forEach((element) => element.addEventListener('click', login));
document.querySelectorAll('[data-action="dashboard"]').forEach((element) => element.addEventListener('click', () => authenticated ? enterDashboard() : login()));
document.querySelectorAll('[data-action="add-bot"]').forEach((element) => element.addEventListener('click', () => openModal('Add a bot', '<p>Add your bot details and choose a permission preset.</p>', 'Add to workspace')));
bindActions();
