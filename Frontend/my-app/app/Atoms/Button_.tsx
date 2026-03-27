import React from "react";

interface ButtonProps {
  text: string;
  variant?: "primary" | "ghost";
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  type?: "button" | "submit";
}

const Button: React.FC<ButtonProps> = ({
  text,
  variant = "primary",
  onClick,
  type = "button",
}) => {
  const baseClass = variant === "primary" ? "btn-primary" : "btn-ghost";

  return (
    <button type={type} className={baseClass} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;