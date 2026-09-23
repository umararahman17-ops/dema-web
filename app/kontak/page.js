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
      <section style={{ padding: '70px 0 40px', background: '#ffffff' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '60px' }}>
            {/* Card 1 */}
            <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.1)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📍</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#11261b', marginBottom: '8px' }}>Sekretariat</h4>
              <p style={{ fontSize: '0.88rem', color: '#536c5e', lineHeight: 1.6 }}>Gedung Student Center Lt. 2, Sayap Timur Kampus Sains &amp; Teknologi</p>
            </div>

            {/* Card 2 */}
            <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(224,99,31,0.1)', color: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>✉️</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#11261b', marginBottom: '8px' }}>Surel Resmi</h4>
              <p style={{ fontSize: '0.88rem', color: '#536c5e', lineHeight: 1.6 }}>
                <a href="mailto:sekretariat@dema-univ.ac.id" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>sekretariat@dema-univ.ac.id</a>
              </p>
            </div>

            {/* Card 3 */}
            <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(30,107,55,0.1)', color: 'var(--primary-green)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📱</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#11261b', marginBottom: '8px' }}>Hotline WhatsApp</h4>
              <p style={{ fontSize: '0.88rem', color: '#536c5e', lineHeight: 1.6 }}>
                <a href="https://wa.me/6281234567890" style={{ color: 'var(--primary-green)', fontWeight: 600 }}>+62 812-3456-7890</a>
              </p>
            </div>

            {/* Card 4 */}
            <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '28px', textAlign: 'center' }}>
              <div style={{ width: '50px', height: '50px', background: 'rgba(224,99,31,0.1)', color: 'var(--accent-orange)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 16px' }}>📸</div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#11261b', marginBottom: '8px' }}>Instagram</h4>
              <p style={{ fontSize: '0.88rem', color: '#536c5e', lineHeight: 1.6 }}>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-orange)', fontWeight: 600 }}>@dema.official</a>
              </p>
            </div>
          </div>

          {/* Main Aspirasi & FAQ Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '50px', alignItems: 'flex-start' }} id="aspirasi">
            {/* Aspirasi Form */}
            <div style={{ background: '#ffffff', border: '1px solid #dcebe1', borderRadius: 'var(--radius-lg)', padding: '40px', boxShadow: 'var(--shadow-md)' }}>
              <div className="section-tag">Layanan Terpadu</div>
              <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#11261b', marginBottom: '8px' }}>Formulir Aspirasi &amp; Aduan Mahasiswa</h2>
              <p style={{ fontSize: '0.95rem', color: '#556e60', marginBottom: '24px' }}>Silakan sampaikan usulan, laporan fasilitas, maupun permohonan advokasi dengan mengisi formulir di bawah ini.</p>
              <AspirasiForm />
            </div>

            {/* FAQ Accordion */}
            <div>
              <div className="section-tag">Pusat Bantuan</div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#11261b', marginBottom: '20px' }}>Pertanyaan Sering Diajukan (FAQ)</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#11281c', marginBottom: '6px' }}>Bagaimana alur advokasi UKT mahasiswa?</h4>
                  <p style={{ fontSize: '0.88rem', color: '#526c5d', lineHeight: 1.6 }}>DEMA membuka posko advokasi banding UKT setiap awal semester. Anda dapat melampirkan berkas bukti kendala finansial untuk kami dampingi ke dekanat.</p>
                </div>

                <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#11281c', marginBottom: '6px' }}>Apakah mahasiswa umum bisa mengajukan kolaborasi program?</h4>
                  <p style={{ fontSize: '0.88rem', color: '#526c5d', lineHeight: 1.6 }}>Sangat bisa! DEMA secara berkala menerima proposal proyek inovasi sains, workshop teknologi, atau agenda sosial melalui Departemen Riset atau Hubungan Masyarakat.</p>
                </div>

                <div style={{ background: '#f7faf8', border: '1px solid #dcebe1', borderRadius: 'var(--radius-md)', padding: '20px' }}>
                  <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#11281c', marginBottom: '6px' }}>Kapan Open Recruitment DEMA dibuka?</h4>
                  <p style={{ fontSize: '0.88rem', color: '#526c5d', lineHeight: 1.6 }}>Perekrutan pengurus dan relawan kepanitiaan dibuka pada awal tahun kepengurusan dan setiap menjelang acara akbar nasional. Pantau Instagram kami untuk info terbaru.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
