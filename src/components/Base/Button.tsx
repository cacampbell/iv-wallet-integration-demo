import React from "react";

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
}

const Button: React.FC<Props> = ({
  children,
  onClick,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center bg-transparent border border-black px-4 py-2 font-semibold rounded-full hover:bg-opacity-90`}
    >
      {children}
    </button>
  )
};

export default Button;