import React, { useState, useEffect } from "react";
import AddTeam from "./AddTeam";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

const TeamBuilder = ({ inventory }) => {
  const [teamList, setTeamList] = useState([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    //load user created teams into state
  }, []);

  function exportTeam(teamIndex) {
    console.log(teamList[teamIndex]);
    //export team to text format able to be used in pokemonshowdown import
  }

  return (
    <div className="">
      <div>
        {console.log(teamList)}
        <h1 className="text-center text-5xl font-bold">Teams</h1>

        {teamList.map((team, i) => {
          return (
            <div key={uniqid()} className="grid grid-cols-3 gap-y-5">
              <div className="col-span-3 flex items-center justify-center flex-col">
                <h3 className="text-center text-2xl py-5">Team {i}</h3>
                <button
                  onClick={() => exportTeam(i)}
                  type="button"
                  className="btn "
                >
                  Export
                </button>
              </div>
              {team.map((pokemon) => {
                return (
                  pokemon.added && (
                    <div>
                      <PokeCard pokemon={pokemon} />
                      {pokemon.moves &&
                        pokemon.moves.map((move) => (
                          <div>
                            <p>{move}</p>
                          </div>
                        ))}
                    </div>
                  )
                );
              })}
            </div>
          );
        })}

        {active ? (
          <AddTeam
            setTeamList={setTeamList}
            setActive={setActive}
            inventory={inventory}
          />
        ) : (
          <button className="btn" onClick={() => setActive(true)}>
            Add new Team
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;
