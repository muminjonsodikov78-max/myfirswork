# Muhsin Ta'lim API

Node.js + Express backend. Maxfiy qiymatlarni GitHub'ga joylamang.

## Tayyorlash

1. PostgreSQL o'rnating va `muhsin_talimi` nomli database yarating.
2. `.env.example` faylidan `.env` nusxa yarating.
3. `.env` ichida DATABASE_URL va tasodifiy, kamida 32 belgili SESSION_SECRET qiymatini kiriting.
4. `npm install` bu papkada bajaring.
5. `npm run dev` bilan serverni ishga tushiring.
6. `http://localhost:3001/api/health` manzilini tekshiring.

Hozircha faqat server va database ulanishining health endpoint'i mavjud. Login, foydalanuvchi yaratish va rollar keyingi bosqichda migratsiya hamda tekshiruvlar bilan qo'shiladi.
