import React, { useState, useEffect } from "react";
import {
  FREQUENT_CREDIT_AMOUNT,
  FREQUENT_CREDIT_INTERVAL,
  PRICE,
} from "../helpers/global";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";
import { add, intlFormatDistance, parseJSON } from "date-fns";

const Home = ({ pokedex, inventory, addToInventory }) => {
  const [newItem, setNewItem] = useState();
  const [creditError, setCreditError] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [buttonDisabled, setButtonDisabled] = useState(true);

  useEffect(() => {
    if (newItem) {
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newItem]);

  useEffect(() => {
    const timer = setInterval(() => {
      if (localStorage.getItem("timeAvailable")) {
        const timeAvailable = parseJSON(localStorage.getItem("timeAvailable"));
        const distance = intlFormatDistance(timeAvailable, new Date());

        //if the returned string format contains the word "ago" that means the user can claim their credits
        if (distance.includes("ago")) {
          localStorage.removeItem("timeAvailable");
          setButtonDisabled(false);
          setTimeLeft(null);
          console.log("Past");
        } else {
          setTimeLeft(distance);
        }
      } else {
        //button is set to disabled initially, this is enables the button after it checks if theres a date
        setButtonDisabled(false);
      }
    }, 1000);

    return () => clearTimeout(timer);
  });

  function openBox(boxType) {
    if (inventory.credits < PRICE[boxType]) {
      setNewItem(null);
      setCreditError(true);
      return;
    } else {
      setCreditError(false);
    }

    const num = randomNumber(pokedex[boxType].length);
    const newItem = pokedex[boxType][num];
    setNewItem([boxType, newItem]);

    addToInventory((prevState) => {
      const newArr = [...prevState[boxType]];
      newArr.push(newItem);

      return {
        ...prevState,
        [boxType]: newArr,
        credits: inventory.credits - PRICE[boxType],
      };
    });
  }

  function addCredits() {
    setButtonDisabled(true);

    localStorage.setItem(
      "timeAvailable",
      JSON.stringify(
        add(new Date(), {
          hours: FREQUENT_CREDIT_INTERVAL,
        })
      )
    );

    addToInventory((prevState) => {
      return { ...prevState, credits: inventory.credits + 1000 };
    });
    //this is just to run the useEffect function to update localstorage
    setNewItem(["credits", { name: "LootCreds!", id: uniqid() }]);
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
          <div className="text-error font-bold text-4xl">
            You do not have enough LootCreds!
          </div>
        )}
      </div>
      <div className="flex gap-4 flex-col">
        <button className="btn btn-md" onClick={() => openBox("pokemon")}>
          Open Pokemon Box ({PRICE.pokemon} LootCreds)
        </button>
        <button className="btn btn-md" onClick={() => openBox("moves")}>
          Open Move Box ({PRICE.moves} LootCreds)
        </button>
        <button className="btn btn-md" onClick={() => openBox("abilities")}>
          Open Ability Box ({PRICE.abilities} LootCreds)
        </button>
        <button
          disabled={buttonDisabled}
          className="btn btn-md"
          onClick={addCredits}
        >
          {timeLeft === "now" || timeLeft === null
            ? `Get ${FREQUENT_CREDIT_AMOUNT} LootCreds`
            : `More LootCreds ${timeLeft}`}
        </button>
        <button
          className="btn btn-sm btn-warning"
          onClick={() => {
            localStorage.clear();
            window.location.reload();
          }}
        >
          Delete Profile
        </button>
      </div>
      <div className="absolute top-2 right-10">
        LootCreds: {inventory.credits}
      </div>
    </div>
  );
};

export default Home;
