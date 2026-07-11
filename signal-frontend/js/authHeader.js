import { api, getToken, clearToken } from './api.js';

const renderLoggedOut = (slot) => {
  slot.innerHTML = `
    <a href="login.html" class="nav-link">Kirish</a>
    <a href="register.html" class="nav-cta">Ro'yxatdan o'tish</a>
  `;
};

const renderLoggedIn = (slot, user) => {
  slot.innerHTML = `
    <span class="nav-user">👤 ${user.username}</span>
    <button class="nav-cta nav-cta--ghost" id="logoutBtn" type="button">Chiqish</button>
  `;
  document.getElementById('logoutBtn').addEventListener('click', () => {
    clearToken();
    window.location.reload();
  });
};

export const initAuthHeader = async () => {
  const slot = document.getElementById('authSlot');
  if (!slot) return;

  const token = getToken();
  if (!token) {
    renderLoggedOut(slot);
    return;
  }

  try {
    const { user } = await api.me();
    renderLoggedIn(slot, user);
  } catch (err) {
    clearToken();
    renderLoggedOut(slot);
  }
};
