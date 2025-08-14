/**
 * Fungsi ini memperbarui tag SEO utama di dalam <head> dokumen.
 * Ia akan menggunakan data yang diberikan, tanpa nilai default internal.
 * @param {object} seoData - Objek yang berisi data SEO.
 */
function updateSeoTags(seoData) {
    // Pastikan seoData adalah objek untuk menghindari error
    const data = seoData || {};

    const title = data.title || document.title; // Gunakan judul yang ada jika tidak ada yang baru
    const description = data.description || '';
    const ogImage = data.ogImage || '';
    const ogType = data.ogType || 'website';
    const canonicalUrl = window.location.href;

    // 1. Update Judul Halaman
    document.title = title;

    // 2. Fungsi bantuan untuk mencari atau membuat meta tag
    function setMetaTag(attr, attrValue, content) {
        if (!content) return; // Jangan buat tag jika kontennya kosong
        let element = document.querySelector(`meta[${attr}='${attrValue}']`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, attrValue);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    }
    
    // 3. Fungsi bantuan untuk mencari atau membuat link tag
    function setLinkTag(rel, href) {
        let element = document.querySelector(`link[rel='${rel}']`);
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    }

    // 4. Update semua tag meta yang relevan
    setMetaTag('name', 'description', description);
    setLinkTag('canonical', canonicalUrl);

    // 5. Update tag Open Graph untuk media sosial
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:image', ogImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'RSQUARE');
}
