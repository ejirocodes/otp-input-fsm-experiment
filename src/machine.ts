import { createMachine } from "@zag-js/core";

const FOCUSED_INDEX = -1;
// state
type MachineState = {
  value: "idle" | "focused";
};

// context
type MachineContext = {
  focusedIndex: number;
  readonly isCompleted: boolean;
  value: string[];
  onComplete?: (value: string[]) => void;
};

type MachineOptions = {
  value?: string[];
  onComplete?: (value: string[]) => void;
  numberOfFields: number;
};

export function machine(options: MachineOptions) {
  const { numberOfFields, ...restOptions } = options;

  return createMachine<MachineContext, MachineState>(
    {
      id: "pin-input",
      context: {
        ...restOptions,
        value: Array.from<string>({ length: numberOfFields }).fill(""),
        focusedIndex: FOCUSED_INDEX,
      },
      computed: {
        isCompleted(ctx) {
          return ctx.value.every((value) => value !== "");
        },
      },
      watch: {
        focusedIndex: ["executeFocus"],
        isCompleted: ["invokeOnComplete"],
      },
      initial: "idle",
      states: {
        idle: {
          on: {
            FOCUS: {
              target: "focused",
              actions: ["setFocusedIndex"],
            },
            LABEL_CLICK: {
              actions: ["focusFirstInput"],
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
          const eventValue: string = event.value;
          const focusedValue = context.value[context.focusedIndex];

          const nextValue = getNextValue(focusedValue, eventValue);

          context.value[context.focusedIndex] = nextValue;
        },
        clearFocusedValue(context) {
          context.value[context.focusedIndex] = "";
        },
        focusPreviousInput(context) {
          const previousIndex = (context.focusedIndex = Math.max(
            0,
            context.focusedIndex - 1
          ));
          context.focusedIndex = previousIndex;
        },
        focusNextInput(context, event) {
          const nextIndex = Math.min(
            context.focusedIndex + 1,
            context.value.length - 1
          );

          context.focusedIndex = nextIndex;
        },
        focusFirstInput(context) {
          context.focusedIndex = 0;
        },
        executeFocus(context) {
          const inputGroup = document.querySelector("[data-part=input-group]");
          if (!inputGroup || context.focusedIndex === -1) return;

          const inputElements = Array.from(
            inputGroup.querySelectorAll<HTMLInputElement>("[data-part=input]")
          );

          const input = inputElements[context.focusedIndex];
          requestAnimationFrame(() => {
            input?.focus();
          });
        },
        setPastedValue(context, event) {
          const pastedValue: string[] = event.value
            .split("")
            .slice(0, context.value.length);

          pastedValue.forEach((value, index) => {
            context.value[index] = value;
          });
        },
        focusedLastEmptyInput(context) {
          const index = context.value.findIndex((val) => val === "");
          const lastIndex = context.value.length - 1;

          context.focusedIndex = index === -1 ? lastIndex : index;
        },
        invokeOnComplete(context) {
          if (!context.isCompleted) return;
          context.onComplete?.(Array.from(context.value));
        },
      },
    }
  );
}

function getNextValue(focusedValue: string, eventValue: string) {
  let nextValue = eventValue;
  if (focusedValue[0] === eventValue[0]) {
    nextValue = eventValue[1];
  } else if (focusedValue[0] === eventValue[1]) {
    nextValue = eventValue[0];
  }

  return nextValue;
}
