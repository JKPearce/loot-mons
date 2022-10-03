import React, { useState } from "react";
import PokeCard from "./PokeCard";

const Home = ({ pokemon, moves, abilities, inventory, addToInventory }) => {
  const [newPokemon, setNewPokemon] = useState(null);

  function addRandomPokemon() {
    const num = randomNumber(pokemon.length);

    addToInventory((prevState) => {
      const newArr = [...prevState.pokemon];
      newArr.push(pokemon[num]); //add newest pokemon to the inv array
      setNewPokemon(pokemon[num]); //add it to display newest pokemon
      return { ...prevState, pokemon: newArr };
    });
  }

  function addRandomMove() {
    const num = randomNumber(moves.length);

    addToInventory((prevState) => {
      const newArr = [...prevState.moves];
      newArr.push(moves[num]);
      return { ...prevState, moves: newArr };
    });
  }

  function randomNumber(number) {
    return Math.floor(Math.random() * number);
  }
  return (
    <div className="container mx-auto ">
      <h1>Loot-Mons</h1>
      <button className="btn" onClick={addRandomPokemon}>
        Get a random pokemon
      </button>
      <button className="btn" onClick={addRandomMove}>
        Get a random move
      </button>
      {newPokemon ? <PokeCard pokemon={newPokemon} /> : ""}
    </div>
  );
};

export default Home;
