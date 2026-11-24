import Link from 'next/link';
import { stats, logoPhilosophy } from '@/lib/data';
import { getAllPrograms } from '@/lib/db';
import { getAllAlumni } from '@/lib/alumni';
import StatsCounter from '@/components/StatsCounter';
import PortfolioSection from '@/components/PortfolioSection';
import AlumniSection from '@/components/AlumniSection';
import AspirasiForm from '@/components/AspirasiForm';
import HeroEmblem from '@/components/HeroEmblem';
import LogoPhilosophy3D from '@/components/LogoPhilosophy3D';
import { 
  IconCompass, 
  IconBook, 
  IconBulb, 
  IconNetwork, 
  IconShield, 
  IconRocket,
  IconArrowRight,
  IconCheck
} from '@/components/Icons';

export const revalidate = 0; // Dynamic data for real-time updates

const prodiList = [
  'Sistem Informasi',
  'Arsitektur',
  'Biologi',
  'Matematika',
  'Ilmu Kelautan',
  'Teknik Sipil',
  'Teknik Lingkungan'
];

export default async function HomePage() {
  const [programs, alumni] = await Promise.all([
    getAllPrograms(),
    getAllAlumni()
  ]);

  return (
    <>
      {/* =========================================================================
          1. HERO SECTION - ICONIC SOLANE V-BEAM & 3D FLOATING EMBLEM
          ========================================================================= */}
      <section className="solane-hero">
        {/* Background Ambient Radial Glow */}
        <div className="solane-hero-ambient" aria-hidden="true" />

        {/* V-Shaped Converging Neon Laser Ray SVG */}
        <div className="solane-v-beam-container" aria-hidden="true">
          <svg 
            className="solane-v-beam-svg" 
            viewBox="0 0 1440 900" 
            fill="none" 
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="vBeamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
                <stop offset="25%" stopColor="#22c55e" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#86efac" stopOpacity="1" />
                <stop offset="75%" stopColor="#22c55e" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#10b981" stopOpacity="0.4" />
              </linearGradient>
              <linearGradient id="vBeamGradientLight" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#166534" stopOpacity="0.3" />
                <stop offset="25%" stopColor="#15803d" stopOpacity="0.85" />
                <stop offset="50%" stopColor="#22c55e" stopOpacity="1" />
                <stop offset="75%" stopColor="#15803d" stopOpacity="0.85" />
                <stop offset="100%" stopColor="#166534" stopOpacity="0.3" />
              </linearGradient>
              <filter id="vBeamGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="8" result="blur1" />
                <feGaussianBlur stdDeviation="22" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur2" />
                  <feMergeNode in="blur1" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Glowing Neon Green Laser Ray V-Curve */}
            <path 
              className="solane-v-beam-glow"
              d="M-40,240 C380,380 620,700 720,750 C820,700 1060,380 1480,240" 
              stroke="url(#vBeamGradient)" 
              strokeWidth="3.5" 
              filter="url(#vBeamGlow)"
            />

            {/* Core Bright Center Ray */}
            <path 
              className="solane-v-beam-core"
              d="M-40,240 C380,380 620,700 720,750 C820,700 1060,380 1480,240" 
              stroke="#ffffff" 
              strokeWidth="1.2" 
              strokeOpacity="0.9"
            />
          </svg>
        </div>

        {/* Hero Content */}
        <div className="solane-hero-content">
          {/* Top 3D Floating Emblem with Halo & Stardust Particles */}
          <div className="solane-emblem-stage">
            <div className="solane-emblem-halo" />
            <div className="solane-stardust-ring" />
            <HeroEmblem />
          </div>

          {/* Solane Main Headline */}
          <h1 className="solane-headline">
            Mewujudkan <span className="glow-text-green">inovasi sains</span> untuk aksi berdampak
          </h1>

          {/* Subtitle */}
          <p className="solane-subtitle">
            Selamat datang di platform resmi Dewan Eksekutif Mahasiswa (DEMA) Fakultas Sains dan Teknologi UIN Sunan Ampel Surabaya. Wadah representasi, eksplorasi riset teknologi, advokasi, dan pengabdian nyata.
          </p>

          {/* CTA Group */}
          <div className="solane-cta-group">
            <Link href="/portofolio" className="btn-solane-green btn-solane-lg">
              Jelajahi Portofolio
            </Link>
            <Link href="/profil" className="btn-solane-ghost btn-solane-lg">
              <IconCompass size={18} /> Profil &amp; Filosofi
            </Link>
          </div>

          {/* 7 Program Studi FST / Ormawa Partner Strip */}
          <div className="solane-partner-strip">
            {prodiList.map((prodi, idx) => (
              <span key={idx} className="solane-partner-item">
                <span className="solane-partner-dot" />
                <span>{prodi}</span>
              </span>
            ))}
          </div>

          {/* Scroll To Explore Indicator at V-Beam Apex */}
          <a href="#explore" className="solane-scroll-explore" aria-label="Scroll ke bagian profil">
            <span className="solane-scroll-text">Scroll To Explore</span>
            <div className="solane-scroll-line" />
          </a>
        </div>
      </section>

      {/* =========================================================================
          2. SECTION: MEET KABINET WIGYAMERTA ANTASENA & STATS
          ========================================================================= */}
      <section className="solane-section" id="explore">
        <div className="container">
          <div className="solane-section-tag">
            KABINET WIGYAMERTA ANTASENA &bull; 2026/2027
          </div>
          <h2 className="solane-section-title">
            Kepemimpinan adaptif yang memahami kebutuhan mahasiswa.
          </h2>

          {/* Large Minimalist Stats Numbers */}
          <StatsCounter items={stats} />

          {/* 3 Pillar Cards (Aware / Personalized / Reliable) */}
          <div className="solane-pillars-grid">
            <div className="solane-pillar-card">
              <div className="solane-pillar-icon">
                <IconBulb size={22} />
              </div>
              <h3 className="solane-pillar-title">Inovatif &amp; Kritis</h3>
              <p className="solane-pillar-desc">
                Mendorong riset terapan dan kreasi solutif yang berorientasi pada pemecahan masalah riil di lingkungan kampus dan masyarakat.
              </p>
            </div>

            <div className="solane-pillar-card">
              <div className="solane-pillar-icon">
                <IconNetwork size={22} />
              </div>
              <h3 className="solane-pillar-title">Sinergis &amp; Kolaboratif</h3>
              <p className="solane-pillar-desc">
                Menjalin kemitraan strategis yang harmonis antar himpunan mahasiswa prodi, lembaga eksternal, dan mitra industri teknologi.
              </p>
            </div>

            <div className="solane-pillar-card">
              <div className="solane-pillar-icon">
                <IconShield size={22} />
              </div>
              <h3 className="solane-pillar-title">Advokatif &amp; Terbuka</h3>
              <p className="solane-pillar-desc">
                Garda terdepan dalam mengawal hak-hak akademis, penjaminan transparansi UKT, serta kanal aspirasi mahasiswa yang selalu siap siaga.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. SECTION: FEATURES / REKAM JEJAK & BENTO SHOWCASE
          ========================================================================= */}
      <section className="solane-section" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)' }} id="portofolio">
        <div className="container">
          {/* Header Row */}
          <div className="solane-features-header">
            <div className="solane-features-title-block">
              <div className="solane-section-tag">PROGRAM KERJA &amp; REKAM JEJAK</div>
              <h2>
                Satu pergerakan terpadu untuk kemajuan riset, advokasi, dan pengabdian.
              </h2>
            </div>
            <div>
              <Link href="/portofolio" className="btn-solane-green">
                Lihat Seluruh Portofolio &rarr;
              </Link>
            </div>
          </div>

          {/* Solane Bento Grid */}
          <div className="solane-bento-grid">
            {/* Bento Left: Inisiatif Nyata */}
            <div className="solane-bento-card">
              <div>
                <div className="solane-bento-top-icon">
                  <IconRocket size={22} />
                </div>
                <h3 className="solane-bento-headline">
                  Inisiatif Nyata &amp; Dampak Berkelanjutan.
                </h3>
                <p className="solane-bento-desc">
                  Setiap inisiatif dirancang dengan indikator dampak yang terukur—mulai dari pameran inovasi berskala nasional, digitalisasi desa binaan, hingga advokasi beasiswa darurat untuk mahasiswa.
                </p>
              </div>

              <div>
                <Link href="/portofolio" className="solane-bento-link">
                  <span>Jelajahi alur program kerja</span>
                  <span>&rarr;</span>
                </Link>
              </div>
            </div>

            {/* Bento Right: Futuristic Holographic UI Mockup */}
            <div className="solane-bento-card" style={{ padding: '24px' }}>
              <div className="solane-mockup-frame">
                <div className="solane-mockup-halo" />
                
                {/* Mockup Top Header */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 10px #22c55e' }} />
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#e2ede6' }}>DEMA Command Center</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#4ade80', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 8px', borderRadius: '99px', border: '1px solid rgba(34, 197, 94, 0.25)' }}>
                    Live 2026/2027
                  </span>
                </div>

                {/* Mockup Pills & Active Items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#4ade80' }}><IconCheck size={16} /></span>
                      <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Science &amp; Tech Expo (STIX)</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8fa697' }}>1.500+ Pengunjung</span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#4ade80' }}><IconCheck size={16} /></span>
                      <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>DEMA Mengabdi: Desa Digital</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8fa697' }}>3 Desa Binaan</span>
                  </div>

                  <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.07)', borderRadius: '12px', padding: '12px 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{ color: '#4ade80' }}><IconCheck size={16} /></span>
                      <span style={{ fontSize: '0.85rem', color: '#ffffff', fontWeight: 600 }}>Advokasi UKT &amp; Kesejahteraan</span>
                    </div>
                    <span style={{ fontSize: '0.75rem', color: '#8fa697' }}>100% Ditindaklanjuti</span>
                  </div>
                </div>

                {/* Mockup Mini V-Beam at Bottom */}
                <div style={{ marginTop: '20px', textAlign: 'center' }}>
                  <svg width="100%" height="40" viewBox="0 0 300 40" fill="none">
                    <path d="M0,5 C75,10 120,35 150,38 C180,35 225,10 300,5" stroke="url(#vBeamGradient)" strokeWidth="2" filter="url(#vBeamGlow)" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Portfolio Cards */}
          <PortfolioSection initialPrograms={programs} showAllButton={true} />
        </div>
      </section>

      {/* =========================================================================
          4. SECTION: ABOUT & 3D LOGO PHILOSOPHY
          ========================================================================= */}
      <section className="solane-section" style={{ borderTop: '1px solid var(--border-color)' }}>
        <div className="container">
          <div className="about-grid">
            <div className="about-text-content">
              <div className="solane-section-tag" style={{ textAlign: 'left' }}>IDENTITAS &amp; VISI</div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em', marginBottom: '20px' }}>
                Filosofi Lambang &amp; Komitmen Nilai
              </h2>
              <p className="about-lead" style={{ color: 'var(--text-main)' }}>
                DEMA hadir sebagai episentrum pergerakan intelektual dan pengabdian mahasiswa yang memadukan kedalaman riset sains dengan kecanggihan teknologi mutakhir.
              </p>
              <p className="about-desc" style={{ color: 'var(--text-muted)' }}>
                Setiap elemen pada lambang DEMA memiliki makna mendalam yang mendasari arah langkah dan etos kerja seluruh fungsionaris dalam melayani mahasiswa dan masyarakat.
              </p>

              <div className="philosophy-grid">
                {logoPhilosophy.map((philo, index) => (
                  <div key={index} className="philosophy-card" style={{ background: 'var(--solane-card-bg)', border: '1px solid var(--solane-card-border)', borderRadius: '16px' }}>
                    <div className="philosophy-header">
                      <div className={`philosophy-icon ${philo.color}`} style={{ padding: '5px' }}>
                        <img src={philo.image} alt={philo.title} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                      </div>
                      <h4 style={{ color: 'var(--text-heading)' }}>{philo.title}</h4>
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>{philo.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Vision Banner with 3D Exploded Philosophy Logo */}
            <div className="about-visual-column">
              <div className="about-banner-card" style={{ background: 'var(--solane-card-bg)', border: '1px solid var(--solane-card-border)', borderRadius: '24px' }}>
                <LogoPhilosophy3D defaultExploded={true} />
                <div className="banner-quote" style={{ color: 'var(--text-main)' }}>
                  &ldquo;Mewujudkan kepemimpinan yang inklusif, profesional, dan berintegritas untuk menciptakan lingkungan organisasi yang hangat serta terbuka bagi seluruh mahasiswa.&rdquo;
                </div>
                <div className="banner-author" style={{ color: '#10b981' }}>
                  &mdash; Komitmen Kabinet Wigyamerta Antasena
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. SECTION: KESAN & PESAN ALUMNI FST
          ========================================================================= */}
      <AlumniSection initialAlumni={alumni} />

      {/* =========================================================================
          6. SECTION: SUARA MAHASISWA & ASPIRASI (CTA)
          ========================================================================= */}
      <section className="solane-section" style={{ borderTop: '1px solid var(--border-color)' }} id="aspirasi">
        <div className="container">
          <div className="cta-grid">
            <div className="cta-text">
              <div style={{ display: 'inline-block', background: 'rgba(52, 211, 153, 0.12)', border: '1px solid rgba(52, 211, 153, 0.3)', padding: '5px 16px', borderRadius: '99px', fontSize: '0.78rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.2px', color: '#10b981', marginBottom: '18px' }}>
                Suara &amp; Aspirasi Mahasiswa
              </div>
              <h2 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-heading)', letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '20px' }}>
                Punya Gagasan, Kritik, atau Membutuhkan Bantuan Advokasi?
              </h2>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '1.02rem', marginBottom: '30px' }}>
                DEMA adalah ruang terbuka untuk setiap suara dan kegelisahan mahasiswa. Sampaikan gagasan proyek, saran evaluasi perkuliahan, fasilitas kampus, maupun kendala finansial secara aman dan terpercaya.
              </p>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontWeight: 800, color: '#10b981', letterSpacing: '-0.03em' }}>100%</div>
                <div style={{ fontSize: '0.9rem', lineHeight: 1.5, color: 'var(--text-main)' }}>
                  Aspirasi masuk dicatat dan dibahas dalam rapat koordinasi pimpinan setiap pekan.
                </div>
              </div>
            </div>

            {/* Quick Form Card */}
            <div className="cta-card-form" style={{ background: 'var(--solane-card-bg)', border: '1px solid var(--solane-card-border)', borderRadius: '24px', padding: '34px' }}>
              <h3 className="form-title" style={{ color: 'var(--text-heading)', fontSize: '1.4rem', fontWeight: 800 }}>Sampaikan Suara Anda</h3>
              <p className="form-subtitle" style={{ color: 'var(--text-muted)' }}>Tuliskan pesan Anda secara langsung ke meja Badan Pengurus Harian.</p>
              <AspirasiForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
