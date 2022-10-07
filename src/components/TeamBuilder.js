import React, { useState, useEffect } from "react";
import AddTeam from "./AddTeam";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";
import { BsClipboardCheck } from "react-icons/bs";

const TeamBuilder = ({ inventory }) => {
  const [teamList, setTeamList] = useState([]);
  const [active, setActive] = useState(false);
  const [copyText, setCopyText] = useState("Copy");

  useEffect(() => {
    //load user created teams into state
  }, []);

  function exportTeam(team) {
    //export team to text format able to be used in pokemonshowdown import
    //Export should mimic this format
    //Bulbasaur @ Choice Band
    // Ability: Aerilate
    // EVs: 84 HP / 176 Atk / 196 Def / 52 SpA
    // - Brick Break
    // - Drill Run
    // - Facade
    // - Ice Fang

    let text = "";
    team.forEach((pokemon) => {
      if (!pokemon.name) return;
      text += `${pokemon.name}\n`;
      pokemon.moves.forEach((move) => {
        if (!move) {
          text += `- \n`;
          return;
        }
        text += `- ${move}\n`;
      });
      text += `\n`;
    });

    navigator.clipboard.writeText(text);
    setCopyText("Copied");
    setTimeout(() => {
      setCopyText("Copy");
    }, 2000);
    console.log(text);
  }

  return (
    <div className="">
      <div>
        <h1 className="p-4 text-center text-5xl font-bold">Teams</h1>
        {teamList.map((team, i) => {
          return (
            <div
              key={uniqid()}
              className="grid grid-cols-1 sm:grid-cols-3 gap-y-5"
            >
              <div className=" py-5 col-span-1 sm:col-span-3 flex items-center justify-center ">
                <h3 className="text-center text-2xl">Team {i}</h3>
                <div className="tooltip" data-tip={copyText}>
                  <button
                    onClick={() => exportTeam(team)}
                    type="button"
                    className="btn btn-block btn-ghost"
                  >
                    <BsClipboardCheck />
                  </button>
                </div>
              </div>
              {team.map((pokemon) => {
                return (
                  pokemon.added && (
                    <div className="p-5">
                      <PokeCard pokemon={pokemon} />
                      {pokemon.moves &&
                        pokemon.moves.map((move) => (
                          <div className="mt-4">
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
