"use client";

import { useState, useRef, useEffect } from "react";

const STAGES = [
  "Conectando con el sitio",
  "Leyendo estructura y copy",
  "Evaluando propuesta de valor",
  "Revisando señales de confianza",
  "Calculando score de marketing",
];

const DEMO_RESULT = {
  score: 54,
  veredicto: "Tiene potencial pero pierde conversiones por el camino",
  problemas: [
    { titulo: "Hero sin propuesta de valor clara", impacto: "-12% conversión", severidad: "critico" },
    { titulo: "Sin señales de confianza visibles", impacto: "-15% confianza", severidad: "critico" },
    { titulo: "Llamados a la acción poco visibles", impacto: "-8% clics", severidad: "medio" },
    { titulo: "Tiempo de carga elevado", impacto: "-5% retención", severidad: "menor" },
  ],
  fortalezas: ["Diseño visual prolijo", "Navegación clara"],
  plan: [
    "Reescribir el hero con un beneficio concreto en los primeros 3 segundos",
    "Agregar testimonios o logos de clientes arriba del pliegue",
    "Hacer el botón principal más visible y repetirlo en cada sección",
    "Optimizar imágenes para reducir el tiempo de carga",
  ],
};

function scoreColor(score) {
  if (score >= 70) return "#F2FF3D";
  if (score >= 40) return "#F2FF3D";
  return "#FF6B5B";
}

function severityColor(sev) {
  if (sev === "critico") return "#FF6B5B";
  if (sev === "medio") return "#F2FF3D";
  return "#7FB8FF";
}

function severityLabel(sev) {
  if (sev === "critico") return "Crítico";
  if (sev === "medio") return "Medio";
  return "Menor";
}

export default function Home() {
  const [step, setStep] = useState("landing");
  const [url, setUrl] = useState("");
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState(null);

  function normalizeUrl(raw) {
    let v = raw.trim();
    if (!v) return "";
    if (!/^https?:\/\//i.test(v)) v = "https://" + v;
    return v;
  }

  async function runAnalysis(targetUrl) {
    setStep("loading");
    setStageIndex(0);

    const stageTimer = setInterval(() => {
      setStageIndex((prev) => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1100);

    try {
      const res = await fetch("/api/analizar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: targetUrl }),
      });

      const data = await res.json();

      clearInterval(stageTimer);

      if (!res.ok || data.error) {
        setStep("error");
        return;
      }

      setStageIndex(STAGES.length - 1);
      setResult({ ...data, urlAnalizada: targetUrl });
      setStep("result");
    } catch (e) {
      clearInterval(stageTimer);
      setStep("error");
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    const normalized = normalizeUrl(url);
    if (!normalized) return;
    runAnalysis(normalized);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B0E0C",
        color: "#F5F5F0",
        fontFamily: "'Inter', system-ui, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 20px",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }
        .mono { font-family: 'JetBrains Mono', monospace; }
        .blink { animation: blink 1s step-start infinite; }
        @keyframes blink { 50% { opacity: 0; } }
        input::placeholder { color: #6B6F69; }
        .gooso-input:focus { outline: none; border-color: #F2FF3D !important; }
        .gooso-btn:hover { background: #F7FF73 !important; }
        .fade-up { animation: fadeUp 0.5s ease both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div style={{ width: "100%", maxWidth: 720, paddingTop: 48, paddingBottom: 64 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 56 }}>
          <div style={{ width: 10, height: 10, background: "#F2FF3D", borderRadius: 2 }} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Radar</span>
          <span className="mono" style={{ fontSize: 11, color: "#6B6F69", marginLeft: 6, letterSpacing: "0.04em" }}>
            BY GOOSO
          </span>
        </div>

        {step === "landing" && (
          <div className="fade-up">
            <p className="mono" style={{ fontSize: 12, color: "#F2FF3D", letterSpacing: "0.08em", marginBottom: 18 }}>
              MARKETING DIGITAL · GROWTH
            </p>
            <h1 style={{ fontSize: 44, lineHeight: 1.08, fontWeight: 700, letterSpacing: "-0.02em", margin: "0 0 20px" }}>
              Tu sitio está dejando
              <br />
              clientes en la mesa.
            </h1>
            <p style={{ fontSize: 17, color: "#A8ACA4", lineHeight: 1.6, maxWidth: 520, margin: "0 0 36px" }}>
              Analizamos tu sitio con IA y te decimos exactamente qué está
              frenando tu conversión — score, problemas detectados y un plan
              de acción priorizado. Gratis, en menos de un minuto.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <input
                className="gooso-input mono"
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="tusitio.com"
                style={{
                  flex: "1 1 280px",
                  background: "#13160F",
                  border: "1px solid #2A2E25",
                  borderRadius: 6,
                  padding: "14px 16px",
                  fontSize: 15,
                  color: "#F5F5F0",
                }}
              />
              <button
                className="gooso-btn"
                type="submit"
                style={{
                  background: "#F2FF3D",
                  color: "#0B0E0C",
                  border: "none",
                  borderRadius: 6,
                  padding: "14px 22px",
                  fontSize: 15,
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Analizar mi sitio →
              </button>
            </form>
            <p className="mono" style={{ fontSize: 12, color: "#5C605A", marginTop: 14 }}>
              Sin tarjeta · Análisis con IA · Resultado inmediato
            </p>
          </div>
        )}

        {step === "loading" && (
          <div className="fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24 }}>Analizando {url}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STAGES.map((s, i) => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, opacity: i <= stageIndex ? 1 : 0.35 }}>
                  <div
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: i < stageIndex ? "#F2FF3D" : i === stageIndex ? "#F2FF3D" : "#3A3E34",
                    }}
                  />
                  <span className="mono" style={{ fontSize: 13 }}>
                    {s}
                    {i === stageIndex ? <span className="blink">...</span> : ""}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === "error" && (
          <div className="fade-up">
            <p style={{ color: "#FF6B5B", marginBottom: 18, fontSize: 15 }}>
              No pudimos completar el análisis en este momento. Probá de nuevo en unos segundos.
            </p>
            <button
              className="gooso-btn"
              onClick={() => setStep("landing")}
              style={{
                background: "#F2FF3D",
                color: "#0B0E0C",
                border: "none",
                borderRadius: 6,
                padding: "12px 20px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              Intentar de nuevo
            </button>
          </div>
        )}

        {step === "result" && result && (
          <div className="fade-up">
            <p className="mono" style={{ fontSize: 12, color: "#6B6F69", marginBottom: 6 }}>
              {result.urlAnalizada}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6 }}>
              <span style={{ fontSize: 64, fontWeight: 700, color: scoreColor(result.score), letterSpacing: "-0.02em" }}>
                {result.score}
              </span>
              <span className="mono" style={{ fontSize: 14, color: "#6B6F69" }}>/100</span>
            </div>
            <p style={{ fontSize: 17, color: "#D8DBD2", marginBottom: 36 }}>{result.veredicto}</p>

            <div style={{ marginBottom: 32 }}>
              <p className="mono" style={{ fontSize: 12, color: "#6B6F69", letterSpacing: "0.06em", marginBottom: 12 }}>
                PROBLEMAS DETECTADOS ({result.problemas.length})
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.problemas.map((p, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      background: "#13160F",
                      border: "1px solid #1E211B",
                      borderLeft: `3px solid ${severityColor(p.severidad)}`,
                      borderRadius: 4,
                      padding: "12px 14px",
                      gap: 12,
                    }}
                  >
                    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <span style={{ fontSize: 14 }}>{p.titulo}</span>
                      <span className="mono" style={{ fontSize: 11, color: severityColor(p.severidad) }}>
                        {severityLabel(p.severidad)}
                      </span>
                    </div>
                    <span className="mono" style={{ fontSize: 13, color: "#A8ACA4", whiteSpace: "nowrap" }}>
                      {p.impacto}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.fortalezas && result.fortalezas.length > 0 && (
              <div style={{ marginBottom: 32 }}>
                <p className="mono" style={{ fontSize: 12, color: "#6B6F69", letterSpacing: "0.06em", marginBottom: 12 }}>
                  LO QUE YA FUNCIONA
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.fortalezas.map((f, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: "#D8DBD2" }}>
                      <span style={{ color: "#F2FF3D" }}>+</span>
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div style={{ marginBottom: 40 }}>
              <p className="mono" style={{ fontSize: 12, color: "#6B6F69", letterSpacing: "0.06em", marginBottom: 12 }}>
                PLAN DE ACCIÓN
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.plan.map((p, i) => (
                  <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span
                      className="mono"
                      style={{
                        fontSize: 12,
                        color: "#0B0E0C",
                        background: "#F2FF3D",
                        borderRadius: 4,
                        width: 22,
                        height: 22,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {i + 1}
                    </span>
                    <span style={{ fontSize: 14.5, color: "#D8DBD2", paddingTop: 1 }}>{p}</span>
                  </div>
                ))}
              </div>
            </div>

            <div
              style={{
                background: "#13160F",
                border: "1px solid #2A2E25",
                borderRadius: 8,
                padding: "24px 22px",
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 16, marginBottom: 6 }}>¿Quieres que implementemos este plan por ti?</p>
              <p style={{ fontSize: 13.5, color: "#A8ACA4", marginBottom: 18 }}>
                Agenda una asesoría gratuita con Gooso y revisamos juntos tu Radar.
              </p>
              <a
                href="https://calendar.app.google/REEMPLAZAR-CON-TU-LINK"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-block",
                  background: "#F2FF3D",
                  color: "#0B0E0C",
                  borderRadius: 6,
                  padding: "12px 24px",
                  fontWeight: 700,
                  fontSize: 14.5,
                  textDecoration: "none",
                }}
              >
                Agendar asesoría gratis →
              </a>
            </div>

            <button
              onClick={() => {
                setStep("landing");
                setUrl("");
                setResult(null);
              }}
              className="mono"
              style={{
                marginTop: 20,
                background: "none",
                border: "none",
                color: "#6B6F69",
                fontSize: 12,
                cursor: "pointer",
                textDecoration: "underline",
              }}
            >
              analizar otro sitio
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
