// const questionKeywords = {
//   "Tell me about yourself.": [
//     "I", "experience", "study", "skills", "learn", "projects", "interests", "strengths"
//   ],
//   "Why do you want to study at this university?": [
//     "university", "program", "study", "learn", "opportunity", "reputation", "faculty", "career"
//   ],
//   "What are your strengths and weaknesses?": [
//     "strength", "weakness", "improve", "skills", "experience", "challenge", "growth", "adaptable"
//   ],
//   "Describe a challenge you faced and how you overcame it.": [
//     "challenge", "problem", "solution", "learn", "overcome", "team", "mistake", "adapt"
//   ],
//   "Where do you see yourself in 5 years?": [
//     "future", "career", "goal", "study", "plan", "growth", "achievement", "development"
//   ]
// };

// export default function evaluateAnswer(question , answer){
//     if(!answer || answer.trim() === ""){
//         return { score : 0 , feedback: "No answer provided."}; 
//     }
//     // Creating a list of keywords based on the question 
//     const keywords = questionKeywords[question] || []; 
//     let keywordMatches = 0 ;

//     // Counting how many keywords are present in the answer 
//    keywords.forEach((word) => {
//     if (answer.toLowerCase().includes(word.toLowerCase())) {
//       keywordMatches += 1;
//     }
//   });

//   // Length bonus 
//   if(answer.length> 80 ) keywordMatches += 1 ; 

//   // Map total points to a feedback 
//    let feedback = " "
// if (keywordMatches <= 3) feedback = "Bad answer. Try to include more relevant points.";
//   else if (keywordMatches <= 6) feedback = "Good answer. Covers most points, but can be improved.";
//   else feedback = "Excellent answer! Clear, detailed, and relevant.";

//   return { score: keywordMatches, feedback };}


// utils/evaluateAnswer.js
// utils/evaluateAnswer.js
// 📌 evaluateAnswer.js
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
