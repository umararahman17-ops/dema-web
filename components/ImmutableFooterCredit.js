'use client';

/**
 * ==============================================================================
 * ⚠️ PERINGATAN HAK CIPTA & INTEGRITAS ORGANISASI (IMMUTABLE ATTRIBUTION)
 * ==============================================================================
 * Bagian atribusi hak cipta dan kepengurusan Kabinet Wigyamerta Antasena ini
 * bersifat PERMANEN, SAKRAL, dan DILINDUNGI HUKUM / TATA TERTIB ORGANISASI.
 *
 * Dilarang keras bagi siapapun yang mendevelop atau memelihara website ini
 * di masa mendatang untuk mengubah, memalsukan, atau menghapus teks atribusi ini.
 * 
 * Sistem dilengkapi mekanisme perlindungan multi-lapis:
 * 1. Self-Healing DOM Guardian (MutationObserver & Periodic Heartbeat).
 * 2. Anti-CSS-Tampering (memaksa visibilitas & pencegahan disembunyikan via CSS).
 * 3. Base64 Tamper-Proof Restoration Fallback.
 * 4. Automatic Injection Guardian (jika komponen dihapus dari Footer).
 * 5. Build-Time Integrity Blocker di next.config.mjs.
 * ==============================================================================
 */

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { IconLock } from '@/components/Icons';

// Konstanta terenkapsulasi & di-freeze permanen
const IMMUTABLE_ATTRIBUTION = Object.freeze({
  orgName: 'Dewan Eksekutif Mahasiswa (DEMA)',
  copyrightNotice: 'Seluruh Hak Cipta Dilindungi.',
  techNotice: 'Dikembangkan dengan',
  framework: 'Next.js (React)',
  cabinet: 'Kabinet Wigyamerta Antasena',
  adminLabel: 'Akses Pengurus',
  adminPath: '/program-kerja/kelola',
  signature: 'DEMA_FST_WIGYAMERTA_ANTASENA_PERMANENT_CREDIT_V1',
  // Cadangan Base64 anti-tamper (apabila teks plaintext diubah secara paksa)
  _b64Org: 'RGV3YW4gRWtzZWt1dGlmIE1haGFzaXN3YSAoREVNQSk=',
  _b64Cab: 'S2FiaW5ldCBXaWd5YW1lcnRhIEFudGFzZW5h',
  _b64Cpr: 'U2VsdXJ1aCBIYWsgQ2lwdGEgRGlsaW5kdW5naS4=',
  _b64Tch: 'RGlrZW1iYW5na2FuIGRlbmdhbg==',
  _b64Frw: 'TmV4dC5qcyAoUmVhY3Qp',
  _b64Adm: 'QWtzZXMgUGVuZ3VydXM=',
  _b64Pth: 'L3Byb2dyYW0ta2VyamEva2Vsb2xh'
});

// Helper decoder anti-tamper
function decodeB64(str) {
  try {
    if (typeof window !== 'undefined' && window.atob) {
      return decodeURIComponent(escape(window.atob(str)));
    }
  } catch (e) {}
  return str;
}

export function buildCreditHTML() {
  const currentYear = new Date().getFullYear();
  const org = decodeB64(IMMUTABLE_ATTRIBUTION._b64Org);
  const cpr = decodeB64(IMMUTABLE_ATTRIBUTION._b64Cpr);
  const tch = decodeB64(IMMUTABLE_ATTRIBUTION._b64Tch);
  const frw = decodeB64(IMMUTABLE_ATTRIBUTION._b64Frw);
  const cab = decodeB64(IMMUTABLE_ATTRIBUTION._b64Cab);
  const adm = decodeB64(IMMUTABLE_ATTRIBUTION._b64Adm);
  const pth = decodeB64(IMMUTABLE_ATTRIBUTION._b64Pth);

  return `
    <div>
      &copy; ${currentYear} <strong>${org}</strong>. ${cpr}
    </div>
    <div>
      ${tch} <strong>${frw}</strong> &bull; ${cab} &bull; <a href="${pth}" style="opacity: 0.55; color: inherit; text-decoration: none; display: inline-flex; align-items: center; gap: 5px;" title="Portal Privat Pengurus">🔒 ${adm}</a>
    </div>
  `;
}

// Self-healing DOM enforce function
export function enforceAttributionElement(el) {
  if (!el || typeof window === 'undefined') return;

  // 1. Pastikan ID & Signature selalu terpasang
  if (el.id !== 'immutable-dema-credit') {
    el.id = 'immutable-dema-credit';
  }
  if (el.getAttribute('data-immutable-signature') !== IMMUTABLE_ATTRIBUTION.signature) {
    el.setAttribute('data-immutable-signature', IMMUTABLE_ATTRIBUTION.signature);
  }

  // 2. Cegah penyembunyian via manipulasi style CSS inline / class
  const style = window.getComputedStyle(el);
  if (
    style.display === 'none' ||
    style.visibility === 'hidden' ||
    parseFloat(style.opacity || '1') < 0.1 ||
    style.fontSize === '0px' ||
    style.height === '0px' ||
    style.clipPath !== 'none' ||
    (style.filter && style.filter.includes('opacity(0)'))
  ) {
    el.style.setProperty('display', 'flex', 'important');
    el.style.setProperty('visibility', 'visible', 'important');
    el.style.setProperty('opacity', '1', 'important');
    el.style.setProperty('font-size', '0.85rem', 'important');
    el.style.setProperty('height', 'auto', 'important');
    el.style.setProperty('clip-path', 'none', 'important');
    el.style.setProperty('filter', 'none', 'important');
    el.style.setProperty('position', 'static', 'important');
    el.style.setProperty('pointer-events', 'auto', 'important');
  }

  // 3. Verifikasi integritas teks hak cipta & kabinet
  const text = (el.innerText || el.textContent || '').trim();
  const requiredOrg = decodeB64(IMMUTABLE_ATTRIBUTION._b64Org);
  const requiredCab = decodeB64(IMMUTABLE_ATTRIBUTION._b64Cab);

  if (!text.includes(requiredOrg) || !text.includes(requiredCab)) {
    // Kembalikan konten secara instan jika dirusak
    el.innerHTML = buildCreditHTML();
  }
}

export default function ImmutableFooterCredit() {
  const containerRef = useRef(null);

  // Self-Healing Tamper-Proof Runtime Guard
  useEffect(() => {
    const el = containerRef.current;
    if (!el || typeof window === 'undefined') return;

    enforceAttributionElement(el);

    // MutationObserver untuk mendeteksi setiap upaya perubahan DOM atau style
    const observer = new MutationObserver(() => {
      enforceAttributionElement(el);
    });

    observer.observe(el, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden', 'id']
    });

    // Heartbeat berkala untuk memastikan integritas tetap terjaga
    const heartbeat = setInterval(() => {
      enforceAttributionElement(el);
    }, 2000);

    return () => {
      observer.disconnect();
      clearInterval(heartbeat);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      id="immutable-dema-credit"
      className="footer-bottom immutable-credit-container"
      data-immutable-signature={IMMUTABLE_ATTRIBUTION.signature}
      suppressHydrationWarning
    >
      <div>
        &copy; {new Date().getFullYear()} <strong>{IMMUTABLE_ATTRIBUTION.orgName}</strong>. {IMMUTABLE_ATTRIBUTION.copyrightNotice}
      </div>
      <div>
        {IMMUTABLE_ATTRIBUTION.techNotice} <strong>{IMMUTABLE_ATTRIBUTION.framework}</strong> • {IMMUTABLE_ATTRIBUTION.cabinet} •{' '}
        <Link
          href={IMMUTABLE_ATTRIBUTION.adminPath}
          style={{
            opacity: 0.55,
            color: 'inherit',
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
          }}
          title="Portal Privat Pengurus"
        >
          <IconLock size={12} /> {IMMUTABLE_ATTRIBUTION.adminLabel}
        </Link>
      </div>
    </div>
  );
}

/**
 * AttributionGuardian
 * Dijalankan di RootLayout sebagai pertahanan cadangan.
 * Jika developer di masa depan menghapus <ImmutableFooterCredit /> dari Footer.js,
 * guardian ini secara otomatis mendeteksi ketiadaannya dan menyuntikkannya kembali ke DOM!
 */
export function AttributionGuardian() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const checkAndInject = () => {
      let creditEl = document.getElementById('immutable-dema-credit');

      if (!creditEl) {
        // Cari container footer atau body
        const footerContainer =
          document.querySelector('.main-footer .container') ||
          document.querySelector('footer') ||
          document.body;

        if (footerContainer) {
          creditEl = document.createElement('div');
          creditEl.id = 'immutable-dema-credit';
          creditEl.className = 'footer-bottom immutable-credit-container';
          creditEl.setAttribute('data-immutable-signature', IMMUTABLE_ATTRIBUTION.signature);
          creditEl.innerHTML = buildCreditHTML();
          footerContainer.appendChild(creditEl);
        }
      } else {
        enforceAttributionElement(creditEl);
      }
    };

    checkAndInject();
    const interval = setInterval(checkAndInject, 2500);

    const bodyObserver = new MutationObserver(() => {
      if (!document.getElementById('immutable-dema-credit')) {
        checkAndInject();
      }
    });

    bodyObserver.observe(document.body, { childList: true, subtree: true });

    return () => {
      clearInterval(interval);
      bodyObserver.disconnect();
    };
  }, []);

  return null;
}
