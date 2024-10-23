import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function SearchPage() {
  const [term, setTerm] = useState("");
  const [jokes, setJokes] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const [loading, setLoading] = useState(false);
  const [favoriteProcessing, setFavoriteProcessing] = useState({});
  const navigate = useNavigate();

  const fetchJokes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/api/search", {
        params: { term, page, limit },
      });
      setJokes(response.data.results);
    } catch (error) {
      console.error("Error fetching jokes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJokes();
  }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchJokes();
  };

  // Add joke to favorites
  const addToFavorites = async (joke) => {
    setFavoriteProcessing((prev) => ({ ...prev, [joke.id]: true }));
    try {
      const response = await axios.post(
        "http://localhost:5000/api/favourites",
        {
          joke_id: joke.id,
          joke_text: joke.joke,
        }
      );
      alert(response.data.message);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        alert("This joke is already in your favorites!");
      } else {
        alert("Could not add to favorites. Try again.");
      }
      console.error("Error adding to favorites:", error);
    } finally {
      setFavoriteProcessing((prev) => ({ ...prev, [joke.id]: false }));
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center mb-4">Search Jokes</h1>
      <div className="text-end">
        <button
          className="btn btn-info mb-3"
          onClick={() => navigate("/favorites")}
        >
          View Favorites
        </button>
      </div>

      <form onSubmit={handleSearch} className="mb-4">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search for jokes..."
            value={term}
            onChange={(e) => setTerm(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          {/* Jokes List */}
          <div className="row">
            {jokes.map((joke) => (
              <div key={joke.id} className="col-md-4">
                <div className="card mb-3">
                  <div className="card-body">
                    <p>{joke.joke}</p>
                    <button
                      className="btn btn-success"
                      onClick={() => addToFavorites(joke)}
                      disabled={favoriteProcessing[joke.id]}
                    >
                      {favoriteProcessing[joke.id] ? (
                        <span
                          className="spinner-border spinner-border-sm"
                          role="status"
                          aria-hidden="true"
                        ></span>
                      ) : (
                        "Add to Favorites"
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="d-flex justify-content-between mt-4 mb-4">
            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1 || loading}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              className="btn btn-secondary"
              onClick={() => setPage((prev) => prev + 1)}
              disabled={loading}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default SearchPage;
