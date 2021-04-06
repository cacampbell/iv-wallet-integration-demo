import React from "react";

interface Props {
  children?: React.ReactNode;
  onClick: () => void;
  width: string;
  height: string;
}

const Button: React.FC<Props> = ({
  children,
  onClick,
  width,
  height
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center px-4 py-2 font-semibold rounded-full hover:bg-opacity-90 h-${height} w-${width} `}
    >
      {children}
    </button>
  )
};

export default Button;