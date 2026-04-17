# Nexora Backend

Bu servis, Nexora e-ticaret platformunun REST API katmanidir. JWT tabanli kimlik dogrulama, urun/siparis/sepet yonetimi ve admin ozelliklerini icerir.

## Teknolojiler

- Node.js + Express
- MongoDB + Mongoose
- JWT Auth
- Swagger (`swagger-jsdoc`, `swagger-ui-express`)

## Kurulum

```bash
npm install
```

## Ortam Degiskenleri

`.env.example` dosyasini `.env` olarak kopyalayin:

```bash
cp .env.example .env
```

Zorunlu alanlar:

- `PORT=5000`
- `MONGO_URI=mongodb://127.0.0.1:27017/nexora`
- `NODE_ENV=development`
- `JWT_SECRET=...`

## Komutlar

- Gelistirme:

```bash
npm run dev
```

- Normal baslatma:

```bash
npm start
```

- Demo veri yukleme:

```bash
npm run seed
```

## HTTP Endpointleri

- API tabani: `http://localhost:5000/api`
- Health: `http://localhost:5000/api/health`
- Swagger UI: `http://localhost:5000/api-docs`
- OpenAPI JSON: `http://localhost:5000/api-docs.json`

Detayli endpoint aciklamalari icin `API.md` dosyasina bakin.

## Notlar

- Seeder calistiginda ilgili koleksiyonlar sifirlanir.
- `JWT_SECRET` degisirse mevcut tokenlar gecersiz olur.
