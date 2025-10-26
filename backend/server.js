import express from 'express';
import dotenv from 'dotenv';
import { Anthropic } from '@anthropic-ai/sdk';
import cors from 'cors';

dotenv.config({ path: './.env.development' });


const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

console.log("CLAUDE_API_KEY:", process.env.ANTHROPIC_API_KEY ? "SET" : "NOT SET");


const app = express();
app.use(express.json());
app.use(cors());



app.post('/api/analyze', async (req, res) => {
  try {
    const { answer } = req.body;
    if (!answer) return res.status(400).json({ error: "No answer provided" });

    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307', 
      messages: [
        {
          role: "user",
content: `You are an expert university admissions coach. Evaluate the following interview answer. 
Do not comment on the person, only on the answer itself. Provide:

1. Strengths of the answer (what is done well in how it is written or explained)
2. Weaknesses of the answer (areas where the answer could be clearer, more concise, or more convincing)
3. Suggestions for improvement (how the answer could be better)

Use max 50 words per section.

Answer: ${answer}`
        }
      ],
      max_tokens: 200,
    });

    res.json({ analysis: response.content[0].text });
  } catch (err) {
    console.error("❌ Full Claude API error:", err);
    res.status(500).json({ error: err.message || "Failed to analyze answer" });
  }
});
const PORT = process.env.PORT || 5000;  

// Test route to verify Anthropic API key is working
app.get('/api/test-key', async (req, res) => {
  try {
    // Simple test request to Claude
    const response = await client.messages.create({
      model: 'claude-3-haiku-20240307',
      messages: [{ role: 'user', content: 'Say hello in one word.' }],
      max_tokens: 20,
    });

    res.json({
      success: true,
      message: response.content[0].text,
    });
  } catch (err) {
    console.error("❌ API key test failed:", err.message);
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
