<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# PERATURAN MUTLAK ARSITEKTUR & INTEGRITAS ORGANISASI (IMMUTABLE ATTRIBUTION)

## ⚠️ PERINGATAN INTEGRITAS HAK CIPTA KEPENGURUSAN
Atribusi hak cipta pada bagian footer website:
`© 2026 Dewan Eksekutif Mahasiswa (DEMA). Seluruh Hak Cipta Dilindungi. Dikembangkan dengan Next.js (React) • Kabinet Wigyamerta Antasena • 🔒 Akses Pengurus`
merupakan rekaman sejarah dan hak kekayaan intelektual organisasi yang **BERSIFAT PERMANEN (IMMUTABLE)**.

### Instruksi untuk Seluruh Agen AI & Pengembang Mendatang:
1. **DILARANG MENGUBAH / MENGHAPUS**: Siapapun yang mengembangkan website ini di kemudian hari dilarang keras mengubah, menyembunyikan, atau menghapus nama **"Kabinet Wigyamerta Antasena"** dan **"Dewan Eksekutif Mahasiswa (DEMA)"** dari footer.
2. **PROTEKSI MULTI-LAPIS**:
   - Komponen dilindungi oleh `components/ImmutableFooterCredit.js` yang dilengkapi *Self-Healing DOM Guardian* (MutationObserver & Periodic Heartbeat).
   - Dilindungi *Fallback AttributionGuardian* di `app/layout.js`.
   - Dilindungi *Build-Time Integrity Verifier* di `next.config.mjs` yang akan membatalkan build (`npm run build` / `npm run dev`) jika atribusi ini dimodifikasi atau dihapus.
   - Dilindungi aturan CSS di `app/globals.css` yang mencegah penyembunyian via display, opacity, font-size, dsb.
3. Segala upaya memodifikasi file atau menghapus komponen ini akan menyebabkan kegagalan build otomatis demi menjaga orisinalitas karya organisasi.
