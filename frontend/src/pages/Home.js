import React from "react";
import { useNavigate } from "react-router-dom";
import '../App.css' ;
function Home() {
    const navigate = useNavigate() ;
    const programs = ["Math", "Science", "Data Science", "Engineering", "AI"];

  return (
    <div className="home-container">
      {/* Section 1 */}
      <div className  = "section section1">   
          <h1>CrackBig</h1>
          <p >Practice your university interview questions and get feedback!</p>
          <div> 
            {/* <img> </img>
            <img> </img> */}
          </div>
      </div>
     
     {/* Section 2 */}
     <div className = "programs-section"> 
          <h2> Programs We Support </h2>
           <div className = "cards-container">
            <div className = "slider-track">

            
              
              <div className="program-card">Mathematics</div>
              <div className="program-card">Computer Science</div>
              <div className="program-card"> Waterloo Engineering</div>
              <div className="program-card">Business</div>
              <div className="program-card">Medicine</div>

              {/* duplicate for seamless loop */}
             

           </div>
           </div>
     </div>

     {/* Section 3 */}
     <div className = "section section3">
         {/* <img> </img> */}
          <button
  style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
        onClick={() => navigate("/interview")} 
      > Start Interview </button>

     </div>
      {/* Temporary placeholder button */}
      
     
    </div>
  );
}

export default Home;
