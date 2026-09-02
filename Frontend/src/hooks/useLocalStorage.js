import { useState, useEffect, useRef } from "react";

export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key);
      return stored ? JSON.parse(stored) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const prevKey = useRef(key);

  // If the key changes (e.g. a different user logs in), re-read that key's
  // own stored value instead of continuing to show the previous key's data.
  useEffect(() => {
    if (prevKey.current !== key) {
      try {
        const stored = window.localStorage.getItem(key);
        setValue(stored ? JSON.parse(stored) : initialValue);
      } catch {
        setValue(initialValue);
      }
      prevKey.current = key;
    }
  }, [key]);

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore write errors (e.g. storage full) */
    }
  }, [key, value]);

  return [value, setValue];
}