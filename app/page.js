export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0B0E0C",
        color: "#F5F5F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "system-ui, sans-serif",
        textAlign: "center",
        padding: 20,
      }}
    >
      <h1 style={{ fontSize: 40, marginBottom: 12 }}>
        Radar <span style={{ color: "#F2FF3D" }}>by Gooso</span>
      </h1>
      <p style={{ color: "#A8ACA4", fontSize: 16 }}>
        El sitio está vivo. Siguiente paso: conectar el formulario y la IA.
      </p>
    </main>
  );
}
