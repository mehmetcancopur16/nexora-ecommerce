# Seeder Rehberi

Seeder, gelistirme ortami icin kapsamli ve iliskili demo veri uretir.

## Komut

```bash
npm run seed
```

## Onemli Uyari

Seeder calistiginda asagidaki koleksiyonlar temizlenir ve yeniden olusturulur:

- Users
- Categories
- Products
- Carts
- Orders
- Reviews

Bu nedenle sadece gelistirme/test veritabaninda calistiriniz.

## Uretilen Veri Kapsami

- Roller:
  - 1 admin kullanici
  - birden fazla normal kullanici
- Kategoriler ve urunler:
  - farkli stok seviyeleri
  - dusuk stok urunler (dashboard testleri icin)
- Sepetler:
  - farkli kullanicilara bagli urun/adet kombinasyonlari
- Siparisler:
  - `pending`, `processing`, `shipped`, `delivered`, `cancelled` durumlarinda dagilim
  - order item fiyat snapshot yapisi
- Yorumlar:
  - farkli puan dagilimlari (1-5)
  - urun ortalama puan ve yorum sayisi hesaplarini tetikleyecek veri
- Wishlist:
  - kullanici dokumanlarinda urun referanslari

## Beklenen Sonuc

Seeder tamamlandiginda terminalde olusturulan kayit sayilari loglanir ve API icindeki listeleme/dashboard endpointleri gercekci demo veriyle test edilebilir hale gelir.
