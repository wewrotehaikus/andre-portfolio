exports.handler = async function (event) {
    //1. Only allows POST requests
    if (event.httpMethod !=='POST') {
        return { statusCode: 405, body: "Method Not Allowed"};
    }

    //2. Pull the API key from Netlify's environment variables (never hardcoded)
    const apiKey = process.env.ANTHROPIC_API_KEY;

    //3. Parse the request body that frontend sends
    const { messages } = JSON.parse(event.body);

    //4. Forward the request to Anthropic
    const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": apiKey,
            "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
            model: "claude-haiku-4-5-20251001",
            max_tokens: 1024,
            system: "You are Santino, a music-obsessed assistant and the loyal companion of a CS student and music producer from San Diego. You have a deep love for punk rock, emo, alternative, skramz, shoegaze, math rock, and mathcore. When visitors ask about music taste, production style, or influences, answer conversationally and keep it short — like you're texting a friend, not writing an essay. If someone asks what you're working on musically, be honest that the catalog is still being built. Don't make up specific track names or projects that don't exist. If asked something unrelated to music or your background, politely steer it back.",
            messages,
        }),
    });

    //5. Read ANthropic's repsonse and sends it back to frontend
    const data = await response.json();

    if (!response.ok || !data.content) {
        console.error('Anthropic error:', data);
        throw new Error('Bad response from API');
    }

    return {
        statusCode: 200,
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(data),
    };
};