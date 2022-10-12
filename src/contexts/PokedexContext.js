import React, { useContext, useEffect, useState } from "react";

const PokedexContext = React.createContext();

export function usePokedex() {
  return useContext(PokedexContext);
}

export function PokedexProvider({ children }) {
  const [pokemon, setPokemon] = useState();
  const [moves, setMoves] = useState();
  const [abilities, setAbilities] = useState();

  function initPokemonData() {
    //data is sourced from https://play.pokemonshowdown.com/data/pokedex.json
    const pokemonData = require("../data/pokedex.json");

    const pokeArray = [];
    for (const pokemon in pokemonData) {
      //removes user made pokemons and pokemon which have a forme from the array
      if (pokemonData[pokemon].forme || pokemonData[pokemon].num < 0) {
      } else {
        pokeArray.push(pokemonData[pokemon]);
      }
    }
    return pokeArray;
  }

  function initMoveData() {
    //data is sourced from https://play.pokemonshowdown.com/data/moves.json
    const moveData = require("../data/moves.json");

    const moves = [];
    for (const move in moveData) {
      moves.push(moveData[move]);
    }
    return moves;
  }

  function initAbilityData() {
    //?limit=100000&offset=0 is needed because default limit is like 50
    return fetch("https://pokeapi.co/api/v2/ability/?limit=100000&offset=0")
      .then((response) => response.json())
      .then((data) => data.results);
    //  abilities;
  }

  useEffect(() => {
    setPokemon(initPokemonData());
    setMoves(initMoveData());

    fetch("https://pokeapi.co/api/v2/ability/?limit=100000&offset=0")
      .then((response) => response.json())
      .then((data) => setAbilities(data.results))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const value = {
    pokemon,
    moves,
    abilities,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
