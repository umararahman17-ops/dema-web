import Link from 'next/link';
import AspirasiForm from '@/components/AspirasiForm';

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
            {/* Card 1 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.15)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📍</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Sekretariat</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>Gedung TA Lantai 5, Lab Saintek UINSA, Kampus 2 Gunung Anyar, Surabaya</p>
            </div>

            {/* Card 2 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(224,99,31,0.15)', color: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>✉️</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Surel Resmi</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <a href="mailto:sekretariat@dema-univ.ac.id" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>sekretariat@dema-univ.ac.id</a>
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.15)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📱</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Hotline WhatsApp</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <a href="https://wa.me/6281234567890" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>+62 812-3456-7890</a>
              </p>
            </div>

            {/* Card 4 */}
            <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(224,99,31,0.15)', color: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📸</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-heading)', marginBottom: '8px' }}>Instagram</h4>
              <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                <a href="https://www.instagram.com/demafstuinsa/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>@demafstuinsa</a>
              </p>
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
