export async function POST(request: Request) {
  let payload: { name?: unknown; email?: unknown; message?: unknown };

  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "Format data tidak valid." }, { status: 400 });
  }

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (!name || !email || !message) {
    return Response.json(
      { error: "Nama, email, dan masukan wajib diisi." },
      { status: 400 }
    );
  }

  const spreadsheetWebhook = process.env.FEEDBACK_SHEET_WEBHOOK_URL;

  if (!spreadsheetWebhook) {
    return Response.json(
      { error: "Integrasi spreadsheet belum dikonfigurasi." },
      { status: 503 }
    );
  }

  try {
    const response = await fetch(spreadsheetWebhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        message,
        submittedAt: new Date().toISOString(),
      }),
      cache: "no-store",
    });

    if (!response.ok) throw new Error("Spreadsheet webhook rejected request.");
  } catch {
    return Response.json(
      { error: "Masukan belum dapat diteruskan ke spreadsheet." },
      { status: 502 }
    );
  }

  return Response.json({ ok: true });
}
