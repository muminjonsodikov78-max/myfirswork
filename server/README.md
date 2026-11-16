# Muhsin Ta'lim API

Node.js + Express + PostgreSQL backend. Maxfiy qiymatlarni GitHub'ga joylamang.

## Talablar

- Node.js 20 yoki undan yangi
- PostgreSQL 14 yoki undan yangi
- Root frontend loyihasi uchun Node.js paketlari

## Birinchi sozlash (Windows PowerShell)

1. PostgreSQL o'rnating va pgAdmin yoki SQL Shell orqali `muhsin_talimi` nomli database yarating.
2. `server` papkasida `.env.example` nusxasini `.env` nomi bilan yarating.
3. `.env` ichida `DATABASE_URL` qiymatini PostgreSQL parolingiz bilan to'ldiring. `SESSION_SECRET` uchun kamida 32 belgili tasodifiy maxfiy qiymat kiriting. Bu qiymatni hech kimga yubormang va GitHub'ga yuklamang.
4. Terminalda `server` papkasiga o'tib quyidagilarni bajaring:

```powershell
npm install
npm run migrate
npm run seed:director
npm run dev
```

5. `http://localhost:3001/api/health` manzilini oching. Database ulangan bo'lsa `{"status":"ok","database":"connected"}` qaytadi.

## Direktor hisobi

`npm run seed:director` loginni so'raydi (boshlang'ich qiymat `director`). Parol terminalda yashirin kiritiladi va ikki marta tasdiqlanadi. Kamida 12 belgili parol tanlang. Parol bazaga bcrypt xeshi ko'rinishida yoziladi. Bir xil loginni qayta yaratish mumkin emas.

## API

- `POST /api/auth/login` — login va parol bilan kirish
- `GET /api/auth/me` — joriy sessiya foydalanuvchisi
- `POST /api/auth/logout` — sessiyadan chiqish
- `GET /api/health` — server va PostgreSQL holati
- `GET /api/users` — faqat direktor foydalanuvchilar ro‘yxatini ko‘radi
- `POST /api/users` — faqat direktor yangi administrator, o‘qituvchi, kassir yoki ota-ona hisobini yaratadi
- `GET /api/students` — direktor, administrator, o‘qituvchi va kassir
- `POST/PUT/DELETE /api/students` — direktor va administrator
- `GET/POST/PUT/DELETE /api/teachers` — direktor va administrator

Sessiyalar PostgreSQL'da saqlanadi. Cookie HttpOnly va SameSite=Lax; production rejimida Secure yoqiladi. Production'da HTTPS ishlating va `CLIENT_ORIGIN` ni aniq frontend domeniga o'zgartiring.

## Rollar bo‘yicha server ruxsatlari

Ruxsatlar backend'da tekshiriladi; frontend menyusini yashirishning o‘zi xavfsizlik deb hisoblanmaydi. Direktor foydalanuvchilarni boshqaradi. O‘quvchilarni ko‘rish huquqi direktor, administrator, o‘qituvchi va kassirga berilgan; o‘quvchi ma'lumotini o‘zgartirish direktor va administrator bilan cheklangan. O‘qituvchilar ro‘yxatini hozircha faqat direktor va administrator boshqaradi.

## Hozirgi cheklov

Bu bosqichda autentifikatsiya API va foydalanuvchi jadvali tayyor. React interfeysiga login oynasini ulash, rollar bo'yicha API ruxsatlarini har bir ma'lumot endpoint'ida qo'llash va localStorage ma'lumotlarini PostgreSQL'ga ko'chirish keyingi bosqichlardir. Mavjud brauzer ma'lumotlari o'chirilmaydi.
