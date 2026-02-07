/**
 * Backend'den gelen PayTR verileriyle form oluşturup submit eder.
 * @param {string} actionUrl - PayTR URL (Genellikle: https://www.paytr.com/odeme)
 * @param {object} formData - Backend'den gelen data + Kart bilgileri
 */
export const submitPayTRForm = (actionUrl: string, formData: any) => {
    // 1. Form elementini oluştur
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = actionUrl;
    form.style.display = 'none'; // Kullanıcı formu görmesin

    // 2. Data içindeki her veri için input oluştur
    for (const key in formData) {
        if (Object.prototype.hasOwnProperty.call(formData, key)) {
            // Null veya undefined değerleri atla
            if (formData[key] !== null && formData[key] !== undefined) {
                const input = document.createElement('input');
                input.type = 'hidden';
                input.name = key;
                input.value = String(formData[key]);
                form.appendChild(input);
            }
        }
    }

    // 3. Formu sayfaya ekle ve submit et
    document.body.appendChild(form);
    form.submit();
};
