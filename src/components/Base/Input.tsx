import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input: React.FC<Props> = ({ name, label, ...rest }: Props) => {
  return (
    <div className="flex flex-col items-center justify-start">
      <label className="text-sm" htmlFor={name}>{label}</label>
      <input id={name} {...rest}></input>
    </div>
  );
}

export default Input;