import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  useLocation,
} from "react-router-dom";
import Favorites from "../FavesPage/favorites";
import Searchbar from "../SearchPage/searchbar";
import "./menu.css";

const App = () => {
  // The Router component is used to wrap the entire application
  // The Switch component is used to render only the first Route or Redirect that matches the current location
  return (
    <Router>
      <Menu />
      <Switch>
        <Route path="/favorites" component={Favorites} />
        <Route path="/search" component={Searchbar} />
      </Switch>
    </Router>
  );
};

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false); // State to control the visibility of the menu
  const location = useLocation(); // Hook to access the current location

  // Function to toggle the menu open or closed
  const toggleOpen = () => setIsOpen(!isOpen);

  // Function to get the button style based on the current location
  const getButtonStyle = () => {
    switch (location.pathname) {
      case "/favorites":
        return "favorite-dropdown";
      case "/search":
        return "search-dropdown";
      default:
        return "dropdown";
    }
  };

  // Render the button and MenuList components
  return (
    <div>
      <button className={getButtonStyle()} onClick={toggleOpen}>
        {isOpen ? "Close menu" : "Open menu"}
      </button>

      {isOpen && <MenuList toggleOpen={toggleOpen} />}
    </div>
  );
};

const MenuList = ({ toggleOpen }) => {
  const location = useLocation(); // Hook to access the current location

  // Function to get the list style based on the current location
  const getListStyle = () => {
    switch (location.pathname) {
      case "/favorites":
        return "favorite-links";
        case "/search":
          return "search-links"
      default:
        return "links";
    }
  };

  return (
    <ul className={getListStyle()}>
      <li>
        <Link to="/favorites" onClick={toggleOpen}>
          <h2>Favorites</h2>
        </Link>
      </li>
      <li>
        <Link to="/search" onClick={toggleOpen}>
          <h2>Search</h2>
        </Link>
      </li>
    </ul>
  );
};

export default App;
