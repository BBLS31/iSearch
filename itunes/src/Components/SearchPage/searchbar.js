import React, { useState } from "react";
import axios from "axios";
import "./searchbar.css";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

const SearchBar = () => {
  // Declare new state variables with their setter functions
  const [term, setTerm] = useState("");
  const [media, setMedia] = useState("music");
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState({
    music: [],
    movie: [],
    podcast: [],
    audiobook: [],
    shortFilm: [],
    tvShow: [],
    ebook: [],
    all: [],
  });

  // Define a function to search for media
  const search = async () => {
    try {
      const response = await axios.get(
        `https://isearch-api.onrender.com/search?term=${term}&media=${media}`
      );
      setResults(response.data.results);
    } catch (error) {
      console.error(`Axios request failed: ${error.message}`);
    }
  };

  // Define a function to add a media item to favorites
  const addToFavorites = (result) => {
    axios
      .post("https://isearch-api.onrender.com/search", result)
      .then((response) => {
        console.log(response.data.message);
        setFavorites((prevFavorites) => ({
          ...prevFavorites,
          [media]: [...prevFavorites[media], result],
        }));
      })
      .catch((error) => {
        console.error("Error adding to favorites:", error);
      });
  };

  return (
    <div>
      <h1>Search</h1>
      <div className="searchbar">
        <input
          className="search"
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Search..."
        />
        <select
          className="search-dd"
          value={media}
          onChange={(e) => setMedia(e.target.value)}
        >
          <option value="music">Music</option>
          <option value="movie">Movie</option>
          <option value="podcast">Podcast</option>
          <option value="audiobook">Audio Book</option>
          <option value="shortFilm">Short Film</option>
          <option value="tvShow">Tv Show</option>
          <option value="ebook">Ebook</option>
          <option value="all">All</option>
        </select>
        <button className="search-btn" onClick={search}>
          Search
        </button>
      </div>

      <div className="grid-container">
        {results.map((result) => (
          <div className="grid-item" key={result.trackid}>
            <Card className="search-card" style={{ width: "18rem" }}>
              <Card.Img variant="top" src={result.artworkUrl100} />
              <Card.Body>
                <div className="card-body">
                  <Card.Title className="title">{result.trackName}</Card.Title>
                  <div className="card-text">
                    <Card.Text>{result.artistName}</Card.Text>
                    <Card.Text>{result.collectionName}</Card.Text>
                    <Card.Text>{result.primaryGenreName}</Card.Text>
                    <Card.Text>
                      {new Date(result.releaseDate).toDateString()}
                    </Card.Text>
                    <Button
                      className="cardBtn"
                      variant="primary"
                      onClick={() => addToFavorites(result)}
                    >
                      Add to Favorites
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
