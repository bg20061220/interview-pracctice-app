import React from 'react';

function WrittenQuestion({ currentAnswer, setCurrentAnswer }) {
  return (
    <textarea
      value={currentAnswer}
      onChange={(e) => setCurrentAnswer(e.target.value)}
      placeholder="Type your answer here..."
      style={{
        width: "80%",
        height: "200px",
        padding: "10px",
        fontSize: "16px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        resize: "vertical"
      }}
    />
  );
}

export default WrittenQuestion;