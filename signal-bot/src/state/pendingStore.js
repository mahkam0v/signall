// Har bir foydalanuvchi hozir qaysi bosqichda ekanini (tasdiqlash / nom o'zgartirish)
// eslab turadi. key: userId, value: { parsed, photo, waitingForTitle }
const pending = new Map();

module.exports = {
  get: (userId) => pending.get(userId),
  set: (userId, state) => pending.set(userId, state),
  delete: (userId) => pending.delete(userId),
};
