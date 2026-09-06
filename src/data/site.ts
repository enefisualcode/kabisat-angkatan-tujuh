// NOTE: ganti seluruh nilai di file ini dengan data resmi KABISAT saat sudah tersedia.
export const site = {
  name: "KABISAT Angkatan Tujuh",
  shortName: "KABISAT",
  fullName: "Keluarga Alumni Angkatan Tujuh",
  tagline: "Menjaga Silaturahmi, Melanjutkan Perjalanan.",
  heroSubtext:
    "Wadah kebersamaan, silaturahmi, dan perjalanan alumni Angkatan Tujuh.",
  description:
    "Website resmi alumni KABISAT Angkatan Tujuh. Informasi kepengurusan, program, agenda, dan dokumentasi perjalanan alumni.",
  // TODO: ganti dengan domain resmi saat sudah tersedia
  url: "https://kabisatangkatantujuh.org",
  email: "halo@kabisatangkatantujuh.org",
  instagram: "https://instagram.com/kabisat.angkatan7",

  logos: {
    full: "/logos/kabisat-full.png",
    symbol: "/logos/kabisat-symbol.png",
  },

  heroImage: "/images/hero/alumni-group.jpeg",
  ogImage: "/og-image.png",

  closingCta: {
    lines: [
      "Perjalanan kita belum selesai.",
      "Setiap pertemuan adalah kesempatan untuk kembali terhubung dan menciptakan cerita baru.",
      "Sampai bertemu di kegiatan KABISAT berikutnya.",
    ],
  },

  about: {
    heroTitle: "Tentang KABISAT",
    kami: {
      heading: "Tentang Kami",
      body: "KABISAT Angkatan Tujuh adalah wadah bagi seluruh alumni Angkatan Tujuh untuk tetap menjaga silaturahmi, berbagi kabar, dan bergerak bersama dalam berbagai program dan kegiatan alumni.",
    },
    awalPerjalanan: {
      heading: "Awal Perjalanan",
      body: "Kebersamaan Angkatan Tujuh dimulai jauh sebelum KABISAT terbentuk secara resmi. Setelah bertahun-tahun terpisah jalan masing-masing, semangat untuk tetap terhubung inilah yang akhirnya menyatukan kembali langkah untuk membentuk wadah alumni yang lebih terstruktur.",
    },
    filosofiNama: {
      heading: "Filosofi Nama KABISAT",
      // TODO: lengkapi filosofi nama saat data resmi tersedia
      body: "Filosofi nama KABISAT akan dilengkapi.",
    },
    filosofiLogo: {
      heading: "Filosofi Logo",
      // TODO: lengkapi filosofi logo saat data resmi tersedia
      body: "Filosofi logo akan dilengkapi.",
    },
  },

  values: [
    {
      id: "silaturahmi",
      title: "SILATURAHMI",
      description: "Menjaga hubungan yang telah tumbuh.",
    },
    {
      id: "kebersamaan",
      title: "KEBERSAMAAN",
      description: "Berjalan bersama dalam berbagai fase kehidupan.",
    },
    {
      id: "kontribusi",
      title: "KONTRIBUSI",
      description:
        "Memberikan manfaat bagi sesama alumni dan lingkungan sekitar.",
    },
  ],
};

export const navLinks = [
  { href: "/", label: "Beranda" },
  { href: "/kepengurusan", label: "Kepengurusan" },
  { href: "/program", label: "Program" },
  { href: "/dokumentasi", label: "Dokumentasi" },
  { href: "/tentang", label: "Tentang" },
];
