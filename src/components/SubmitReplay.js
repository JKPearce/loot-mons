import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  increment,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";
import { CREDITS_PER_SCORE, WINNER_BONUS_CREDITS } from "../helpers/global";

const SubmitReplay = () => {
  const replayLink = useRef();
  const [replayData, setReplayData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [replayExists, setReplayExists] = useState(false);
  const [forfeited, setForfeited] = useState(false);
  const [replayList, setReplayList] = useState();
  const [replayListLoading, setReplayListLoading] = useState(true);
  const { currentUser } = useAuth();

  //on mount get all the submitted links and display them in a list
  useEffect(() => {
    setReplayListLoading(true);
    const unsubscribe = onSnapshot(collection(db, "replays"), (snapshot) => {
      const replayArray = [];
      snapshot.docs.forEach((doc) => {
        replayArray.push({ ...doc.data() });
      });
      setReplayList(replayArray);
      setReplayListLoading(false);
    });

    return () => unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    setReplayData(null);
    setReplayExists(false);
    setLoading(true);
    setShowBreakdown(false);

    //get the game ID and URL by removing .json or adding .json
    let url = "";
    let gameID = "";

    if (replayLink.current.value.endsWith(".json")) {
      url = replayLink.current.value;
      gameID = replayLink.current.value.slice(
        replayLink.current.value.lastIndexOf("/"),
        replayLink.current.value.indexOf(".json")
      );
    } else {
      url = `${replayLink.current.value}.json`;
      gameID = replayLink.current.value.slice(
        replayLink.current.value.lastIndexOf("/") + 1
      );
    }

    //check if replay link exists in DB
    getDoc(doc(db, "replays", gameID))
      .then((snap) => {
        if (snap.exists()) {
          setReplayExists(true);
        } else {
          fetch(`${url}`)
            .then((response) => response.json())
            .then((data) => {
              setReplayData(data);
            });
        }
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }

  //when the replayData gets loaded in from the fetch request calculate scores
  useEffect(() => {
    if (replayData) {
      setForfeited(() => {
        const regex = /forfeited/gi;
        const result = regex.test(replayData.log);
        return result;
      });
      setPlayer1({
        name: replayData.p1,
        score: getScore("p2"), //has to be opposite player
        winner: getWinner(replayData.p1),
        team: getTeam("p1"),
      });
      setPlayer2({
        name: replayData.p2,
        score: getScore("p1"), //has to be opposite player
        winner: getWinner(replayData.p2),
        team: getTeam("p2"),
      });

      //The calcReward was running before it would check for forfeit so added a 3 second "Loading" delay
      setLoading(true);
      const timer = setTimeout(() => {
        calcReward();
        setLoading(false);
      }, 3000);
      return () => clearInterval(timer);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayData]);

  //when the reward gets calculated, find the players accounts with the matching name in db
  //and award them the total reward
  useEffect(() => {
    if (player1.totalReward > 0 || player2.totalReward > 0) {
      setShowBreakdown(true);

      //save all replay details to database
      setDoc(doc(db, "replays", replayData.id), {
        ...replayData,
        submitted: serverTimestamp(),
        player1: player1,
        player2: player2,
        url: replayLink.current.value,
        submitted_by: currentUser.displayName,
      });

      //award credits to players on lootmons
      updatePlayerProfile(player1);
      updatePlayerProfile(player2);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1.totalReward, player2.totalReward]);

  //find the user profile with matching username and add credits and notification
  function updatePlayerProfile(p) {
    const playerQuery = query(
      collection(db, "users"),
      where("username", "==", `${p.name}`)
    );

    getDocs(playerQuery).then((snapshot) => {
      snapshot.forEach((playerDocument) => {
        updateDoc(doc(db, `users/${playerDocument.id}`), {
          credits: increment(p.totalReward),
          lifetime_credits: increment(p.totalReward),
          wins: p.winner ? increment(1) : increment(0),
          games_played: increment(1),
        });

        addDoc(collection(db, `users/${playerDocument.id}/notifications`), {
          message: `${currentUser.displayName} has submitted a replay and you have been awarded ${p.totalReward} LootCreds!`,
          read: false,
          time: serverTimestamp(),
          game_id: replayData.id,
          reward: p.totalReward,
        }).then((newDoc) => {
          //this adds the ID to the object also so i can target the notification and toggle read
          updateDoc(newDoc, {
            id: newDoc.id,
          });
        });
      });
    });
  }

  function calcReward() {
    setPlayer1((prevState) => {
      let total = 0;
      total += prevState.score * CREDITS_PER_SCORE;
      if (prevState.winner && !forfeited) {
        total += WINNER_BONUS_CREDITS;
      }
      return { ...prevState, totalReward: total };
    });
    setPlayer2((prevState) => {
      let total = 0;
      total += prevState.score * CREDITS_PER_SCORE;
      if (prevState.winner && !forfeited) {
        total += WINNER_BONUS_CREDITS;
      }
      return { ...prevState, totalReward: total };
    });
  }

  function getScore(player) {
    //score = opposite player faint count
    //double backslash to escape the | symbol
    const regex = `(faint+\\|${player}a:)(\\W)`;
    const score = replayData.log.match(new RegExp(regex, "gi"));

    if (!score) return 0;
    if (score.length > 0) {
      return score.length;
    } else {
      return 0;
    }
  }

  function getWinner(name) {
    //u000A is the escape code for the \n, without this the regex will not find winners name
    // eslint-disable-next-line no-control-regex
    const regex = /(?<=win\|)(.*?)(?=\u000A)/i;
    const winner = replayData.log.match(regex);

    if (winner[0] === name) {
      return true;
    } else {
      return false;
    }
  }

  function getTeam(player) {
    const regex = `(?<=(poke\\|${player}+\\|))(\\w+)`;
    const team = replayData.log.match(new RegExp(regex, "gi"));
    return team;
  }

  return (
    <div className="flex flex-col items-center content-center p-10 gap-5">
      <h1 className="p-4 text-center text-5xl font-bold ">Submit Replay</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-full">
        <input
          type="text"
          required
          pattern="(?:https?:\/\/)?(?:replay\.)?pokemonshowdown.com\/(.*)"
          title="Pokemon showdown replay link e.g: https://replay.pokemonshowdown.com/sports-gen8nationaldexdraft-667088"
          ref={replayLink}
          placeholder="Replay Link e.g. https://replay.pokemonshowdown.com/sports-gen8nationaldexdraft-667088"
          className="input input-bordered w-full"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      <div className="card card-bordered bg-base-100 text-base-content shadow-lg p-5 w-full max-h-80 overflow-y-auto">
        {replayListLoading ? (
          ("Replay List loading",
          (<progress className="progress w-full"></progress>))
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-compact w-full">
              <thead>
                <tr className="sticky top-0">
                  <th> </th>
                  <th>Link</th>
                  <th>Winner</th>
                  <th>Player 1</th>
                  <th>Player 1 Total Reward</th>
                  <th>Player 2</th>
                  <th>Player 2 Total Reward</th>
                  <th>Submitted on</th>
                  <th>Submitted by</th>
                </tr>
              </thead>
              <tbody>
                {replayList &&
                  replayList.map((replay, i) => {
                    return (
                      <tr key={replay.id}>
                        <td className="font-bold">{i}</td>
                        <td>
                          <a className="link" href={replay.url}>
                            {replay.id}
                          </a>
                        </td>
                        <td>
                          {replay.player1.winner
                            ? replay.player1.name
                            : replay.player2.name}
                        </td>
                        <td>{replay.player1.name}</td>
                        <td>{replay.player1.totalReward}</td>
                        <td>{replay.player2.name}</td>
                        <td>{replay.player2.totalReward}</td>
                        <td>
                          {replay.submitted
                            ? replay.submitted.toDate().toDateString()
                            : "Loading time"}
                        </td>
                        <td>{replay.submitted_by}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {loading && <progress className="progress w-full"></progress>}
      {forfeited && !showBreakdown && (
        <p>Game was forfeited and no points were awarded</p>
      )}
      {replayExists && <p>This replay has already been submitted</p>}
      {showBreakdown && (
        <div className="card card-bordered bg-base-100 text-base-content shadow-lg p-5 flex flex-col gap-5 content-center justify-center text-center">
          <div className="">
            <p className="text-xl font-bold">How LootCreds are rewarded</p>
            <p>Credits per Pokemon Elimination: {CREDITS_PER_SCORE}</p>
            <p>Credits per win: {WINNER_BONUS_CREDITS}</p>
            <p>
              If a game is forfeit you still can get points per elimination but
              the win bonus is removed
            </p>
          </div>
          <div className="flex flex-wrap gap-10 place-content-center ">
            <div className="p-2 w-60">
              <p className="text-center text-xl font-bold">{player1.name}</p>
              <div>
                <p>Total eliminations: {player1.score}</p>
                <p>Elimination reward: {player1.score * CREDITS_PER_SCORE}</p>
                <p>{player1.winner ? `200 LootCreds for winning` : `Loser`}</p>
                <p>Total: {player1.totalReward} LootCreds!</p>
              </div>
            </div>
            <div className="p-2 w-60">
              <p className="text-center text-xl font-bold">{player2.name}</p>
              <div>
                <p>Total eliminations: {player2.score}</p>
                <p>Elimination reward: {player2.score * CREDITS_PER_SCORE}</p>
                <p>{player2.winner ? `200 LootCreds for winning` : `Loser`}</p>
                <p>Total: {player2.totalReward} LootCreds!</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmitReplay;
