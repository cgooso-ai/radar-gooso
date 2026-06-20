export const metadata = {
  title: "Radar by Gooso — Diagnóstico de marketing gratis",
  description:
    "Analizamos tu sitio con IA y te decimos exactamente qué está frenando tu conversión.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
