import React from "react";
import PokeCard from "./PokeCard";

const Inventory = ({ inventory }) => {
  return (
    <>
      <div className=" flex flex-wrap gap-4 flex-1 justify-center">
        {inventory.pokemon.map((poke, i) => (
          <PokeCard key={i} pokemon={poke} />
        ))}
      </div>
      <div className="move-inventory">
        <h3>Moves</h3>
        {inventory.moves.map((move, i) => (
          <p key={i}>{move.name}</p>
        ))}
      </div>
    </>
  );
};

export default Inventory;
