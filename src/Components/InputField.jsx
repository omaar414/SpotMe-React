import React from "react";

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-white mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
      />
    </div>
  );
};

export default InputField;