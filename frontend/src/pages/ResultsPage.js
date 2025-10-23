import { useNavigate } from "react-router-dom";
import React , {useState , useEffect} from "react";
import evaluateAnswer from "../utils/evaluate";
import evaluateAnswerWithClaude from "../utils/claudeEvaluate";
function ResultsPage({ answers }) {
  const [evaluatedAnswers , setEvaluatedAnswers] = useState("") ;
    const navigate = useNavigate();

    useEffect(() => {
    const evaluateAll = async () => {
      const results = await Promise.all(
        answers.map(async (item) => {
          if (item.evaluationMethod === "basic") {
            const { score, feedback } = evaluateAnswer(item.question, item.answer);
            return { ...item, score, feedback };
          } else if (item.evaluationMethod === "claude") {
            const { score, feedback } = await evaluateAnswerWithClaude(item.question, item.answer);
            return { ...item, score, feedback };
          }
          return item;
        })
      );

      setEvaluatedAnswers(results);
    };

    if (answers.length > 0) {
      evaluateAll();
    }
  }, [answers]);

   return (
    <div style={{ maxWidth: "700px", margin: "50px auto", textAlign: "left" }}>
      <h1 style={{ textAlign: "center" }}>Interview Results</h1>

      {evaluatedAnswers.length > 0 ? (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {evaluatedAnswers.map((item, idx) => (
            <li
              key={idx}
              style={{
                marginBottom: "25px",
                padding: "15px",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <p>
                <strong>Q:</strong> {item.question}
              </p>
              <p>
                <strong>A:</strong> {item.answer}
              </p>
              <p>
                <strong>Score:</strong> {item.score ?? "Evaluating..."}
              </p>
              <p>
                <em>Feedback:</em> {item.feedback ?? "Evaluating..."}
              </p>
              <p>
                <em>Method:</em> {item.evaluationMethod}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ textAlign: "center" }}>No answers submitted yet.</p>
      )}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button
          onClick={() => navigate("/")}
          style={{
            padding: "10px 20px",
            fontSize: "16px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default ResultsPage;