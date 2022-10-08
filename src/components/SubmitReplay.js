import React, { useState } from "react";

const SubmitReplay = () => {
  const [replayLink, setReplayLink] = useState("");
  const [replayData, setReplayData] = useState({});
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    //validate data here to make sure its a pokemonshowdown replay link
    setReplayData({});
    setLoading(true);
    fetch(`${replayLink}.json`)
      .then((response) => response.json())
      .then((data) => {
        setReplayData(data);
        setLoading(false);
      });
  }

  function testButton() {
    const replayLog = replayData.log;
    //uses positive lookahead to find "player|p1|" or p2| and saves the next word
    const playerNameRegex = /(?<=(player\|p+[0-9]+\|))(\w+)/gi;
    const playerNames = replayLog.match(playerNameRegex);
    const p1 = playerNames[0];
    const p2 = playerNames[1];
    console.log("player1: ", p1, " player2: ", p2);

    //cross reference player name with p1 or p2 to determine team list
    //then compare team list to all of teams on user profile
    //and if they match then grant user credits for win or loss
    const teamRegex = /(?<=(poke\|p1+\|))(\w+)/gi;
    const team = replayLog.match(teamRegex);
    console.log("Team", team);

    const winnerRegex = /(?<=win\|)(\w+)/gi;
    const winner = replayLog.match(winnerRegex);
    console.log("winner: ", winner[0]);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={replayLink}
          onChange={(e) => setReplayLink(e.target.value)}
          placeholder="Replay Link e.g. https://replay.pokemonshowdown.com/sports-gen8nationaldexdraft-667088"
          className="input input-bordered w-full max-w-xs"
        />
        <button className="btn" type="submit">
          Submit
        </button>
      </form>
      <button className="btn" onClick={testButton}>
        test
      </button>
      {loading && <progress className="progress w-56"></progress>}
      {replayData.log && <>{replayData.log}</>}
    </div>
  );
};

export default SubmitReplay;
