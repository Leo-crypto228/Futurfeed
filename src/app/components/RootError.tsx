import { useRouteError } from "react-router";

export function RootError() {
  const err = useRouteError();

  let name = "Erreur";
  let msg = "Erreur inconnue";
  let stack = "";

  if (err instanceof Error) {
    name = err.name || "Error";
    msg = err.message || String(err);
    stack = err.stack?.split("\n").slice(1, 6).join("\n") || "";
  } else if (err && typeof err === "object") {
    const e = err as { message?: string; status?: number; statusText?: string };
    msg = e.message || e.statusText || JSON.stringify(err);
    if (e.status) name = `HTTP ${e.status}`;
  } else {
    msg = String(err);
  }

  if (msg.includes("Loading chunk") || msg.includes("Failed to fetch dynamically imported")) {
    window.location.reload();
    return null;
  }

  return (
    <div style={{ minHeight: "100dvh", background: "#050510", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px", gap: 12 }}>
      <p style={{ color: "#f87171", fontSize: 13, fontFamily: "monospace", textAlign: "center", fontWeight: 700, margin: 0 }}>
        {name}
      </p>
      <p style={{ color: "rgba(255,255,255,0.85)", fontSize: 14, fontFamily: "monospace", textAlign: "center", maxWidth: 480, wordBreak: "break-all", margin: 0, lineHeight: 1.5 }}>
        {msg}
      </p>
      {stack && (
        <pre style={{ color: "rgba(255,255,255,0.35)", fontSize: 10, fontFamily: "monospace", textAlign: "left", maxWidth: 480, wordBreak: "break-all", whiteSpace: "pre-wrap", margin: 0 }}>
          {stack}
        </pre>
      )}
      <button
        onClick={() => { window.location.href = "/"; }}
        style={{ marginTop: 8, padding: "10px 24px", borderRadius: 999, background: "#6366f1", border: "none", color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 14 }}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
