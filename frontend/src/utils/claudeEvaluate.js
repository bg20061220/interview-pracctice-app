/*import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';
dotenv.config();  // <-- this loads all env variables from .env

// Initialize the Anthropic client
const anthropic = new Anthropic({
  apiKey: process.env.REACT_APP_ANTHROPIC_API_KEY, // Make sure to set this in your .env file
  dangerouslyAllowBrowser: true // Required for client-side usage
});

/**
 * Evaluates an interview answer using Claude API
 * @param {string} question - The interview question
 * @param {string} answer - The user's answer
 * @returns {Promise<{score: number, feedback: string}>} - Evaluation result
 */
/*async function evaluateAnswerWithClaude(question, answer) {
  if (!answer || answer.trim() === "") {
    return { score: 0, feedback: "No answer provided." };
  }

  if (!process.env.REACT_APP_ANTHROPIC_API_KEY) {
    return {
      score: 0,
      feedback: "Claude API key not configured. Please set REACT_APP_ANTHROPIC_API_KEY in your environment variables."
    };
  }

  try {
    const prompt = `You are an expert interview coach evaluating university application interview answers. Please analyze the following interview question and answer:

Question: "${question}"
Answer: "${answer}"

Please provide:
1. A score from 1-10 (where 1 is poor, 5 is average, 10 is excellent)
2. Specific feedback on:
   - Content quality and relevance
   - Structure and clarity
   - Examples and evidence provided
   - Areas for improvement
   - Strengths demonstrated

Format your response as JSON with "score" (number) and "feedback" (string) fields.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 300,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    // Parse the response
    const responseText = message.content[0].text;

    try {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const result = JSON.parse(jsonMatch[0]);
        return {
          score: Math.max(1, Math.min(10, result.score || 1)),
          feedback: result.feedback || "Analysis completed."
        };
      }
    } catch (parseError) {
      console.warn('Failed to parse JSON response, using fallback parsing');
    }

    // Fallback: extract score and feedback manually
    const scoreMatch = responseText.match(/score["\s]*:[\s]*(\d+)/i);
    const score = scoreMatch ? parseInt(scoreMatch[1]) : 5;

    return {
      score: Math.max(1, Math.min(10, score)),
      feedback: responseText.replace(/\{[\s\S]*\}/, '').trim() || "Your answer has been analyzed by Claude."
    };

  } catch (error) {
    console.error('Claude API Error:', error);

    if (error.status === 401) {
      return {
        score: 0,
        feedback: "Invalid API key. Please check your REACT_APP_ANTHROPIC_API_KEY."
      };
    }

    if (error.status === 429) {
      return {
        score: 0,
        feedback: "Rate limit exceeded. Please try again later."
      };
    }

    return {
      score: 0,
      feedback: `Error analyzing answer: ${error.message}. Please try again.`
    };
  }
}

export default evaluateAnswerWithClaude;*/

// claudeEvaluate.js
const evaluateAnswerWithClaude = async (question, answer) => {
  try {
    const response = await fetch("http://localhost:5000/api/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ answer }),
    });

    const data = await response.json();

    return {
      score: null, // optional: Claude score if you add it in prompt
      feedback: data.analysis || "No feedback returned",
    };
  } catch (err) {
    console.error(err);
    return {
      score: null,
      feedback: "Error fetching analysis from Claude",
    };
  }
};

export default evaluateAnswerWithClaude; // ✅ make sure to export default
