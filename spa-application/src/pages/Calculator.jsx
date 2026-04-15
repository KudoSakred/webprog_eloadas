import React, { useState } from 'react';

const Calculator = () => {
  const [input, setInput] = useState("");

  const handleClick = (value) => setInput(input + value);
  const clear = () => setInput("");
  const calculate = () => {
    try {
      // Biztonsági okokból élesben érdemes mathjs-t használni eval helyett
      setInput(eval(input).toString());
    } catch {
      setInput("Hiba");
    }
  };

  return (
    <div className="calc-container">
      <h3>Számológép</h3>
      <div className="display">{input || "0"}</div>
      <div className="buttons">
        {["7", "8", "9", "/", "4", "5", "6", "*", "1", "2", "3", "-", "0", ".", "=", "+"].map(char => (
          <button key={char} onClick={() => char === "=" ? calculate() : handleClick(char)}>{char}</button>
        ))}
        <button onClick={clear} style={{ gridColumn: "span 4", background: "#ff4444", color: "white" }}>Törlés</button>
      </div>
    </div>
  );
};

export default Calculator;