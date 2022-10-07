import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

//display inventory for user to select a pokemon
const AddPokemon = ({
  inventory,
  setNewTeam,
  id,
  setShowPokemonModal,
  pokemon,
}) => {
  const [moves, setMoves] = useState([]);

  //need to set moves to an array of 4 nulls in order to target them
  useEffect(() => {
    if (!pokemon.moves) {
      setMoves([null, null, null, null]);
    } else {
      setMoves([...pokemon.moves]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(pokemon) {
    setNewTeam((prevState) => {
      let newTeam = [...prevState];
      const newPokemon = {
        name: pokemon.name,
        num: pokemon.num,
        added: true,
        moves: moves,
      };
      newTeam[id] = newPokemon;
      return newTeam;
    });

    setShowPokemonModal(false);
  }

  return (
    <div
      id="modalContainer"
      onClick={(e) =>
        e.target.id === "modalContainer" ? setShowPokemonModal(false) : null
      }
      className="p-10 fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex flex-col justify-center items-center z-50"
    >
      <h3 className="font-bold text-lg">Pokemon Inventory</h3>
      <div className="modal-box min-w-full">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 sm:grid-cols-2 lg:grid-cols-6">
          {inventory.pokemon.length !== 0 ? (
            inventory.pokemon.map((pokemon) => (
              //display the inventory here
              <button
                type="button"
                onClick={() => {
                  handleClick(pokemon);
                }}
              >
                <PokeCard key={uniqid()} pokemon={pokemon} />
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
          onClick={() => setShowPokemonModal(false)}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AddPokemon;
