"use client";

import { useState, type FormEvent } from "react";
import { Send } from "lucide-react";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FadeIn from "@/components/ui/FadeIn";
import { site } from "@/data/site";

export default function FeedbackSection() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">(
    "idle"
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const subject = `Masukan dari ${name}`;
    const body = `Nama: ${name}\nEmail: ${email}\n\nMasukan:\n${message}`;

    setStatus("sending");

    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });

      if (response.status === 503) {
        window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
          subject
        )}&body=${encodeURIComponent(body)}`;
        setStatus("idle");
        return;
      }

      if (!response.ok) throw new Error("Feedback submission failed");

      setName("");
      setEmail("");
      setMessage("");
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="py-24 sm:py-28">
      <Container className="max-w-2xl">
        <FadeIn>
          <SectionHeading
            eyebrow="Masukan & Saran"
            title="Punya Masukan untuk KABISAT?"
            description="Sampaikan saran, kritik, atau ide kegiatan untuk perkembangan KABISAT Angkatan Tujuh."
          />
        </FadeIn>

        <FadeIn delay={0.1}>
          <form onSubmit={handleSubmit} className="mt-10 space-y-5">
            <div>
              <label
                htmlFor="feedback-name"
                className="mb-1.5 block text-sm font-medium text-navy/70"
              >
                Nama
              </label>
              <input
                id="feedback-name"
                type="text"
                required
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Nama kamu"
                className="w-full rounded-card border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-email"
                className="mb-1.5 block text-sm font-medium text-navy/70"
              >
                Email
              </label>
              <input
                id="feedback-email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="nama@email.com"
                className="w-full rounded-card border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:border-gold focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="feedback-message"
                className="mb-1.5 block text-sm font-medium text-navy/70"
              >
                Masukan
              </label>
              <textarea
                id="feedback-message"
                required
                rows={5}
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Tulis masukan atau saran kamu di sini..."
                className="w-full resize-none rounded-card border border-navy/15 bg-white px-4 py-3 text-sm text-navy placeholder:text-navy/35 focus:border-gold focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={status === "sending"}
              className="flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-transform duration-200 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
            >
              Kirim Masukan
              <Send size={15} />
            </button>
            <p
              aria-live="polite"
              className="text-sm text-navy/65"
            >
              {status === "sending"
                ? "Mengirim masukan..."
                : status === "success"
                  ? "Terima kasih, masukan Anda sudah kami terima."
                  : status === "error"
                    ? "Masukan belum terkirim. Silakan coba lagi."
                    : null}
            </p>
          </form>
        </FadeIn>
      </Container>
    </section>
  );
}
