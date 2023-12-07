const express = require("express");
const helmet = require("helmet");
const fileHandler = require("fs");
const https = require("https");
const cors = require("cors")
const app = express();
const port = 8000;

// Use the built-in JSON middleware in Express to automatically parse JSON
app.use(express.json());
app.use(helmet());
app.use(cors());

// Define a GET route for "/search"
app.get("/search", (req, res) => {
  // Destructure the query parameters from the request
  const { term, media } = req.query;

  // Make a GET request to the iTunes API with the provided term and media type
  https
    .get(
      `https://itunes.apple.com/search?term=${term}&media=${media}`,
      (response) => {
        let data = "";

        // A chunk of data has been received.
        response.on("data", (chunk) => {
          data += chunk;
        });

        // The whole response has been received.
        response.on("end", () => {
          res.json(JSON.parse(data));
        });
      }
    )
    .on("error", (error) => {
      // If an error occurs, send a 500 status code and a message to the client
      res
        .status(500)
        .send("An error occurred while fetching data from the iTunes API");
    });
});

// Define a POST route for "/search"
app.post("/search", (req, res) => {
  // Read the contents of the "favorites.json" file
  fileHandler.readFile(`favorites.json`, (err, data) => {
    // If an error occurs or the file is empty, send a 404 status code and a message to the client
    if (err || !data) {
      console.error(err);
      return res
        .status(404)
        .json({ message: "Error reading file or file is empty" });
    }

    let mediaFile;
    try {
      // Parse the file data as JSON
      mediaFile = JSON.parse(data);
    } catch (err) {
      console.error(err);
      return res.status(404).json({ message: "Error parsing JSON data" });
    }

    // Create a new media object with an ID and the data from the request body
    const id = mediaFile.length + 1;
    const media = {
      id: id,
      wrapperType: req.body.wrapperType,
      kind: req.body.kind,
      artistId: req.body.artistId,
      collectionId: req.body.collectionId,
      trackId: req.body.trackId,
      artistName: req.body.artistName,
      collectionName: req.body.collectionName,
      trackName: req.body.trackName,
      collectionCensoredName: req.body.collectionCensoredName,
      trackCensoredName: req.body.trackCensoredName,
      artistViewUrl: req.body.artistViewUrl,
      collectionViewUrl: req.body.collectionViewUrl,
      trackViewUrl: req.body.trackViewUrl,
      previewUrl: req.body.previewUrl,
      artworkUrl30: req.body.artworkUrl30,
      artworkUrl60: req.body.artworkUrl60,
      artworkUrl100: req.body.artworkUrl100,
      collectionPrice: req.body.collectionPrice,
      trackPrice: req.body.trackPrice,
      releaseDate: req.body.releaseDate,
      collectionExplicitness: req.body.collectionExplicitness,
      trackExplicitness: req.body.trackExplicitness,
      discCount: req.body.discCount,
      discNumber: req.body.discNumber,
      trackCount: req.body.trackCount,
      trackNumber: req.body.trackNumber,
      trackTimeMillis: req.body.trackTimeMillis,
      country: req.body.country,
      currency: req.body.currency,
      primaryGenreName: req.body.primaryGenreName,
      isStreamable: req.body.isStreamable,
    };

    // Add the new media object to the array
    mediaFile.push(media);

    // Write the updated array back to the "favorites.json" file
    fileHandler.writeFile(
      `favorites.json`,
      JSON.stringify(mediaFile),
      { flag: "w" },
      (err) => {
        // If an error occurs, send a 404 status code and a message to the client
        if (err) {
          console.error(err);
          return res.status(404).json({ message: "Error writing to file" });
        }

        // If successful, send a 200 status code and a message to the client
        return res
          .status(200)
          .json({ message: `Media item was created with id ${media.id}` });
      }
    );
  });
});

// Define a GET route for "/favorites"
app.get("/favorites", (req, res) => {
  // Read the contents of the "favorites.json" file
  fileHandler.readFile(`favorites.json`, "utf-8", (err, data) => {
    // If an error occurs, send a 404 status code and a message to the client
    if (err) {
      return res.status(404).json({ message: "Can't find file" });
    }
    // If successful, send a 200 status code and the file data to the client
    return res.status(200).json(JSON.parse(data));
  });
});

// Define a DELETE route for "/delete"
app.delete("/delete", (req, res) => {
  // Extract the track name from the request body
  const trackName = req.body.trackName;

  // Read the contents of the "favorites.json" file
  fileHandler.readFile(`favorites.json`, "utf-8", (err, data) => {
    // If an error occurs, send a 404 status code and a message to the client
    if (err) {
      return res.status(404).json({ message: `Can't find file` });
    }

    // Parse the file data as JSON
    let mediaItems = JSON.parse(data);

    // Find the index of the media item with the provided track name
    let index = mediaItems.findIndex((item) => item.trackName === trackName);

    // If the media item is not found, send a 404 status code and a message to the client
    if (index === -1) {
      return res.status(404).json({
        message: `Media item with trackName: ${trackName} does not exist`,
      });
    }

    // Remove the media item from the array
    mediaItems.splice(index, 1);

    // Write the updated array back to the "favorites.json" file
    fileHandler.writeFile(
      `favorites.json`,
      JSON.stringify(mediaItems),
      { flag: "w" },
      (err) => {
        // If an error occurs, send a 404 status code and a message to the client
        if (err) {
          return res
            .status(404)
            .json({ message: `Failed to delete media item` });
        }

        // If successful, send a 200 status code and a message to the client
        return res.status(200).json({
          message: `Media item with trackName: ${trackName} was deleted`,
        });
      }
    );
  });
});

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

