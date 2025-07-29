const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

async function categorizeAndPrioritizeIncident(description) {
    const prompt = `
You are an AI assistant for a power management system.

Classify the incident description into:
- Category: One of the following:
  Transformer Issue, Line Fault, Voltage Fluctuation, Pole Damage, Junction Box Damage, Power Outage, Partial Outage, Load Shedding, Tree Obstruction, Animal Interference, Water Logging, Fire Risk, Meter Fault, Power Theft, Meter Tampering, Unauthorized Work, Scheduled Maintenance, Pending Repair/Work Delay, Noise/Smell from Equipment, Other

Then assign a priority level (one of):
- Critical: Life-threatening, fire, hospital blackout
- High: Dangerous but not critical (sparking, public area risks)
- Medium: Causes inconvenience or partial disruption
- Low: Minor issue
- Trivial: Log only

Return only JSON, no code block or explanation:
{
  "category": "<Category>",
  "priority": "<Critical | High | Medium | Low | Trivial>"
}

Incident: "${description}"
`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer": `http://localhost:3000`,
            "X-Title": "PDA-UrjaBandhu"
        },
        body: JSON.stringify({
            model: "deepseek/deepseek-chat-v3-0324:free",
            messages: [{ role: "user", content: prompt }]
        })
    });

    const data = await response.json();

    const rawText = data.choices?.[0]?.message?.content;
    const cleanedText = rawText.replace(/```json|```/g, '').trim();

    if (!cleanedText) {
        throw new Error("OpenRouter returned no content.");
    }

    try {
        return JSON.parse(cleanedText);
    } catch (err) {
        console.error("Failed to parse JSON from OpenRouter response:", cleanedText);
        throw err;
    }
}

module.exports = { categorizeAndPrioritizeIncident };
