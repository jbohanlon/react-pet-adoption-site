import React from "react";
import { render } from "react-dom";
import { Link, Router } from "@reach/router";
import { Provider } from "react-redux";
import SearchParams from "./SearchParams";
import Details from "./Details";
import store from "./store";

const App = () => {
  return (
    <Provider store={store}>
      <React.StrictMode>
        <div>
          <header>
            <Link to="/">Adopt Me!</Link>
          </header>
          <Router>
            <SearchParams path="/" />
            <Details path="/details/:id" />
          </Router>
        </div>
      </React.StrictMode>
    </Provider>
  );
};

render(<App />, document.getElementById("root"));
