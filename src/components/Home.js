import React, { useState } from "react";
import { useInventory } from "../contexts/InventoryContext";
import { usePokedex } from "../contexts/PokedexContext";
import { PRICE } from "../helpers/global";
import PokeCard from "./PokeCard";

const Home = () => {
  const { pokedex } = usePokedex();
  const {
    userProfile,
    credits,
    addPokemon,
    newItem,
    resetNewItem,
    addMove,
    addAbility,
    removeCredits,
    loadingProfile,
    updateUserProfile,
  } = useInventory();
  const [creditError, setCreditError] = useState(false);
  const [bundle, setBundle] = useState();

  function openSingleBox(boxType) {
    //remove existing bundle display
    setBundle();

    if (credits < PRICE[boxType]) {
      resetNewItem();
      setCreditError(true);
      return;
    } else {
      setCreditError(false);
    }

    const num = randomNumber(pokedex[boxType].length);
    const newItem = pokedex[boxType][num];

    const creditCost = PRICE[boxType];
    removeCredits(creditCost);

    if (boxType === "pokemon") {
      addPokemon(newItem);
    }
    if (boxType === "moves") {
      addMove(newItem);
    }
    if (boxType === "abilities") {
      addAbility(newItem);
    }
  }

  function openTeamBundle() {
    const promises = [];
    const bundleItems = [];
    setBundle();
    //check if the user is a new user and check if they can afford discount and visa versa
    if (userProfile.new_user) {
      if (credits < PRICE.firstTimeDiscount) {
        resetNewItem();
        setCreditError(true);
        return;
      }
      //discounted teamBundle for first time users
      //remove new user flag and remove credits
      promises.push(updateUserProfile("new_user", false));
      promises.push(removeCredits(PRICE.firstTimeDiscount));
      //add all items to inventory
      for (let i = 0; i < 6; i++) {
        //add 6 pokemon to inv
        const newItem = pokedex.pokemon[randomNumber(pokedex.pokemon.length)];
        bundleItems.push(newItem);
        promises.push(addPokemon(newItem));
      }
      for (let i = 0; i < 6; i++) {
        //add 6 abilities to inv
        const newItem =
          pokedex.abilities[randomNumber(pokedex.abilities.length)];
        bundleItems.push(newItem);
        promises.push(addAbility(newItem));
      }
      for (let i = 0; i < 24; i++) {
        //add 24 moves to inv
        const newItem = pokedex.moves[randomNumber(pokedex.moves.length)];
        bundleItems.push(newItem);
        promises.push(addMove(newItem));
      }
    } else if (!userProfile.new_user) {
      if (credits < PRICE.teamBundle) {
        resetNewItem();
        setCreditError(true);
        return;
      }
      //default priced team bundle for repeat purchases
      promises.push(removeCredits(PRICE.teamBundle));
      //add all items to inventory
      for (let i = 0; i < 6; i++) {
        //add 6 pokemon to inv
        const newItem = pokedex.pokemon[randomNumber(pokedex.pokemon.length)];
        bundleItems.push(newItem);
        promises.push(addPokemon(newItem));
      }
      for (let i = 0; i < 6; i++) {
        //add 6 abilities to inv
        const newItem =
          pokedex.abilities[randomNumber(pokedex.abilities.length)];
        bundleItems.push(newItem);
        promises.push(addAbility(newItem));
      }
      for (let i = 0; i < 24; i++) {
        //add 24 moves to inv
        const newItem = pokedex.moves[randomNumber(pokedex.moves.length)];
        bundleItems.push(newItem);
        promises.push(addMove(newItem));
      }
    } else {
      setCreditError(false);
    }

    Promise.all(promises).then(resetNewItem()).then(setBundle(bundleItems));
  }

  function randomNumber(number) {
    return Math.floor(Math.random() * number);
  }

  return (
    <div className="relative flex flex-col place-items-center p-5">
      <h1 className="p-4 text-center text-5xl font-bold ">Loot-Mons</h1>

      <div className="h-auto min-h-[10rem] text-center mb-5">
        {newItem ? (
          newItem[0] === "pokemon" ? (
            <PokeCard pokemon={newItem[1]} newPokemon={true} />
          ) : (
            <div className="pt-16">
              <b>{newItem[1].name}</b> has been added to your inventory!
            </div>
          )
        ) : null}
        {bundle ? (
          <div className="grid grid-cols-3 gap-3  flex-col ">
            <h3 className="col-span-3">You open the Bundle and get</h3>
            {bundle.map((item, i) => (
              <div key={i}>
                <b>{item.name}</b>
              </div>
            ))}
          </div>
        ) : null}
        {creditError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Not enough LootCreds!</span>
            </div>
          </div>
        )}
      </div>
      {loadingProfile ? (
        "Loading..."
      ) : (
        <div className="flex gap-4 flex-col">
          <div className="indicator">
            {userProfile.new_user && (
              <span className="indicator-item badge badge-accent">
                New User Discount!
              </span>
            )}
            <button
              className="btn btn-md btn-primary"
              onClick={() => openTeamBundle()}
            >
              Open Team Bundle (
              {userProfile.new_user
                ? PRICE.firstTimeDiscount
                : PRICE.teamBundle}
              LootCreds)
            </button>
          </div>
          <button
            className="btn btn-md btn-accent"
            onClick={() => openSingleBox("pokemon")}
          >
            Open Pokemon Box ({PRICE.pokemon} LootCreds)
          </button>
          <button
            className="btn btn-md btn-info"
            onClick={() => openSingleBox("moves")}
          >
            Open Move Box ({PRICE.moves} LootCreds)
          </button>
          <button
            className="btn btn-md btn-warning"
            onClick={() => openSingleBox("abilities")}
          >
            Open Ability Box ({PRICE.abilities} LootCreds)
          </button>
        </div>
      )}
      <div className="absolute top-2 right-10">
        LootCreds: {loadingProfile ? "Loading..." : credits}
      </div>
    </div>
  );
};

export default Home;
