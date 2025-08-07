const ProdukPreview = createClass({
  render: function() {
    const entry = this.props.entry;
    const details = entry.getIn(['data', 'detail']) ? entry.getIn(['data', 'detail']).toJS() : {};
    const harga = entry.getIn(['data', 'harga']);

    // Ambil data galeri, pastikan tidak error jika kosong
    const galeri = details.galeri || [];

    const featuresHTML = galeri.map(feature => `
        <div style="margin-bottom: 2rem; border-bottom: 1px solid #eee; padding-bottom: 2rem;">
            <h4 style="font-size: 1.25em; font-weight: bold; margin-bottom: 1rem;">${feature.judul || ''}</h4>
            <img src="${this.props.getAsset(feature.gambar)}" alt="${feature.judul || ''}" style="width: 100%; border-radius: 8px; margin-bottom: 1rem;" />
            <p>${feature.deskripsi || ''}</p>
        </div>
    `).join('');

    return h('div', { "className": "p-8 font-sans" },
      h('header', { "className": "text-center mb-12" },
        h('h1', { "className": "text-4xl font-extrabold mb-4 gradient-text" }, entry.getIn(['data', 'judul']) || 'Judul Template'),
        h('div', { "className": "inline-block bg-orange-100 text-orange-800 font-bold text-2xl px-8 py-3 rounded-full mt-6" },
          harga === 0 ? 'Gratis' : `Rp ${new Intl.NumberFormat('id-ID').format(harga)}`
        )
      ),
      h('main', {},
        h('section', {}, featuresHTML)
      )
    );
  }
});
