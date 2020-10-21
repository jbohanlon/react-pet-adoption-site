import React, { useState, useEffect, useContext } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import Results from "./Results";
import useDropdown from "./useDropdown";
import ThemeContext from "./ThemeContext";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([]); // Empty array because there aren't any pets when you first request them from the API
  const [theme, setTheme] = useContext(ThemeContext); // You aren't going to need setTheme so grabbing it isn't necessary

  // async functions always return a Promise when they complete
  async function requestPets() {
    // Wait in this function until pet.animals() finishes running and return that data
    const { animals } = await pet.animals({
      location,
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
    }, console.error);
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
            value={location}
            placeholder="Location"
            onChange={(event) => {
              setLocation(event.target.value);
            }}
          />
        </label>

        <AnimalDropdown />
        <BreedDropdown />
        <label htmlFor="theme">
          Theme
          <select
            value={theme}
            onChange={(event) => setTheme(event.target.value)}
            onBlur={(event) => setTheme(event.target.value)}
          >
            <option value="peru">Peru</option>
            <option value="darkblue">Dark Blue</option>
            <option value="mediumorchid">Medium Orchid</option>
            <option value="chartreuse">Chartreuse</option>
          </select>
        </label>
        <button style={{ backgroundColor: theme }}>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
