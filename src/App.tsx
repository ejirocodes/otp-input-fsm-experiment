import "./App.css";
import { useMachine } from "@zag-js/react";
import { machine } from "./machine";

const inputs = [...Array.from({ length: 4 }).keys()];
function App() {
  const [state, send] = useMachine(machine);

  const { focusedIndex, value } = state.context;
  const { type } = state.event;

  return (
    <div className="App">
      <pre>{JSON.stringify({ value, focusedIndex, event: type })}</pre>
      <div data-part="container">
        <label htmlFor="">Enter verification</label>
        <div data-part="input-group">
          {inputs.map((index) => (
            <input
              data-part="input"
              key={index}
              value={value[index]}
              onChange={(event) => {
                const { value } = event.target;
                send({ type: "INPUT", index, value });
              }}
              onFocus={() => {
                send({ type: "FOCUS", index });
              }}
              onBlur={() => {
                send({ type: "BLUR", index });
              }}
              onKeyDown={(event) => {
                if (event.key === "Backspace") {
                  send({ type: "BACKSPACE", index });
                }
              }}
              onPaste={(event) => {
                const value = event.clipboardData.getData("text/plain");
                send({ type: "PASTE", value, index });
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
