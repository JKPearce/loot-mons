import React, { useEffect, useRef, useState } from "react";
import DisplayPokemon from "./DisplayPokemon";
import uniqid from "uniqid";
import { useTeams } from "../contexts/TeamContext";
import { useInventory } from "../contexts/InventoryContext";
import { useNavigate } from "react-router-dom";
import { cloneDeep, cloneDeepWith } from "lodash";

const AddTeam = () => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const { addTeam, teamList } = useTeams();
  const { moves, pokemon } = useInventory();
  const navigate = useNavigate();
  const [localPokemon, setLocalPokemon] = useState();
  const teamNameRef = useRef();

  const [pokemonTeamPosition, setPokemonTeamPosition] = useState(false);
  const [displayPokemonInventory, setDisplayPokemonInventory] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    addTeam(newTeam, teamNameRef.current.value)
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
            moveListNames.push(move.name);
            return (
              <option key={uniqid()} value={move.name}>
                {move.name}
              </option>
            );
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

  useEffect(() => {
    // cloning the pokemon inv state to remove the count from a
    // different array other than the main pokemon array state
    // this means that the player dosnt need to refresh the page to fix their inv
    if (pokemon) {
      setLocalPokemon(cloneDeep(pokemon));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="p-5">
        <form className="gap-3 flex flex-col" onSubmit={handleSubmit}>
          <div className="form-control flex place-content-center">
            <label className="label">
              <span className="label-text">Team Name</span>
            </label>
            <input
              type="text"
              ref={teamNameRef}
              className="input input-bordered"
              defaultValue={`Team ${teamList.length + 1}`}
            ></input>
          </div>
          <div className="grid place-items-center grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 place-content-center">
            {newTeam.map((poke, i) => (
              <div
                className="card p-5 border border-base-content border-opacity-20 bg-base-100 shadow-lg w-full h-full place-content-center "
                key={uniqid()}
              >
                {/* if the team position is = the button index you clicked then show the add new pokemon modal  */}
                {pokemonTeamPosition === i && displayPokemonInventory ? (
                  // sends details of the current position to the modal to use as default values in drop downs
                  <DisplayPokemon
                    setLocalPokemon={setLocalPokemon}
                    localPokemon={localPokemon}
                    id={i}
                    pokemonAtTeamPosition={poke}
                    setNewTeam={setNewTeam}
                    setDisplayPokemonInventory={setDisplayPokemonInventory}
                  />
                ) : poke.added ? (
                  <>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        className="btn h-min w-full border border-base-300 shadow-sm p-3"
                        type="button"
                        onClick={() => addNewPokemonAtTeamPosition(i)}
                      >
                        <figure>
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.num}.png`}
                            alt={poke.name}
                          />
                        </figure>
                        <div>{poke.name}</div>
                      </button>
                      <div className="gap-3 flex flex-col">
                        {/* sends current ID to be used as pokemonTeamPosition */}
                        {moveDropDown(i)}
                      </div>
                    </div>
                  </>
                ) : (
                  <button
                    onClick={() => addNewPokemonAtTeamPosition(i)}
                    type="button"
                    className="btn btn-lg btn-accent w-20 place-self-center"
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
