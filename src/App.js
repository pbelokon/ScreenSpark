import { useState } from "react";
import { useMovies } from "./hooks/useMovie";
import { useLocalStorageState } from "./hooks/useLocalStorageState";
import NavBar from "./components/NavBar";
import Search from "./components/Search";
import Summary from "./components/Summary";
import MovieList from "./components/MovieList";
import WatchedList from "./components/WatchedList";
import Loading from "./components/Loading";
import SelectedMovie from "./components/SelectedMovie";
import Box from "./components/Box";

export default function App() {
  const [query, setQuery] = useState("");
  const [selectedID, setSelectedId] = useState(null);

  const { movies, error, isLoading } = useMovies(query);
  const [watched, setWatched] = useLocalStorageState([], "watched");

  function handleMovieSelection(id) {
    setSelectedId((selectedID) => (id === selectedID ? null : id));
  }

  function handleCloseMovie() {
    setSelectedId(null);
  }

  function handleWatchedMovies(movie) {
    setWatched((watched) => [...watched, movie]);
  }

  function handleRemoveWatched(id) {
    setWatched(watched.filter((movie) => movie.imdbID !== id));
  }

  return (
    <>
      <NavBar>
        <Search onQuery={setQuery} query={query} />
        <Numresults movies={movies} />
      </NavBar>
      <Main>
        <Box>
          {isLoading && <Loading />}
          {!isLoading && !error && (
            <MovieList movies={movies} onSelect={handleMovieSelection} />
          )}
          {error && <ErrorMessage message={error} />}
        </Box>
        <Box>
          {selectedID ? (
            <SelectedMovie
              id={selectedID}
              onClose={handleCloseMovie}
              onAddWatched={handleWatchedMovies}
              watched={watched}
            />
          ) : (
            <>
              <Summary watched={watched} />
              <WatchedList
                watched={watched}
                onRemoveWatched={handleRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function ErrorMessage({ message }) {
  return <p className="error">{message}</p>;
}

function Numresults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}
