import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Nav from "./components/Nav";

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [moves, setMoves] = useState([]);
  const [abilities, setAbilities] = useState([]);
  const [inventory, addToInventory] = useState({ pokemon: [], moves: [] }); // TODO usestate set to localsave OR empty array

  useEffect(() => {
    const pokemonData = require("./data/pokedex.json");
    let pokeArray = [];
    for (const pokemon in pokemonData) {
      if (pokemonData[pokemon].forme || pokemonData[pokemon].num < 0) {
      } else {
        pokeArray.push(pokemonData[pokemon]);
      }
    }
    setPokemon(pokeArray);

    const moveData = require("./data/moves.json");
    let moveArray = [];
    for (const move in moveData) {
      moveArray.push(moveData[move]);
    }

    setMoves(moveArray);

    //?limit=100000&offset=0 is needed because pokeapi normally returns 20 results
    fetch("https://pokeapi.co/api/v2/ability/?limit=100000&offset=0")
      .then((response) => response.json())
      .then((data) => setAbilities(data.results));
  }, []);

  return (
    <BrowserRouter>
      <Nav />

      <Routes>
        <Route
          path="/"
          index
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
      </Routes>
    </BrowserRouter>
  );
}

export default App;
