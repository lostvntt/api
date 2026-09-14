const express = require('express');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 3000;

app.post('/chat', async (req, res) => {
    const userPrompt = req.body.prompt;

    if (!userPrompt) {
        return res.status(400).json({ error: 'Missing prompt in request body' });
    }

    try {
        const openaiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userPrompt }]
            })
        });

        const data = await openaiResponse.json();

        if (!openaiResponse.ok) {
            return res.status(openaiResponse.status).json(data);
        }

        const reply = data.choices[0].message.content;
        res.json({ reply: reply });

    } catch (error) {
        console.log('Proxy Error:', error);
        res.status(500).json({ error: 'Internal server error connecting to OpenAI' });
    }
});

app.listen(PORT, () => {
    console.log(`Proxy server running on port ${PORT}`);
});
