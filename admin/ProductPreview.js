// Gunakan 'h' dari Netlify CMS untuk membuat elemen HTML (mirip dengan React.createElement)
const h = NetlifyCMS.h;

// Buat template pratinjau untuk koleksi 'produk'
const ProductPreview = createClass({
  render: function() {
    // Ambil data dari form input
    const entry = this.props.entry;
    const judul = entry.getIn(['data', 'judul']);
    const harga = entry.getIn(['data', 'harga']);
    const deskripsi = entry.getIn(['data', 'deskripsi_singkat']);
    
    // Gunakan 'widgetFor' untuk menampilkan pratinjau gambar yang sedang di-upload
    const thumbnail = this.props.widgetFor('gambar_thumbnail');

    // Render struktur HTML untuk pratinjau
    return h('div', { className: 'preview-pane' },
      h('h1', {}, judul || 'Judul Produk...'),
      h('p', {}, 'Harga: ' + (harga || '0')),
      h('hr'),
      h('p', {}, deskripsi || 'Deskripsi singkat produk...'),
      h('hr'),
      h('h2', {}, 'Gambar Thumbnail'),
      thumbnail
    );
  }
});

// Daftarkan template pratinjau ini untuk koleksi dengan 'name: "produk"'
CMS.registerPreviewTemplate('produk', ProductPreview);
