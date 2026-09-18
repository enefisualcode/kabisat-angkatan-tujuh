"use client";

import { useFormStatus } from "react-dom";

export default function DeleteOpportunityButton({ id, title, action }: {
  id: string;
  title: string;
  action: (form: FormData) => Promise<void>;
}) {
  return <form action={action} onSubmit={event => {
    if (!window.confirm(`Hapus posting "${title}" beserta gambar lampirannya? Tindakan ini tidak dapat dibatalkan.`)) event.preventDefault();
  }}>
    <input type="hidden" name="id" value={id} />
    <DeleteButton />
  </form>;
}

function DeleteButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending} className="rounded-full border border-red-300 px-5 py-3 text-red-700 hover:bg-red-50 disabled:cursor-wait disabled:opacity-60">{pending ? "Menghapus..." : "Hapus"}</button>;
}
