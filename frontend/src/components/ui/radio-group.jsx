import * as React from "react";
import { Circle } from "lucide-react";
import { cn } from "../../lib/utils";

const RadioGroupContext = React.createContext({});

const RadioGroup = React.forwardRef(
  (
    { className, value, defaultValue, onValueChange, children, ...props },
    ref,
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const isControlled = value !== undefined;
    const currentValue = isControlled ? value : internalValue;

    const handleValueChange = (newValue) => {
      if (!isControlled) {
        setInternalValue(newValue);
      }
      if (onValueChange) {
        onValueChange(newValue);
      }
    };

    return (
      <RadioGroupContext.Provider
        value={{ value: currentValue, onValueChange: handleValueChange }}
      >
        <div className={cn("grid gap-2", className)} ref={ref} {...props}>
          {children}
        </div>
      </RadioGroupContext.Provider>
    );
  },
);
RadioGroup.displayName = "RadioGroup";

const RadioGroupItem = React.forwardRef(
  ({ className, value, ...props }, ref) => {
    const { value: groupValue, onValueChange } =
      React.useContext(RadioGroupContext);
    const isChecked = groupValue === value;

    return (
      <button
        type="button"
        role="radio"
        aria-checked={isChecked}
        data-state={isChecked ? "checked" : "unchecked"}
        value={value}
        ref={ref}
        className={cn(
          "aspect-square h-4 w-4 rounded-full border border-primary text-primary shadow focus:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        onClick={() => onValueChange(value)}
        {...props}
      >
        <span
          className={cn(
            "flex items-center justify-center",
            isChecked ? "visible" : "invisible",
          )}
        >
          <Circle className="h-2.5 w-2.5 fill-current text-current" />
        </span>
      </button>
    );
  },
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
