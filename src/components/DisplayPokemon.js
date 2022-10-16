import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";
import * as _ from "lodash";

//display inventory for user to select a pokemon
const DisplayPokemon = ({
  setNewTeam,
  id,
  pokemonAtTeamPosition,
  setDisplayPokemonInventory,
  localPokemon,
}) => {
  const [selectedMoves, setSelectedMoves] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    //need to set moves to an array of 4 nulls in order to loop / target
    if (!pokemonAtTeamPosition.moves) {
      setSelectedMoves([null, null, null, null]);
    } else {
      setSelectedMoves([...pokemonAtTeamPosition.moves]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleClick(poke, i) {
    if (!_.isEmpty(pokemonAtTeamPosition)) {
      //this checks if the player is selecting the same pokemon and increments
      //the count so they can actually select it
      if (pokemonAtTeamPosition.name === poke.name) {
        poke.count++;
      } else if (poke.count > 0) {
        //this checks if the player has selected a pokemon that they have enough of in their inventory
        //then it increases the pokemon count of the pokemon that was at the team spot
        //this essentially refunds the pokemon if they chose another at the same slot
        const pokemonInLocalStorage = _.find(localPokemon, (pokemon) => {
          return pokemon.name === pokemonAtTeamPosition.name;
        });
        pokemonInLocalStorage.count++;
      }
    }

    if (poke.count <= 0) {
      setError("Not enough pokemon!");
    } else {
      poke.count--;
      setNewTeam((prevState) => {
        let newTeam = [...prevState];

        const newPokemon = {
          ...poke,
          added: true,
          moves: selectedMoves,
        };
        newTeam[id] = newPokemon;

        return newTeam;
      });
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
          {localPokemon.length !== 0 ? (
            localPokemon.map((poke, i) => (
              //display the inventory here
              <button
                type="button"
                onClick={() => {
                  handleClick(poke, i);
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
