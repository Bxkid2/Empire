// api/speak.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  try {
    const { text } = req.body;

    if (!text || typeof text !== "string") {
      res.status(400).json({ error: "Missing text" });
      return;
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      res.status(500).json({ error: "OPENAI_API_KEY is not set" });
      return;
    }

    const ttsResponse = await fetch("https://api.openai.com/v1/audio/speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini-tts",
        voice: "alloy",
        input: text,
      }),
    });

    if (!ttsResponse.ok) {
      const err = await ttsResponse.text();
      console.error("OpenAI error:", err);
      res.status(500).json({ error: "TTS request failed" });
      return;
    }

    const buffer = Buffer.from(await ttsResponse.arrayBuffer());

    res.setHeader("Content-Type", "audio/mpeg");
    res.setHeader("Cache-Control", "no-store");
    res.status(200).send(buffer);
  } catch (e) {
    console.error("Server error:", e);
    res.status(500).json({ error: "Server error" });
  }
}