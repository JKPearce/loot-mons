import React, { useState, useEffect } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

//display inventory for user to select a pokemon, move, abilities etc
const AddPokemon = ({ inventory, setNewTeam, id }) => {
  const [newPokemon, setNewPokemon] = useState({
    name: null,
    num: null,
    ability: null,
    moves: [],
  });

  const [selecting, setSelecting] = useState(true);

  function handleChange(e, pokemon) {
    console.log(e);
  }

  useEffect(() => {
    setNewTeam((prevState) => {
      let newTeam = [...prevState];
      newTeam[id] = newPokemon;
      return newTeam;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newPokemon]);

  function handleClick(pokemon) {
    setNewPokemon({
      name: pokemon.name,
      num: pokemon.num,
    });

    setSelecting(false);
  }

  return (
    <div className="container flex flex-row flex-wrap ">
      {selecting ? (
        inventory.pokemon.length !== 0 ? (
          inventory.pokemon.map((pokemon) => (
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
        )
      ) : (
        <button onClick={() => setSelecting(true)} type="button">
          <PokeCard pokemon={newPokemon} />
        </button>
      )}
    </div>
  );
};

export default AddPokemon;
