import { useEffect, useState } from "react";
import "./App.css"

const API_KEY = "a9eb901f9fcf404a4c7d94471f83fc3a";
const BASE = "https://api.themoviedb.org/3";
const IMG = "https://image.tmdb.org/t/p/w342";

function MovieCard({ movie }) {
    return (
        <article className="card">
            {movie.poster_path ? (
                <img src={IMG + movie.poster_path} alt={`${movie.title} poster`} />
            ) : (
                <div className="no-poster">No poster</div>
            )}
            <h3>{movie.title}</h3>
            <p>Release date: {movie.release_date || "Unknown"}</p>
            <p>Rating: {movie.vote_average.toFixed(1)}</p>
        </article>
    );
}

export default function App() {
    const [movies, setMovies] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [input, setInput] = useState("");
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] =useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        const url = query
        ? `${BASE}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}&page=${page}`
        : `${BASE}/movie/popular?api_key=${API_KEY}&page=${page}`;

        fetch(url)
            .then((res) => {
                if (!res.ok) throw new Error("Request failed");
                return res.json();
            })
            .then((data) => {
                setMovies(data.results);
            setTotalPages(Math.min(data.total_pages, 500));
            setError("");
            })
            .catch(() => setError("Could not load movies. Check your API key."));
    }, [query, page]);
 
    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        setQuery(input.trim());
    };
 
    const sorted = [...movies];
    const byDate = (a, b) => (a.release_date || "").localeCompare(b.release_date || "");
    const byRating = (a, b) => a.vote_average - b.vote_average;
    if (sortBy === "release_date_asc") sorted.sort(byDate);
    else if (sortBy === "release_date_desc") sorted.sort((a, b) => byDate(b, a));
    else if (sortBy === "vote_average_asc") sorted.sort(byRating);
    else if (sortBy === "vote_average_desc") sorted.sort((a, b) => byRating(b, a));
 
    return (
    <h1 className="site-title">Movie Explorer</h1>
      <header className="toolbar">
        <form onSubmit={handleSearch} className="search">
          <input
            type="text"
            placeholder="Search movies by title"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="">Sort By</option>
            <option value="release_date_asc">Release Date (Asc)</option>
            <option value="release_date_desc">Release Date (Desc)</option>
            <option value="vote_average_asc">Rating (Asc)</option>
            <option value="vote_average_desc">Rating (Desc)</option>
        </select>
      </header>
 
      {error && <p className="error">{error}</p>}
      {!error && sorted.length === 0 && <p className="empty">No movies found.</p>}
 
      <main className="grid">
        {sorted.map((m) => (
          <MovieCard key={m.id} movie={m} />
        ))}
      </main>
 
      <footer className="pager">
        <button onClick={() => setPage((p) => p - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={() => setPage((p) => p + 1)} disabled={page >= totalPages}>
          Next
        </button>
      </footer>
    </div>
  );
}
