import React from "react";
import { useTheme } from "../../contexts/ThemeContext";

export default function TableRowSkeleton({ columns = 7 }) {
  const { theme } = useTheme();

  return (
    <tr className="animate-pulse">
      {[...Array(columns)].map((_, index) => (
        <td key={index} className="px-6 py-4">
          <div className={`h-4 rounded ${
            theme === "dark" ? "bg-slate-800" : "bg-gray-200"
          } ${index === 0 ? 'w-40' : 'w-20'}`}></div>
        </td>
      ))}
    </tr>
  );
}
