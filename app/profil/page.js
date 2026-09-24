import Link from 'next/link';
import { logoPhilosophy } from '@/lib/data';
import { IconAtom, IconGear, IconOctagon, IconPillar, IconTarget } from '@/components/Icons';

const philoIcons = {
  atom: <IconAtom size={22} />,
  gear: <IconGear size={22} />,
  octagon: <IconOctagon size={22} />,
  pillar: <IconPillar size={22} />,
};

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '24px' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(30, 107, 55, 0.15)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <IconTarget size={26} />
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--accent-orange)', letterSpacing: '1px' }}>Landasan Gerak</div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-heading)' }}>Visi &amp; Misi Kabinet Wigyamerta Antasena</h3>
                </div>
              </div>
              
              <ul style={{ display: 'flex', flexDirection: 'column', gap: '16px', fontSize: '0.96rem', lineHeight: '1.7', color: 'var(--text-main)', paddingLeft: '0', listStyle: 'none' }}>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', lineHeight: '1.2', flexShrink: 0 }}>&bull;</span>
                  <span>Mewujudkan kepemimpinan yang inklusif, profesional, dan berintegritas untuk menciptakan lingkungan organisasi yang hangat serta terbuka bagi seluruh mahasiswa.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', lineHeight: '1.2', flexShrink: 0 }}>&bull;</span>
                  <span>Memperkuat branding dan prestasi FST melalui publikasi, promosi, dan penyelenggaraan kegiatan sains dan teknologi yang berdampak luas.</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ color: 'var(--accent-orange)', fontSize: '1.4rem', lineHeight: '1.2', flexShrink: 0 }}>&bull;</span>
                  <span>Mengoptimalkan aspirasi mahasiswa dengan menyediakan wadah yang responsif, kolaboratif, dan berorientasi pada kemajuan seluruh program studi di FST.</span>
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
            {/* Logo Showcase Box */}
            <div className="profile-logo-showcase">
              <img src="/logo.png" alt="Logo DEMA" className="profile-logo-img" />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '4px' }}>Lambang Resmi DEMA</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--accent-orange)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px' }}>Integrasi Sains &amp; Teknologi</p>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', background: 'var(--bg-surface-subtle)', padding: '6px 14px', borderRadius: '99px', border: '1px solid var(--border-color)' }}>
                Dekonstruksi 4 Elemen Utama &bull; Terpisah Sesuai Makna
              </div>
            </div>

            {/* Philosophy Detailed Breakdown */}
            <div className="profile-philo-list">
              {logoPhilosophy.map((philo, index) => (
                <div key={index} className="profile-philo-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
                    <div className="philo-element-preview">
                      <img 
                        src={philo.image} 
                        alt={philo.title} 
                        className="philo-element-img" 
                      />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px', color: philo.color === 'orange' ? 'var(--accent-orange)' : 'var(--primary-green-light)', marginBottom: '2px' }}>
                        Elemen Lambang #{index + 1}
                      </div>
                      <h4 style={{ fontSize: '1.08rem', fontWeight: 800, color: 'var(--text-heading)' }}>{philo.title}</h4>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.9rem', lineHeight: 1.65, color: 'var(--text-muted)' }}>{philo.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
