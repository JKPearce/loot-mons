import React, { useContext, useEffect, useState } from "react";

const PokedexContext = React.createContext();

export function usePokedex() {
  return useContext(PokedexContext);
}

export function PokedexProvider({ children }) {
  const [pokedex, setPokedex] = useState({
    pokemon: [],
    moves: [],
    abilities: [],
  });

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
      //remove moves from the list
      if (
        moveData[move].isMax ||
        moveData[move].isZ
        //|| moveData[move].isNonstandard === "LGPE"
      ) {
        return;
      }

      moves.push(moveData[move]);
    }
    return moves;
  }

  async function initAbilityData() {
    //?limit=100000&offset=0 is needed because default limit is like 50
    const abilities = await fetch(
      "https://pokeapi.co/api/v2/ability/?limit=100000&offset=0"
    )
      .then((response) => response.json())
      .then((data) => {
        //filter out abilities and only return ones that are valid
        const abilities = [];
        data.results.forEach((ability) => {
          fetch(ability.url)
            .then((response) => response.json())
            .then((data) => data.is_main_series && abilities.push(data));
        });
        return abilities;
      });

    return abilities;
  }

  useEffect(() => {
    (async () => {
      setPokedex({
        pokemon: initPokemonData(),
        moves: initMoveData(),
        abilities: await initAbilityData(),
      });
    })();
  }, []);

  const value = {
    pokedex,
  };

  return (
    <PokedexContext.Provider value={value}>{children}</PokedexContext.Provider>
  );
}
