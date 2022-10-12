import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext";
import {
  addDoc,
  collection,
  getDocs,
  setDoc,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";

const InventoryContext = React.createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const { currentUser } = useAuth();
  const [pokemonRef, setPokemonRef] = useState();
  const [movesRef, setMovesRef] = useState();
  const [abilitiesRef, setAbilitiesRef] = useState();

  const [inventory, setInventory] = useState({});

  function addPokemon(pokemon) {
    //TODO:if pokemon exists in inv then update count
    return setDoc(doc(db, `users/${currentUser.uid}/pokemon`, pokemon.name), {
      ...pokemon,
      count: 1,
    });
  }

  function addMove(move) {
    return addDoc(movesRef, move);
  }

  function addAbility(ability) {
    return addDoc(abilitiesRef, ability);
  }

  useEffect(() => {
    if (currentUser) {
      setPokemonRef(collection(db, `users/${currentUser.uid}/pokemon`));
      setMovesRef(collection(db, `users/${currentUser.uid}/moves`));
      setAbilitiesRef(collection(db, `users/${currentUser.uid}/abilities`));

      const colRef = collection(db, `users/${currentUser.uid}/inventory`);
      getDocs(colRef).then((snapshot) => {
        snapshot.docs.forEach((doc) => {
          setInventory((prevState) => {
            return { ...prevState, [doc.id]: [doc.data()] };
          });
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = {
    inventory,
    addPokemon,
    addMove,
    addAbility,
  };
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
