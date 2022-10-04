import React, { useState } from "react";
import AddPokemon from "./AddPokemon";
import PokeCard from "./PokeCard";

const AddTeam = ({ setTeamList, setActive, inventory }) => {
  const [newTeam, setNewTeam] = useState([{}, {}, {}, {}, {}, {}]);
  const [showAddPokemon, setShowAddPokemon] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    console.log("submitted", e);
    //TODO: get all the info from the form and save in state
    console.log(newTeam);
    setTeamList((prevState) => [...prevState, newTeam]);
    //remove this component
    setActive(false);
  }

  return (
    <>
      <div className="container">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-row gap-4">
            {newTeam.map((pokemon, i) => (
              <div className="" key={i}>
                {showAddPokemon === i ? (
                  <AddPokemon
                    id={i}
                    setNewTeam={setNewTeam}
                    inventory={inventory}
                  />
                ) : pokemon.name ? (
                  <button type="button" onClick={() => setShowAddPokemon(i)}>
                    <PokeCard pokemon={pokemon} />
                  </button>
                ) : (
                  <button
                    onClick={() => setShowAddPokemon(i)}
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
