export const orgInfo = {
  name: 'Dewan Eksekutif Mahasiswa (DEMA)',
  shortName: 'DEMA',
  cabinetName: 'Kabinet Wigyamerta Antasena',
  period: '2026/2027',
  tagline: 'Sinergi Sains & Teknologi Bersama Mahasiswa FST UINSA',
  motto: 'Inovatif, Berkarakter, Kolaboratif, Solutif',
  email: 'sekretariat@dema-univ.ac.id',
  phone: '+62 812-3456-7890',
  address: 'Gedung TA Lantai 5, Lab Saintek UIN Sunan Ampel Surabaya, Kampus 2 Gunung Anyar, Surabaya',
  instagram: '@demafstuinsa',
  instagramUrl: 'https://www.instagram.com/demafstuinsa/',
  youtube: '@demafstuinsa506',
  youtubeUrl: 'https://www.youtube.com/@demafstuinsa506',
  linkedin: 'DEMA FST UIN Sunan Ampel Surabaya',
  linkedinUrl: 'https://id.linkedin.com/company/dema-fst-uin-sunan-ampel-surabaya',
  facebook: 'Dema Fst Uinsa',
  facebookUrl: 'https://www.facebook.com/people/Dema-Fst-Uinsa/100009686855633/',
};

export const stats = [
  { number: 8, suffix: '', label: 'Departemen & Biro', iconKey: 'building', color: 'green' },
  { number: 42, suffix: '+', label: 'Program Kerja Terlaksana', iconKey: 'rocket', color: 'orange' },
  { number: 5400, suffix: '+', label: 'Mahasiswa Terfasilitasi', iconKey: 'users', color: 'green' },
  { number: 24, suffix: '+', label: 'Mitra Kampus & Industri', iconKey: 'handshake', color: 'orange' },
];

export const logoPhilosophy = [
  {
    iconKey: 'atom',
    image: '/logo-elements/inti-atom.png',
    color: 'green',
    title: 'Inti Atom (Sains & Riset)',
    desc: 'Melambangkan pilar keilmuan, riset ilmiah yang tajam, dan pemikiran rasional analitis mahasiswa sebagai kaum intelektual sains & teknologi.'
  },
  {
    iconKey: 'gear',
    image: '/logo-elements/roda-bergerigi.png',
    color: 'orange',
    title: 'Roda Bergerigi (Teknologi & Aksi)',
    desc: 'Simbol penerapan teknologi, dinamika kerja yang tiada henti, dan implementasi nyata solusi rekayasa teknik bagi peradaban bangsa.'
  },
  {
    iconKey: 'octagon',
    image: '/logo-elements/bingkai-segi-delapan.png',
    color: 'green',
    title: 'Bingkai Segi Delapan Teranyam',
    desc: 'Representasi keteguhan integritas moral berlandaskan nilai Islam, keharmonisan persatuan elemen kampus, serta sinergi lintas disiplin ilmu.'
  },
  {
    iconKey: 'pillar',
    image: '/logo-elements/pilar-sudut-maju.png',
    color: 'orange',
    title: 'Pilar Oranye & Sudut Maju',
    desc: 'Melambangkan pilar kokoh kepemimpinan, keberanian menatap tantangan zaman, dan arah akselerasi gerak yang progresif.'
  }
];

export const defaultPrograms = [
  {
    id: 1,
    slug: 'science-tech-innovation-expo',
    title: 'Science & Technology Expo (STIX 2026)',
    category: 'sains-teknologi',
    categoryName: 'Sains & Teknologi',
    date: '15-18 Mei 2026',
    status: 'Sukses Terlaksana',
    desc: 'Pameran inovasi dan riset teknologi mahasiswa berskala nasional dengan 80+ prototipe karya teknologi mutakhir, IoT, kecerdasan buatan, serta kompetisi ilmiah.',
    impact: '1.500+ Pengunjung • 25 Tim Finalis • 6 Paten/HKI Terbantu',
    image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
    tags: ['Expo', 'IoT', 'AI', 'Riset'],
    featured: true
  },
  {
    id: 2,
    slug: 'dema-mengabdi-desa-digital',
    title: 'DEMA Mengabdi: Transformasi Digital Desa',
    category: 'sosial-pengabdian',
    categoryName: 'Sosial & Pengabdian',
    date: '20-27 Juli 2026',
    status: 'Sukses Terlaksana',
    desc: 'Program pengabdian masyarakat terintegrasi yang menghadirkan sistem administrasi desa berbasis website, pelatihan literasi internet sehat, dan digitalisasi UMKM lokal.',
    impact: '3 Desa Binaan • 45 UMKM Terdigitalisasi • 300+ Warga Terlatih',
    image: 'https://images.unsplash.com/photo-1531206715517-5c0ba140b2b8?auto=format&fit=crop&w=800&q=80',
    tags: ['Pengabdian', 'Desa Digital', 'UMKM'],
    featured: true
  },
  {
    id: 3,
    slug: 'leadership-tech-bootcamp',
    title: 'National Student Leadership & Tech Bootcamp',
    category: 'kaderisasi',
    categoryName: 'Kaderisasi & Karir',
    date: '10-12 Maret 2026',
    status: 'Sukses Terlaksana',
    desc: 'Kaderisasi kepemimpinan tingkat lanjut bagi aktivis mahasiswa dengan fokus pada manajemen organisasi modern, diplomasi, problem solving berbasis data, dan adaptasi era AI.',
    impact: '350 Peserta Terpilih • 12 Mentor Eksekutif & Praktisi',
    image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    tags: ['Leadership', 'Bootcamp', 'Manajemen'],
    featured: true
  },
  {
    id: 4,
    slug: 'hackathon-ai-green-solutions',
    title: 'Hackathon: Green Tech & AI Climate Solutions',
    category: 'sains-teknologi',
    categoryName: 'Sains & Teknologi',
    date: '2-4 Agustus 2026',
    status: 'Sukses Terlaksana',
    desc: 'Kompetisi coding 36 jam nonstop untuk merancang solusi komputasi cerdas dalam mitigasi krisis iklim, manajemen energi terbarukan, dan zero-waste kampus.',
    impact: '42 Tim Pengembang • Rp 40 Juta Total Hibah Dana Riset',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80',
    tags: ['Hackathon', 'AI', 'Sustainability'],
    featured: true
  },
  {
    id: 5,
    slug: 'advokasi-terpadu-kesejahteraan-mahasiswa',
    title: 'Advokasi Terpadu & Forum Dengar Suara',
    category: 'advokasi',
    categoryName: 'Advokasi Mahasiswa',
    date: 'Setiap Bulan (Berkala)',
    status: 'Program Berjalan',
    desc: 'Kanal advokasi terbuka dan pendampingan bantuan banding UKT, sarana laboratorium, dan beasiswa darurat untuk menjamin tidak ada rekan mahasiswa yang putus kuliah.',
    impact: '100% Aduan Masuk Ditindaklanjuti • 180+ Penerima Beasiswa Advokasi',
    image: 'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=800&q=80',
    tags: ['Advokasi', 'Beasiswa', 'UKT'],
    featured: true
  },
  {
    id: 6,
    slug: 'festival-seni-kreatif-sains',
    title: 'Art & Science Fusion Festival 2026',
    category: 'seni-kreatif',
    categoryName: 'Kreatif & Seni',
    date: '28-29 September 2026',
    status: 'Segera Datang',
    desc: 'Kolaborasi spektakuler antara sains komputasi dan instalasi seni interaktif multimedia yang mengeksplorasi estetika fraktal, musik algoritmis, dan teater kontemporer.',
    impact: 'Target 2.000 Apresian • 15 Komunitas Seni Kolaborator',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    tags: ['Art & Science', 'Festival', 'Seni'],
    featured: true
  }
];
