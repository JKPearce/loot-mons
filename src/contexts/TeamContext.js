import React, { useContext, useEffect, useState } from "react";
import { db } from "../firebase.js";
import { useAuth } from "../contexts/AuthContext";
import {
  collection,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function addTeam(team, teamName) {
    return addDoc(collection(db, `users/${currentUser.uid}/teams`), {
      team_name: teamName,
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
