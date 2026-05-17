import { useRouteError } from "react-router";

export function RootError() {
  const err = useRouteError() as Error | { message?: string; status?: number } | undefined;
  const msg = (err as Error)?.message || (err as { message?: string })?.message || String(err);

  // ChunkLoadError → vieux cache, reload forcé
  if (msg.includes("Loading chunk") || msg.includes("Failed to fetch dynamically imported")) {
    window.location.reload();
    return null;
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", gap: 16 }}>
      <p style={{ color: "rgba(255,255,255,0.30)", fontSize: 11, fontFamily: "monospace", textAlign: "center", maxWidth: 480, wordBreak: "break-all" }}>
        {msg}
      </p>
      <button
        onClick={() => { window.location.href = "/"; }}
        style={{ padding: "10px 24px", borderRadius: 999, background: "#6366f1", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
