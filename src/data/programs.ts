import type { Program } from "@/types";

// NOTE: data placeholder — ganti tanggal, lokasi, PIC, dan progress sesuai kondisi aktual.
export const programs: Program[] = [
  {
    id: "prog-1",
    slug: "pembentukan-kepengurusan",
    title: "Pembentukan Kepengurusan",
    shortDescription:
      "Menyusun struktur kepengurusan resmi pertama KABISAT Angkatan Tujuh.",
    description:
      "Program ini menjadi langkah awal berdirinya KABISAT secara formal, mulai dari penyusunan struktur organisasi, penentuan pengurus inti, hingga pembagian divisi kerja untuk menjalankan program-program alumni ke depannya.",
    estimatedDate: "September 2026",
    actualDate: "September 2026",
    location: "Jakarta",
    status: "completed",
    progress: 100,
    coverImage: "/programs/pembentukan-kepengurusan.png",
    pic: "Tim Formatur",
    participantCount: 25,
    milestones: [
      { title: "Penjaringan calon pengurus", completed: true },
      { title: "Musyawarah struktur organisasi", completed: true },
      { title: "Penetapan pengurus inti", completed: true },
      { title: "Pembentukan divisi", completed: true },
      { title: "Serah terima mandat", completed: true },
    ],
  },
  {
    id: "prog-2",
    slug: "gathering-kabisat",
    title: "Gathering KABISAT",
    shortDescription:
      "Pertemuan santai untuk mempererat kembali silaturahmi seluruh alumni.",
    description:
      "Gathering KABISAT adalah agenda kumpul santai yang dirancang sebagai ruang temu alumni lintas angkatan kerja dan kesibukan masing-masing. Diselenggarakan dengan format yang hangat dan personal, jauh dari kesan formal.",
    estimatedDate: "November 2026",
    location: "Jakarta",
    status: "preparation",
    progress: 45,
    coverImage: "/programs/gathering-kabisat.png",
    pic: "Divisi Program",
    participantCount: 80,
    milestones: [
      { title: "Pembentukan panitia acara", completed: true },
      { title: "Menentukan konsep acara", completed: true },
      { title: "Survey lokasi", completed: false, current: true },
      { title: "Pendataan peserta", completed: false },
      { title: "Booking venue", completed: false },
      { title: "Pelaksanaan", completed: false },
    ],
  },
  {
    id: "prog-3",
    slug: "reuni-akbar-kabisat-2026",
    title: "Reuni Akbar KABISAT",
    shortDescription:
      "Reuni besar seluruh alumni Angkatan Tujuh menutup tahun 2026.",
    description:
      "Reuni Akbar KABISAT menjadi puncak agenda tahunan yang mempertemukan seluruh alumni Angkatan Tujuh dalam satu momen kebersamaan besar, lengkap dengan rangkaian acara, nostalgia, dan penghargaan bagi para penggerak KABISAT.",
    estimatedDate: "Desember 2026",
    location: "Jakarta",
    status: "planned",
    progress: 15,
    coverImage: "/programs/reuni-akbar-kabisat.png",
    pic: "Divisi Program",
    participantCount: 150,
    milestones: [
      { title: "Pembentukan panitia", completed: true },
      { title: "Menentukan konsep", completed: true },
      { title: "Survey lokasi", completed: true },
      { title: "Pendataan peserta", completed: false, current: true },
      { title: "Booking venue", completed: false },
      { title: "Pelaksanaan", completed: false },
    ],
  },
  {
    id: "prog-4",
    slug: "silaturahmi-ramadan",
    title: "Silaturahmi Ramadan",
    shortDescription:
      "Agenda buka puasa dan silaturahmi alumni menyambut bulan Ramadan.",
    description:
      "Silaturahmi Ramadan menjadi agenda rutin yang dirancang untuk mempertemukan alumni dalam suasana hangat bulan puasa, sekaligus menjadi ajang berbagi kabar dan mempererat kembali hubungan antar alumni.",
    estimatedDate: "Maret 2027",
    location: "Jakarta",
    status: "planned",
    progress: 5,
    coverImage: "/programs/silaturahmi-ramadan.png",
    pic: "Divisi Sosial",
    milestones: [
      { title: "Pembentukan panitia", completed: false, current: true },
      { title: "Menentukan konsep", completed: false },
      { title: "Survey lokasi", completed: false },
      { title: "Pendataan peserta", completed: false },
      { title: "Pelaksanaan", completed: false },
    ],
  },
  {
    id: "prog-5",
    slug: "bakti-sosial",
    title: "Bakti Sosial",
    shortDescription:
      "Gagasan program kontribusi sosial dari alumni untuk lingkungan sekitar.",
    description:
      "Bakti Sosial masih berupa gagasan awal untuk menghadirkan kontribusi nyata KABISAT bagi masyarakat sekitar, sejalan dengan nilai Kontribusi yang dijunjung KABISAT.",
    estimatedDate: "Juni 2027",
    location: undefined,
    status: "idea",
    progress: 0,
    coverImage: "/programs/bakti-sosial.png",
    pic: "Divisi Sosial",
    milestones: [
      { title: "Perumusan konsep kegiatan", completed: false, current: true },
      { title: "Pembentukan panitia", completed: false },
      { title: "Penentuan lokasi sasaran", completed: false },
      { title: "Pelaksanaan", completed: false },
    ],
  },
];

export function getProgramBySlug(slug: string) {
  return programs.find((p) => p.slug === slug);
}
