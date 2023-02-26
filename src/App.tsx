import { useMachine } from "@zag-js/react";
import "./App.css";
import { machine } from "./machine";

function App() {
  const [state, send] = useMachine(machine({ numberOfFields: 6, onComplete }));
  const { value } = state.context;

  function onComplete(value: string[]) {
    console.log({ value });
  }

  return (
    <div className="App">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.currentTarget);
          console.log(formData.get("pincode"));
        }}
      >
        <div data-part="container">
          <label
            onClick={() => {
              send({ type: "LABEL_CLICK" });
            }}
          >
            Enter verification
          </label>
          <input type="hidden" name="pincode" value={value.join("")} />
          <div data-part="input-group">
            {value.map((_, index) => (
              <input
                key={index}
                data-part="input"
                value={value[index]}
                maxLength={2}
                onChange={(event) => {
                  const { value } = event.target;
                  send({ type: "INPUT", index, value });
                }}
                onFocus={() => {
                  send({ type: "FOCUS", index });
                }}
                onBlur={() => {
                  send({ type: "BLUR" });
                }}
                onKeyDown={(event) => {
                  const { key } = event;
                  if (key === "Backspace") {
                    send({ type: "BACKSPACE", index });
                  }
                }}
                onPaste={(event) => {
                  event.preventDefault();
                  const value = event.clipboardData.getData("Text").trim();

                  send({ type: "PASTE", value, index });
                }}
              />
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      <pre>{stringify(state)}</pre>
    </div>
  );
}

function stringify(state: Record<string, any>) {
  const { value, event, context } = state;
  return JSON.stringify({ state: value, event, context }, null, 2);
}

export default App;
