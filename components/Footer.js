import Link from 'next/link';
import { IconMapPin, IconClock, IconLock } from '@/components/Icons';

export default function Footer() {
  return (
    <footer className="main-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: Brand Info */}
          <div>
            <div className="footer-brand-wrap">
              <img src="/logo.png" alt="Logo DEMA" className="footer-logo-img" />
              <div className="footer-brand-title">DEMA <span>FST</span></div>
            </div>
            <p className="footer-desc">
              Dewan Eksekutif Mahasiswa — Wadah pergerakan, advokasi, pengabdian, dan akselerasi potensi mahasiswa dalam bidang sains dan teknologi yang progresif, inklusif, dan berdampak nyata.
            </p>
            <div className="footer-social-links">
              <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram @demafstuinsa" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              </a>
              <a href="https://www.youtube.com/@demafstuinsa506" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="YouTube @demafstuinsa506" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </a>
              <a href="https://id.linkedin.com/company/dema-fst-uin-sunan-ampel-surabaya" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn DEMA FST UIN Sunan Ampel Surabaya" aria-label="LinkedIn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
              </a>
              <a href="https://www.facebook.com/people/Dema-Fst-Uinsa/100009686855633/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Facebook Dema Fst Uinsa" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="mailto:sekretariat@dema-univ.ac.id" className="footer-social-link" title="Email Resmi Sekretariat" aria-label="Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigasi Utama */}
          <div>
            <h4 className="footer-heading">Navigasi Utama</h4>
            <ul className="footer-links-list">
              <li><Link href="/">Beranda Utama</Link></li>
              <li><Link href="/profil">Profil &amp; Filosofi Lambang</Link></li>
              <li><Link href="/portofolio">Portofolio Program Kerja</Link></li>
              <li><Link href="/kontak">Layanan Aspirasi</Link></li>
            </ul>
          </div>

          {/* Col 3: Fokus Program Kerja */}
          <div>
            <h4 className="footer-heading">Fokus Program</h4>
            <ul className="footer-links-list">
              <li><Link href="/portofolio?kategori=sains-teknologi">Sains &amp; Teknologi</Link></li>
              <li><Link href="/portofolio?kategori=sosial-pengabdian">Sosial &amp; Pengabdian</Link></li>
              <li><Link href="/portofolio?kategori=kaderisasi">Kaderisasi &amp; Karir</Link></li>
              <li><Link href="/portofolio?kategori=advokasi">Advokasi Kesejahteraan</Link></li>
              <li><Link href="/portofolio?kategori=seni-kreatif">Kreatif &amp; Seni Mahasiswa</Link></li>
            </ul>
          </div>

          {/* Col 4: Sekretariat */}
          <div>
            <h4 className="footer-heading">Sekretariat DEMA</h4>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#8fa697', marginBottom: '12px', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: 'var(--accent-orange)', marginTop: '3px' }}><IconMapPin size={16} /></span>
              <span>Gedung TA Lantai 5, Lab Saintek UINSA<br />Kampus 2 Gunung Anyar, Surabaya</span>
            </p>
            <p style={{ fontSize: '0.85rem', color: '#b6cec1', display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <span style={{ color: 'var(--primary-green-light)', marginTop: '3px' }}><IconClock size={15} /></span>
              <span>
                <strong>Jam Pelayanan Mahasiswa:</strong><br />
                Senin - Jumat: 08.30 - 17.00 WIB
              </span>
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} <strong>Dewan Eksekutif Mahasiswa (DEMA)</strong>. Seluruh Hak Cipta Dilindungi.
          </div>
          <div>
            Dikembangkan dengan <strong>Next.js (React)</strong> • Kabinet Wigyamerta Antasena • <Link href="/program-kerja/kelola" style={{ opacity: 0.55, color: 'inherit', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '5px' }} title="Portal Privat Pengurus"><IconLock size={12} /> Akses Pengurus</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
