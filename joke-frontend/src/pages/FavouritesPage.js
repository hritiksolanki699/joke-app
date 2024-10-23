import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function FavouritesPage() {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFavourites = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "http://localhost:5000/api/favourites"
        );
        setFavourites(response.data);
      } catch (error) {
        console.error("Error fetching favourites:", error);
        setError("Could not fetch favorites. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchFavourites();
  }, []);

  return (
    <div className="container mt-5">
      <h1>Favorite Jokes</h1>
      <div className="text-end">
        <button className="btn btn-primary mb-4" onClick={() => navigate("/")}>
          Go to Home
        </button>
      </div>
      {loading ? (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : (
        <div className="row">
          {favourites.length > 0 ? (
            favourites.map((joke) => (
              <div key={joke.id} className="col-md-4">
                <div className="card mb-3">
                  <div className="card-body">
                    <p>{joke.joke_text}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <div className="alert alert-info" role="alert">
                No favorite jokes found.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default FavouritesPage;
