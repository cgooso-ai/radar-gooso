"use client";

import { useState, useRef, useEffect } from "react";

const STAGES = [
  "Conectando con el sitio",
  "Leyendo estructura y copy",
  "Evaluando propuesta de valor",
  "Revisando señales de confianza",
  "Calculando score de marketing",
];

const DESCUBRE = [
  {
    titulo: "Tu puntaje real",
    texto: "Te ponemos un número del 1 al 100, claro y sin vueltas, de qué tan bien tu sitio convierte visitas en clientes.",
  },
  {
    titulo: "Un análisis hecho con IA",
    texto: "Leemos tu sitio como lo leería un cliente nuevo, y te decimos qué le hace dudar antes de comprar o escribirte.",
  },
  {
    titulo: "Los problemas, ordenados por urgencia",
    texto: "No una lista interminable. Te decimos qué arreglar primero y por qué, según el impacto que tiene en tus ventas.",
  },
  {
    titulo: "Un plan que podés empezar hoy",
    texto: "Acciones concretas, no teoría. Cosas que vos mismo, o tu equipo, pueden implementar esta semana.",
  },
];

const FUGAS = [
  {
    titulo: "Tenés visitas, pero no compran",
    texto: "Pagás por tráfico que llega y se va sin hacer nada. Algo en el camino no está convenciendo.",
    metric: "1.8%",
    metricLabel: "de cada 100 visitas compra",
  },
  {
    titulo: "La gente se va antes de entender qué ofreces",
    texto: "Si en los primeros segundos no queda claro qué resolvés, la persona cierra la pestaña.",
    metric: "78%",
    metricLabel: "se va sin interactuar",
  },
  {
    titulo: "Compran una vez y ya",
    texto: "Sin algo que invite a comprar más o volver, cada cliente te cuesta más de lo que debería.",
    metric: "1x",
    metricLabel: "compra promedio por cliente",
  },
  {
    titulo: "Llenan el carrito pero no pagan",
    texto: "Costos sorpresa, checkout largo, pocas formas de pago. El carrito abandonado es plata que ya tenías.",
    metric: "70%",
    metricLabel: "abandona el carrito",
  },
];

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

function UrlForm(props) {
  const url = props.url;
  const setUrl = props.setUrl;
  const onSubmit = props.onSubmit;
  const big = props.big;

  return (
    <form onSubmit={onSubmit} style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
      <input
        className="gooso-input mono"
        type="text"
        value={url}
        onChange={function (e) { setUrl(e.target.value); }}
        placeholder="tusitio.com"
        style={{
          flex: "1 1 280px",
          background: "#13160F",
          border: "1px solid #2A2E25",
          borderRadius: 6,
          padding: big ? "16px 18px" : "14px 16px",
          fontSize: big ? 16 : 15,
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
          padding: big ? "16px 24px" : "14px 22px",
          fontSize: big ? 16 : 15,
          fontWeight: 700,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Analizar mi sitio →
      </button>
    </form>
  );
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

    const stageTimer = setInterval(function () {
      setStageIndex(function (prev) {
        return prev < STAGES.length - 1 ? prev + 1 : prev;
      });
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
      setResult(Object.assign({}, data, { urlAnalizada: targetUrl }));
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

  const showLandingContent = step === "landing";

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
      }}
    >
      <style>{"* { box-sizing: border-box; } .mono { font-family: 'JetBrains Mono', monospace; } .blink { animation: blink 1s step-start infinite; } @keyframes blink { 50% { opacity: 0; } } input::placeholder { color: #6B6F69; } .gooso-input:focus { outline: none; border-color: #F2FF3D !important; } .gooso-btn:hover { background: #F7FF73 !important; } .fade-up { animation: fadeUp 0.5s ease both; } @keyframes fadeUp { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } } .descubre-card { border: 1px solid #1E211B; border-radius: 10px; padding: 24px; background: #0E110D; } .fuga-card { border: 1px solid #1E211B; border-radius: 10px; padding: 22px; background: #0E110D; }"}</style>

      <div style={{ width: "100%", maxWidth: 720, padding: "48px 20px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 56 }}>
          <div style={{ width: 10, height: 10, background: "#F2FF3D", borderRadius: 2 }} />
          <span style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-0.02em" }}>Radar</span>
          <span className="mono" style={{ fontSize: 11, color: "#6B6F69", marginLeft: 6, letterSpacing: "0.04em" }}>
            BY GOOSO
          </span>
        </div>

        {step === "landing" ? (
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
              Te mostramos, con ejemplos concretos de tu propio sitio, qué le
              hace dudar a alguien antes de comprarte. Gratis, en menos de un
              minuto, sin compromiso.
            </p>

            <UrlForm url={url} setUrl={setUrl} onSubmit={handleSubmit} big={false} />
            <p className="mono" style={{ fontSize: 12, color: "#5C605A", marginTop: 14 }}>
              Sin tarjeta · Análisis con IA · Resultado inmediato
            </p>
          </div>
        ) : null}

        {step === "loading" ? (
          <div className="fade-up">
            <h2 style={{ fontSize: 22, fontWeight: 500, marginBottom: 24 }}>Analizando {url}</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {STAGES.map(function (s, i) {
                return (
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
                );
              })}
            </div>
          </div>
        ) : null}

        {step === "error" ? (
          <div className="fade-up">
            <p style={{ color: "#FF6B5B", marginBottom: 18, fontSize: 15 }}>
              No pudimos completar el análisis en este momento. Probá de nuevo en unos segundos.
            </p>
            <button
              className="gooso-btn"
              onClick={function () { setStep("landing"); }}
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
        ) : null}

        {step === "result" && result ? (
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
                {"PROBLEMAS DETECTADOS (" + result.problemas.length + ")"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {result.problemas.map(function (p, i) {
                  return (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        background: "#13160F",
                        border: "1px solid #1E211B",
                        borderLeft: "3px solid " + severityColor(p.severidad),
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
                  );
                })}
              </div>
            </div>

            {result.fortalezas && result.fortalezas.length > 0 ? (
              <div style={{ marginBottom: 32 }}>
                <p className="mono" style={{ fontSize: 12, color: "#6B6F69", letterSpacing: "0.06em", marginBottom: 12 }}>
                  LO QUE YA FUNCIONA
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  {result.fortalezas.map(function (f, i) {
                    return (
                      <div key={i} style={{ display: "flex", gap: 8, fontSize: 14, color: "#D8DBD2" }}>
                        <span style={{ color: "#F2FF3D" }}>+</span>
                        {f}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <div style={{ marginBottom: 40 }}>
              <p className="mono" style={{ fontSize: 12, color: "#6B6F69", letterSpacing: "0.06em", marginBottom: 12 }}>
                PLAN DE ACCIÓN
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {result.plan.map(function (p, i) {
                  return (
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
                  );
                })}
              </div>
            </div>

            <div
              style={{
                background: "#13160F",
                border: "1px solid #2A2E25",
                borderRadius: 8,
                padding: "24px 22px",
                textAlign: "center",
                marginBottom: 20,
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
              onClick={function () {
                setStep("landing");
                setUrl("");
                setResult(null);
              }}
              className="mono"
              style={{
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
        ) : null}
      </div>

      {showLandingContent ? (
        <div style={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ width: "100%", maxWidth: 720, padding: "40px 20px 0" }}>
            <p className="mono" style={{ fontSize: 12, color: "#F2FF3D", letterSpacing: "0.06em", marginBottom: 10 }}>
              QUÉ VAS A ENCONTRAR
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 32px", maxWidth: 480 }}>
              Lo mismo que ya le mostramos a más de 80 negocios.
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
              {DESCUBRE.map(function (d, i) {
                return (
                  <div key={i} className="descubre-card">
                    <p className="mono" style={{ fontSize: 11, color: "#F2FF3D", marginBottom: 10 }}>
                      {String(i + 1).padStart(2, "0")}
                    </p>
                    <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 8 }}>{d.titulo}</p>
                    <p style={{ fontSize: 14, color: "#A8ACA4", lineHeight: 1.55, margin: 0 }}>{d.texto}</p>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 720, padding: "64px 20px 0" }}>
            <p className="mono" style={{ fontSize: 12, color: "#F2FF3D", letterSpacing: "0.06em", marginBottom: 10 }}>
              POR QUÉ PASA ESTO
            </p>
            <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 32px", maxWidth: 520 }}>
              Cuatro razones por las que un sitio no vende lo que debería.
            </h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {FUGAS.map(function (f, i) {
                return (
                  <div
                    key={i}
                    className="fuga-card"
                    style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 20, flexWrap: "wrap" }}
                  >
                    <div style={{ flex: "1 1 280px" }}>
                      <p style={{ fontSize: 16, fontWeight: 500, marginBottom: 6 }}>{f.titulo}</p>
                      <p style={{ fontSize: 14, color: "#A8ACA4", lineHeight: 1.55, margin: 0 }}>{f.texto}</p>
                    </div>
                    <div style={{ textAlign: "right", flexShrink: 0 }}>
                      <p style={{ fontSize: 28, fontWeight: 700, color: "#F2FF3D", margin: 0, letterSpacing: "-0.01em" }}>
                        {f.metric}
                      </p>
                      <p className="mono" style={{ fontSize: 11, color: "#6B6F69", margin: 0 }}>{f.metricLabel}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: 720, padding: "64px 20px 80px" }}>
            <div
              style={{
                border: "1px solid #2A2E25",
                borderRadius: 12,
                padding: "40px 32px",
                textAlign: "center",
                background: "#0E110D",
              }}
            >
              <h2 style={{ fontSize: 26, fontWeight: 700, letterSpacing: "-0.01em", margin: "0 0 12px" }}>
                ¿Cuál de estas cuatro es la tuya?
              </h2>
              <p style={{ fontSize: 15, color: "#A8ACA4", margin: "0 0 28px", maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                Poné tu sitio acá y te lo decimos en menos de un minuto, sin vueltas.
              </p>
              <div style={{ maxWidth: 440, marginLeft: "auto", marginRight: "auto" }}>
                <UrlForm url={url} setUrl={setUrl} onSubmit={handleSubmit} big={true} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </main>
  );
}
