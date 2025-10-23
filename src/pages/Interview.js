import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import questions from "../utils/questionData";
import WrittenQuestion from "../components/WrittenQuestion";
import VideoQuestion from "../components/VideoQuestion";
import '../App.css';

function Interview({answers, setAnswers}) {
    const [currentAnswer, setCurrentAnswer] = useState("");
    const [question, setQuestion] = useState(null);
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const[analysisMethod, setAnalysisMethod] = useState("basic");
    const navigate = useNavigate(); 

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * questions.length);
        setQuestion(questions[randomIndex]);
    }, []);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime <= 1) {
                    clearInterval(timer);
                    handleSubmit(); // Auto-submit when time runs out
                    return 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    const handleSubmit = async () => {
        console.log(currentAnswer);
       
        setAnswers([
            ...answers,
            { question: question?.text || question, answer: currentAnswer, type: question?.type || "written" , evaluationMethod : analysisMethod, }
        ]);
        setCurrentAnswer("");
        navigate("/results" , {state : { latestAnswer : currentAnswer , evaluationMethod : analysisMethod}});
    }
  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>Interview Page</h1>
      <div style={{ marginBottom: "20px" }}>
        <h2 style={{ color: timeLeft < 60 ? "red" : "black" }}>
          Time Remaining: {formatTime(timeLeft)}
        </h2>
      </div>
      <p><strong>Question: </strong>{question?.text || question}</p>
      <div style={{ margin: "20px 0" }}>
        {question?.type === "video" ? (
          <VideoQuestion setCurrentAnswer={setCurrentAnswer} />
        ) : (
          <WrittenQuestion
            currentAnswer={currentAnswer}
            setCurrentAnswer={setCurrentAnswer}
          />
        )}
      </div>
      <br />
      
      <div>
  <label>
    <input
      type="radio"
      name="method"
      value="basic"
      checked={analysisMethod === "basic"}
      onChange={() => setAnalysisMethod("basic")}
    />
    Basic System
  </label>
  
  <label>
    <input
      type="radio"
      name="method"
      value="claude"
      checked={analysisMethod === "claude"}
      onChange={() => setAnalysisMethod("claude")}
    />
    Claude API
  </label>
</div>
  {<button onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Submit Answer
      </button> }

    </div>
  );
}

export default Interview;
