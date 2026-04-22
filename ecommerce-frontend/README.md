# Nexora Frontend

Bu paket, Nexora e-ticaret uygulamasinin kullanici ve admin arayuzunu icerir.

## Teknolojiler

- React
- Vite
- Zustand tabanli store yapisi
- Axios ile API haberlesmesi

## Kurulum

```bash
npm install
```

## Ortam Degiskenleri

`.env.example` dosyasini `.env` olarak kopyalayin:

```bash
cp .env.example .env
```

Kullanilan degiskenler:

- `VITE_API_BASE_URL` (varsayilan fallback: `http://localhost:5001/api`)
- `VITE_AUTH_LOGIN_PATH` (opsiyonel, varsayilan `/auth/login`)
- `VITE_AUTH_REGISTER_PATH` (opsiyonel, varsayilan `/auth/register`)

## Komutlar

- Gelistirme modu:

```bash
npm run dev
```

- Production build:

```bash
npm run build
```

- Preview:

```bash
npm run preview
```

- Lint:

```bash
npm run lint
```

## Calisma URL'i

Varsayilan Vite adresi:

- `http://localhost:5173`

Backend ayakta degilse urun listesi, auth ve sepet akislari API hatasi verir. Kok dizinden `npm run dev` kullanarak frontend ve backend'i birlikte baslatmaniz onerilir.
