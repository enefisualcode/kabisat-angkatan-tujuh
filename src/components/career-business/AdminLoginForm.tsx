"use client";

import { LoaderCircle } from "lucide-react";
import { useFormStatus } from "react-dom";

export default function AdminLoginForm({ action }: { action: (formData: FormData) => void | Promise<void> }) {
  return <form action={action} className="mt-6 space-y-4">
    <label className="block">Password admin<input name="password" type="password" required autoComplete="current-password" maxLength={512} className="mt-2 w-full rounded-xl border p-3" /></label>
    <LoginButton />
  </form>;
}

function LoginButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} aria-busy={pending} className="inline-flex min-h-11 min-w-28 items-center justify-center gap-2 rounded-full bg-navy px-6 py-3 text-cream transition-[background-color,opacity,transform] duration-150 active:scale-[0.98] active:bg-navy-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold disabled:cursor-wait disabled:opacity-70">{pending ? <><LoaderCircle size={17} className="animate-spin" aria-hidden="true" />Memeriksa...</> : "Masuk"}</button>;
}
