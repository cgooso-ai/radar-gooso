export async function POST(request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "Falta la URL" }, { status: 400 });
    }

    let siteText = "";
    let fetchOk = true;

    try {
      const siteRes = await fetch(url, {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; RadarBot/1.0)" },
      });
      const html = await siteRes.text();
      siteText = html
        .replace(/<script[\s\S]*?<\/script>/gi, " ")
        .replace(/<style[\s\S]*?<\/style>/gi, " ")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 6000);
      if (!siteRes.ok) fetchOk = false;
    } catch (e) {
      fetchOk = false;
    }

    const systemPrompt = `Eres el motor de analisis de Radar, una herramienta de diagnostico de marketing creada por Gooso. Tu trabajo es analizar el contenido de un sitio web (texto extraido del HTML) y producir un diagnostico de marketing y conversion, en español latinoamericano, tono directo y profesional, sin tecnicismos innecesarios.

Responde UNICAMENTE con un objeto JSON valido, sin texto antes ni despues, sin backticks de markdown, con esta forma exacta:

{
  "score": numero entero entre 1 y 100,
  "veredicto": "frase corta de 4 a 8 palabras sobre el estado general",
  "problemas": [
    { "titulo": "string corto", "impacto": "string corto tipo -12% conversion o similar, estimado", "severidad": "critico" | "medio" | "menor" }
  ],
  "fortalezas": [ "string corto" ],
  "plan": [ "accion concreta 1", "accion concreta 2", "accion concreta 3" ]
}

Reglas:
- "problemas": entre 3 y 5 items, ordenados de mas a menos severo.
- "plan": entre 3 y 5 acciones concretas y priorizadas, accionables en una semana.
- "fortalezas": entre 1 y 3 items, cosas que el sitio ya hace bien.
- Si el contenido del sitio es limitado o no se pudo leer bien, dilo implicitamente en el veredicto y basa el analisis en lo que si esta disponible, pero nunca inventes datos especificos como cifras de trafico o ventas reales.
- No menciones que eres una IA ni expliques tu proceso. Solo devuelve el JSON.`;

    const userPrompt = fetchOk
      ? `Analiza este sitio web: ${url}\n\nContenido extraido del HTML (texto visible, primeros caracteres):\n"""${siteText || "(sin contenido legible)"}"""`
      : `No fue posible leer el contenido del sitio en ${url}. Genera un diagnostico generico pero util basado en el dominio y en problemas comunes de sitios de servicios o negocios digitales, dejando claro en el veredicto que es un analisis preliminar.`;

    const aiResponse = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-6",
        max_tokens: 1000,
        system: systemPrompt,
        messages: [{ role: "user", content: userPrompt }],
      }),
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      return Response.json(
        { error: "Error al llamar a la IA", detail: errText },
        { status: 500 }
      );
    }

    const data = await aiResponse.json();
    const textBlock = (data.content || []).find((b) => b.type === "text");
    let raw = textBlock ? textBlock.text : "";
    raw = raw.replace(/```json|```/g, "").trim();

    const parsed = JSON.parse(raw);

    let score = Number(parsed.score);
    if (Number.isNaN(score)) score = 50;
    score = Math.max(1, Math.min(100, Math.round(score)));

    return Response.json({
      score,
      veredicto: parsed.veredicto || "",
      problemas: Array.isArray(parsed.problemas) ? parsed.problemas : [],
      fortalezas: Array.isArray(parsed.fortalezas) ? parsed.fortalezas : [],
      plan: Array.isArray(parsed.plan) ? parsed.plan : [],
    });
  } catch (err) {
    return Response.json(
      { error: "No se pudo completar el analisis", detail: String(err) },
      { status: 500 }
    );
  }
}
