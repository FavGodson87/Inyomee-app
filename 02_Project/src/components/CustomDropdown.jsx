import React, { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

const CustomDropdown = ({
  value,
  onChange,
  options,
  placeholder = "Select",
  className = "",        // applied to wrapper (width/margins)
  buttonClassName = "",  // applied to the button (padding/height)
  optionClassName = "",  // optional: to style the options container
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleDocClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handleDocClick);
    return () => document.removeEventListener("mousedown", handleDocClick);
  }, []);

  const selectedLabel = options.find((o) => o.value === value)?.label || placeholder;

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        type="button"
        onClick={() => setOpen((s) => !s)}
        className={`flex justify-between items-center w-full border border-neutral-300 bg-white text-gray-700  focus:ring-2 focus:ring-green-500 transition-all ${buttonClassName}`}
      >
        <span className="truncate">{selectedLabel}</span>
        <ChevronDown className="ml-2 w-5 h-5 text-gray-500" />
      </button>

      {open && (
        <ul className={`absolute mt-2 left-0 w-full bg-white border border-neutral-300 rounded-xl shadow-lg z-10 ${optionClassName}`}>
          {options.map((opt) => (
            <li
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`px-4 py-2 cursor-pointer hover:bg-green-50 ${
                value === opt.value ? "bg-green-100 text-green-700 font-medium" : ""
              }`}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
