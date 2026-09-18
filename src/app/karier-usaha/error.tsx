"use client";
export default function ErrorPage({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-2xl px-6 py-24 text-center"><h1 className="text-2xl font-bold">Peluang belum dapat dimuat</h1><p className="my-4">Terjadi gangguan koneksi. Silakan coba kembali.</p><button onClick={reset} className="rounded-full bg-navy px-6 py-3 text-cream">Coba lagi</button></section>;
}
