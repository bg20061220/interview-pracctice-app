
import Sentiment from "sentiment";
import nlp from "compromise";

const sentiment = new Sentiment();

function evaluateAnswer(question, answer) {
  // 1️⃣ Sentiment analysis
  const sentimentResult = sentiment.analyze(answer);
  const sentimentScore = sentimentResult.score;

  let sentimentFeedback = "";
  if (sentimentScore > 1) {
    sentimentFeedback = "Your answer feels confident and positive.";
  } else if (sentimentScore < 0) {
    sentimentFeedback = "Your answer sounds a bit negative, try to be more optimistic.";
  } else {
    sentimentFeedback = "Your answer is neutral, you could add more enthusiasm.";
  }

  // 2️⃣ Compromise NLP checks
  const doc = nlp(answer);

  // Count nouns & verbs (to see if the answer has substance)
  const nounCount = doc.nouns().out('array').length;
  const verbCount = doc.verbs().out('array').length;

  let structureFeedback = "";
  if (nounCount < 2 || verbCount < 1) {
    structureFeedback = "Try adding more details or actions to make your answer stronger.";
  } else {
    structureFeedback = "Good structure — your answer includes details and actions.";
  }

  // 3️⃣ Length check
  const wordCount = answer.split(/\s+/).length;
  let lengthFeedback = "";
  if (wordCount < 20) {
    lengthFeedback = "Your answer is a bit short, consider expanding with examples.";
  } else if (wordCount > 120) {
    lengthFeedback = "Your answer is quite long, try to be more concise.";
  } else {
    lengthFeedback = "Good length — clear and to the point.";
  }

  // 4️⃣ Final feedback + score
  const feedback = [sentimentFeedback, structureFeedback, lengthFeedback].join(" ");

  // Normalize score (just a simple example combining sentiment + structure)
  const finalScore = Math.max(1, Math.min(10, sentimentScore + nounCount + verbCount));

  return {
    score: finalScore,
    feedback,
  };
}

export default evaluateAnswer;
