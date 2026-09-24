import Link from 'next/link';
import { getAllPrograms } from '@/lib/db';
import PortfolioSection from '@/components/PortfolioSection';

export const metadata = {
  title: 'Portofolio & Rekam Jejak Program Kerja | DEMA',
  description: 'Katalog program kerja unggulan, expo riset teknologi, aksi pengabdian desa, dan inisiatif advokasi mahasiswa DEMA.',
};

export const revalidate = 0; // Dynamic data

export default function PortofolioPage() {
  const programs = getAllPrograms();

  return (
    <>
      {/* Page Banner */}
      <section className="page-banner">
        <div className="container">
          <h1>Portofolio &amp; Rekam Jejak</h1>
          <p>Katalog dokumentasi inisiatif, expo teknologi, proyek riset mahasiswa, aksi kemanusiaan, serta advokasi kesejahteraan yang tersimpan di database DEMA.</p>
          <div className="breadcrumb-trail">
            <Link href="/">Beranda</Link> &bull; <span>Portofolio DEMA</span>
          </div>
        </div>
      </section>

      {/* Portfolio Showcase */}
      <section style={{ padding: '70px 0 100px', background: 'var(--bg-page)' }}>
        <div className="container">
          <PortfolioSection initialPrograms={programs} showAllButton={false} />

          {/* Collaboration Callout Box */}
          <div style={{ marginTop: '70px', background: 'linear-gradient(135deg, #10331b, #19522b)', borderRadius: 'var(--radius-lg)', padding: '40px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '8px' }}>Punya Ide Program Kolaborasi Bersama DEMA?</h3>
              <p style={{ fontSize: '0.95rem', color: '#d0e4d7', maxWidth: '600px' }}>Kami terbuka untuk kemitraan riset, sponsor kegiatan, mentoring karir mahasiswa, maupun pengabdian masyarakat lintas instansi.</p>
            </div>
            <div>
              <Link href="/kontak" className="btn btn-orange btn-lg">
                Hubungi Tim Kemitraan &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
