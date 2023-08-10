import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(() => {
    function callFunc(e) {
      if (e.key.toLowerCase() === key.toLowerCase()) {
        callback();
      }
    }
    document.addEventListener("keydown", callFunc);

    return () => document.removeEventListener("keydown", callback);
  }, [key, callback]);
}
