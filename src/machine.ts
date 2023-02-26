import { createMachine } from "@zag-js/core";

const FOCUSED_INDEX = -1;
// state
type MachineState = {
  value: "idle" | "focused";
};

// context
type MachineContext = {
  value: string[];
  focusedIndex: number;
};

export const machine = createMachine<MachineContext, MachineState>(
  {
    id: "pin-input",
    context: {
      value: Array.from<string>({ length: 4 }).fill(""),
      focusedIndex: FOCUSED_INDEX,
    },
    watch: {
      focusedIndex: ["executeFocus"],
    },
    initial: "idle",
    states: {
      idle: {
        on: {
          FOCUS: {
            target: "focused",
            actions: ["setFocusedIndex"],
          },
        },
      },
      focused: {
        on: {
          BLUR: {
            target: "idle",
            actions: ["clearFocusedIndex"],
          },
          INPUT: {
            actions: ["setFocusedValue", "focusNextInput"],
          },
          BACKSPACE: {
            actions: ["clearFocusedValue", "focusPreviousInput"],
          },
          PASTE: {
            actions: ["setPastedValue", "focusedLastEmptyInput"],
          },
        },
      },
    },
  },
  {
    actions: {
      setFocusedIndex(context, event) {
        context.focusedIndex = event.index;
      },

      clearFocusedIndex(context) {
        context.focusedIndex = FOCUSED_INDEX;
      },

      setFocusedValue(context, event) {
        context.value[context.focusedIndex] = event.value;
      },

      focusNextInput(context, event) {
        const nextIndex = Math.min(
          context.focusedIndex + 1,
          context.value.length - 1
        );

        context.focusedIndex = nextIndex;
      },
      executeFocus(context) {
        const inputGroup = document.querySelector("[data-part=input-group]");
        if (!inputGroup || context.focusedIndex === -1) return;

        const inputElements = Array.from<HTMLInputElement>(
          inputGroup.querySelectorAll("[data-part=input]")
        );

        const input = inputElements[context.focusedIndex];
        input?.focus();
      },
    },
  }
);
