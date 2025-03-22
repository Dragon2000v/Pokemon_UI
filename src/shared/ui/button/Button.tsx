import { FC, ButtonHTMLAttributes } from "react";

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export const Button: FC<Props> = ({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}) => {
  return (
    <button
      className={`
        px-6 py-3 rounded-lg font-medium
        transition-all duration-200
        ${
          variant === "primary"
            ? "bg-primary hover:bg-opacity-80"
            : "bg-secondary hover:bg-opacity-80"
        }
        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};
