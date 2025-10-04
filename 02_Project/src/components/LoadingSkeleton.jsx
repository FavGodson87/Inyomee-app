import React from "react";

const LoadingSkeleton = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex space-x-2">
        <div className="w-2 h-10 bg-green-500 rounded-xl animate-[bounce_1s_infinite]" />
        <div className="w-2 h-16 bg-green-400 rounded-xl animate-[bounce_1s_infinite] [animation-delay:-0.2s]" />
        <div className="w-2 h-12 bg-green-600 rounded-xl animate-[bounce_1s_infinite] [animation-delay:-0.4s]" />
        <div className="w-2 h-20 bg-green-500 rounded-xl animate-[bounce_1s_infinite] [animation-delay:-0.6s]" />
      </div>
    </div>
  );
};

export default LoadingSkeleton;
