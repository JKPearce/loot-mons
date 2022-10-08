import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Nav from "./components/Nav";
import TeamBuilder from "./components/TeamBuilder";
import { NEW_USER_CREDIT_AMOUNT } from "./helpers/global";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [moves, setMoves] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [inventory, addToInventory] = useState({
    pokemon: [],
    moves: [],
    abilities: [],
    items: [],
    credits: NEW_USER_CREDIT_AMOUNT,
  });

  function initPokemonData() {
    //data is sourced from https://play.pokemonshowdown.com/data/pokedex.json
    const pokemonData = require("./data/pokedex.json");

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
    const moveData = require("./data/moves.json");

    const moves = [];
    for (const move in moveData) {
      moves.push(moveData[move]);
    }
    return moves;
  }

  useEffect(() => {
    setPokemon(initPokemonData());
    setMoves(initMoveData());

    //?limit=100000&offset=0 is needed because pokeapi normally returns 20 results
    fetch("https://pokeapi.co/api/v2/ability/?limit=100000&offset=0")
      .then((response) => response.json())
      .then((data) => setAbilities(data.results));

    //get existing user data
    if (localStorage.getItem("inventory")) {
      addToInventory(JSON.parse(localStorage.getItem("inventory")));
    }
  }, []);

  return (
    <>
      <Nav />
      <Routes>
        <Route
          exact
          path="/"
          element={
            <Home
              pokemon={pokemon}
              moves={moves}
              abilities={abilities}
              inventory={inventory}
              addToInventory={addToInventory}
            />
          }
        />
        <Route
          path="/inventory"
          element={<Inventory inventory={inventory} />}
        />
        <Route
          path="/team-builder"
          element={<TeamBuilder inventory={inventory} />}
        />
      </Routes>
    </>
  );
}

export default App;
