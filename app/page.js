import Link from 'next/link';
import { stats, logoPhilosophy } from '@/lib/data';
import { getAllPrograms } from '@/lib/db';
import StatsCounter from '@/components/StatsCounter';
import PortfolioSection from '@/components/PortfolioSection';
import AspirasiForm from '@/components/AspirasiForm';
import HeroEmblem from '@/components/HeroEmblem';
import { IconCompass, IconBook, IconBulb, IconNetwork, IconShield, IconChart } from '@/components/Icons';

export const revalidate = 0; // Dynamic data for real-time portfolio updates

export default async function HomePage() {
  const programs = await getAllPrograms();

  return (
    <>
      {/* 1. HERO SECTION - LOGO DULUAN */}
      <section className="hero-section hero-showcase-layout">
        <div className="container">
          <div className="hero-top-center">
            {/* 1. LOGO DULUAN: 3D Interactive Emblem with Glow & Badges */}
            <HeroEmblem programCount={programs.length} />

            {/* 2. Headline & Call to Actions */}
            <div className="hero-content-center">
              <div className="hero-pill">
                <span className="hero-pill-dot"></span>
                <span>Dewan Eksekutif Mahasiswa &bull; Kabinet Wigyamerta Antasena</span>
              </div>
              
              <h1 className="hero-title">
                Mewujudkan <span className="gradient-text-green">Inovasi Sains</span> &amp; <span className="gradient-text-orange">Aksi Berdampak</span>
              </h1>
              
              <p className="hero-subtitle">
                Selamat datang di platform resmi Dewan Eksekutif Mahasiswa (DEMA) Fakultas Sains dan Teknologi UIN Sunan Ampel Surabaya. Wadah representasi, eksplorasi riset teknologi, advokasi kesejahteraan, dan pengabdian nyata mahasiswa.
              </p>

              <div className="hero-actions">
                <Link href="/portofolio" className="btn btn-orange btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                  <IconCompass size={20} /> Jelajahi Portofolio
                </Link>
                <Link href="/profil" className="btn btn-outline-green btn-lg" style={{ display: 'inline-flex', alignItems: 'center', gap: '9px' }}>
                  <IconBook size={20} /> Profil &amp; Filosofi Logo
                </Link>
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
                      <div className={`philosophy-icon ${philo.color}`} style={{ padding: '5px' }}>
                        <img src={philo.image} alt={philo.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
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
                  &mdash; Visi Agung Kabinet Wigyamerta Antasena 2026/2027
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

          <div className="core-values-grid">
            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(224, 99, 31, 0.12)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconBulb size={26} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Inovatif &amp; Kritis</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Mendorong riset terapan dan kreasi solutif yang berorientasi pada pemecahan masalah riil di lingkungan kampus dan masyarakat.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(30, 107, 55, 0.12)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconNetwork size={26} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Sinergis &amp; Kolaboratif</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Menjalin kemitraan strategis yang harmonis antar himpunan jurusan, lembaga eksternal kampus, dan mitra industri teknologi.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(224, 99, 31, 0.12)', color: 'var(--accent-orange)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconShield size={26} />
              </div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '10px' }}>Advokatif &amp; Peduli</h4>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Garda terdepan dalam mengawal hak-hak akademis, penjaminan kesejahteraan ekonomi, dan inklusivitas fasilitas bagi seluruh mahasiswa.</p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '30px', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-sm)' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(30, 107, 55, 0.12)', color: 'var(--primary-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px' }}>
                <IconChart size={26} />
              </div>
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
