// components/ui/Checkbox.jsx or Checkbox.tsx

import React from "react";

export default function Checkbox({ label, checked = false, onChange }) {
  return (
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm text-white">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="form-checkbox h-4 w-4 text-brand bg-gray-800 border-gray-600 rounded focus:ring-brand"
      />
      <span>{label}</span>
    </label>
  );
}
