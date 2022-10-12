import React, { useState, useEffect } from "react";
import { CREDITS_PER_SCORE, WINNER_BONUS_CREDITS } from "../helpers/global";

const SubmitReplay = ({ inventory, addToInventory }) => {
  const [replayLink, setReplayLink] = useState("");
  const [replayData, setReplayData] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [player1, setPlayer1] = useState({});
  const [player2, setPlayer2] = useState({});
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [forfeited, setForfeited] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    //validate data here to make sure its a pokemonshowdown replay link
    setReplayData(null);
    setLoading(true);
    fetch(`${replayLink}.json`)
      .then((response) => response.json())
      .then((data) => {
        setReplayData(data);
        setLoading(false);
      })
      .catch((error) => setLoading(false));
  }

  useEffect(() => {
    if (replayData) {
      if (username === replayData.p1 || username === replayData.p2) {
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
        setNameError(false);
        //The calcReward was running before it would check for forfeit so added a 3 second "Loading" delay
        setLoading(true);
        const timer = setTimeout(() => {
          calcReward();
          setLoading(false);
        }, 3000);
        return () => clearInterval(timer);
      } else {
        setNameError(true);
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [replayData]);

  useEffect(() => {
    if (player1.totalReward > 0 || player2.totalReward > 0) {
      setShowBreakdown(true);
      if (player1.name === username) {
        addToInventory((prevState) => {
          return {
            ...prevState,
            credits: prevState.credits + player1.totalReward,
          };
        });
      }
      if (player2.name === username) {
        addToInventory((prevState) => {
          return {
            ...prevState,
            credits: prevState.credits + player2.totalReward,
          };
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player1.totalReward, player2.totalReward]);

  useEffect(() => {
    console.log("adding credits", inventory.credits);
    localStorage.setItem("inventory", JSON.stringify(inventory));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inventory.credits]);

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
          value={replayLink}
          onChange={(e) => setReplayLink(e.target.value)}
          placeholder="Replay Link e.g. https://replay.pokemonshowdown.com/sports-gen8nationaldexdraft-667088"
          className="input input-bordered w-full"
        />
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Showdown Username e.g. BionicSoup"
          className="input input-bordered w-full"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      <p>LootCreds: {inventory.credits}</p>
      {loading && <progress className="progress w-full"></progress>}
      {nameError && (
        <div className="font-bold text-4xl bg-error p-10">
          Username did not match any name in the replay file
        </div>
      )}
      {forfeited && !showBreakdown && (
        <p>Game was forfeited and no points were awarded</p>
      )}
      {showBreakdown && (
        <div className="card card-bordered bg-base-100 shadow-lg p-5 flex flex-col gap-5 content-center justify-center text-center">
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
