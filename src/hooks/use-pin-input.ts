import { useMachine } from "@zag-js/react";
import { ComponentProps } from "react";
import { machine, MachineOptions } from "../machine";

type LabelProps = ComponentProps<"label"> & { "data-part": string };
type InputProps = ComponentProps<"input"> & { "data-part": string };
export function usePinInput(options: MachineOptions) {
  const [state, send] = useMachine(machine({ ...options }));

  const value = state.context.value;
  const name = state.context?.name;
  const valueAsString = value.join("");

  return {
    value,
    valueAsString,

    getLabelProps(): LabelProps {
      return {
        onClick() {
          send({ type: "LABEL_CLICK" });
        },
        "data-part": "label",
      };
    },
    getHiddenInputProps(): InputProps {
      return {
        "data-part": "hidden-input",
        type: "hidden",
        name,
        value: value.join(""),
      };
    },
    getInputProps({ index }: { index: number }): InputProps {
      return {
        "data-part": "input",
        value: value[index],
        maxLength: 2,
        onChange(event) {
          const { value } = event.target;
          send({ type: "INPUT", index, value });
        },
        onFocus() {
          send({ type: "FOCUS", index });
        },
        onBlur() {
          send({ type: "BLUR" });
        },
        onKeyDown(e) {
          const { key } = e;
          if (key === "Backspace") {
            send({ type: "BACKSPACE", index });
          }
        },
        onPaste(e) {
          e.preventDefault();
          const value = e.clipboardData.getData("Text").trim();

          send({ type: "PASTE", value, index });
        },
      };
    },
  };
}
