# API Rehberi

Bu dokuman, backend servisinin temel endpoint gruplarini ve Swagger kullanimini ozetler.

## Swagger

- UI: `GET /api-docs`
- JSON: `GET /api-docs.json`

Swagger UI uzerinden endpointleri canli test edebilirsiniz. Yetkili endpointler icin once giris yapip Bearer token alin, sonra Swagger'daki `Authorize` butonuna `Bearer <token>` formatinda ekleyin.

## Health

- `GET /health`
- `GET /api/health`

Her iki endpoint de servis ayakta bilgisini verir.

## Ana Endpoint Gruplari

- `/api/users`: kayit, giris, profil, sifre/profil guncelleme, wishlist
- `/api/categories`: kategori liste/detay ve admin yonetimi
- `/api/products`: urun liste/detay, arama, admin urun yonetimi
- `/api/cart`: sepet goruntuleme ve urun ekleme/guncelleme/silme
- `/api/orders`: siparis olusturma, kullanici siparisleri, admin siparis yonetimi
- `/api/reviews`: urun yorumlari, yorum ekleme/silme
- `/api/admin`: dashboard metrikleri ve kullanici yonetimi

## Standart API Cevap Yapisi

Basarili cevaplar genellikle:

```json
{
  "success": true,
  "data": {}
}
```

Hatali cevaplar:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Hata mesaji"
}
```

Detayli schema ve tum parametreler icin Swagger dokumanini kaynak kabul edin.
