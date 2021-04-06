import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label: string;
}

const Input: React.FC<Props> = ({ name, label, ...rest }: Props) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <input id={name} {...rest}></input>
    </div>
  );
}

export default Input;