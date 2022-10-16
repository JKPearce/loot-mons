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
  const [teamsLoading, setTeamsLoading] = useState(true);

  const [teamList, setTeamList] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const unsubscribe = onSnapshot(
        collection(db, `users/${currentUser.uid}/teams`),
        (snapshot) => {
          const teamListArray = [];
          snapshot.docs.forEach((team) => {
            teamListArray.push({ ...team.data() });
          });
          setTeamList(teamListArray);
          setTeamsLoading(false);
        }
      );

      return () => unsubscribe();
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
    teamsLoading,
  };
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
