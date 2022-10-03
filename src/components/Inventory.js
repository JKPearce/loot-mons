import React from "react";
import PokeCard from "./PokeCard";

const Inventory = ({ inventory }) => {
  return (
    <div>
      <p>inventory</p>
      {inventory.pokemon.map((poke, i) => (
        <PokeCard pokemon={poke} />
      ))}
      <div className="move-inventory">
        <h3>Moves</h3>
        {inventory.moves.map((move, i) => (
          <p key={i}>{move.name}</p>
        ))}
      </div>
    </div>
  );
};

export default Inventory;
