# Seeder Guide

Seeder, development/test ortaminda tum kritik alanlari kapsayan bir E2E veri seti olusturur.

## Commands

```bash
# Destructive full dataset seed
npm run seed

# Same as seed, explicit naming
npm run seed:e2e

# Protected mode (production ortaminda --force yoksa fail olur)
npm run seed:safe
```

## Safety

- Seeder destruktiftir: hedef koleksiyonlari temizleyip yeniden olusturur.
- `NODE_ENV=production` durumunda `--force` yoksa seeder calismaz.
- Canli veritabani yerine sadece development/staging test DB kullanin.

## Collections Reset

- Users
- Categories
- Products
- Carts
- Orders
- Reviews
- Coupons
- StoreSettings
- ContactMessages
- Notifications
- PaymentMethods
- ReturnRequests
- NewsletterSubscribers

## Seeded Dataset Coverage

- **Auth/Users**
  - 1 admin + coklu user
  - profile/address/phone verileri
  - wishlist referanslari
- **Catalog**
  - coklu kategori + aktif urunler
  - dusuk stok urunleri (dashboard alarm testleri)
- **Commerce**
  - carts
  - farkli order status dagilimlari (`pending`, `processing`, `shipped`, `delivered`, `cancelled`)
  - farkli payment status ve method dagilimlari
- **Reviews**
  - farkli rating dagilimlari
  - moderation status + hidden varyasyonlari
  - product rating metriklerinin tekrar hesaplanmasi
- **Admin Business Data**
  - coupons (active/inactive/expired)
  - store settings
  - support inbox message statuses
  - notifications (read/unread, type dagilimi)
  - payment methods (default + additional)
  - return requests (requested/approved/rejected/refunded)
  - newsletter subscribers (home/footer source)

## Expected Outcome

Seeder tamamlandiginda admin panel, storefront ve profile akislarinin tamami gercekci MongoDB verileri ile smoke test edilebilir hale gelir.
