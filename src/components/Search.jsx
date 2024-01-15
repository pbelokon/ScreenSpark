import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export default function Search({ onQuery, query }) {
  const inputElement = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputElement.current) return;

    inputElement.current.focus();
    onQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onQuery(e.target.value)}
      ref={inputElement}
    />
  );
}
