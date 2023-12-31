import { useEffect, useRef, useState } from "react";
import StarRating from "./StarRating";
import { useMovies } from "./useMovies";
import { useLocalStorage } from "./useLocalStorage";
import { useKey } from "./useKey";

const key = "c0f9bda0";

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

export default function App1() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const { movies, error, isLoading } = useMovies(query);

  const [watched, setWatched] = useLocalStorage([], "watched");

  // const [watched, setWatched] = useState(function () {
  //   const movWatched = localStorage.getItem("watched");
  //   return JSON.parse(movWatched);
  // });

  function onSelectMovie(id) {
    setSelectedId((prevId) => (prevId === id ? null : id));
  }

  function onCloseMovie() {
    setSelectedId(null);
  }

  function onAddWatched(movie) {
    setWatched((prevMovies) => [...prevMovies, movie]);
  }

  function onRemoveWatched(id) {
    setWatched((prevMov) => prevMov.filter((mov) => mov.imdbID !== id));
    // const mov = JSON.parse(localStorage.getItem("watched")).filter(
    //   (m) => m.imdbID !== id
    // );
    // localStorage.setItem("watched", JSON.stringify(mov));
  }

  // useEffect(() => {
  //   const mov = JSON.parse(localStorage.getItem("watched"));
  //   setWatched(mov);
  // }, []);
  // useEffect(() => {
  //   localStorage.setItem("watched", JSON.stringify(watched));
  // }, [watched]);

  return (
    <>
      <NavBar>
        <Logo />
        <SearchBar query={query} setQuery={setQuery} />
        <NumResults movies={movies} />
      </NavBar>
      <Main>
        {/* <Box element={<LoadedMoviesList movies={movies} />} />
        <Box
          element={
            <>
              <WatchedMoviesSummary watched={watched} />
              <WatchedMoviesList watched={watched} />
            </>
          }
        /> */}
        <Box>
          {/* {movies.length ? (
            <LoadedMoviesList movies={movies} />
          ) : (
            <p className="loader">Loading...</p>
          )} */}
          {/* {isLoading ? <Loader /> : <LoadedMoviesList movies={movies} />} */}
          {isLoading && <Loader />}
          {!isLoading && !error && (
            <LoadedMoviesList movies={movies} onSelectMovie={onSelectMovie} />
          )}
          {error && <ErrorComponent message={error} />}
        </Box>
        <Box>
          {selectedId ? (
            <MovieDetails
              selectedId={selectedId}
              onCloseMovie={onCloseMovie}
              onAddWatched={onAddWatched}
              watchedMovies={watched}
            />
          ) : (
            <>
              <WatchedMoviesSummary watched={watched} />
              <WatchedMoviesList
                watched={watched}
                onRemoveWatched={onRemoveWatched}
              />
            </>
          )}
        </Box>
      </Main>
    </>
  );
}

function Loader() {
  return <p className="loader">Loading...</p>;
}
function ErrorComponent({ message }) {
  return (
    <p className="error">
      <span>⛔</span>
      {` ${message}`}
    </p>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}

function SearchBar({ setQuery, query }) {
  const inputEl = useRef(null);

  const queryHandler = (e) => {
    setQuery(e.target.value);
  };

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) return;
    inputEl.current.focus();
    setQuery("");
  });

  // useEffect(() => {
  //   function focusElement(e) {
  //     if (document.activeElement === inputEl.current) return;

  //     if (e.code === "Enter") {
  //       inputEl.current.focus();
  //       setQuery("");
  //     }
  //   }

  //   document.addEventListener("keydown", focusElement);

  //   return () => document.removeEventListener("keydown", focusElement);
  // }, []);

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={queryHandler}
      ref={inputEl}
    />
  );
}

function NumResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}

function MovieDetails({
  selectedId,
  onCloseMovie,
  onAddWatched,
  watchedMovies,
}) {
  const [movie, setMovie] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [userRating, setUserRating] = useState("");

  const ratingCount = useRef(0);

  let watched;
  watched = watchedMovies.find((mov) => mov.imdbID === selectedId);

  const {
    Title: title,
    Poster: poster,
    Runtime: runtime,
    imdbRating,
    Plot: plot,
    Released: released,
    Actors: actors,
    Director: director,
    Genre: genre,
  } = movie;

  function addWatchedMovie() {
    const watchedMovie = {
      imdbID: selectedId,
      title,
      poster,
      runtime: Number.parseInt(runtime),
      imdbRating: Number(imdbRating),
      userRating,
      ratingCount: ratingCount.current,
    };
    // console.log(watchedMovie);
    onAddWatched(watchedMovie);
    onCloseMovie();
  }

  useEffect(() => {
    if (userRating) ratingCount.current++;
  }, [userRating]);

  useEffect(() => {
    async function getMovieDetails() {
      try {
        setError(null);
        setIsLoading(true);
        const res = await fetch(
          `http://www.omdbapi.com/?apikey=${key}&i=${selectedId}`
        );
        const data = await res.json();
        setMovie(data);
      } catch {
        setError("Couldn't load movie details");
      } finally {
        setIsLoading(false);
      }
    }
    getMovieDetails();
  }, [selectedId]);

  useEffect(() => {
    if (!title) return;
    document.title = `Movie | ${title}`;

    return () => (document.title = "usePopcorn");
  }, [title]);

  useKey("Escape", onCloseMovie);

  // useEffect(() => {
  //   function callBack(e) {
  //     if (e.key === "Escape") {
  //       onCloseMovie();
  //     }
  //   }
  //   document.addEventListener("keydown", callBack);

  //   return () => document.removeEventListener("keydown", callBack);
  // }, []);

  return (
    <>
      {isLoading && <Loader />}

      {!isLoading && !error && (
        <div className="details">
          <header>
            <button className="btn-back" onClick={onCloseMovie}>
              &larr;
            </button>
            <img src={poster} alt={`Poster of ${title} movie`} />
            <div className="details-overview">
              <h2>{title}</h2>
              <p>
                {released} &bull; {runtime}
              </p>
              <p>{genre}</p>
              <p>
                <span>⭐</span>
                {imdbRating}
              </p>
            </div>
          </header>
          <section>
            <div className="rating">
              {watched ? (
                <p>
                  You rated the movie {watched.userRating} <span>⭐</span>
                </p>
              ) : (
                <>
                  <StarRating
                    maxRating={10}
                    size={24}
                    color="gold"
                    onStarRating={setUserRating}
                  />
                  {userRating > 0 && (
                    <button className="btn-add" onClick={addWatchedMovie}>
                      + Add to list
                    </button>
                  )}
                </>
              )}
            </div>
            <p>
              <em>{plot}</em>
            </p>
            <p>Starring {actors}</p>
            <p>Directed by {director}</p>
          </section>
        </div>
      )}
      {error && <ErrorComponent message={error} />}
    </>
  );
}

function Main({ children }) {
  return <main className="main">{children}</main>;
}

function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <MovieToggleButton onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </MovieToggleButton>
      {isOpen && children}
    </div>
  );
}
// function WatchBox() {
//   const [isOpen2, setIsOpen2] = useState(true);
//   const [watched, setWatched] = useState(tempWatchedData);
//   return (
//     <div className="box">
//       <MovieToggleButton onClick={() => setIsOpen2((open) => !open)}>
//         {isOpen2 ? "–" : "+"}
//       </MovieToggleButton>
//       {isOpen2 && (
//         <>
//           <WatchedMoviesSummary watched={watched} />
//           <WatchedMoviesList watched={watched} />
//         </>
//       )}
//     </div>
//   );
// }
function MovieToggleButton({ children, onClick }) {
  return (
    <button className="btn-toggle" onClick={onClick}>
      {children}
    </button>
  );
}

function LoadedMoviesList({ movies, onSelectMovie }) {
  return (
    <ul className="list list-movies">
      {movies?.map((movie) => (
        <Loadedmovie
          movie={movie}
          key={movie.imdbID}
          onSelectMovie={onSelectMovie}
        />
      ))}
    </ul>
  );
}
function Loadedmovie({ movie, onSelectMovie }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelectMovie(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}

function WatchedMoviesSummary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(watched.map((movie) => movie.runtime));
  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{Math.floor(avgRuntime)} min</span>
        </p>
      </div>
    </div>
  );
}

function WatchedMoviesList({ watched, onRemoveWatched }) {
  return (
    <ul className="list">
      {watched.map((movie) => (
        <WatchedMovie
          key={movie.imdbID}
          movie={movie}
          onRemoveWatched={onRemoveWatched}
        />
      ))}
    </ul>
  );
}

function WatchedMovie({ movie, onRemoveWatched }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>

        <button
          className="btn-delete"
          onClick={() => onRemoveWatched(movie.imdbID)}
        >
          X
        </button>
      </div>
    </li>
  );
}
