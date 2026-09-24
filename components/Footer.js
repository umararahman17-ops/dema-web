import Link from 'next/link';

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
              <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Instagram @demafstuinsa">📸</a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="LinkedIn">💼</a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="YouTube">▶️</a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" title="Twitter/X">🐦</a>
              <a href="mailto:sekretariat@dema-univ.ac.id" className="footer-social-link" title="Email">✉️</a>
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
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#8fa697', marginBottom: '12px' }}>
              📍 Gedung TA Lantai 5, Lab Saintek UINSA<br />
              Kampus 2 Gunung Anyar, Surabaya
            </p>
            <p style={{ fontSize: '0.85rem', color: '#b6cec1' }}>
              🕒 <strong>Jam Pelayanan Mahasiswa:</strong><br />
              Senin - Jumat: 08.30 - 17.00 WIB
            </p>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom">
          <div>
            &copy; {new Date().getFullYear()} <strong>Dewan Eksekutif Mahasiswa (DEMA)</strong>. Seluruh Hak Cipta Dilindungi.
          </div>
          <div>
            Dikembangkan dengan <strong>Next.js (React)</strong> • Kabinet Wigyamerta Antasena • <Link href="/program-kerja/kelola" style={{ opacity: 0.45, color: 'inherit', textDecoration: 'none' }} title="Portal Privat Pengurus">🔒 Akses Pengurus</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
