import { ChangeEvent, DetailedHTMLProps, InputHTMLAttributes } from "react";
import { cn } from "utils";

interface NumberInputProps
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  onChangeText: (val: string) => void;
  decimals: number;
  inputClassName?: string;
}

export const NumberInput = ({
  className,
  inputClassName,
  decimals = 18,
  onChange,
  onChangeText,
  ...props
}: NumberInputProps) => {
  onChange =
    onChange ??
    ((e: ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      const numberishRegex = new RegExp(
        `^(?:\\d+(?:\\.\\d{0,${decimals}})?|\\.(?:\\d{1,${decimals}})?|)$`
      );
      if (numberishRegex.test(val)) onChangeText(val);
    });
  return (
    <div className={className}>
      <input
        {...props}
        onChange={onChange}
        className={cn(
          inputClassName,
          "w-full border-b leading-none outline-none"
        )}
      />
    </div>
  );
};
