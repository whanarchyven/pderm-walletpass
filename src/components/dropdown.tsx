import React from "react";

export const DropdownLists = ({ fieldValues, value, setKeyValue }) => {
  const handleChange = (event, fieldName) => {
    setKeyValue(fieldName, event.target.value);
  };

  return (
    <div className="dropdown-lists space-y-4">
      {Object.entries(fieldValues).map(([fieldName, fieldData]: any) => (
        <div key={fieldName} className="dropdown-list border-b">
          <label
            htmlFor={fieldName}
            className="block text-xs font-medium text-gray-500"
          >
            {fieldData.label}
          </label>
          <select
            id={fieldName}
            value={value[fieldName]}
            onChange={(event) => handleChange(event, fieldName)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-gray-500 focus:border-gray-500 sm:text-sm rounded-md"
          >
            <option value="">Choose an option</option>
            {fieldData.values.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default DropdownLists;
