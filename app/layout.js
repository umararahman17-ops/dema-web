import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata = {
  metadataBase: new URL('http://localhost:3000'),
  title: 'DEMA | Dewan Eksekutif Mahasiswa - Kabinet Wigyamerta Antasena',
  description: 'Portal Resmi Dewan Eksekutif Mahasiswa (DEMA) Fakultas Sains dan Teknologi UIN Sunan Ampel Surabaya - Kabinet Wigyamerta Antasena. Menghadirkan profil kabinet, filosofi lambang, portofolio program kerja inovatif, serta layanan aspirasi terpadu berbasis Next.js.',
  icons: {
    icon: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'DEMA | Dewan Eksekutif Mahasiswa - Kabinet Wigyamerta Antasena',
    description: 'Wadah pergerakan, riset sains teknologi, dan aspirasi mahasiswa FST UINSA.',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap" rel="stylesheet" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('dema_theme');
                if (saved) {
                  document.documentElement.setAttribute('data-theme', saved);
                } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
