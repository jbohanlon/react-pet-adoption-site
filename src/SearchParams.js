import React, { useState, useEffect } from "react";
import pet, { ANIMALS } from "@frontendmasters/pet";
import Results from "./Results";
import useDropdown from "./useDropdown";

const SearchParams = () => {
  const [location, setLocation] = useState("Seattle, WA");
  const [breeds, setBreeds] = useState([]);
  const [animal, AnimalDropdown] = useDropdown("Animal", "dog", ANIMALS);
  const [breed, BreedDropdown, setBreed] = useDropdown("Breed", "", breeds);
  const [pets, setPets] = useState([]); // Empty array because there aren't any pets when you first request them from the API

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
        <button>Submit</button>
      </form>
      <Results pets={pets} />
    </div>
  );
};

export default SearchParams;
