import { createStore } from "redux";
import reducer from "./reducers";

const store = createStore(
  reducer,
  // If redux dev tools exist, use them
  // If they don't exist, use a bogus function that doesn't do anything
  typeof window === "object" &&
    typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== "undefined"
    ? window.__REDUX_DEVTOOLS_EXTENSION__()
    : (func) => func
);

export default store;
