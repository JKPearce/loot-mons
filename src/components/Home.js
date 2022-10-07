import React, { useState } from "react";
import PokeCard from "./PokeCard";

const Home = ({ pokemon, moves, abilities, inventory, addToInventory }) => {
  const [newPokemon, setNewPokemon] = useState(null);
  const [newMove, setNewMove] = useState(null);

  function addRandomPokemon() {
    const num = randomNumber(pokemon.length);

    addToInventory((prevState) => {
      const newArr = [...prevState.pokemon];
      newArr.push(pokemon[num]); //add newest pokemon to the inv array
      return { ...prevState, pokemon: newArr };
    });
    setNewPokemon(pokemon[num]); //add it to display newest pokemon
    setNewMove(null);
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  function addRandomMove() {
    const num = randomNumber(moves.length);

    addToInventory((prevState) => {
      const newArr = [...prevState.moves];
      newArr.push(moves[num]);
      return { ...prevState, moves: newArr };
    });
    setNewMove(moves[num]);
    setNewPokemon(null);
    localStorage.setItem("inventory", JSON.stringify(inventory));
  }

  function randomNumber(number) {
    return Math.floor(Math.random() * number);
  }
  return (
    <div className="container grid grid-cols-3 place-items-center">
      <h1 className="p-4 text-center text-5xl font-bold col-span-3">
        Loot-Mons
      </h1>
      <div className="col-span-3 h-60 w-40 ">
        {newPokemon && <PokeCard pokemon={newPokemon} newPokemon={true} />}
        {newMove && (
          <p className="my-auto">
            <b>{newMove.name}</b> Has been added to your inventory!
          </p>
        )}
      </div>
      <button className="btn" onClick={addRandomPokemon}>
        Get a random pokemon
      </button>
      <button className="btn" onClick={addRandomMove}>
        Get a random move
      </button>
    </div>
  );
};

export default Home;
