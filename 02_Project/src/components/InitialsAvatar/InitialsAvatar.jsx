import React from "react";

const colors = [
  "#F87171", "#FBBF24", "#34D399", "#60A5FA",
  "#A78BFA", "#F472B6", "#38BDF8", "#FACC15",
];

function stringToColor(str) {
  if (!str) return colors[0];
  const code = str.toUpperCase().charCodeAt(0);
  return colors[code % colors.length];
}

export default function InitialsAvatar({ name = "", size = 40 }) {
  const firstName = name.trim().split(" ")[0] || "";
  const initial = firstName.charAt(0).toUpperCase();
  const bgColor = stringToColor(initial);

  return (
    <div className="group relative flex items-center justify-center">
  {/* Avatar */}
  <div
    className="flex items-center justify-center rounded-full font-bold pt-1 text-white cursor-pointer"
    style={{
      width: size,
      height: size,
      backgroundColor: bgColor,
      fontSize: size / 2,
    }}
  >
    {initial}
  </div>

  {/* Tooltip */}
  <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2
    invisible group-hover:visible opacity-0 group-hover:opacity-100 
    translate-y-1 group-hover:-translate-y-1
    transition-all duration-500 ease-in-out
    bg-neutral-800 text-white text-sm rounded px-2 py-1 whitespace-nowrap z-10 pointer-events-none">
    Hi, {firstName}!
  </div>
</div>

  );
}
