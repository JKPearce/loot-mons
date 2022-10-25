import * as _ from "lodash";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import uniqid from "uniqid";
import { useTeams } from "../contexts/TeamContext";

export default function Teams() {
  const { teamList, teamsLoading, deleteTeam } = useTeams();
  const [copyText, setCopyText] = useState("Copy");
  const [confirmDelete, setConfirmDelete] = useState(false);

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
    <div className="flex flex-col">
      {teamsLoading ? (
        <progress className="progress w-1/2 self-center my-40"></progress>
      ) : (
        <div className="flex flex-col place-content-center gap-5 p-5">
          {teamList.map((team, i) => {
            return (
              <div
                key={uniqid()}
                className="bg-base-100 h-auto self-center text-center border border-base-content border-opacity-50 rounded-sm shadow-lg"
              >
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
                    <Link
                      className="btn btn-ghost"
                      to="/add-team"
                      state={{ team: team }}
                    >
                      Edit
                    </Link>
                    {confirmDelete === i ? (
                      <>
                        <button
                          className="btn btn-error "
                          onClick={() => {
                            deleteTeam(team);
                            setConfirmDelete(false);
                          }}
                        >
                          YES
                        </button>
                        <button
                          className="btn btn-error "
                          onClick={() => setConfirmDelete(false)}
                        >
                          NO
                        </button>
                      </>
                    ) : (
                      <button
                        className="btn btn-error "
                        onClick={() => setConfirmDelete(i)}
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 p-2 gap-2">
                  {team.pokemon.map((pokemon, j) => {
                    return (
                      !_.isEmpty(pokemon) && (
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
                            <div key={uniqid()} className="">
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
                                      <tr key={uniqid()}>
                                        <td>{`Move ${k + 1}:`}</td>
                                        <td>{move ? move : "No move"}</td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          </ReactTooltip>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
      <Link className="btn btn-md self-center w-auto" to="/add-team">
        Add new Team
      </Link>
    </div>
  );
}
