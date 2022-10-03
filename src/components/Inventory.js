import React from "react";

const Inventory = ({ inventory }) => {
  return (
    <div>
      <p>inventory</p>
      {inventory.pokemon.map((poke, i) => (
        <div key={i} className="pokemon">
          <img
            alt="pokemon"
            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.num}.png`}
          ></img>
          <p>{poke.name}</p>
        </div>
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
