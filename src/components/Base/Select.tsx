import React, { ChangeEvent, useState } from "react";

interface Props {
  options: string[];
  onChange?: Function;
}

const Select: React.FC<Props> = ({ options, onChange }: Props) => {
  const [items] = useState([...options]);
  const [value, setValue] = useState(items[0]);

  function handleSelect(e: ChangeEvent<HTMLSelectElement>): void {
    e.preventDefault();
    setValue(e.currentTarget.value);

    if (onChange != null) {
      onChange(e.currentTarget.value);
    }
  }

  return (
    <select
      className="flex flex-col items-center justify-center w-full"
      value={value}
      onChange={handleSelect}
    >
      {items.map(item => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  );
}

export default Select;