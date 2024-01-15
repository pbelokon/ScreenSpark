import { useState, useEffect } from "react";

// public use only 1000 calls a day
const KEY = "5a9447a4";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // syncretizing with the dependency array
  useEffect(
    function () {
      // not React helper but browser native helper
      const controller = new AbortController();
      async function fetchMovies() {
        try {
          setIsLoading(true);
          setError("");
          const res = await fetch(
            `https://www.omdbapi.com/?apikey=${KEY}&s=${query}`,
            { signal: controller.signal }
          );

          if (!res.ok)
            throw new Error("Something went wrong while fetching movies");

          const data = await res.json();

          if (data.Response === "False") throw new Error("Movie not found!");

          setMovies(data.Search);
          setError("");
        } catch (e) {
          if (e.message !== "AbortError") setError(e.message);
        } finally {
          setIsLoading(false);
        }
      }

      if (query.length < 3) {
        setMovies([]);
        setError("");
        return;
      }

      fetchMovies(); // calling the async function

      return function () {
        controller.abort();
      };
    },
    [query]
  );

  return { movies, error, isLoading };
}
