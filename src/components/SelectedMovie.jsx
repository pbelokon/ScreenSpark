import { useState, useRef, useEffect } from "react";
import { useKey } from "../hooks/useKey";
import StarRating from "./StarRating";
import Loading from "./Loading";
// public use only 1000 calls a day
const KEY = "5a9447a4";

export default function SelectedMovie({ id, onClose, onAddWatched, watched }) {
  const [movie, setMovie] = useState({});
  const [loading, setLoading] = useState(false);
  const [userRating, setUserRating] = useState(0);

  const countRef = useRef(0);

  useEffect(
    function () {
      if (userRating) countRef.current = countRef.current + 1;
    },
    [userRating]
  );

  const isWatched = watched
    .map((wMovie) => wMovie.imdbID)
    .includes(movie.imdbID);
  const watchedRating = watched.find(
    (movie) => movie.imdbID === id
  )?.userRating;

  useEffect(
    function () {
      if (!movie.Title) return;
      document.title = `MOVIE | ${movie.Title}`;

      // clean up function
      return function () {
        document.title = "Screen Spark";
      };
    },
    [movie]
  );

  useEffect(
    function () {
      async function getMovieDetails() {
        setLoading(true);
        const res = await fetch(
          `https://www.omdbapi.com/?apikey=${KEY}&i=${id}`
        );

        const data = await res.json();

        setMovie(data);
        setLoading(false);
      }

      getMovieDetails();
    },
    [id]
  );

  useKey("Escape", onClose);

  function handleAdd() {
    const watchedMovie = {
      imdbID: id,
      title: movie.Title,
      year: movie.Year,
      poster: movie.Poster,
      imdbRating: Number(movie.imdbRating),
      runTime: movie.Runtime.split(" ").at(0),
      userRating: userRating,
      ratingCount: countRef.current,
    };

    onAddWatched(watchedMovie);
    onClose(true);
  }

  return (
    <div className="details">
      {loading ? (
        <Loading />
      ) : (
        <>
          <header>
            <button className="btn-back" onClick={onClose}>
              &larr;
            </button>
            <img src={movie.Poster} alt={`Poster for ${movie.Title}`} />
            <div className="details-overview">
              <h2>{movie.Title}</h2>
              <p>
                {movie.Released} &bull; {movie.Runtime}
              </p>
              <p>{movie.Genre}</p>
              <p>
                <span>⭐</span>
                {movie.imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              <StarRating maxRating={10} onSetRating={setUserRating} />
              {isWatched ? (
                <p>You have rated this movie {watchedRating} ⭐</p>
              ) : (
                userRating > 0 && (
                  <button className="btn-add" onClick={handleAdd}>
                    + Add to List
                  </button>
                )
              )}
            </div>
            <p>
              <em>{movie.Plot}</em>
            </p>
            <p>Starring: {movie.Actors}</p>
            <p>Directed by: {movie.Director}</p>
          </section>
        </>
      )}
    </div>
  );
}
