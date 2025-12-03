# 🚀 RSQUARE Deployment Guide ke Netlify

## Status Perubahan
✅ Logo sizing diperbaiki (header: 56px, footer: 72px)
✅ Mobile menu UX ditingkatkan (max-height limit: 300px)
✅ Semua file sudah siap di-commit

## 📋 INSTRUKSI COMMIT & PUSH

Buka terminal dan jalankan command berikut:

```bash
cd /workspaces/RSQUARE

# 1. Verifikasi status
git status

# 2. Add perubahan
git add style.css app.js

# 3. Commit dengan pesan deskriptif
git commit -m "fix: improve mobile menu UX and logo sizing

- Increase logo header size from 40px to 56px for better visibility
- Increase logo footer size from 48px to 72px for better visibility
- Implement max-height 300px limit on mobile menu to prevent content overlap
- Add smooth animation to mobile menu toggle with proper easing
- Fix CSS mobile menu styling with transition and overflow hidden"

# 4. Push ke main branch
git push origin main

# 5. Verifikasi berhasil
git log --oneline -5
```

## 🌐 AUTOMATIC DEPLOYMENT

Setelah `git push`, Netlify akan **otomatis**:
1. ✅ Detect perubahan di repository
2. ✅ Trigger build dengan command: `node scripts/generate-product-index.js`
3. ✅ Deploy ke live site
4. ⏱️ Selesai dalam ~2-3 menit

**No action needed** - tinggal tunggu saja!

## 🔄 CLEAR CACHE (PENTING!)

Karena CSS & JS di-cache selama 1 tahun, ikuti ini **setelah build selesai**:

### Via Dashboard (Recommended):
1. Buka https://app.netlify.com
2. Login dengan akun Netlify Anda
3. Pilih site "rsquareidea"
4. Klik "Deploys" tab
5. Scroll ke bagian "Options"
6. Klik "Clear cache" → "Clear cache and redeploy"

### Via CLI (Alternatif):
```bash
netlify cache:clear
```

## ✅ VERIFICATION CHECKLIST

Setelah cache di-clear (~5 menit):

- [ ] Buka https://rsquareidea.my.id/
- [ ] Buka di mobile device / mobile browser
- [ ] Klik hamburger menu icon
- [ ] Verifikasi menu tidak overlap konten
- [ ] Verifikasi animasi menu smooth
- [ ] Check logo di header lebih besar
- [ ] Check logo di footer lebih besar (72px)
- [ ] Test di berbagai breakpoint (tablet, mobile, desktop)

## 📊 BUILD & DEPLOY STATUS

Monitor di: https://app.netlify.com/sites/rsquareidea/deploys

Status indicators:
- 🟢 Building = Sedang build
- 🟢 Optimizing = Proses optimasi
- 🟢 Published = Deploy selesai ✅

## 🎯 TROUBLESHOOTING

**Q: Deploy gagal?**
A: Cek build logs di Netlify Dashboard → Deploys → Latest deploy → Check logs

**Q: Perubahan tidak terlihat di live site?**
A: Kemungkinan cache browser. Lakukan:
1. Hard refresh: Ctrl+Shift+R (Windows/Linux) atau Cmd+Shift+R (Mac)
2. Clear cache Netlify
3. Tunggu 5-10 menit

**Q: Bagaimana tracking deployment?**
A: Buka https://app.netlify.com → Sites → rsquareidea → Deploys (tab paling kanan)

## 📞 SUPPORT

- Netlify Docs: https://docs.netlify.com
- GitHub Push Issues: https://github.com/settings/tokens
- Site Settings: https://app.netlify.com/sites/rsquareidea/settings

---

**Created:** 2025-12-03
**Last Updated:** 2025-12-03
