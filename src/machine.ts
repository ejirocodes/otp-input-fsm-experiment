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
      value: [],
      focusedIndex: FOCUSED_INDEX,
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
            actions: ["setFocusedValue", "focusedNextInput"],
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
    },
  }
);
