import React, { InputHTMLAttributes } from "react";

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
}

const Input: React.FC<Props> = ({ name, label, ...rest }: Props) => {
  const labelDisplay = () => {
    if (label != null) 
      return (<label className="text-sm" htmlFor={name}>{label}</label>)
    
    return null;
  }
  
  return (
    <div className="flex items-center justify-center">
      { labelDisplay() }
      <input 
        id={name} 
        {...rest}
        className="px-4 py-2 my-2 text-black placeholder-black border border-gray-200 w-60 focus:outline-none focus:ring-transparent focus:border-gray-400 focus:shadow-input"
      >
      </input>
    </div>
  );
}

export default Input;