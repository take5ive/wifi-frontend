import { useState } from "react";

export const useNumberInput = (
  numberishValue: string,
  decimals: number = 18
): [string, (e: React.ChangeEvent<HTMLInputElement>) => void] => {
  const numberishRegex = new RegExp(
    `^(?:\\d+(?:\\.\\d{0,${decimals}})?|\\.(?:\\d{1,${decimals}})?|)$`
  );
  const [value, setValue] = useState(numberishValue);
  const onChangeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (numberishRegex.test(newValue)) {
      setValue(newValue);
    }
  };
  return [value, onChangeValue];
};
