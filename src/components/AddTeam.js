import React, { useState } from "react";
import AddPokemon from "./AddPokemon";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

const AddTeam = ({ setTeamList, setActive, inventory }) => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const [showAddPokemon, setShowAddPokemon] = useState(false);
  const [selectingPokemon, setSelectingPokemon] = useState(true);
  const [selectedMove, setSelectedMove] = useState([]);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("submitted", e);
    //TODO: get all the info from the form and save in state
    console.log(newTeam);
    setTeamList((prevState) => [...prevState, newTeam]);

    setActive(false);
  }

  function handleMoveSelected(e, moveNumber, pokemonTeamPosition) {
    setNewTeam((prevState) => {
      const newTeamArray = [...prevState];
      newTeamArray[pokemonTeamPosition].moves[moveNumber - 1] = e.target.value;
      console.log(newTeamArray);
      return newTeamArray;
    });
    console.log(e.target.value, moveNumber, pokemonTeamPosition);
  }

  const moveDropDown = (pokemonTeamPosition) => {
    let moveListElements = [];
    for (let i = 1; i < 5; i++) {
      let moveListNames = [];
      moveListElements.push(
        <select
          onChange={(e) => handleMoveSelected(e, i, pokemonTeamPosition)}
          key={uniqid()}
          className="select select-bordered w-full max-w-xs"
        >
          <option key={uniqid()} disabled selected>
            {`Move ${i}`}
          </option>
          {inventory.moves.map((move) => {
            if (moveListNames.includes(move.name)) {
              return;
            } else {
              moveListNames.push(move.name);
              return (
                <option key={uniqid()} value={move.name}>
                  {move.name}
                </option>
              );
            }
          })}
        </select>
      );
    }
    return moveListElements;
  };

  function handleAdd(i) {
    setShowAddPokemon(i);
    setSelectingPokemon(true);
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4">
            {newTeam.map((pokemon, i) => (
              <div className="" key={uniqid()}>
                {showAddPokemon === i && selectingPokemon ? (
                  <AddPokemon
                    id={i}
                    setNewTeam={setNewTeam}
                    inventory={inventory}
                    setSelectingPokemon={setSelectingPokemon}
                    selectingPokemon={selectingPokemon}
                  />
                ) : pokemon.added ? (
                  <>
                    <button type="button" onClick={() => () => handleAdd(i)}>
                      <PokeCard pokemon={pokemon} />
                    </button>
                    {moveDropDown(i)}
                  </>
                ) : (
                  <button
                    onClick={() => handleAdd(i)}
                    type="button"
                    className="btn"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
          <input
            className="btn btn-success"
            type={"submit"}
            value={"Save"}
          ></input>
        </form>
      </div>
    </>
  );
};

export default AddTeam;
