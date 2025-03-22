import { ButtonHTMLAttributes, FC } from "react";
import cn from "classnames";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = "primary",
  size = "md",
  ...props
}) => {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-lg font-medium transition-colors",
        {
          "bg-primary hover:bg-primary/90 text-white": variant === "primary",
          "bg-secondary hover:bg-secondary/90 text-white":
            variant === "secondary",
          "border-2 border-text/10 hover:bg-text/5": variant === "outline",
          "text-sm px-3 py-1": size === "sm",
          "text-base px-4 py-2": size === "md",
          "text-lg px-6 py-3": size === "lg",
        },
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};
