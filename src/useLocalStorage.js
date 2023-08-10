import { useState, useEffect } from "react";

export function useLocalStorage(initialState, key) {
  const [watched, setWatched] = useState(function () {
    const movWatched = localStorage.getItem(key);
    return movWatched ? JSON.parse(movWatched) : initialState;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(watched));
  }, [watched, key]);

  return [watched, setWatched];
}
