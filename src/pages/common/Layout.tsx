import { cn } from "utils";

interface LayoutProps extends React.HTMLAttributes<HTMLDivElement> {}
export const Layout = ({ className, ...props }: LayoutProps) => {
  return (
    <main
      className={cn("w-screen min-h-screen px-16 pt-12 pb-16", className)}
      {...props}
    />
  );
};
