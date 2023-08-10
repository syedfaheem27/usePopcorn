import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
// import App1 from "./App1";
// import StarRating from "./StarRating";

// function Star() {
//   const [stars, setStars] = useState(0);
//   return (
//     <div>
//       <StarRating
//         maxRating={10}
//         color="#1e3a8a"
//         size="42"
//         onStarRating={setStars}
//       />
//       <p>{stars ? `The movie was rated ${stars} stars` : ""}</p>
//     </div>
//   );
// }

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
    {/* <StarRating maxRating={5} />
    <StarRating
      maxRating={5}
      color="#dc2626"
      size="32"
      messages={["Terrible", "Bad", "Okay", "Good", "Amazing"]}
    />
    <Star />
    <StarRating maxRating={5} defaultRating={3} color="red" className="test" /> */}
  </React.StrictMode>
);
