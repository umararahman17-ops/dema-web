import Link from 'next/link';
import { stats, logoPhilosophy } from '@/lib/data';
import { getAllPrograms } from '@/lib/db';
import StatsCounter from '@/components/StatsCounter';
import PortfolioSection from '@/components/PortfolioSection';
import AspirasiForm from '@/components/AspirasiForm';

export const revalidate = 0; // Dynamic data for real-time portfolio updates

export default function HomePage() {
  const programs = getAllPrograms();

  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-grid">
            {/* Left Column: Copywriting & CTAs */}
            <div>
              <div className="hero-pill">
                <span className="hero-pill-dot"></span>
                <span>Dewan Eksekutif Mahasiswa &bull; Periode 2026/2027</span>
              </div>
              
              <h1 className="hero-title">
                Mewujudkan <span className="gradient-text-green">Sinergi Inovasi</span> &amp; <span className="gradient-text-orange">Aksi Berdampak</span>
              </h1>
              
              <p className="hero-subtitle">
                Selamat datang di platform resmi Dewan Eksekutif Mahasiswa (DEMA). Wadah representasi, eksplorasi riset teknologi, advokasi kesejahteraan, dan pengabdian nyata untuk almamater dan masyarakat.
              </p>

              <div className="hero-actions">
                <Link href="/portofolio" className="btn btn-orange btn-lg">
                  <span>🚀</span> Jelajahi Portofolio
                </Link>
                <Link href="/profil" className="btn btn-outline-green btn-lg">
                  <span>📖</span> Profil &amp; Filosofi Logo
                </Link>
              </div>

              <div className="hero-social-proof">
                <div className="avatar-group">
                  <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80" alt="Pengurus 1" />
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80" alt="Pengurus 2" />
                  <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" alt="Pengurus 3" />
                  <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80" alt="Pengurus 4" />
                </div>
                <div className="hero-proof-text">
                  <strong>Bergerak Kolektif &amp; Inklusif</strong><br />
                  Didukung oleh 8 Departemen &amp; Ratusan Mahasiswa Penggerak
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Logo Emblem & Floating Badges */}
            <div className="hero-visual-card">
              <div className="hero-emblem-glow"></div>
              
              {/* Floating Badge Top */}
              <div className="floating-badge badge-top">
                <div className="badge-icon green">🏆</div>
                <div className="badge-content">
                  <h4>{programs.length}+ Program</h4>
                  <p>Tersimpan di Database</p>
                </div>
              </div>

              {/* Center Emblem Box */}
              <div className="hero-emblem-wrapper">
                <img src="/logo.png" alt="Emblem DEMA" className="hero-emblem-img" />
                <div className="hero-emblem-title">DEMA 2026</div>
                <div className="hero-emblem-subtitle">Sinergi Inovasi</div>
              </div>

              {/* Floating Badge Bottom */}
              <div className="floating-badge badge-bottom">
                <div className="badge-icon orange">⚡</div>
                <div className="badge-content">
                  <h4>100% Terbuka</h4>
                  <p>Kanal Aspirasi Mahasiswa</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. STATS SECTION */}
      <StatsCounter items={stats} />

      {/* 3. ABOUT & LOGO PHILOSOPHY */}
      <section className="section-about">
        <div className="container">
          <div className="about-grid">
            <div className="about-text-content">
              <div className="section-tag">Identitas &amp; Visi</div>
              <h3>Mengenal DEMA &amp; Filosofi Lambang Organisasi</h3>
              <p className="about-lead">
                DEMA hadir sebagai episentrum pergerakan intelektual dan pengabdian mahasiswa yang memadukan kedalaman riset sains dengan kecanggihan teknologi mutakhir.
              </p>
              <p className="about-desc">
                Setiap elemen pada lambang DEMA memiliki makna mendalam yang mendasari arah langkah dan etos kerja seluruh fungsionaris dalam melayani mahasiswa dan masyarakat.
              </p>

              <div className="philosophy-grid">
                {logoPhilosophy.map((philo, index) => (
                  <div key={index} className="philosophy-card">
                    <div className="philosophy-header">
                      <div className={`philosophy-icon ${philo.color}`}>{philo.icon}</div>
                      <h4>{philo.title}</h4>
                    </div>
                    <p>{philo.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Vision Banner */}
            <div className="about-visual-column">
              <div className="about-banner-card">
                <div className="banner-logo-center">
                  <img src="/logo.png" alt="Logo DEMA" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                </div>
                <div className="banner-quote">
                  &ldquo;Terwujudnya DEMA sebagai motor penggerak transformasi yang progresif, adaptif terhadap perkembangan teknologi, berintegritas tinggi, dan senantiasa berpihak pada kesejahteraan mahasiswa.&rdquo;
                </div>
                <div className="banner-author">
                  &mdash; Visi Agung Kabinet Sinergi Inovasi 2026/2027
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. CORE VALUES */}
      <section style={{ padding: '70px 0', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Pilar Nilai</div>
            <h2 className="section-title">Prinsip &amp; Landasan Gerak Kami</h2>
            <p className="section-subtitle">Empat nilai fundamental yang menjadi kompas dalam setiap perumusan program kerja dan pengambilan kebijakan.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>💡</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Inovatif &amp; Kritis</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Mendorong riset terapan dan kreasi solutif yang berorientasi pada pemecahan masalah riil di lingkungan kampus dan masyarakat.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>🤝</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Sinergis &amp; Kolaboratif</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Menjalin kemitraan strategis yang harmonis antar himpunan jurusan, lembaga eksternal kampus, dan mitra industri teknologi.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>🛡️</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Advokatif &amp; Peduli</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Garda terdepan dalam mengawal hak-hak akademis, penjaminan kesejahteraan ekonomi, dan inklusivitas fasilitas bagi seluruh mahasiswa.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ fontSize: '2.2rem', marginBottom: '14px' }}>📊</div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Akuntabel &amp; Transparan</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Menjunjung tinggi etika kejujuran dan keterbukaan informasi publik dalam pengelolaan anggaran serta pelaksanaan amanah organisasi.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PORTFOLIO & WORK PROGRAMS FROM DATABASE */}
      <section className="section-portfolio" id="portofolio">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">Rekam Jejak &amp; Karya</div>
            <h2 className="section-title">Portofolio &amp; Program Kerja Unggulan</h2>
            <p className="section-subtitle">Dokumentasi inisiatif nyata, proyek teknologi, pengabdian masyarakat, dan event akbar yang telah tersimpan di database.</p>
          </div>

          <PortfolioSection initialPrograms={programs} showAllButton={true} />
        </div>
      </section>

      {/* 6. SUARA MAHASISWA & ASPIRASI (CTA) */}
      <section className="section-cta" id="aspirasi">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-text">
              <div style={{ display: 'inline-block', background: 'rgba(224,99,31,0.25)', border: '1px solid rgba(224,99,31,0.5)', padding: '4px 14px', borderRadius: '99px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '16px' }}>
                Suara &amp; Aspirasi Mahasiswa
              </div>
              <h2>Punya Gagasan, Kritik, atau Membutuhkan Bantuan Advokasi?</h2>
              <p>
                DEMA adalah ruang terbuka untuk setiap suara dan kegelisahan mahasiswa. Sampaikan gagasan proyek, saran evaluasi perkuliahan, fasilitas kampus, maupun kendala finansial secara aman dan terpercaya.
              </p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-orange-light)' }}>100%</div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.4, color: '#dcebe0' }}>
                  Aspirasi masuk dicatat dan dibahas dalam rapat koordinasi pimpinan setiap pekan.
                </div>
              </div>
            </div>

            {/* Quick Form Card */}
            <div className="cta-card-form">
              <h3 className="form-title">Sampaikan Suara Anda</h3>
              <p className="form-subtitle">Tuliskan pesan Anda secara langsung ke meja Badan Pengurus Harian.</p>
              <AspirasiForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
