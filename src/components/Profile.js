import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

//this page will display user profile details so they can edit their showdown name / change password
//it will also be the place a user comes to look at lootmon stats like,
//total pokemon in inv, total wins, highest amount of credits owned, total credits acquired, total credits spent
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const [disable, setDisable] = useState(true);
  const { currentUser } = useAuth();

  return (
    <div className="relative flex flex-col place-items-center p-5">
      <h1 className="p-4 text-center text-5xl font-bold ">Profile</h1>
      <div className="grid grid-cols-2">
        <div>Email</div>
        <div>{currentUser.email}</div>
        <div>Username</div>
        <div>{currentUser.displayName}</div>
      </div>
    </div>
  );
}
