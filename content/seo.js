// seo.js (Versi Perbaikan)

/**
 * Memperbarui tag SEO utama (<title>, <meta description>, <link canonical>, dll.).
 * @param {object} seoData - Objek berisi data SEO.
 * @param {string} [seoData.title] - Judul baru untuk halaman.
 * @param {string} [seoData.description] - Deskripsi meta baru.
 * @param {string} [seoData.ogImage] - URL gambar untuk Open Graph.
 * @param {string} [seoData.ogType] - Tipe Open Graph (misal: 'article').
 * @param {string} [seoData.canonicalUrl] - URL kanonis spesifik. Jika tidak diberikan, akan menggunakan URL halaman saat ini.
 */
function updateSeoTags(seoData) {
    const data = seoData || {};

    // Gunakan judul yang ada jika tidak ada yang baru, tambahkan nama situs
    const title = data.title ? `${data.title} - RSQUARE` : document.title;
    
    // Gunakan URL kanonis yang diberikan, atau default ke URL saat ini
    // <-- PERUBAHAN SANGAT PENTING ADA DI SINI
    const canonicalUrl = data.canonicalUrl || window.location.href;

    // 1. Update Judul Halaman
    document.title = title;

    // 2. Fungsi bantuan untuk membuat atau memperbarui meta tag
    function setMetaTag(attr, attrValue, content) {
        if (!content) return;
        let element = document.querySelector(`meta[${attr}='${attrValue}']`);
        if (!element) {
            // Jika tag tidak ada (misal: meta description), buat baru
            element = document.createElement('meta');
            element.setAttribute(attr, attrValue);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    }
    
    // 3. Fungsi bantuan untuk membuat atau memperbarui link tag
    function setLinkTag(rel, href) {
        if (!href) return;
        let element = document.querySelector(`link[rel='${rel}']`);
        if (!element) {
            element = document.createElement('link');
            element.setAttribute('rel', rel);
            document.head.appendChild(element);
        }
        element.setAttribute('href', href);
    }

    // 4. Update semua tag SEO yang relevan
    setMetaTag('name', 'description', data.description);
    setLinkTag('canonical', canonicalUrl);

    // 5. Update tag Open Graph untuk media sosial
    setMetaTag('property', 'og:title', title);
    setMetaTag('property', 'og:description', data.description);
    setMetaTag('property', 'og:image', data.ogImage);
    setMetaTag('property', 'og:url', canonicalUrl);
    setMetaTag('property', 'og:type', data.ogType || 'website');
    setMetaTag('property', 'og:site_name', 'RSQUARE');
}
