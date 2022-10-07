import React, { useState } from "react";
import AddPokemon from "./AddPokemon";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

const AddTeam = ({ setTeamList, setActive, inventory }) => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const [teamPosition, setTeamPosition] = useState(false);
  const [showPokemonModal, setShowPokemonModal] = useState(true);
  // const [showInventoryModal, setShowInventoryModal] = useState(false);

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
  }

  //This function gets already selected moves and
  //creates a dropdown box with the moves still selected
  const moveDropDown = (pokemonTeamPosition) => {
    let moveListElements = [];
    for (let i = 1; i < 5; i++) {
      let moveListNames = [];
      moveListElements.push(
        <select
          onChange={(e) => handleMoveSelected(e, i, pokemonTeamPosition)}
          value={
            //Check if there is a move selected already for that pokemon if so display its name
            newTeam[pokemonTeamPosition].moves[i - 1]
              ? newTeam[pokemonTeamPosition].moves[i - 1]
              : `Move ${i}`
          }
          key={uniqid()}
          className="select select-bordered w-full max-w-xs"
        >
          <option key={uniqid()} disabled>
            {`Move ${i}`}
          </option>
          {inventory.moves.map((move) => {
            if (moveListNames.includes(move.name)) {
              return <></>;
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
    setTeamPosition(i);
    setShowPokemonModal(true);
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 place-content-center">
            {newTeam.map((pokemon, i) => (
              <div
                className="flex flex-col place-items-center p-5"
                key={uniqid()}
              >
                {teamPosition === i && showPokemonModal ? (
                  <AddPokemon
                    id={i}
                    pokemon={pokemon}
                    setNewTeam={setNewTeam}
                    inventory={inventory}
                    setShowPokemonModal={setShowPokemonModal}
                    selectingPokemon={showPokemonModal}
                  />
                ) : pokemon.added ? (
                  <>
                    <button type="button" onClick={() => handleAdd(i)}>
                      <PokeCard pokemon={pokemon} />
                    </button>
                    {/* sends current value to be used as pokemonTeamPosition */}
                    {moveDropDown(i)}
                  </>
                ) : (
                  <button
                    onClick={() => handleAdd(i)}
                    type="button"
                    className="btn btn-lg btn-accent"
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
