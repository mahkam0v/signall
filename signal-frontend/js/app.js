import { api, assetUrl } from './api.js';
import { initAuthHeader } from './authHeader.js';

const state = { search: '', genre: null, genres: [] };

const gridEl = document.getElementById('grid');
const countEl = document.getElementById('resultCount');
const chipsEl = document.getElementById('categoryChips');
const searchInput = document.getElementById('searchInput');
const modalEl = document.getElementById('animeModal');
const modalBody = document.getElementById('animeModalBody');
const modalClose = document.getElementById('animeModalClose');

const escapeHtml = (str) =>
  String(str).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );

const relativeTime = (isoDate) => {
  const days = Math.floor((Date.now() - new Date(isoDate).getTime()) / 86400000);
  if (days <= 0) return 'BUGUN YANGILANDI';
  if (days === 1) return 'KECHA YANGILANDI';
  if (days < 30) return `${days} KUN OLDIN`;
  return `${Math.floor(days / 30)} OY OLDIN`;
};

const renderChips = () => {
  const chips = ['Hammasi', ...state.genres];
  chipsEl.innerHTML = chips
    .map((g) => {
      const isAll = g === 'Hammasi';
      const active = (isAll && !state.genre) || g === state.genre;
      return `<span class="chip${active ? ' active' : ''}" data-genre="${isAll ? '' : escapeHtml(g)}">${escapeHtml(g)}</span>`;
    })
    .join('');
};

const renderGrid = (items) => {
  if (items.length === 0) {
    gridEl.innerHTML = `<div class="empty-state">Hech narsa topilmadi. Boshqa nom yoki kategoriya bilan urinib ko'r.</div>`;
    return;
  }

  gridEl.innerHTML = items
    .map((anime) => {
      const genrePieces = (anime.genre || '').split(',').map((g) => g.trim()).filter(Boolean);
      const firstGenre = genrePieces[0] || 'Anime';
      const img = assetUrl(anime.photoUrl);
      const channelsCount = anime.channelsCount ?? 0;
      const artStyle = img
        ? `style="background-image:url('${img}'); background-size:cover; background-position:center;"`
        : '';

      return `
        <div class="card" data-slug="${escapeHtml(anime.slug)}">
          <div class="card-art" ${artStyle}>
            <span class="card-status">${relativeTime(anime.updatedAt)}</span>
            <span class="card-ch">${escapeHtml(firstGenre.toUpperCase())}</span>
          </div>
          <div class="card-body">
            <div class="card-title">${escapeHtml(anime.title)}</div>
            <div class="card-meta">${genrePieces
              .map((g) => `<span>${escapeHtml(g)}</span>`)
              .join('<span class="dot"></span>')}</div>
            <div class="card-channels">${channelsCount} KANALDA MAVJUD</div>
          </div>
        </div>`;
    })
    .join('');
};

const openModal = async (slug) => {
  modalEl.classList.add('open');
  modalBody.innerHTML = `<p class="modal-loading">Yuklanmoqda...</p>`;

  try {
    const { anime } = await api.getAnime(slug);
    const genrePieces = (anime.genre || '').split(',').map((g) => g.trim()).filter(Boolean);

    const channelsHtml = anime.channels.length
      ? anime.channels
          .map((ch) => {
            const handle = ch.channel.replace('@', '');
            const meta = [ch.quality, ch.episode ? `Qism ${ch.episode}` : null].filter(Boolean).join(' · ');
            return `<li>
              <a href="https://t.me/${escapeHtml(handle)}" target="_blank" rel="noopener">${escapeHtml(ch.channel)}</a>
              <span class="channel-meta">${escapeHtml(meta)}</span>
            </li>`;
          })
          .join('')
      : `<li><span class="channel-meta">Hozircha kanal ma'lumoti yo'q.</span></li>`;

    modalBody.innerHTML = `
      <h2 class="modal-title">${escapeHtml(anime.title)}</h2>
      <div class="modal-genres">${genrePieces
        .map((g) => `<span class="chip">${escapeHtml(g)}</span>`)
        .join('')}</div>
      <h3 class="modal-subheading">Kanallar</h3>
      <ul class="channel-list">${channelsHtml}</ul>`;
  } catch (err) {
    modalBody.innerHTML = `<p class="modal-error">Ma'lumotni yuklab bo'lmadi: ${escapeHtml(err.message)}</p>`;
  }
};

const closeModal = () => modalEl.classList.remove('open');

const loadAnime = async () => {
  gridEl.innerHTML = `<div class="empty-state">Yuklanmoqda...</div>`;
  try {
    const params = { limit: 60 };
    if (state.search) params.search = state.search;
    if (state.genre) params.genre = state.genre;

    const { items, total } = await api.listAnime(params);
    countEl.textContent = `${total} ta anime`;
    renderGrid(items);
  } catch (err) {
    gridEl.innerHTML = `<div class="empty-state">Ma'lumotni yuklab bo'lmadi: ${escapeHtml(err.message)}<br>Backend ishga tushganini tekshir (npm run dev, signal-backend papkasida).</div>`;
  }
};

let searchTimer;
searchInput.addEventListener('input', (e) => {
  clearTimeout(searchTimer);
  const value = e.target.value;
  searchTimer = setTimeout(() => {
    state.search = value.trim();
    loadAnime();
  }, 300);
});

chipsEl.addEventListener('click', (e) => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  state.genre = chip.dataset.genre || null;
  renderChips();
  loadAnime();
});

gridEl.addEventListener('click', (e) => {
  const card = e.target.closest('.card');
  if (!card) return;
  openModal(card.dataset.slug);
});

modalClose.addEventListener('click', closeModal);
modalEl.addEventListener('click', (e) => {
  if (e.target === modalEl) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

async function init() {
  try {
    const { genres } = await api.listGenres();
    state.genres = genres;
  } catch (err) {
    state.genres = [];
  }
  renderChips();
  await loadAnime();
  initAuthHeader();
}

init();
