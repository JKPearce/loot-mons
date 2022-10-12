import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext";
import { collection, getDocs } from "firebase/firestore";

const InventoryContext = React.createContext();

export function useInventory() {
  return useContext(InventoryContext);
}

export function InventoryProvider({ children }) {
  const { currentUser } = useAuth();

  const [inventory, setInventory] = useState({});

  useEffect(() => {
    if (currentUser) {
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
  };
  return (
    <InventoryContext.Provider value={value}>
      {children}
    </InventoryContext.Provider>
  );
}
