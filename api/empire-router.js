export default async function handler(req, res) {
  try {
    const { provider, prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No prompt provided." });
    }

    // --- Load API Keys ---
    const OPENAI_KEY = process.env.OPEN_AI_KEY;
    const TOGETHER_KEY = process.env.TOGETHER_API_KEY;

    let url = "";
    let headers = {};
    let body = {};

    // -------------------------
    // OPENAI ROUTE
    // -------------------------
    if (provider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";

      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_KEY}`,
      };

      body = {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      };
    }

    // -------------------------
    // TOGETHER: APRIEL 1.5 THINKER
    // -------------------------
    else if (provider === "together-apriel") {
      url = "https://api.together.xyz/v1/chat/completions";

      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOGETHER_KEY}`,
      };

      body = {
        model: "ServiceNow-AI/Apriel-1.5-15b-Thinker",
        messages: [{ role: "user", content: prompt }],
      };
    }

    // -------------------------
    // TOGETHER: KIMI K2 THINKER
    // -------------------------
    else if (provider === "together-kimi") {
      url = "https://api.together.xyz/v1/chat/completions";

      headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOGETHER_KEY}`,
      };

      body = {
        model: "moonshotai/Kimi-K2-Thinking",
        messages: [{ role: "user", content: prompt }],
      };
    }

    // -------------------------
    // DEFAULT / FALLBACK
    // -------------------------
    else {
      return res.status(400).json({
        error: "Unknown provider. Use openai, together-apriel, together-kimi.",
      });
    }

    // -------------------------
    // EXECUTE REQUEST
    // -------------------------
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return res.status(200).json({
      provider,
      reply: data?.choices?.[0]?.message?.content || "No response",
    });

  } catch (err) {
    console.error("Empire Router Error:", err);
    return res.status(500).json({ error: "Router failed." });
  }
}