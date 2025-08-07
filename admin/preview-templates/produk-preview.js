const { h, createClass } = window.React;

const ProdukPreview = createClass({
  render: function () {
    const entry = this.props.entry;
    const getAsset = this.props.getAsset;

    // --- 1. Ambil Semua Data dari Formulir CMS ---
    const judul = entry.getIn(['data', 'judul']);
    const harga = entry.getIn(['data', 'harga']);
    
    const detail = entry.getIn(['data', 'detail']) ? entry.getIn(['data', 'detail']).toJS() : {};
    const deskripsiLengkap = detail.deskripsi_lengkap;
    const linkYoutube = detail.link_youtube;
    const linkPembelian = detail.link_pembelian || [];
    const galeri = detail.galeri || [];

    const formattedPrice = `Rp ${new Intl.NumberFormat('id-ID').format(harga || 0)}`;

    // --- 2. Bangun Tampilan Menggunakan Fungsi h() ---
    return h(
      'div',
      { className: 'animate-on-scroll' }, // Wrapper utama
      
      // A. Header Halaman
      h('header', { className: 'py-20 px-6 text-center' },
        h('div', { className: 'container mx-auto' },
          h('h1', { className: 'text-4xl md:text-5xl font-extrabold mb-4 gradient-text pb-2' }, `Preview Detail: ${judul || '...'}`),
          h('p', { className: 'text-lg text-gray-600 max-w-2xl mx-auto' }, deskripsiLengkap || '...'),
          h('div', { className: 'inline-block bg-orange-100 text-orange-800 font-bold text-2xl px-8 py-3 rounded-full mt-6 shadow-sm' },
            harga === 0 ? 'Gratis' : formattedPrice
          )
        )
      ),

      // B. Main Content
      h('main', { className: 'px-6 pb-20 space-y-24' },
        h('section', { className: 'container mx-auto flex flex-col items-center gap-8 space-y-24 py-12' },
          // Looping untuk Galeri Fitur
          galeri.map(item => 
            h('div', { className: 'flex flex-col items-center gap-6' },
              h('div', { className: 'card rounded-xl p-4 w-full md:max-w-3xl' },
                item.gambar && h('img', { src: getAsset(item.gambar).toString(), alt: item.judul, className: 'rounded-lg w-full shadow-lg' })
              ),
              h('div', { className: 'text-center md:text-left max-w-2xl' },
                h('h2', { className: 'text-3xl font-bold text-gray-800 mb-4' }, item.judul || '...'),
                h('div', { className: 'text-gray-600 leading-relaxed space-y-3' }, 
                  // Gunakan widgetFor agar markdown bisa dirender
                   this.props.widgetFor(`detail.galeri.${galeri.indexOf(item)}.deskripsi`)
                )
              )
            )
          )
        ),
        
        // C. Bagian Video Tutorial
        h('section', { className: 'py-16 px-6' },
          h('div', { className: 'container mx-auto max-w-4xl' },
            h('div', { className: 'text-center mb-10' },
              h('h2', { className: 'text-3xl font-bold text-gray-800' }, 'Tonton Video Tutorialnya!'),
              h('p', { className: 'text-gray-600 mt-2' }, 'Lihat bagaimana template ini bekerja dalam aksi nyata.')
            ),
            h('div', { className: 'card rounded-2xl p-2 md:p-4' },
              h('div', { className: 'relative overflow-hidden rounded-lg', style: { paddingTop: '56.25%' } },
                linkYoutube && h('iframe', {
                  className: 'absolute top-0 left-0 w-full h-full',
                  src: linkYoutube,
                  title: `Tutorial ${judul}`,
                  frameborder: '0',
                  allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
                  allowfullscreen: true
                })
              )
            )
          )
        ),

        // D. Bagian Tombol Pembelian (CTA)
        h('section', { className: 'container mx-auto mt-12 text-center' },
          h('h2', { className: 'text-3xl font-bold text-gray-800' }, 'Siap Meningkatkan Produktivitas?'),
          h('p', { className: 'text-lg text-gray-600 mt-2 mb-8' }, 'Pilih platform favorit Anda untuk mendapatkan template ini sekarang.'),
          h('div', { className: 'max-w-md mx-auto space-y-4' },
            // Looping untuk Tombol Pembelian
            linkPembelian.map(link => 
              h('a', { href: '#', className: 'btn-primary flex items-center justify-center w-full px-8 py-3 rounded-lg font-semibold text-white text-base' }, `Akses di ${link.platform}`)
            )
          )
        )
      )
    );
  }
});
