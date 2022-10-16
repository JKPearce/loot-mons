import React, { useEffect, useRef, useState } from "react";
import DisplayPokemon from "./DisplayPokemon";
import uniqid from "uniqid";
import { useTeams } from "../contexts/TeamContext";
import { useInventory } from "../contexts/InventoryContext";
import { useNavigate } from "react-router-dom";
import { cloneDeep, isEmpty } from "lodash";

const AddTeam = () => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const { addTeam, teamList } = useTeams();
  const { moves, pokemon, abilities, pokemonLoading } = useInventory();
  const navigate = useNavigate();
  const [localPokemon, setLocalPokemon] = useState(cloneDeep(pokemon));
  const teamNameRef = useRef();
  const [loading, setLoading] = useState(false);

  const [pokemonTeamPosition, setPokemonTeamPosition] = useState(false);
  const [displayPokemonInventory, setDisplayPokemonInventory] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    addTeam(newTeam, teamNameRef.current.value)
      .then(() => {
        console.log("Adding team: ", newTeam);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
        navigate("/teams");
      });
  }

  function handleMoveSelected(e, moveNumber, teamPosition) {
    setNewTeam((prevState) => {
      const newTeamArray = [...prevState];
      newTeamArray[teamPosition].moves[moveNumber - 1] = e.target.value;
      return newTeamArray;
    });
  }

  function handleAbilitySelect(e, teamPosition) {
    setNewTeam((prevState) => {
      const newTeamArray = [...prevState];
      newTeamArray[teamPosition].ability = e.target.value;
      return newTeamArray;
    });
  }

  //move 1 - 4 dropdown box with the moves still selected
  const createMoveDropDown = (pokemonTeamPosition) => {
    let moveListElements = [];
    for (let i = 1; i < 5; i++) {
      moveListElements.push(
        <div key={uniqid()} className={`row-start-${i} col-start-2`}>
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
              return (
                <option
                  key={uniqid()}
                  value={move.name}
                  disabled={remaining(move, "moves") <= 0 ? true : false}
                >
                  {`${move.name} (${remaining(move, "moves")})`}
                </option>
              );
            })}
          </select>
        </div>
      );
    }
    return moveListElements;
  };

  function remaining(item, keyName) {
    //takes in an item and counts how many is in current team and output amount
    //get count of item and loop thru newTeamList for the items and remove 1 for each count of item return that value
    let result = item.count;

    newTeam.forEach((teamMember) => {
      if (isEmpty(teamMember)) return;
      if (keyName === "moves") {
        if (teamMember[keyName].includes(item.name)) {
          result--;
        }
      } else if (keyName === "ability") {
        if (item.name === teamMember.ability) {
          result--;
        }
      }
    });
    return result;
  }

  function addNewPokemonAtTeamPosition(i) {
    setPokemonTeamPosition(i);
    setDisplayPokemonInventory(true);
  }

  useEffect(() => {
    // cloning the pokemon inv state to remove the count from a
    // different array other than the main pokemon array state
    // this means that the player dosnt need to refresh the page to fix their inv
    setLocalPokemon(cloneDeep(pokemon));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pokemon]);

  return (
    <div className="">
      {pokemonLoading ? (
        <div className="p-10 flex place-content-center min-h-screen w-full">
          <progress className="progress w-full"></progress>
        </div>
      ) : (
        <form className="relative min-h-screen" onSubmit={handleSubmit}>
          <div className=" gap-3 flex flex-col p-5">
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
            <div className="grid place-items-center grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-3 place-content-center">
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
                    <div key={uniqid()} className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col justify-between col-start-1 row-span-3">
                        <button
                          className="btn h-full w-full border border-base-300 shadow-sm p-5"
                          type="button"
                          onClick={() => addNewPokemonAtTeamPosition(i)}
                        >
                          <figure className="h-full">
                            <img
                              src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.num}.png`}
                              alt={poke.name}
                            />
                          </figure>
                          <div className="break-words">{poke.name}</div>
                        </button>
                      </div>
                      <div>
                        <select
                          key={uniqid()}
                          onChange={(e) => handleAbilitySelect(e, i)}
                          defaultValue={
                            //if ability is selected keep it otherwise say "ability"
                            newTeam[i].ability ? newTeam[i].ability : "Ability"
                          }
                          className="select select-bordered w-full max-w-xs"
                        >
                          <option disabled>Ability</option>
                          {abilities.map((ability) => {
                            return (
                              <option
                                key={uniqid()}
                                disabled={
                                  remaining(ability, "ability") <= 0
                                    ? true
                                    : false
                                }
                                value={ability.name}
                              >{`${ability.name}  (${remaining(
                                ability,
                                "ability"
                              )})`}</option>
                            );
                          })}
                        </select>
                      </div>
                      {/* sends current ID to be used as pokemonTeamPosition */}
                      {createMoveDropDown(i)}
                    </div>
                  ) : (
                    <button
                      key={uniqid()}
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
          </div>
          <div className="w-full sticky sm:flex bottom-0 flex gap-3 place-content-center bg-neutral p-2 sm:bg-none">
            <button
              className="btn btn-error"
              onClick={() => navigate("/teams")}
              type="button"
            >
              Cancel
            </button>
            <button
              disabled={loading}
              className="btn btn-success btn-md"
              type={"submit"}
            >
              {loading ? `Loading...` : `Save`}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AddTeam;
