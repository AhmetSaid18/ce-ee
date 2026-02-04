# 💳 Ajans Ödemeleri - PayTR Direct API Dokümantasyonu

Bu doküman, **Owner ve Agency** tarafından ajans ödemelerini almak için kullanılan **PayTR Direct API** entegrasyonunu açıklar.

## 📋 Genel Bakış

PayTR Direct API, **3D Secure olmadan** kart bilgileri ile direkt ödeme yapmanıza olanak sağlar. Aşağıdaki özellikler desteklenir:

1. **Manuel Tahsilat** - Tek seferlik ödeme (yeni kart veya kayıtlı karttan)
2. **Abonelik Sistemi** - Yıllık veya Aylık otomatik çekim (yeni kart veya kayıtlı karttan)
3. **Kayıtlı Kart Yönetimi** - Kart listesi, kayıtlı karttan ödeme, kart silme
4. **Proje Bazlı Ödemeler** - Tüm ödemeler projeye bağlıdır

> **ÖNEMLİ**: PayTR Direct API'de **token yoktur**. Kart bilgileri backend'e gönderilir, backend PayTR'a direkt ödeme isteği yapar ve sonuç döner. Bu, iframe token sisteminden farklıdır.

> **UToken Sistemi**: PayTR, kullanıcıya özel bir `utoken` oluşturur. Aynı email için tüm kartlar bu token altında gruplanır. İlk ödeme sonrası `utoken` otomatik olarak kaydedilir ve sonraki ödemelerde kullanılır.

---

## 🔐 Güvenlik Notları

- Kart bilgileri **backend'e gönderilir** (HTTPS üzerinden)
- Backend, kart bilgilerini PayTR'a gönderir
- **Production'da kart bilgileri şifrelenerek saklanmalıdır** (şu an plain text)
- Abonelikler için kart bilgileri veritabanında saklanır (otomatik ödeme için)

---

## 1. Manuel Tahsilat (Tek Seferlik Ödeme)

Owner veya Agency, proje bazlı tek seferlik ödeme almak için bu endpoint'i kullanır.

### 1.1. Endpoint

- **URL**: `/api/dashboard/agency-payments/direct/`
- **Method**: `POST`
- **Yetki**: Owner/Admin veya Agency (sadece kendi projeleri için)

### 1.2. Request Body (Yeni Kart ile)

```json
{
  "project_id": 12,
  "agency_id": 5,
  "amount": 1500.00,
  "description": "Manuel tahsilat açıklaması",
  "card_holder_name": "Ahmet Yılmaz",
  "card_number": "4355084355084358",
  "card_month": "12",
  "card_year": "2025",
  "card_cvv": "123"
}
```

**Alanlar**:
- `project_id` (integer, **required**): Proje ID'si
- `agency_id` (integer, optional): Ajans ID'si (Owner için gerekli, Agency için otomatik)
- `amount` (decimal, required): Ödeme tutarı (TL)
- `description` (string, optional): Ödeme açıklaması
- `card_holder_name` (string, required): Kart sahibi adı (max 128 karakter)
- `card_number` (string, required): Kart numarası (13-19 haneli, sadece rakamlar)
- `card_month` (string, required): Son kullanma ayı (01-12)
- `card_year` (string, required): Son kullanma yılı (YYYY veya YY formatında)
- `card_cvv` (string, required): CVV kodu (3-4 haneli)

### 1.3. Response (Başarılı)

```json
HTTP 200 OK
{
  "status": "success",
  "message": "Ödeme başarıyla alındı.",
  "transaction_id": "12345678",
  "merchant_oid": "a1b2c3d4e5f6...",
  "finance_id": 42,
  "amount": "1500.00",
  "description": "Manuel tahsilat açıklaması",
  "agency": {
    "id": 5,
    "company_name": "Darni Dekor"
  },
  "project": {
    "id": 12,
    "name": "Proje Adı"
  }
}
```

### 1.4. Response (Hata)

```json
HTTP 400 Bad Request
{
  "error": "Ödeme başarısız: Kart limiti yetersiz."
}
```

**Olası Hatalar**:
- `"Proje bulunamadı."` - Geçersiz project_id
- `"Ajans bulunamadı."` - Geçersiz agency_id
- `"Bu projeye erişim izniniz yok."` - Agency kendi projesi olmayan bir projeye erişmeye çalışıyor
- `"Geçersiz kart numarası."` - Kart numarası formatı hatalı
- `"Geçersiz ay. 01-12 arası olmalıdır."` - Ay değeri hatalı
- `"Geçersiz yıl."` - Yıl değeri hatalı
- `"Geçersiz CVV kodu."` - CVV formatı hatalı
- `"Ödeme başarısız: [PayTR hata mesajı]"` - PayTR'dan gelen hata

### 1.5. Backend İşlem Akışı

1. Request validasyonu (kart bilgileri, tutar, ajans kontrolü)
2. PayTR Direct API'ye ödeme isteği gönderilir
3. PayTR'dan response alınır
4. Başarılı ise:
   - Finance kaydı oluşturulur (USD kuru ile birlikte)
   - Response döner
5. Başarısız ise:
   - Hata mesajı döner

### 1.6. Finance Kaydı

Ödeme başarılı olduğunda otomatik olarak bir Finance kaydı oluşturulur:
- `type`: `"income"`
- `currency`: `"TRY"`
- `amount`: Ödeme tutarı
- `exchange_rate`: O günün USD kuru (otomatik çekilir)
- `exchange_rate_date`: Bugünün tarihi
- `description`: `"{Ajans Adı} - {Proje Adı} - {Açıklama} (PayTR Direct: {merchant_oid})"`
- `project`: Proje ID'si (proje bazlı ödeme)

Bu kayıt `GET /api/dashboard/finances/` endpoint'inde görünecektir.

---

## 2. Abonelik Başlatma (Yıllık/Aylık)

Owner veya Agency, proje bazlı yıllık veya aylık abonelik başlatabilir. İki yöntem desteklenir:
1. **Yeni Kart ile** - Kart bilgileri gönderilir
2. **Kayıtlı Karttan** - Daha önce kaydedilmiş kart kullanılır

### 2.1. Endpoint

- **URL**: `/api/dashboard/agency-payments/subscription/`
- **Method**: `POST`
- **Yetki**: Owner/Admin veya Agency (sadece kendi projeleri için)

### 2.2. Request Body (Yeni Kart ile)

```json
{
  "project_id": 12,
  "agency_id": 5,
  "subscription_type": "monthly",
  "amount": 500.00,
  "use_saved_card": false,
  "card_holder_name": "Ahmet Yılmaz",
  "card_number": "4355084355084358",
  "card_month": "12",
  "card_year": "2025",
  "card_cvv": "123"
}
```

### 2.3. Request Body (Kayıtlı Karttan)

```json
{
  "project_id": 12,
  "agency_id": 5,
  "subscription_type": "monthly",
  "amount": 500.00,
  "use_saved_card": true,
  "ctoken": "kart_token_buraya",
  "card_cvv": "123"
}
```

**Alanlar**:
- `project_id` (integer, **required**): Proje ID'si
- `agency_id` (integer, optional): Ajans ID'si (Owner için gerekli, Agency için otomatik)
- `subscription_type` (string, required): `"annual"` (Yıllık) veya `"monthly"` (Aylık)
- `amount` (decimal, required): Ödeme tutarı (TL)
- `use_saved_card` (boolean, optional): `true` ise kayıtlı karttan, `false` ise yeni kart ile
- `ctoken` (string, conditional): Kayıtlı kart token'ı (`use_saved_card=true` ise gerekli)
- `card_cvv` (string, conditional): CVV kodu (kayıtlı karttan ödeme için `require_cvv=1` ise gerekli)
- `card_holder_name` (string, conditional): Kart sahibi adı (yeni kart için gerekli)
- `card_number` (string, conditional): Kart numarası (yeni kart için gerekli)
- `card_month` (string, conditional): Son kullanma ayı (yeni kart için gerekli)
- `card_year` (string, conditional): Son kullanma yılı (yeni kart için gerekli)

### 2.4. Response (Başarılı)

```json
HTTP 200 OK
{
  "status": "success",
  "message": "Abonelik başarıyla oluşturuldu ve ilk ödeme alındı.",
  "transaction_id": "12345678",
  "merchant_oid": "a1b2c3d4e5f6...",
  "subscription_id": 7,
  "finance_id": 43,
  "amount": "500.00",
  "subscription_type": "Aylık Ücret",
  "next_payment_date": "2026-01-02",
  "agency": {
    "id": 5,
    "company_name": "Darni Dekor"
  }
}
```

### 2.5. Response (Hata)

```json
HTTP 400 Bad Request
{
  "error": "Bu proje için zaten aktif bir Aylık abonelik bulunmaktadır."
}
```

**Olası Hatalar**:
- `"Proje bulunamadı."` - Geçersiz project_id
- `"Ajans bulunamadı."` - Geçersiz agency_id
- `"Bu proje için zaten aktif bir {tür} abonelik bulunmaktadır."` - Aynı proje için aynı türde aktif abonelik var
- `"Kayıtlı karttan abonelik için ctoken gereklidir."` - Kayıtlı karttan abonelik için ctoken eksik
- `"card_holder_name yeni kart için gereklidir."` - Yeni kart için kart bilgileri eksik
- Kart validasyon hataları
- PayTR ödeme hataları

### 2.6. Backend İşlem Akışı

1. Request validasyonu
2. Proje ve Agency kontrolü
3. Mevcut aktif abonelik kontrolü (aynı proje için aynı türde)
4. PayTR Direct API ile ilk ödeme yapılır:
   - Yeni kart ile: Kart bilgileri gönderilir
   - Kayıtlı karttan: `utoken` ve `ctoken` gönderilir, `recurring_payment=1` eklenir
5. Başarılı ise:
   - `AgencySubscription` kaydı oluşturulur
   - `utoken` Agency'ye kaydedilir (ilk ödeme ise)
   - Sonraki ödeme tarihi hesaplanır:
     - Yıllık: 1 yıl sonra
     - Aylık: 1 ay sonra
   - Finance kaydı oluşturulur (proje ile bağlantılı)
   - Response döner

### 2.6. Otomatik Ödeme Sistemi

Abonelikler için otomatik ödeme, **cron job** ile çalışır:

```bash
python manage.py process_agency_subscriptions
```

**Nasıl Çalışır**:
- Günlük çalıştırılmalı (cron job ile)
- `next_payment_date` bugün veya geçmiş olan aktif abonelikleri bulur
- Her abonelik için PayTR Direct API ile ödeme yapar
- Başarılı olursa:
  - Abonelik güncellenir (sonraki ödeme tarihi hesaplanır)
  - Finance kaydı oluşturulur
- Başarısız olursa:
  - Abonelik durumu `paused` veya `cancelled` olur

**Cron Job Örneği** (günlük saat 00:00'da):
```bash
0 0 * * * cd /opt/projects/now_api && python manage.py process_agency_subscriptions
```

---

## 3. Abonelik Yönetimi

### 3.1. Abonelikleri Listeleme

- **URL**: `/api/dashboard/agency-subscriptions/`
- **Method**: `GET`
- **Yetki**: Owner/Admin

**Query Parameters**:
- `agency` (optional): Ajans ID'sine göre filtreleme
- `status` (optional): Duruma göre filtreleme (`active`, `paused`, `cancelled`, `expired`)

**Örnek**:
```http
GET /api/dashboard/agency-subscriptions/?agency=5&status=active
```

**Response**:
```json
HTTP 200 OK
[
  {
    "id": 7,
    "agency": 5,
    "agency_company_name": "Darni Dekor",
    "subscription_type": "monthly",
    "amount": "500.00",
    "status": "active",
    "card_holder_name": "Ahmet Yılmaz",
    "card_number_last4": "4358",
    "start_date": "2025-12-02",
    "next_payment_date": "2026-01-02",
    "last_payment_date": "2025-12-02",
    "total_payments": 1,
    "total_amount_paid": "500.00",
    "created_at": "2025-12-02T10:30:00Z",
    "updated_at": "2025-12-02T10:30:00Z"
  }
]
```

### 3.2. Aboneliği Duraklatma

- **URL**: `/api/dashboard/agency-subscriptions/{id}/pause/`
- **Method**: `POST`
- **Yetki**: Owner/Admin

**Response**:
```json
HTTP 200 OK
{
  "status": "success",
  "message": "Abonelik duraklatıldı."
}
```

### 3.3. Aboneliği İptal Etme

- **URL**: `/api/dashboard/agency-subscriptions/{id}/cancel/`
- **Method**: `POST`
- **Yetki**: Owner/Admin

**Response**:
```json
HTTP 200 OK
{
  "status": "success",
  "message": "Abonelik iptal edildi."
}
```

### 3.4. Aboneliği Aktif Etme

- **URL**: `/api/dashboard/agency-subscriptions/{id}/activate/`
- **Method**: `POST`
- **Yetki**: Owner/Admin

**Response**:
```json
HTTP 200 OK
{
  "status": "success",
  "message": "Abonelik aktif edildi."
}
```

---

## 4. Frontend İçin Önemli Notlar

### 5.1. Kart Bilgileri Güvenliği

- Kart bilgileri **backend'e HTTPS üzerinden gönderilmelidir**
- Frontend'de kart bilgilerini **asla log'lamayın**
- Kart numarasını gösterirken sadece **son 4 haneyi** gösterin
- CVV alanını **password type** olarak gösterin

### 5.2. Form Validasyonu

Frontend'de şu validasyonları yapın:

**Kart Numarası**:
- Sadece rakamlar (boşluk ve tire kaldırılmalı)
- 13-19 haneli olmalı
- Luhn algoritması ile kontrol edilebilir (opsiyonel)

**Ay**:
- 01-12 arası olmalı
- Tek haneli ise başına 0 eklenmeli (örn: "1" → "01")

**Yıl**:
- YYYY veya YY formatında olabilir
- Geçmiş yıl olmamalı
- 2020-2099 arası olmalı

**CVV**:
- 3-4 haneli olmalı
- Sadece rakamlar

### 5.3. Ödeme Akışı

**Manuel Tahsilat**:
1. Owner, ajans seçer
2. Tutar ve açıklama girer
3. Kart bilgilerini girer
4. "Ödeme Al" butonuna tıklar
5. Loading gösterilir
6. Başarılı ise: Başarı mesajı + Finance listesine yönlendirme
7. Başarısız ise: Hata mesajı gösterilir

**Abonelik Başlatma**:
1. Owner, ajans seçer
2. Abonelik türü seçer (Yıllık/Aylık)
3. Tutar girer
4. Kart bilgilerini girer
5. "Abonelik Başlat" butonuna tıklar
6. Loading gösterilir
7. Başarılı ise: Başarı mesajı + Abonelik detayları gösterilir
8. Başarısız ise: Hata mesajı gösterilir

### 5.4. UToken ve Kayıtlı Kart Sistemi

**UToken Nedir?**
- PayTR, her kullanıcı (email) için özel bir `utoken` oluşturur
- İlk ödeme sonrası bu token otomatik olarak kaydedilir
- Aynı email için tüm kartlar bu token altında gruplanır
- `utoken` Agency modelinde saklanır

**Kayıtlı Kart Sistemi**:
1. İlk ödeme yapılır (yeni kart ile)
2. PayTR `utoken` döner (callback'te veya response'da)
3. Backend `utoken`'ı Agency'ye kaydeder
4. Sonraki ödemelerde:
   - Kart listesi alınır (`GET /saved-cards/`)
   - Kullanıcı kart seçer
   - `ctoken` ile ödeme yapılır
   - `require_cvv=1` ise CVV istenir

**Kart Listesi Kullanımı**:
```javascript
// Kart listesini al
const getSavedCards = async (agencyId) => {
  const response = await fetch(
    `/api/dashboard/agency-payments/saved-cards/?agency_id=${agencyId}`,
    { credentials: 'include' }
  );
  const data = await response.json();
  return data.cards || [];
};

// Kart seçildiğinde
const selectedCard = cards.find(card => card.ctoken === selectedCtoken);
if (selectedCard.require_cvv === '1') {
  // CVV alanı göster
}
```

### 5.5. Token Konusu

**ÖNEMLİ**: PayTR Direct API'de **token yoktur**. Bu, iframe token sisteminden farklıdır:

- **Iframe Token Sistemi**: Frontend token alır, iframe'de ödeme yapar (3D Secure ile)
- **Direct API**: Backend kart bilgilerini alır, direkt ödeme yapar (3D Secure olmadan)

Frontend'in yapması gereken:
- Kart bilgilerini backend'e göndermek
- Response'u beklemek
- Başarı/hata durumunu göstermek

### 5.6. Örnek Frontend Kodu (React)

```javascript
// Manuel Tahsilat (Yeni Kart ile)
const handleDirectPayment = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/agency-payments/direct/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Cookie auth için
      body: JSON.stringify({
        project_id: formData.projectId, // Zorunlu
        agency_id: formData.agencyId, // Owner için gerekli, Agency için otomatik
        amount: formData.amount,
        description: formData.description,
        card_holder_name: formData.cardHolderName,
        card_number: formData.cardNumber.replace(/\s/g, ''), // Boşlukları kaldır
        card_month: formData.cardMonth.padStart(2, '0'), // "1" → "01"
        card_year: formData.cardYear,
        card_cvv: formData.cardCvv,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      // Başarılı
      showSuccessMessage('Ödeme başarıyla alındı!');
      // Finance listesine yönlendir veya refresh et
      navigate('/finances');
    } else {
      // Hata
      showErrorMessage(data.error || 'Ödeme başarısız oldu.');
    }
  } catch (error) {
    showErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};

// Abonelik Başlatma (Yeni Kart ile)
const handleSubscription = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/agency-payments/subscription/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        project_id: formData.projectId,
        agency_id: formData.agencyId, // Owner için gerekli
        subscription_type: formData.subscriptionType, // "annual" veya "monthly"
        amount: formData.amount,
        use_saved_card: false,
        card_holder_name: formData.cardHolderName,
        card_number: formData.cardNumber.replace(/\s/g, ''),
        card_month: formData.cardMonth.padStart(2, '0'),
        card_year: formData.cardYear,
        card_cvv: formData.cardCvv,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showSuccessMessage(`Abonelik başarıyla başlatıldı! Sonraki ödeme: ${data.next_payment_date}`);
      navigate(`/agency-subscriptions/${data.subscription_id}`);
    } else {
      showErrorMessage(data.error || 'Abonelik başlatılamadı.');
    }
  } catch (error) {
    showErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};

// Abonelik Başlatma (Kayıtlı Karttan)
const handleSubscriptionWithSavedCard = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/agency-payments/subscription/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        project_id: formData.projectId,
        agency_id: formData.agencyId, // Owner için gerekli
        subscription_type: formData.subscriptionType,
        amount: formData.amount,
        use_saved_card: true,
        ctoken: formData.ctoken,
        card_cvv: formData.cardCvv, // require_cvv=1 ise gerekli
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showSuccessMessage(`Abonelik başarıyla başlatıldı! Sonraki ödeme: ${data.next_payment_date}`);
      navigate(`/agency-subscriptions/${data.subscription_id}`);
    } else {
      showErrorMessage(data.error || 'Abonelik başlatılamadı.');
    }
  } catch (error) {
    showErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};

// Kayıtlı Karttan Ödeme
const handlePaymentWithSavedCard = async (formData) => {
  try {
    setLoading(true);
    const response = await fetch('/api/dashboard/agency-payments/saved-card/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({
        project_id: formData.projectId,
        amount: formData.amount,
        ctoken: formData.ctoken,
        card_cvv: formData.cardCvv, // require_cvv=1 ise gerekli
        description: formData.description,
      }),
    });
    
    const data = await response.json();
    
    if (response.ok) {
      showSuccessMessage('Ödeme başarıyla alındı!');
      navigate('/finances');
    } else {
      showErrorMessage(data.error || 'Ödeme başarısız oldu.');
    }
  } catch (error) {
    showErrorMessage('Bir hata oluştu. Lütfen tekrar deneyin.');
  } finally {
    setLoading(false);
  }
};
```

---

## 6. Finance Endpoint'inde Görünürlük

Tüm ödemeler (manuel ve abonelik) otomatik olarak Finance kaydı oluşturur ve `GET /api/dashboard/finances/` endpoint'inde görünür:

```json
GET /api/dashboard/finances/
[
  {
    "id": 42,
    "project": null,
    "type": "income",
    "currency": "TRY",
    "foreign_amount": null,
    "amount": "1500.00",
    "exchange_rate": "32.4500",
    "exchange_rate_date": "2025-12-02",
    "description": "Darni Dekor - Manuel Tahsilat (PayTR Direct: a1b2c3d4...)",
    "date": "2025-12-02"
  },
  {
    "id": 43,
    "project": null,
    "type": "income",
    "currency": "TRY",
    "foreign_amount": null,
    "amount": "500.00",
    "exchange_rate": "32.4500",
    "exchange_rate_date": "2025-12-02",
    "description": "Darni Dekor - Aylık Ücret Abonelik Başlangıç (PayTR Direct: b2c3d4e5...)",
    "date": "2025-12-02"
  }
]
```

---

## 7. Özet

- ✅ **Manuel Tahsilat**: Tek seferlik ödeme için `POST /agency-payments/direct/` (yeni kart veya kayıtlı karttan)
- ✅ **Abonelik Başlatma**: Yıllık/Aylık için `POST /agency-payments/subscription/` (yeni kart veya kayıtlı karttan)
- ✅ **Kayıtlı Kart Yönetimi**: 
  - `GET /agency-payments/saved-cards/` - Kart listesi
  - `POST /agency-payments/saved-card/` - Kayıtlı karttan ödeme
  - `DELETE /agency-payments/saved-cards/{ctoken}/` - Kart silme
- ✅ **Abonelik Yönetimi**: Listeleme, duraklatma, iptal, aktif etme
- ✅ **Otomatik Ödeme**: Cron job ile günlük çalıştırılmalı
- ✅ **Finance Entegrasyonu**: Tüm ödemeler Finance'de görünür (proje ile bağlantılı)
- ✅ **Proje Bazlı**: Tüm ödemeler projeye bağlıdır
- ✅ **Agency Erişimi**: Agency kendi projeleri için ödeme yapabilir
- ✅ **UToken Sistemi**: PayTR otomatik olarak `utoken` oluşturur ve kaydeder
- ✅ **Token Yok**: Direct API'de iframe token yok, direkt ödeme yapılır

---

Bu doküman, frontend ekibinin PayTR Direct API entegrasyonunu yapması için gerekli tüm bilgileri içerir.


