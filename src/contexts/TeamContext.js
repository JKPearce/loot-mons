import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
  setDoc,
  doc,
  increment,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

const TeamContext = React.createContext();

export function useTeams() {
  return useContext(TeamContext);
}

export function TeamsProvider({ children }) {
  const { currentUser } = useAuth();

  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    if (currentUser) {
      onSnapshot(
        collection(db, `users/${currentUser.uid}/teams`),
        (snapshot) => {
          const teamListArray = [];
          snapshot.docs.forEach((team) => {
            teamListArray.push({ ...team.data() });
          });

          setTeamList(teamListArray);
        }
      );
    }
  }, []);

  function addTeam(team) {
    return addDoc(collection(db, `users/${currentUser.uid}/teams`), {
      pokemon: team,
      created_at: serverTimestamp(),
    });
  }

  const value = {
    teamList,
    addTeam,
  };
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}

// useEffect(() => {
//     if (currentUser) {
//       const pokemonRef = collection(db, `inventory/${currentUser.uid}/pokemon`);
//       const movesRef = collection(db, `inventory/${currentUser.uid}/moves`);
//       const abilitiesRef = collection(
//         db,
//         `inventory/${currentUser.uid}/abilities`
//       );
//       const userRef = doc(db, `users/${currentUser.uid}`);

//       onSnapshot(pokemonRef, (snapshot) => {
//         const pokemonArray = [];

//         snapshot.docs.forEach((doc) => {
//           pokemonArray.push({ ...doc.data() });
//         });
//         setPokemon(pokemonArray);
//       });

//       onSnapshot(movesRef, (snapshot) => {
//         const moveArray = [];
//         snapshot.docs.forEach((doc) => {
//           moveArray.push({ ...doc.data() });
//         });
//         setMoves(moveArray);
//       });

//       onSnapshot(abilitiesRef, (snapshot) => {
//         const abilitiesArray = [];
//         snapshot.docs.forEach((doc) => {
//           abilitiesArray.push({ ...doc.data() });
//         });
//         setAbilities(abilitiesArray);
//       });

//       onSnapshot(userRef, (snapshot) => {
//         setCredits(snapshot.data().credits);
//         console.log("credit snapshot", snapshot.data().credits);
//       });
//     }

//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, []);

// const { currentUser } = useAuth();
// const [pokemon, setPokemon] = useState([]);
// const [moves, setMoves] = useState([]);
// const [abilities, setAbilities] = useState([]);
// const [credits, setCredits] = useState();
// const [newItem, setNewItem] = useState();

// function addPokemon(newPokemon) {
//   //set the newest item so it can be displayed
//   setNewItem(["pokemon", newPokemon]);

//   if (checkForDupe(newPokemon, pokemon)) {
//     console.log("update doc");
//     return updateDoc(
//       doc(db, `inventory/${currentUser.uid}/pokemon/${newPokemon.name}`),
//       {
//         count: increment(1),
//       }
//     );
//   } else {
//     return setDoc(
//       doc(db, `inventory/${currentUser.uid}/pokemon`, newPokemon.name),
//       {
//         ...newPokemon,
//         count: 1,
//       }
//     );
//   }
// }

// function addMove(newMove) {
//   setNewItem(["move", newMove]);

//   if (checkForDupe(newMove, moves)) {
//     return updateDoc(
//       doc(db, `inventory/${currentUser.uid}/moves/${newMove.name}`),
//       {
//         count: increment(1),
//       }
//     );
//   } else {
//     return setDoc(
//       doc(db, `inventory/${currentUser.uid}/moves`, newMove.name),
//       {
//         ...newMove,
//         count: 1,
//       }
//     );
//   }
// }

// function addAbility(newAbility) {
//   setNewItem(["ability", newAbility]);

//   if (checkForDupe(newAbility, abilities)) {
//     return updateDoc(
//       doc(db, `inventory/${currentUser.uid}/abilities/${newAbility.name}`),
//       {
//         count: increment(1),
//       }
//     );
//   } else {
//     return setDoc(
//       doc(db, `inventory/${currentUser.uid}/abilities`, newAbility.name),
//       {
//         ...newAbility,
//         count: 1,
//       }
//     );
//   }
// }

// function checkForDupe(newObject, currentObject) {
//   //check if the player already has that item in their inventory
//   const result = currentObject.some(
//     (current) => current.name === newObject.name
//   );
//   console.log("duplicate = ", result);
//   return result;
// }

// function resetNewItem() {
//   setNewItem(null);
// }

// function removeCredits(amount) {
//   updateDoc(doc(db, `users/${currentUser.uid}/`), {
//     credits: increment(-amount),
//     boxes_opened: increment(1),
//   });
// }
