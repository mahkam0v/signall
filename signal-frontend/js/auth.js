import { api, setToken } from './api.js';

const form = document.getElementById('authForm');
const errorEl = document.getElementById('authError');
const submitBtn = document.getElementById('authSubmit');
const mode = form.dataset.mode; // 'login' | 'register'

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';

  const username = form.username.value.trim();
  const password = form.password.value;

  if (mode === 'register') {
    const confirmPassword = form.confirmPassword.value;
    if (password !== confirmPassword) {
      errorEl.textContent = 'Parollar mos kelmadi.';
      return;
    }
  }

  const originalLabel = submitBtn.textContent;
  submitBtn.disabled = true;
  submitBtn.textContent = 'Yuborilmoqda...';

  try {
    const result =
      mode === 'register'
        ? await api.register(username, password)
        : await api.login(username, password);

    setToken(result.token);
    window.location.href = 'index.html';
  } catch (err) {
    errorEl.textContent = err.message;
    submitBtn.disabled = false;
    submitBtn.textContent = originalLabel;
  }
});
