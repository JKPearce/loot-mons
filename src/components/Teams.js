import React, { useState } from "react";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";
import { BsClipboardCheck } from "react-icons/bs";
import { useTeams } from "../contexts/TeamContext";
import { Link } from "react-router-dom";

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
      <h1 className="p-4 text-center text-5xl font-bold">Teams</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 text-center gap-5 p-5">
        {teamList &&
          teamList.map((team, i) => {
            return (
              <div key={uniqid()} className="card bg-base-100 shadow-lg border">
                <div className=" py-5 flex items-center justify-center bg-base-300 ">
                  <h3 className="text-center col-span-3 text-2xl">
                    TEAM NAME HERE
                  </h3>
                  <div className="tooltip" data-tip={copyText}>
                    <button
                      onClick={() => exportTeam(team.pokemon)}
                      type="button"
                      className="btn btn-block btn-ghost"
                    >
                      <BsClipboardCheck />
                    </button>
                  </div>
                </div>
                <div className="p-2 gap-2 bg-base-100 grid grid-cols-3">
                  {team.pokemon.map((pokemon) => {
                    return (
                      pokemon.added && (
                        <div className="card p-5">
                          <img
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`}
                            alt={pokemon.name}
                          />
                          <h3 className="">{pokemon.name}</h3>
                          <div>
                            {pokemon.moves &&
                              pokemon.moves.map((move) => (
                                <div key={uniqid()} className="mt-4">
                                  <p>{move}</p>
                                </div>
                              ))}
                          </div>
                        </div>
                      )
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>
      <Link to="/add-team">
        <button className="btn m-5">Add new Team</button>
      </Link>
    </div>
  );
}
