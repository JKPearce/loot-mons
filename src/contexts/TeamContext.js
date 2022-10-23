import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase.js";

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

  async function addTeam(team, teamName) {
    const doc = await addDoc(collection(db, `users/${currentUser.uid}/teams`), {
      team_name: teamName,
      pokemon: team,
      created_at: serverTimestamp(),
    });
    updateDoc(doc, {
      id: doc.id,
    });
  }

  function deleteTeam(team) {
    return deleteDoc(doc(db, `users/${currentUser.uid}/teams`, team.id));
  }

  function updateTeam(team, teamName, id) {
    return updateDoc(doc(db, `users/${currentUser.uid}/teams`, id), {
      team_name: teamName,
      pokemon: team,
      created_at: serverTimestamp(),
    });
  }

  const value = {
    teamList,
    addTeam,
    teamsLoading,
    deleteTeam,
    updateTeam,
  };
  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
}
