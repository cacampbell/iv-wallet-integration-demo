import React from "react";

import ellipsis from "../../assets/ellipsis.gif";

const Loading: React.FC = () => {
  return (
    <div className="relative">
      <img className="w-10" src={ellipsis} alt="loading..." />
    </div>
  );
};

export default Loading;