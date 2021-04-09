import React from "react";

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
  disabled: boolean;
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  disabled
}: Props) => {
  const classes = [
      "inline-flex",
      "items-center",
      "bg-transparent",
      "px-4", 
      "py-2",
      "font-semibold",
      "rounded-full",
      "border",
      "border-black"
  ];

  const appliedClasses = () => {
    if (disabled) {
      classes.push("text-gray-400 border-gray-400");
    }

    return classes;
  }

  return (
    <button
      onClick={onClick}
      className={appliedClasses().join(" ")}
      disabled={disabled}
    >
      {children}
    </button>
  )
};

export default Button;