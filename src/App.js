import React  , {useState} from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Interview from "./pages/Interview";
import ResultsPage from "./pages/ResultsPage"
import Home from "./pages/Home";

function App() {
  const [answers, setAnswers] = useState([]);
    return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/interview" element={<Interview answers = {answers} setAnswers = {setAnswers} />} />
        <Route path="/results" element={<ResultsPage answers = {answers}/>} />
      </Routes>
    </Router>
  );


}

export default App;
