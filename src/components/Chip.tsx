import { cn } from "utils";

const ChipColor = {
  blue: ["bg-blue-200", "text-blue-700"],
  green: ["bg-green-200", "text-green-700"],
  red: ["bg-red-200", "text-red-700"],
  yellow: ["bg-yellow-200", "text-yellow-700"],
  gray: ["bg-gray-200", "text-gray-700"],
  indigo: ["bg-indigo-200", "text-indigo-700"],
  purple: ["bg-purple-200", "text-purple-700"],
  pink: ["bg-pink-200", "text-pink-700"],
  emerald: ["bg-emerald-200", "text-emerald-700"],
  orange: ["bg-orange-200", "text-orange-700"],
  lime: ["bg-lime-200", "text-lime-700"],
  amber: ["bg-amber-200", "text-amber-700"],
  teal: ["bg-teal-200", "text-teal-700"],
  violet: ["bg-violet-200", "text-violet-700"],
  cyan: ["bg-cyan-200", "text-cyan-700"],
  fuchsia: ["bg-fuchsia-200", "text-fuchsia-700"],
  rose: ["bg-rose-200", "text-rose-700"],
};

const ChipSize = {
  md: "rounded px-3 py-1",
  sm: "rounded px-2 py-0.5",
};

interface ChipProps {
  color: keyof typeof ChipColor | "random";
  size?: keyof typeof ChipSize;
  content: string;
  className?: string;
}

export const Chip = ({ content, color, className, size='md' }: ChipProps) => {
  if (color === "random") {
    const keys = Object.keys(ChipColor);
    color = keys[
      (content.length * content[0].charCodeAt(0)) % keys.length
    ] as keyof typeof ChipColor;
  }
  const [bg, txt] = ChipColor[color];
  return (
    <span className={cn(ChipSize[size], bg, className)}>
      <p className={cn(txt, "text-center text-sm")}>{content}</p>
    </span>
  );
};
