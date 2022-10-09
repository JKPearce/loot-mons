import React, { useState, useEffect } from "react";
import { PRICE } from "../helpers/global";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

const Home = ({ pokedex, inventory, addToInventory }) => {
  const [newItem, setNewItem] = useState();
  const [creditError, setCreditError] = useState(false);

  useEffect(() => {
    if (newItem) {
      console.log(newItem);
      localStorage.setItem("inventory", JSON.stringify(inventory));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newItem]);

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
    addToInventory((prevState) => {
      return { ...prevState, credits: inventory.credits + 1000 };
    });
    //this is just to run the useEffect function to update localstorage
    setNewItem(["credits", { name: "LootCreds!", id: uniqid() }]);
  }

  function randomNumber(number) {
    return Math.floor(Math.random() * number);
  }

  function renderNewItem() {
    if (newItem) {
      if (newItem[0] === "pokemon") {
        return <PokeCard pokemon={newItem[1]} newPokemon={true} />;
      } else {
        return (
          <div>
            <b>{newItem[1].name}</b> has been added to your inventory!
          </div>
        );
      }
    } else {
      return null;
    }
  }

  return (
    <div className="relative flex flex-col place-items-center p-5">
      <h1 className="p-4 text-center text-5xl font-bold ">Loot-Mons</h1>
      <div className="h-60 w-40 ">
        {renderNewItem()}
        {/* {newItem ? (
          newItem[0] ?
          newItem[0] === "pokemon" ? (
            <PokeCard pokemon={newItem[1]} newPokemon={true} />
          ) : (
            <div>
              <b>{newItem[1].name}</b> has been added to your inventory!
            </div>
          ) :
        ) : null} */}
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
        <button className="btn btn-md" onClick={addCredits}>
          Get 1000 LootCreds
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
