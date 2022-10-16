import React, { useState } from "react";
import uniqid from "uniqid";
import { BsClipboardCheck } from "react-icons/bs";
import { useTeams } from "../contexts/TeamContext";
import { Link } from "react-router-dom";
import PokeCard from "./PokeCard";
import ReactTooltip from "react-tooltip";

export default function Teams() {
  const { teamList } = useTeams();
  const [copyText, setCopyText] = useState("Copy");

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
      text += `Ability: ${pokemon.ability}\n`;
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
  }

  return (
    <div className="">
      <div className="flex flex-col place-content-center gap-5 p-5">
        {teamList.map((team, i) => {
          return (
            <div className="bg-base-100 h-auto self-center text-center border border-base-content border-opacity-50 rounded-sm shadow-lg">
              <div className="w-full bg-base-300 text-3xl p-2 flex flex-col place-content-center">
                {team.team_name}
                <div>
                  <button
                    onClick={() => exportTeam(team.pokemon)}
                    type="button"
                    className="btn btn-ghost tooltip z-50"
                    data-tip={copyText}
                  >
                    Export
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 p-2 gap-2">
                {team.pokemon.map((pokemon, j) => {
                  return (
                    <div
                      className="p-5"
                      data-tip
                      data-for={`${i}${j}`}
                      key={uniqid()}
                    >
                      <figure className="btn btn-ghost h-full btn-active shadow-md">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`}
                          alt={pokemon.name}
                        />
                      </figure>
                      {/* id of ij means team x pokemon y so each id is different */}
                      <ReactTooltip id={`${i}${j}`}>
                        <div className="">
                          <div>
                            <h3 className="font-bold text-xl border-b-accent border-b">
                              {pokemon.name}
                            </h3>
                            {pokemon.ability && (
                              <p className="text-lg">{`Ability: ${pokemon.ability}`}</p>
                            )}
                          </div>
                          <table className=" table-compact">
                            <tbody>
                              {pokemon.moves.map((move, k) => {
                                return (
                                  move && (
                                    <tr key={uniqid()}>
                                      <td>{`Move ${k + 1}:`}</td>
                                      <td>{move}</td>
                                    </tr>
                                  )
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </ReactTooltip>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <Link className="btn btn-md self-center w-auto" to="/add-team">
          Add new Team
        </Link>
      </div>
    </div>
  );
}

{
  /* <h1 className="p-4 text-center text-5xl font-bold">Teams</h1>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 text-center gap-5 p-5">
  {teamList &&
    teamList.map((team, i) => {
      return (
        <div
          key={uniqid()}
          className="card bg-base-100 shadow-lg border grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
        >
          <div className=" py-5 flex items-center justify-center bg-base-300 col-span-1 sm:col-span-2 md:col-span-3">
            <h3 className="text-center text-2xl">{team.team_name}</h3>
            <div className="tooltip z-50" data-tip={copyText}>
              <button
                onClick={() => exportTeam(team.pokemon)}
                type="button"
                className="btn btn-block btn-ghost"
              >
                <BsClipboardCheck />
              </button>
            </div>
          </div>
          {team.pokemon.map((pokemon) => {
            return (
              pokemon.added && (
                <div
                  key={uniqid()}
                  className="p-5 grid grid-cols-2 gap-2"
                >
                  <div className="flex flex-col justify-between col-start-1 row-span-3 ">
                    <div>
                      <figure className="h-full">
                        <img
                          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`}
                          alt={pokemon.name}
                        />
                      </figure>
                      <div className="break-words">{pokemon.name}</div>
                    </div>
                  </div>
                  <div className="col-start-1 row-start-4">
                    <p>{pokemon.ability}</p>
                  </div>

                  {pokemon.moves &&
                    pokemon.moves.map((move, i) => (
                      <div
                        key={uniqid()}
                        className={`row-start-${i} col-start-2 border border-opacity-30 border-base-content rounded`}
                      >
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
</div> */
}
