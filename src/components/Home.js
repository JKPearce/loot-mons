import React, { useState } from "react";
import { PRICE } from "../helpers/global";
import PokeCard from "./PokeCard";
// import { add, formatDistanceToNowStrict, parseJSON, isPast } from "date-fns";
import { usePokedex } from "../contexts/PokedexContext";
import { useInventory } from "../contexts/InventoryContext";

const Home = () => {
  const { pokedex } = usePokedex();
  const {
    credits,
    addPokemon,
    newItem,
    resetNewItem,
    addMove,
    addAbility,
    removeCredits,
    loadingCredits,
  } = useInventory();
  const [creditError, setCreditError] = useState(false);
  // const [timeLeft, setTimeLeft] = useState(null);
  // const [buttonDisabled, setButtonDisabled] = useState(true);

  // useEffect(() => {
  //   const timer = setInterval(() => {
  //     if (localStorage.getItem("timeAvailable")) {
  //       const timeAvailable = parseJSON(localStorage.getItem("timeAvailable"));
  //       const distance = formatDistanceToNowStrict(timeAvailable, {
  //         unit: "minute",
  //       });

  //       if (isPast(timeAvailable)) {
  //         localStorage.removeItem("timeAvailable");
  //         setButtonDisabled(false);
  //         setTimeLeft(null);
  //       } else {
  //         setTimeLeft(distance);
  //       }
  //     } else {
  //       //button is set to disabled initially, this is enables the button after it checks if theres a date
  //       setButtonDisabled(false);
  //     }
  //   }, 1000);

  //   return () => clearTimeout(timer);
  // });

  function openSingleBox(boxType) {
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

  function randomNumber(number) {
    return Math.floor(Math.random() * number);
  }

  return (
    <div className="relative flex flex-col place-items-center p-5">
      <h1 className="p-4 text-center text-5xl font-bold ">Loot-Mons</h1>

      <div className="h-60 w-40 ">
        {newItem ? (
          newItem[0] === "pokemon" ? (
            <PokeCard pokemon={newItem[1]} newPokemon={true} />
          ) : (
            <div>
              <b>{newItem[1].name}</b> has been added to your inventory!
            </div>
          )
        ) : null}
        {creditError && (
          <div className="alert alert-error shadow-lg">
            <div>
              <span>Not enough LootCreds!</span>
            </div>
          </div>
        )}
      </div>
      {loadingCredits ? (
        "Loading..."
      ) : (
        <div className="flex gap-4 flex-col">
          <button
            className="btn btn-md"
            onClick={() => openSingleBox("pokemon")}
          >
            Open Pokemon Box ({PRICE.pokemon} LootCreds)
          </button>
          <button className="btn btn-md" onClick={() => openSingleBox("moves")}>
            Open Move Box ({PRICE.moves} LootCreds)
          </button>
          <button
            className="btn btn-md"
            onClick={() => openSingleBox("abilities")}
          >
            Open Ability Box ({PRICE.abilities} LootCreds)
          </button>
          {/* <button
          disabled={buttonDisabled}
          className="btn btn-md"
          onClick={addCredits}
        >
          {timeLeft === "now" || timeLeft === null
            ? `Get ${FREQUENT_CREDIT_AMOUNT} LootCreds`
            : `More LootCreds ${timeLeft}`}
        </button> */}
        </div>
      )}
      <div className="absolute top-2 right-10">
        LootCreds: {loadingCredits ? "Loading..." : credits}
      </div>
    </div>
  );
};

export default Home;
