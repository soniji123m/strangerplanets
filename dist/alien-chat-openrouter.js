// Alien chat OpenRouter direct integration
async function sendToOpenRouter(userMessage) {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer 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",
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "ProceduralPlanet"
        },
        body: JSON.stringify({
            model: "meta-llama/llama-3.2-3b-instruct",
            messages: [
                { role: "user", content: userMessage }
            ]
        })
    });

    if (!response.ok) {
        throw new Error("OpenRouter API error: " + response.statusText);
    }
    const data = await response.json();
    return data.choices[0].message.content;
}

window.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('alien-chat-input');
    const chatSend = document.getElementById('alien-chat-send');
    const chatMessages = document.getElementById('alien-chat-messages');

    chatSend.onclick = async () => {
        const msg = chatInput.value.trim();
        if (!msg) return;
        chatInput.value = '';
        // Show user message
        const userDiv = document.createElement('div');
        userDiv.textContent = 'You: ' + msg;
        userDiv.style.color = '#fff';
        chatMessages.appendChild(userDiv);

        // Show loading...
        const alienDiv = document.createElement('div');
        alienDiv.textContent = 'Alien is typing...';
        alienDiv.style.color = 'var(--neon-cyan, #00ffff)';
        chatMessages.appendChild(alienDiv);

        try {
            const reply = await sendToOpenRouter(msg);
            alienDiv.textContent = 'Alien: ' + reply;
        } catch (err) {
            alienDiv.textContent = 'Alien: [Error: ' + err.message + ']';
        }
        chatMessages.scrollTop = chatMessages.scrollHeight;
    };
    chatInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') chatSend.onclick();
    });
});