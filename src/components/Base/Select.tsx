import React, { useState } from "react";

interface Props {
  options: string[]
}

const Select: React.FC<Props> = ({ options }: Props) => {
  const [items] = useState([...options])
  return (<div>{options}</div>);
}

export default Select;