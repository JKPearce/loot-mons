import React, { useState, useEffect } from "react";
import AddTeam from "./AddTeam";
import PokeCard from "./PokeCard";
import uniqid from "uniqid";

const TeamBuilder = ({ inventory }) => {
  const [teamList, setTeamList] = useState([]);
  const [active, setActive] = useState(false);

  useEffect(() => {
    //load user created teams into state
  }, []);

  return (
    <div className="container">
      <div>
        {console.log(teamList)}
        <h3>Teams</h3>

        {teamList.map((team, i) => {
          return (
            <div key={uniqid()}>
              {team.map((pokemon) => (
                <PokeCard key={uniqid()} pokemon={pokemon} />
              ))}
            </div>
          );
        })}

        {active ? (
          <AddTeam
            setTeamList={setTeamList}
            setActive={setActive}
            inventory={inventory}
          />
        ) : (
          <button className="btn" onClick={() => setActive(true)}>
            Add new Team
          </button>
        )}
      </div>
    </div>
  );
};

export default TeamBuilder;