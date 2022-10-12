import React from "react";
import PokeCard from "./PokeCard";

const Inventory = ({ inventory }) => {
  return (
    <>
      <div className="grid grid-cols-2 p-5 gap-5">
        <div className="card card-bordered bg-base-100 shadow-lg overflow-y-scroll col-span-full">
          <h3 className="z-10 sticky top-0 p-2 bg-primary-content text-center text-lg font-bold">
            Pokemon
          </h3>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-h-96">
            {inventory.pokemon.map((poke, i) => (
              <PokeCard key={i} pokemon={poke} />
            ))}
          </div>
        </div>
        <div className="h-80 w-48 card card-bordered bg-base-100 shadow-lg overflow-y-scroll h ">
          <h3 className="sticky top-0 p-2 bg-primary-content text-center text-lg font-bold">
            Moves
          </h3>
          <div className="flex flex-col p-2">
            {inventory.moves.map((move, i) => (
              <p
                className="p-5 border border-base-300 bg-base-100 rounded-2xl"
                key={i}
              >
                {move.name}
              </p>
            ))}
          </div>
        </div>
        <div className="h-80 w-48 card card-bordered bg-base-100 shadow-lg overflow-y-scroll ">
          <h3 className="sticky top-0 p-2 bg-primary-content text-center text-lg font-bold">
            Abilities
          </h3>
          <div className="flex flex-col p-2 ">
            {inventory.abilities.map((ability, i) => (
              <div
                className="p-5 border border-base-300 bg-base-100 rounded-2xl"
                key={i}
              >
                {ability.name}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
