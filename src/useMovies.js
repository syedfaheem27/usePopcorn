import { useState, useEffect } from "react";

const KEY = "c0f9bda0";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();
    async function loadMovies() {
      let res;
      try {
        try {
          setError("");
          setIsLoading(true);
          res = await fetch(
            `http://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            {
              signal: controller.signal,
            }
          );

          const data = await res.json();
          if (data.Response === "False") {
            setError("Movie not found");
          } else {
            setMovies(data.Search);
          }
        } catch (err) {
          if (!res || !res.ok) {
            throw new Error("Fetching movies failed");
          }
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    if (query.length < 3) {
      setMovies([]);
      setError("");
      return;
    }
    // onCloseMovie();
    loadMovies();

    return () => controller.abort();
  }, [query]);

  return {
    isLoading,
    movies,
    error,
  };
}
