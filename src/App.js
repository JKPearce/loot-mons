import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Inventory from "./components/Inventory";
import Nav from "./components/Nav";
import SubmitReplay from "./components/SubmitReplay";
import TeamBuilder from "./components/TeamBuilder";
import { NEW_USER_CREDIT_AMOUNT } from "./helpers/global";

function App() {
  const [teamList, setTeamList] = useState([]);

  const [pokedex, setPokedex] = useState({
    pokemon: [],
    moves: [],
    abilities: [],
    items: [],
  });

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

  async function initAbilityData() {
    //?limit=100000&offset=0 is needed because default limit is like 50
    const abilities = await fetch(
      "https://pokeapi.co/api/v2/ability/?limit=100000&offset=0"
    )
      .then((response) => response.json())
      .then((data) => data.results);
    return abilities;
  }

  useEffect(() => {
    (async () => {
      setPokedex({
        pokemon: initPokemonData(),
        moves: initMoveData(),
        abilities: await initAbilityData(),
        items: [],
      });
    })();

    //get existing user data
    if (localStorage.getItem("inventory")) {
      addToInventory(JSON.parse(localStorage.getItem("inventory")));
    }
    if (localStorage.getItem("teams")) {
      setTeamList(JSON.parse(localStorage.getItem("teams")));
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
              pokedex={pokedex}
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
          path="/teams"
          element={
            <TeamBuilder
              inventory={inventory}
              teamList={teamList}
              setTeamList={setTeamList}
            />
          }
        />
        <Route path="/submit-replay" element={<SubmitReplay />} />
      </Routes>
    </>
  );
}

export default App;
