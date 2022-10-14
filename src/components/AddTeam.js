import React, { useState } from "react";
import DisplayPokemon from "./DisplayPokemon";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";
import { useTeams } from "../contexts/TeamContext";
import { useInventory } from "../contexts/InventoryContext";
import { useNavigate } from "react-router-dom";
import * as _ from "lodash";

const AddTeam = () => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const { addTeam } = useTeams();
  const { moves, pokemon } = useInventory();
  const navigate = useNavigate();

  // cloning the pokemon inv state so a forced page reload isn't
  // needed this means no need to re-read database
  const [localPokemon] = useState(_.cloneDeep(pokemon));

  const [pokemonTeamPosition, setPokemonTeamPosition] = useState(false);
  const [displayPokemonInventory, setDisplayPokemonInventory] = useState(true);

  function handleSubmit(e) {
    e.preventDefault();
    addTeam(newTeam)
      .then(() => {
        console.log("Adding team: ", newTeam);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        navigate("/teams");
      });
  }

  function handleMoveSelected(e, moveNumber, pokemonTeamPosition) {
    setNewTeam((prevState) => {
      const newTeamArray = [...prevState];
      newTeamArray[pokemonTeamPosition].moves[moveNumber - 1] = e.target.value;
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
          {moves.map((move) => {
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

  function addNewPokemonAtTeamPosition(i) {
    setPokemonTeamPosition(i);
    setDisplayPokemonInventory(true);
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 place-content-center">
            {newTeam.map((poke, i) => (
              <div
                className="flex flex-col place-items-center p-5"
                key={uniqid()}
              >
                {/* if the team position is = the button index you clicked then show the add new pokemon modal  */}
                {pokemonTeamPosition === i && displayPokemonInventory ? (
                  // sends details of the current position to the modal to use as default values in drop downs
                  <DisplayPokemon
                    pokemon={localPokemon}
                    id={i}
                    selectedPokemon={poke}
                    setNewTeam={setNewTeam}
                    setDisplayPokemonInventory={setDisplayPokemonInventory}
                    selectingPokemon={displayPokemonInventory}
                  />
                ) : poke.added ? (
                  <>
                    <button
                      type="button"
                      onClick={() => addNewPokemonAtTeamPosition(i)}
                    >
                      <PokeCard pokemon={poke} />
                    </button>
                    {/* sends current value to be used as pokemonTeamPosition */}
                    {moveDropDown(i)}
                  </>
                ) : (
                  <button
                    onClick={() => addNewPokemonAtTeamPosition(i)}
                    type="button"
                    className="btn btn-lg btn-accent"
                  >
                    +
                  </button>
                )}
              </div>
            ))}
          </div>
          <button
            className="btn btn-error"
            onClick={() => navigate("/teams")}
            type="button"
          >
            Cancel
          </button>
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
