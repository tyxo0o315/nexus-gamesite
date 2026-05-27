// render.js — Reads SITE_DATA and populates the DOM

document.addEventListener('DOMContentLoaded', () => {
  const d = SITE_DATA;

  // Inject meta
  document.title = d.meta.groupName;
  document.getElementById('site-group-name').textContent = d.meta.groupName;
  document.getElementById('hero-tagline').textContent = d.meta.tagline;
  document.getElementById('footer-group-name').textContent = d.meta.groupName;

  const githubLink = document.getElementById('footer-github');
  if (githubLink && d.meta.githubUrl) githubLink.href = d.meta.githubUrl;

  // Ideas doc embed
  const docUrl = d.meta.ideasDocUrl;
  const docWrap = document.getElementById('ideas-doc-wrap');
  if (docUrl && docWrap) {
    docWrap.hidden = false;
    const iframe = document.getElementById('ideas-doc-iframe');
    const openBtn = document.getElementById('ideas-doc-open');
    if (iframe) iframe.src = docUrl;
    if (openBtn) openBtn.href = docUrl;
  }

  // Split hero headline into animated words
  splitHeroHeadline();

  // Render sections
  renderGames(d.activeGames);
  renderMods(d.mods);
  renderIdeas(d.playingIdeas);

  // Footer last-updated
  const allDates = [
    ...d.activeGames.map(g => g.lastUpdated),
    ...d.playingIdeas.map(i => i.date),
  ];
  const latest = allDates.sort().reverse()[0];
  const el = document.getElementById('footer-updated');
  if (el && latest) el.textContent = '最后更新 ' + latest;
});

function splitHeroHeadline() {
  const hl = document.getElementById('hero-headline');
  if (!hl) return;
  const text = hl.getAttribute('data-text') || hl.textContent.trim();
  hl.textContent = '';
  const lines = text.split('/');
  lines.forEach((line, li) => {
    if (li > 0) {
      const br = document.createElement('span');
      br.className = 'line-break';
      hl.appendChild(br);
    }
    line.trim().split(' ').forEach((word, wi) => {
      if (wi > 0) hl.appendChild(document.createTextNode(' '));
      const span = document.createElement('span');
      span.className = 'word';
      const inner = document.createElement('span');
      inner.className = 'word-inner';
      inner.textContent = word;
      span.appendChild(inner);
      hl.appendChild(span);
    });
  });
}

// ── Games ──────────────────────────────────────────────────

function renderGames(games) {
  const container = document.getElementById('games-track');
  if (!container) return;
  container.innerHTML = '';
  games.forEach(g => container.appendChild(buildGameCard(g)));
}

function buildGameCard(g) {
  const card = document.createElement('article');
  card.className = 'game-card';
  card.dataset.status = g.status;

  const statusLabel = { active: '进行中', paused: '暂停中', archived: '已归档' }[g.status] || g.status;

  card.innerHTML = `
    ${g.coverImage
      ? `<div class="game-card-cover">
           <img src="${g.coverImage}" alt="${g.title}" loading="lazy" draggable="false">
           <span class="game-card-cover-emoji">${g.coverEmoji}</span>
         </div>`
      : `<div class="game-card-emoji">${g.coverEmoji}</div>`
    }
    <div>
      <div class="game-card-title">${g.title}</div>
      <div class="game-card-subtitle">${g.subtitle}</div>
    </div>
    <div class="game-card-badges">
      <span class="badge badge-version">${g.version}</span>
      <span class="badge">${g.loader}${g.loaderVersion ? ' ' + g.loaderVersion : ''}</span>
    </div>
    <div class="game-card-mod-count">
      <div class="count-number">${g.totalMods}</div>
      <div class="count-label">个模组</div>
    </div>
    <p class="game-card-notes">${g.notes}</p>
    ${g.serverAddress ? `
    <div class="game-card-server">
      <span class="server-label">服务器地址</span>
      <code class="server-address">${g.serverAddress}</code>
    </div>` : ''}
    ${g.modsLink
      ? `<a class="btn-mods-link" href="${g.modsLink}">
           <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2.5" stroke-linecap="round">
             <line x1="8" y1="6" x2="21" y2="6"/>
             <line x1="8" y1="12" x2="21" y2="12"/>
             <line x1="8" y1="18" x2="21" y2="18"/>
             <line x1="3" y1="6" x2="3.01" y2="6"/>
             <line x1="3" y1="12" x2="3.01" y2="12"/>
             <line x1="3" y1="18" x2="3.01" y2="18"/>
           </svg>
           查看 Mod 列表
         </a>`
      : ''
    }
    <div class="game-card-footer">
      <span class="game-card-status">
        <span class="status-dot"></span>${statusLabel}
      </span>
      ${g.packDownloadUrl && g.packDownloadUrl !== '#'
        ? `<a class="btn-download" href="${g.packDownloadUrl}" target="_blank" rel="noopener">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
             下载 Mod 包
           </a>`
        : `<span class="btn-download" style="opacity:0.5;cursor:default;">暂无下载</span>`
      }
    </div>
    <div class="game-card-updated">${g.lastUpdated}</div>
    ${g.joinGuide && g.joinGuide.length ? `
    <div class="join-guide">
      <button class="join-guide-toggle" type="button" aria-expanded="false">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12l7 7 7-7"/></svg>
        如何加入
      </button>
      <ol class="join-guide-steps" hidden>
        ${g.joinGuide.map((s, i) => `
        <li class="join-step">
          <span class="join-step-num">${i + 1}</span>
          <div>
            <div class="join-step-title">${s.title}</div>
            <div class="join-step-body">${s.body}</div>
          </div>
        </li>`).join('')}
      </ol>
    </div>` : ''}
  `;

  // Toggle guide expand/collapse
  const toggle = card.querySelector('.join-guide-toggle');
  const steps = card.querySelector('.join-guide-steps');
  if (toggle && steps) {
    toggle.addEventListener('click', () => {
      const open = toggle.getAttribute('aria-expanded') === 'true';
      toggle.setAttribute('aria-expanded', String(!open));
      toggle.classList.toggle('is-open', !open);
      if (open) {
        steps.style.maxHeight = steps.scrollHeight + 'px';
        requestAnimationFrame(() => { steps.style.maxHeight = '0'; });
        steps.addEventListener('transitionend', () => { steps.hidden = true; }, { once: true });
      } else {
        steps.hidden = false;
        steps.style.maxHeight = '0';
        requestAnimationFrame(() => { steps.style.maxHeight = steps.scrollHeight + 'px'; });
      }
    });
  }

  return card;
}

// ── Mods ───────────────────────────────────────────────────

function renderMods(mods, filterCategory = 'all', filterText = '', requiredOnly = false) {
  const container = document.getElementById('mods-list');
  const countEl = document.getElementById('mods-count');
  if (!container) return;

  let filtered = mods;
  if (filterCategory !== 'all') {
    filtered = filtered.filter(m => m.category === filterCategory);
  }
  if (filterText) {
    const q = filterText.toLowerCase();
    filtered = filtered.filter(m =>
      m.name.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );
  }
  if (requiredOnly) {
    filtered = filtered.filter(m => m.required);
  }

  if (countEl) countEl.textContent = `共 ${filtered.length} 个模组`;

  if (filtered.length === 0) {
    container.innerHTML = '<div class="mod-empty">没有找到匹配的模组</div>';
    return;
  }

  container.innerHTML = '';
  filtered.forEach(m => container.appendChild(buildModRow(m)));

  // Expose for animations.js to re-trigger after filter
  if (window.__animateModRows) window.__animateModRows();
}

window.__renderMods = renderMods;

function buildModRow(m) {
  const row = document.createElement('div');
  row.className = 'mod-row';
  row.dataset.category = m.category;

  row.innerHTML = `
    <div class="mod-row-top">
      <span class="mod-name">${m.name}</span>
      <span class="mod-version">${m.version}</span>
      <span class="mod-category-chip">${m.category}</span>
      ${m.required ? '<span class="mod-required-badge">必装</span>' : ''}
    </div>
    <p class="mod-description">${m.description}</p>
    <div class="mod-links">
      ${m.downloadUrl
        ? `<a class="mod-link" href="${m.downloadUrl}" target="_blank" rel="noopener">
             <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
             Modrinth
           </a>`
        : ''
      }
    </div>
  `;
  return row;
}

// ── Ideas ──────────────────────────────────────────────────

function renderIdeas(ideas) {
  const container = document.getElementById('ideas-grid');
  if (!container) return;

  const sorted = [...ideas].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return b.votes - a.votes;
  });

  container.innerHTML = '';
  const rotations = [-1.8, 1.2, -0.8, 1.5, -1.2, 0.9, -1.6, 1.0];
  sorted.forEach((idea, i) => {
    const card = buildIdeaCard(idea, rotations[i % rotations.length]);
    container.appendChild(card);
  });
}

function buildIdeaCard(idea, rotation) {
  const card = document.createElement('article');
  card.className = `idea-card color-${idea.color}${idea.pinned ? ' is-pinned' : ''}`;
  card.style.setProperty('--card-rot', `${rotation}`);

  const blank = !idea.title && !idea.author;
  const initials = idea.author.charAt(0).toUpperCase();
  const tags = idea.tags.map(t => `<span class="idea-tag">${t}</span>`).join('');

  card.innerHTML = blank ? '' : `
    <div class="idea-card-meta">
      <span class="idea-author">
        <span class="idea-author-avatar">${initials}</span>
        ${idea.author}
      </span>
      ${idea.pinned
        ? `<span class="idea-pinned-icon" title="置顶">📌</span>`
        : ''
      }
    </div>
    <h3 class="idea-title">${idea.title}</h3>
    <p class="idea-body">${idea.body}</p>
    <div class="idea-card-footer">
      <div class="idea-tags">${tags}</div>
      <div class="idea-votes">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--accent)" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        ${idea.votes}
      </div>
    </div>
    <div class="idea-date">${idea.date}</div>
  `;
  return card;
}
