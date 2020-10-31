import React, { useState, useEffect } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import { connect } from "react-redux";
import Results from "./Results";
import useDropdown from "./useDropdown";
import changeTheme from "./actionCreators/changeTheme";
import changeLocation from "./actionCreators/changeLocation";

const SearchParams = (props) => {
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([]); // Empty array because there aren't any pets when you first request them from the API

  // async functions always return a Promise when they complete
  async function requestPets() {
    // Wait in this function until pet.animals() finishes running and return that data
    const { animals } = await pet.animals({
      location: props.location,
      breed,
      type: animal,
    });

    // You know animals will be set because of requestPets() above, but if nothing gets returned then set an empty array instead
    setPets(animals || []);
  }

  useEffect(() => {
    setBreeds([]); // Clear out existing list of breeds
    setBreed(""); // Clear out previously selected breed

    // Note: This breeds isn't the breeds above
    pet.breeds(animal).then(({ breeds }) => {
      const breedStrings = breeds.map(({ name }) => name); // Get string version of the current breed's name
      setBreeds(breedStrings);
    }, console.error); // eslint-disable-line no-console
  }, [animal, setBreed, setBreeds]); // List of dependencies that React will check for changes, and it'll re-run useEffect if any changed

  return (
    <div className="search-params">
      <form
        onSubmit={(event) => {
          event.preventDefault(); // You don't want to actually submit the form through HTML POST or something like that
          requestPets();
        }}
      >
        <label htmlFor="location">
          Location
          <input
            id="location"
            value={props.location}
            placeholder="Location"
            onChange={(event) => {
              props.setLocation(event.target.value);
            }}
          />
        </label>

        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select
            value={props.theme}
            onChange={(event) => props.setTheme(event.target.value)}
            onBlur={(event) => props.setTheme(event.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chartreuse</option>
          </select>
        </label>
        <button style={{ backgroundColor: props.theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

const mapStateToProps = ({ theme, location }) => ({
  theme,
  location,
});

const mapDispatchToProps = (dispatch) => ({
  setTheme: (theme) => dispatch(changeTheme(theme)),
  setLocation: (location) => dispatch(changeLocation(location)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SearchParams);
