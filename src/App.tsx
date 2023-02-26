import { useMachine } from "@zag-js/react";
import "./App.css";
import { usePinInput } from "./hooks/use-pin-input";
import { machine } from "./machine";

function App() {
  const { value, getHiddenInputProps, getInputProps, getLabelProps } =
    usePinInput({
      numberOfFields: 6,
      name: "pincode",
      onComplete,
    });

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
          <label {...getLabelProps()}>Enter verification</label>
          <input {...getHiddenInputProps()} />
          <div data-part="input-group">
            {value.map((_, index) => (
              <input key={index} {...getInputProps({ index })} />
            ))}
          </div>
        </div>
        <button type="submit">Submit</button>
      </form>
      {/* <pre>{stringify(state)}</pre> */}
    </div>
  );
}

function stringify(state: Record<string, any>) {
  const { value, event, context } = state;
  return JSON.stringify({ state: value, event, context }, null, 2);
}

export default App;
