/**
 * Fungsi ini memperbarui tag SEO utama di dalam <head> dokumen.
 * @param {object} seoData - Objek yang berisi data SEO.
 * @param {string} seoData.title - Judul untuk tag <title> dan og:title.
 * @param {string} seoData.description - Deskripsi untuk meta description dan og:description.
 * @param {string} seoData.ogImage - URL gambar untuk og:image.
 * @param {string} [seoData.ogType='website'] - Tipe Open Graph, defaultnya 'website'.
 */
function updateSeoTags(seoData) {
    // Memberikan nilai default jika ada data yang kosong
    const defaults = {
        title: 'RSQUARE - Template Google Sheets Premium',
        description: 'Temukan template Google Sheets dan Slides premium untuk meningkatkan produktivitas dan analisis data Anda.',
        ogImage: 'https://rsquareidea.my.id/photos/RSQUARE-LOGO.png', // Ganti dengan URL gambar default Anda
        ogType: 'website'
    };

    const title = seoData.title || defaults.title;
    const description = seoData.description || defaults.description;
    const ogImage = seoData.ogImage || defaults.ogImage;
    const ogType = seoData.ogType || defaults.ogType;
    const canonicalUrl = window.location.href; // URL halaman saat ini

    // 1. Update Judul Halaman
    document.title = title;

    // 2. Fungsi bantuan untuk mencari atau membuat meta tag
    function setMetaTag(attr, attrValue, content) {
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
