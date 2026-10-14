import fs from 'fs';
import path from 'path';

/**
 * ==============================================================================
 * SISTEM VERIFIKASI INTEGRITAS ATRIBUSI HAK CIPTA ORGANISASI
 * DEMA KABINET WIGYAMERTA ANTASENA
 * ==============================================================================
 * Fungsi ini memvalidasi keutuhan komponen dan atribusi hak cipta sebelum Next.js
 * mengkompilasi website (berlaku untuk `next dev` dan `next build`).
 *
 * Jika ada pihak yang mencoba mengubah nama kabinet, menghapus atribusi, atau
 * memutus kaitan komponen ImmutableFooterCredit, proses kompilasi akan segera
 * DIBATALKAN secara otomatis demi melindungi hak kekayaan intelektual & sejarah organisasi.
 * ==============================================================================
 */
function verifyPermanentAttribution() {
  const root = process.cwd();
  const immutableComponentPath = path.join(root, 'components', 'ImmutableFooterCredit.js');
  const footerPath = path.join(root, 'components', 'Footer.js');
  const layoutPath = path.join(root, 'app', 'layout.js');

  const bannerBorder = '='.repeat(78);

  const raiseViolation = (message) => {
    const errorMsg = [
      '',
      bannerBorder,
      '⛔ FATAL: PELANGGARAN INTEGRITAS ATRIBUSI HAK CIPTA ORGANISASI',
      bannerBorder,
      message,
      '',
      '📌 Atribusi hak cipta "Dewan Eksekutif Mahasiswa (DEMA)" dan',
      '   "Kabinet Wigyamerta Antasena" bersifat IMMUTABLE (Permanen & Dilindungi).',
      '   Pengembang dilarang keras memodifikasi atau menghapus jejak atribusi ini.',
      bannerBorder,
      ''
    ].join('\n');
    throw new Error(errorMsg);
  };

  // 1. Cek keberadaan file komponen
  if (!fs.existsSync(immutableComponentPath)) {
    raiseViolation('File komponen `components/ImmutableFooterCredit.js` tidak ditemukan atau telah dihapus!');
  }

  const immutableContent = fs.readFileSync(immutableComponentPath, 'utf8');

  // 2. Cek token sakral
  const requiredTokens = [
    'Kabinet Wigyamerta Antasena',
    'Dewan Eksekutif Mahasiswa (DEMA)',
    'DEMA_FST_WIGYAMERTA_ANTASENA_PERMANENT_CREDIT_V1',
    'S2FiaW5ldCBXaWd5YW1lcnRhIEFudGFzZW5h',
    'RGV3YW4gRWtzZWt1dGlmIE1haGFzaXN3YSAoREVNQSk='
  ];

  for (const token of requiredTokens) {
    if (!immutableContent.includes(token)) {
      raiseViolation(`Token verifikasi '${token}' hilang atau dimodifikasi pada components/ImmutableFooterCredit.js!`);
    }
  }

  // 3. Cek Footer.js
  if (fs.existsSync(footerPath)) {
    const footerContent = fs.readFileSync(footerPath, 'utf8');
    if (!footerContent.includes('ImmutableFooterCredit')) {
      raiseViolation('Komponen `ImmutableFooterCredit` telah diputus/dihapus dari `components/Footer.js`!');
    }
  }

  // 4. Cek RootLayout
  if (fs.existsSync(layoutPath)) {
    const layoutContent = fs.readFileSync(layoutPath, 'utf8');
    if (!layoutContent.includes('AttributionGuardian')) {
      raiseViolation('Komponen penjaga `AttributionGuardian` telah dihapus dari `app/layout.js`!');
    }
  }
}

verifyPermanentAttribution();

/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
};

export default nextConfig;
