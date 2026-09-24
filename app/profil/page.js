import Link from 'next/link';
import { logoPhilosophy } from '@/lib/data';

export const metadata = {
  title: 'Profil & Filosofi Lambang | DEMA Kabinet Wigyamerta Antasena',
  description: 'Pelajari sejarah, visi misi, serta filosofi lambang atom dan roda bergerigi DEMA Fakultas Sains dan Teknologi UINSA.',
};

export default function ProfilPage() {
  return (
    <>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h1>Profil &amp; Identitas Organisasi</h1>
          <p>Mengenal lebih dekat Dewan Eksekutif Mahasiswa, visi misi pergerakan, dan filosofi lambang kebanggaan organisasi.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <span>Profil DEMA</span>
          </div>
        </div>
      </section>

      {/* Section 1: Sejarah & Visi Misi */}
      <section style={{ padding: '80px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="profile-history-grid">
            <div>
              <div className="section-tag">Sejarah &amp; Peran</div>
              <h2 style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '20px' }}>Lembaga Eksekutif Tertinggi Mahasiswa</h2>
              <p style={{ fontSize: '1.02rem', lineHeight: 1.8, color: 'var(--text-main)', marginBottom: '16px' }}>
                Dewan Eksekutif Mahasiswa (DEMA) adalah lembaga eksekutif tertinggi di tingkat fakultas/kampus yang memegang mandat utama sebagai representasi resmi mahasiswa, fasilitator pengembangan bakat dan riset ilmiah, serta pelindung hak-hak konstitusional sivitas akademika.
              </p>
              <p style={{ fontSize: '0.95rem', lineHeight: 1.8, color: 'var(--text-muted)' }}>
                Berangkat dari kesadaran bahwa kemajuan bangsa bertumpu pada penguasaan sains dan kemandirian teknologi yang berlandaskan moral, DEMA terus bertransformasi menjadi katalisator inovasi yang solutif, independen, dan berorientasi pada kemaslahatan masyarakat.
              </p>
            </div>

            <div className="profile-history-card">
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
                <div style={{ fontSize: '2rem' }}>🎯</div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-orange)', letterSpacing: '1px' }}>Komitmen Utama</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>Visi Kabinet Wigyamerta Antasena</h3>
                </div>
              </div>
              <p style={{ fontSize: '1.05rem', fontStyle: 'italic', color: 'var(--primary-green-light)', lineHeight: 1.7, marginBottom: '24px' }}>
                &ldquo;Mewujudkan DEMA sebagai episentrum pergerakan mahasiswa yang adaptif, inovatif dalam riset sains dan teknologi, serta bersinergi secara inklusif demi memberikan kebermanfaatan nyata.&rdquo;
              </p>
              
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '12px' }}>Misi Strategis:</h4>
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem', color: 'var(--text-muted)' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary-green)', fontWeight: 800 }}>01.</span>
                  <span>Membangun ekosistem riset terapan dan inovasi sains teknologi yang kompetitif.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary-green)', fontWeight: 800 }}>02.</span>
                  <span>Mengoptimalkan fungsi advokasi mahasiswa yang cepat tanggap, transparan, dan terpercaya.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary-green)', fontWeight: 800 }}>03.</span>
                  <span>Menggalakkan program pengabdian berbasis teknologi bagi kemandirian masyarakat dan desa.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <span style={{ color: 'var(--primary-green)', fontWeight: 800 }}>04.</span>
                  <span>Mempererat harmonisasi dan sinergi antar-lembaga mahasiswa serta kemitraan industri.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Bedah Filosofi Logo */}
      <section style={{ padding: '80px 0', background: 'var(--bg-page)', borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Identitas Visual</div>
            <h2 className="section-title">Filosofi &amp; Makna Simbol Lambang</h2>
            <p className="section-subtitle">Setiap garis, warna, dan lambang geometris dirancang dengan makna filosofis yang merefleksikan karakter DEMA.</p>
          </div>

          <div className="profile-logo-grid">
            {/* Logo Showcase Box */}
            <div className="profile-logo-showcase">
              <img src="/logo.png" alt="Logo DEMA" className="profile-logo-img" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)' }}>Lambang Resmi DEMA</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>Integrasi Sains &amp; Teknologi</p>
            </div>

            {/* Philosophy Detailed Breakdown */}
            <div className="profile-philo-list">
              {logoPhilosophy.map((philo, index) => (
                <div key={index} className="profile-philo-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div className={`philosophy-icon ${philo.color}`}>{philo.icon}</div>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-heading)' }}>{philo.title}</h4>
                  </div>
                  <p style={{ fontSize: '0.88rem', lineHeight: 1.6, color: 'var(--text-muted)' }}>{philo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
