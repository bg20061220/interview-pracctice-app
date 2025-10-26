
// claudeEvaluate.js
const backendUrl = process.env.REACT_APP_BACKEND_URL;
console.log("Backend URL :" , process.env.REACT_APP_BACKEND_URL)
const evaluateAnswerWithClaude = async (question, answer) => {
  try {
    const response =  await fetch(`${backendUrl}/api/analyze`, {
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
