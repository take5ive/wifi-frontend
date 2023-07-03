import { cn } from "utils";

export const BlockContainer = ({
  className,
  ...props
}: React.HtmlHTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        "flex items-center py-4 pr-8 border-b hover:bg-neutral-100",
        className
      )}
      {...props}
    />
  );
};
