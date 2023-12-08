import React, { useState, useEffect } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "./favorites.css";

// Define the Favorites component
function Favorites() {
  // Declare a new state variable 'favorites' with its setter function 'setFavorites'
  const [favorites, setFavorites] = useState([]);

  // Use the useEffect hook to fetch data when the component mounts
  useEffect(() => {
    // Fetch the favorites data from the server
    fetch("https://isearch-api.onrender.com/favorites")
      .then((response) => response.json())
      .then((data) => {
        // Update the 'favorites' state with the fetched data
        setFavorites(data);
      })
      .catch((error) => {
        // Log any error that occurs during the fetch operation
        console.error("Error fetching data: ", error);
      });
  }, []); // Empty dependency array means this effect runs once on mount

  // Define a function to delete a favorite item
  const deleteFavorite = (item) => {
    // Send a DELETE request to the server
    fetch("https://isearch-api.onrender.com/delete", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ trackName: item.trackName }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update the 'favorites' state by removing the deleted item
        setFavorites(
          favorites.filter((favorite) => favorite.trackName !== item.trackName)
        );
      })
      .catch((error) => {
        // Log any error that occurs during the delete operation
        console.error("Error deleting favorite: ", error);
      });
  };

  return (
    <div>
      <h1 className="header">Favorites</h1>
      <div className="container">
        {favorites.map((item) => (
          // For each favorite item, render a Card component
          <Card className="fave-cards" style={{ width: "18rem" }}>
            <Card.Img variant="top" src={item.artworkUrl100} />
            <Card.Body>
              <div className="faves-cardbody">
                <Card.Title className="faves-title">
                  {item.trackName}
                </Card.Title>
                <div className="faves-card-text">
                  <Card.Text>{item.artistName}</Card.Text>
                  <Card.Text>{item.collectionName}</Card.Text>
                  <Card.Text>{item.primaryGenreName}</Card.Text>
                  <Card.Text>
                    {new Date(item.releaseDate).toDateString()}
                  </Card.Text>
                  <Button
                    className="faves-deleteBtn"
                    variant="primary"
                    onClick={() => deleteFavorite(item)}
                  >
                    Remove from Favorites
                  </Button>
                </div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default Favorites;
