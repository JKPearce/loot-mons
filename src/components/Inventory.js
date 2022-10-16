import React from "react";
import PokeCard from "./PokeCard";
import { useInventory } from "../contexts/InventoryContext";

const Inventory = () => {
  const { pokemon, moves, abilities } = useInventory();
  return (
    <>
      <div className="grid grid-cols-2 p-5 gap-5">
        <div className="card card-bordered bg-base-100 shadow-lg  col-span-full">
          <h3 className="z-10 sticky top-0 p-2 bg-base-300 text-center text-lg font-bold">
            {`Pokemon Total:${pokemon.length}`}
          </h3>
          <div className="p-5 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 max-h-96 overflow-y-scroll">
            {pokemon.map((poke, i) => (
              <PokeCard key={i} pokemon={poke} />
            ))}
          </div>
        </div>
        <div className="max-h-80 w-auto card card-bordered bg-base-100 shadow-lg">
          <h3 className="sticky top-0 p-2 bg-base-300 text-center text-lg font-bold">
            {`Moves Total:${moves.length}`}
          </h3>
          <div className="overflow-y-scroll">
            <table className="table table-zebra w-full">
              <tbody>
                {moves.map((move, i) => (
                  <tr key={i}>
                    <td>{move.name}</td>
                    <td>{move.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="max-h-80 w-auto card card-bordered bg-base-100 shadow-lg">
          <h3 className="sticky top-0 p-2 bg-base-300 text-center text-lg font-bold">
            {`Abilities Total:${abilities.length}`}
          </h3>
          <div className="overflow-y-scroll">
            <table className="table table-zebra w-full">
              <tbody>
                {abilities.map((ability, i) => (
                  <tr key={i}>
                    <td>{ability.name}</td>
                    <td>{ability.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default Inventory;
