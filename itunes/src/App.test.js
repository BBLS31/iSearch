import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import search from '../src/Components/Function/util'
import SearchBar from "./Components/SearchPage/searchbar";
import renderer from "react-test-renderer";



test("Fetches api data", async () => {
  try {
    const res = await search(); // Calls the api function and awaits the response
    console.log(res); // Logs the data received to the console

    // Checks if the wrapperType property of the response equals "track"
    expect(res.wrapperType).toEqual("track");
  } catch (error) {
    console.error("Error fetching data: ", error);
  }
});





test("Searchbar renders correctly", () => {
  const tree = renderer.create(<SearchBar />).toJSON(); //renders the WeatherApp component into a JSON object using react-test-renderer
  expect(tree).toMatchSnapshot();//compares the rendered output to a snaphot stored in the snapshots directory, or creates a snapshot if it does not exist
});
