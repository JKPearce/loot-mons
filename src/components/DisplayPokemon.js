import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

//display inventory for user to select a pokemon
const DisplayPokemon = ({
  setNewTeam,
  id,
  selectedPokemon,
  setDisplayPokemonInventory,
  pokemon,
}) => {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    //need to set moves to an array of 4 nulls in order to loop / target
    if (!selectedPokemon.moves) {
      setSelectedMoves([null, null, null, null]);
    } else {
      setSelectedMoves([...selectedPokemon.moves]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(selectedPokemon) {
    if (selectedPokemon.count - 1 < 0) {
      setError("Not enough pokemon!");
    } else {
      setNewTeam((prevState) => {
        let newTeam = [...prevState];

        const newPokemon = {
          ...selectedPokemon,
          added: true,
          moves: selectedMoves,
        };
        newTeam[id] = newPokemon;
        return newTeam;
      });
      //only changes the count to the cloned state
      selectedPokemon.count = selectedPokemon.count - 1;
      console.log("new count of pokemon:   ", selectedPokemon.count);
      setDisplayPokemonInventory(false);
    }
  }

  return (
    //first div makes it so you can click outside of modal and close it
    <div
      id="modalContainer"
      onClick={(e) =>
        e.target.id === "modalContainer"
          ? setDisplayPokemonInventory(false)
          : null
      }
      className="p-10 fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex flex-col justify-center items-center z-50"
    >
      <h3 className="font-bold text-lg">Pokemon Inventory</h3>
      {error && (
        <div className="alert alert-error shadow-lg">
          <div>
            <span>{error}</span>
          </div>
        </div>
      )}
      <div className="modal-box min-w-full">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-6">
          {pokemon.length !== 0 ? (
            pokemon.map((poke) => (
              //display the inventory here
              <button
                type="button"
                onClick={() => {
                  handleClick(poke);
                }}
                key={uniqid()}
              >
                <PokeCard key={uniqid()} pokemon={poke} />
              </button>
            ))
          ) : (
            <p>YOU DO NOT HAVE ANY POKEMANS!</p>
          )}
        </div>
      </div>
      <div className="modal-action">
        <button
          type="button"
          className="btn btn-error "
          onClick={() => setDisplayPokemonInventory(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default DisplayPokemon;
