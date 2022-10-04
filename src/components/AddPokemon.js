import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

//display inventory for user to select a pokemon, move, abilities etc
const AddPokemon = ({
  inventory,
  setNewTeam,
  id,
  setSelectingPokemon,
  selectingPokemon,
  pokemon,
}) => {
  const [moves, setMoves] = useState([]);

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

    setSelectingPokemon(false);
  }

  return (
    <div className="container flex flex-row flex-wrap ">
      {console.log(moves)}
      {selectingPokemon &&
        (inventory.pokemon.length !== 0 ? (
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
        ))}
    </div>
  );
};

export default AddPokemon;
