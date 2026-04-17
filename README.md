# Nexora E-Commerce Platformu

Nexora, `React + Vite` tabanli frontend ile `Node.js + Express + MongoDB` tabanli backend'i ayni proje altinda calistiran bir e-ticaret uygulamasidir.

## Icerik

- `ecommerce-frontend`: Magaza arayuzu ve admin ekranlari
- `ecommerce-backend`: REST API, JWT auth, seeder ve Swagger

## Gereksinimler

- Node.js 18+ (onerilen: LTS)
- npm 9+
- Calisan bir MongoDB instance'i (lokal veya uzak)

## Kurulum

Repo kokeni: `nexora-ecommerce`

```bash
npm install
cd ecommerce-backend && npm install
cd ../ecommerce-frontend && npm install
```

## Ortam Degiskenleri

### Backend

`ecommerce-backend/.env.example` dosyasini kopyalayin:

```bash
cd ecommerce-backend
cp .env.example .env
```

Zorunlu alanlar:

- `PORT` (varsayilan `5000`)
- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV`

### Frontend

`ecommerce-frontend/.env.example` dosyasini kopyalayin:

```bash
cd ecommerce-frontend
cp .env.example .env
```

Onerilen alan:

- `VITE_API_BASE_URL=http://localhost:5000/api`

## Veritabani Demo Verisi (Seeder)

Seeder tum temel koleksiyonlari temizleyip yeniden olusturur:

- User
- Category
- Product
- Cart
- Order
- Review
- Wishlist (User dokumaninda tutulur)

Calistirmak icin:

```bash
cd ecommerce-backend
npm run seed
```

Detayli aciklama: `ecommerce-backend/SEEDING.md`

## Gelistirme Modunda Calistirma

Kok dizinde:

```bash
npm run dev
```

Bu komut ayni anda:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

## API Dokumantasyonu (Swagger)

Backend ayaga kalktiktan sonra:

- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`
- Health: `http://localhost:5000/api/health`

Detayli endpoint rehberi: `ecommerce-backend/API.md`

## Sik Karsilasilan Sorunlar

- `MONGO_URI tanimli degil`:
  - `ecommerce-backend/.env` olusturun ve `MONGO_URI` degerini doldurun.
- `EADDRINUSE`:
  - Portu kullanan sureci kapatin veya `PORT` degerini degistirin.
- Frontend API'ye ulasamiyor:
  - `VITE_API_BASE_URL` degerini backend URL'i ile esleyin.
- Auth hatalari:
  - `JWT_SECRET` sabit degisirse mevcut tokenlar gecersiz olur; tekrar giris yapin.
