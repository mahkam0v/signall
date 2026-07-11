# SIGNAL bot

Anime kanal postlarini yig'ib, PostgreSQL bazasida saqlaydigan Telegram bot.

## Struktura

```
src/
  config/env.js              -> barcha environment o'zgaruvchilar shu yerdan o'qiladi
  db/data-source.js          -> TypeORM DataSource (PostgreSQL ulanish sozlamalari)
  db/entities/Anime.js       -> "anime" jadvali uchun TypeORM EntitySchema
  db/entities/Channel.js     -> "channels" jadvali uchun TypeORM EntitySchema
  db/migrate.js               -> DataSource.synchronize() orqali jadvallarni yaratadi
  repositories/animeRepository.js -> bazaga yagona kirish nuqtasi (TypeORM repository'lar shu yerda)
  services/postParser.js      -> kanal postidan ma'lumot ajratib olish
  services/previewService.js  -> tasdiqlash uchun preview matni
  state/pendingStore.js       -> foydalanuvchi jarayon holati (xotirada)
  keyboards/confirmKeyboard.js-> inline tugmalar
  handlers/commandHandlers.js -> /start /qidir /royxat /ochir
  handlers/messageHandlers.js -> matn va rasm postlarini qabul qilish
  handlers/actionHandlers.js  -> tugma bosilishlari (confirm/edit_title/cancel)
  bot.js                      -> Telegraf instance + handlerlarni ulash
  index.js                    -> ishga tushirish nuqtasi
```

## O'rnatish

1. Paketlarni o'rnating:
   ```
   npm install
   ```

2. `.env.example` faylidan `.env` yasang va to'ldiring:
   ```
   cp .env.example .env
   ```
   - `BOT_TOKEN` — BotFather'dan olingan token
   - `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` — lokal PostgreSQL sozlamalari
     (yoki ular o'rniga bitta `DATABASE_URL` yozsangiz ham bo'ladi)

3. Lokal PostgreSQL'da baza yarating (agar mavjud bo'lmasa):
   ```
   createdb signal_bot
   ```

4. Jadvallarni yarating:
   ```
   npm run migrate
   ```

5. Botni ishga tushiring:
   ```
   npm start
   ```

## Tuzatilgan bug'lar

- **Dublikat kanal yozuvlari**: eski versiyada "✅ Saqlash" bir necha marta bosilsa yoki bir xil
  post qayta yuborilsa, `channels` ro'yxatiga bir xil kanal qayta-qayta qo'shilardi. Endi
  `channels` jadvalida `UNIQUE(anime_id, channel, episode)` + `ON CONFLICT ... DO UPDATE`
  ishlatilgani uchun dublikat bo'lmaydi, faqat sifat ma'lumoti yangilanadi.
- **Genre/rasm yangilanmasligi**: eski versiyada anime birinchi marta saqlanganda genre/rasm
  qotib qolardi, keyingi postlarda yangi ma'lumot kelsa ham e'tiborga olinmasdi. Endi
  `upsertAnime` har safar mavjud ma'lumotni yangilaydi.
- **`ctx.editMessageReplyMarkup()` xatoligi**: xabar eskirgan yoki allaqachon o'zgartirilgan
  bo'lsa, bu chaqiruv Telegram API xatosini tashlab, butun handlerni yiqitib yuborishi mumkin
  edi. Endi `safeRemoveKeyboard` orqali try/catch bilan o'ralgan.
- **Nom bo'yicha qidiruv izchilligi**: `/qidir` va saqlash turli joylarda turlicha
  normalizatsiya qilinardi (masalan ortiqcha bo'shliqlar hisobga olinmasdi). Endi yagona
  `slugify()` funksiyasi orqali barcha joyda bir xil normalizatsiya qo'llanadi.
- **Fayl asosidagi baza (`animeDB.json`)**: bir vaqtda bir nechta yozish bo'lsa fayl buzilish
  xavfi bor edi, endi PostgreSQL tranzaksion saqlashni ta'minlaydi.
- **TypeORM ishlatilmagan edi**: avvalgi versiyada `pg` paketi orqali xom (raw) SQL so'rovlar
  yozilgan edi, TypeORM umuman ulanmagan. Endi `db/data-source.js` + `db/entities/*` orqali
  TypeORM DataSource va Entity'lar ishlatiladi, `animeRepository.js` esa TypeORM
  repository (`find`, `save`, `delete`) metodlariga o'tkazildi. Eski COALESCE mantig'i
  (`genre`/`photo` bo'sh kelsa eskisini saqlab qolish) endi `upsertAnime` ichida JS
  darajasida amalga oshiriladi.

## Eslatma

`pending` (kim hozir qaysi bosqichda) hozircha xotirada (`Map`) saqlanadi — bot qayta
ishga tushsa tozalanadi. Agar bir nechta server nusxasi (masalan bir nechta instance yoki
serverless) ishlatmoqchi bo'lsangiz, buni ham Redis yoki alohida jadvalga ko'chirish kerak
bo'ladi, lekin bitta bot instance uchun hozirgi yechim yetarli.
