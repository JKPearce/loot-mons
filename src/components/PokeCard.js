import React from "react";

const PokeCard = ({ pokemon }) => {
  return (
    <div
      key={pokemon}
      className="card card-compact w-40 bg-base-300 shadow-xl card-bordered"
    >
      <figure>
        <img
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemon.num}.png`}
          alt={pokemon.name}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{pokemon.name}!</h2>
        <p>{pokemon.name} has been added to your inventory!</p>
        {/* <div className="card-actions justify-end">
          <button className="btn btn-primary">Buy Now</button>
        </div> */}
      </div>
    </div>
  );
};

export default PokeCard;
