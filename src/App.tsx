import { useState } from "react";
import reactLogo from "./assets/react.svg";
import "./App.css";

function App() {
  const inputs = Array.from({ length: 4 });
  return (
    <div className="App">
      <div data-part="container">
        <label htmlFor="">Enter verification</label>
        <div data-part="input-group">
          <input type="text" data-part="input" />
        </div>
      </div>
    </div>
  );
}

export default App;
