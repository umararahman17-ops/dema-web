import Link from 'next/link';
import AspirasiForm from '@/components/AspirasiForm';
import { IconMapPin, IconMail, IconPhone } from '@/components/Icons';

export const metadata = {
  title: 'Kontak & Kanal Aspirasi Mahasiswa | DEMA',
  description: 'Hubungi pengurus Dewan Eksekutif Mahasiswa (DEMA), sampaikan aspirasi, aduan fasilitas, atau gagasan kolaborasi.',
};

export default function KontakPage() {
  return (
    <>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h1>Kontak &amp; Saluran Aspirasi</h1>
          <p>Kami hadir untuk mendengar dan memperjuangkan suara Anda. Hubungi kami melalui kanal resmi atau sampaikan aspirasi Anda secara langsung.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <span>Kontak</span>
          </div>
        </div>
      </section>

      {/* Contact Info Grid */}
      <section style={{ padding: '70px 0 40px', background: 'var(--bg-surface)' }}>
        <div className="container">
          <div className="contact-info-grid">
            {/* Card 1: Sekretariat */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.15)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <IconMapPin size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Sekretariat</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Gedung TA Lantai 5, Lab Saintek UINSA, Kampus 2 Gunung Anyar, Surabaya</p>
            </div>

            {/* Card 2: Surel */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(224,99,31,0.15)', color: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <IconMail size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Surel Resmi</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <a href="mailto:sekretariat@dema-univ.ac.id" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>sekretariat@dema-univ.ac.id</a>
              </p>
            </div>

            {/* Card 3: WhatsApp */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.15)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <IconPhone size={24} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Hotline Aspirasi</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <a href="https://wa.me/6281234567890" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>+62 812-3456-7890</a>
              </p>
            </div>
          </div>

          {/* Official Social Media Channels */}
          <div style={{ marginBottom: '60px' }}>
            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
              <div className="section-tag">Kanal Resmi</div>
              <h3 style={{ fontSize: '1.55rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Media Sosial &amp; Publikasi Digital</h3>
              <p style={{ fontSize: '0.92rem', color: 'var(--text-muted)' }}>Ikuti linimasa kegiatan, rilis informasi terkini, serta dokumentasi program kerja DEMA FST UINSA.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))', gap: '20px' }}>
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/demafstuinsa/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
                className="hover-card-rise"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #f09433, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Instagram</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>@demafstuinsa</div>
                </div>
              </a>

              {/* YouTube */}
              <a 
                href="https://www.youtube.com/@demafstuinsa506" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
                className="hover-card-rise"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#FF0000', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>YouTube</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>@demafstuinsa506</div>
                </div>
              </a>

              {/* LinkedIn */}
              <a 
                href="https://id.linkedin.com/company/dema-fst-uin-sunan-ampel-surabaya" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
                className="hover-card-rise"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#0A66C2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>LinkedIn</div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-heading)', lineHeight: 1.3 }}>DEMA FST UINSA</div>
                </div>
              </a>

              {/* Facebook */}
              <a 
                href="https://www.facebook.com/people/Dema-Fst-Uinsa/100009686855633/" 
                target="_blank" 
                rel="noopener noreferrer" 
                style={{ 
                  background: 'var(--bg-card)', 
                  border: '1px solid var(--border-color)', 
                  borderRadius: 'var(--radius-md)', 
                  padding: '24px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  textDecoration: 'none', 
                  transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)' 
                }}
                className="hover-card-rise"
              >
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#1877F2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', flexShrink: 0 }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                </div>
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 600 }}>Facebook</div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-heading)' }}>Dema Fst Uinsa</div>
                </div>
              </a>
            </div>
          </div>

          {/* Main Aspirasi & FAQ Grid */}
          <div className="contact-main-grid" id="aspirasi">
            {/* Aspirasi Form */}
            <div className="contact-form-card">
              <div className="section-tag">Layanan Terpadu</div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Formulir Aspirasi &amp; Aduan Mahasiswa</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: '24px' }}>Silakan sampaikan usulan, laporan fasilitas, maupun permohonan advokasi dengan mengisi formulir di bawah ini.</p>
              <AspirasiForm />
            </div>

            {/* FAQ Accordion */}
            <div>
              <div className="section-tag">Pusat Bantuan</div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '20px' }}>Pertanyaan Sering Diajukan (FAQ)</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '6px' }}>Bagaimana alur advokasi UKT mahasiswa?</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>DEMA membuka posko advokasi banding UKT setiap awal semester. Anda dapat melampirkan berkas bukti kendala finansial untuk kami dampingi ke dekanat.</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '6px' }}>Apakah mahasiswa umum bisa mengajukan kolaborasi program?</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Sangat bisa! DEMA secara berkala menerima proposal proyek inovasi sains, workshop teknologi, atau agenda sosial melalui Departemen Riset atau Hubungan Masyarakat.</p>
                </div>

                <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '6px' }}>Kapan Open Recruitment DEMA dibuka?</h4>
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Perekrutan pengurus dan relawan kepanitiaan dibuka pada awal tahun kepengurusan dan setiap menjelang agenda akbar. Pantau Instagram resmi kami di <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>@demafstuinsa</a> untuk pengumuman terbaru.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
