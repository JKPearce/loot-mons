import { doc, updateDoc } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useInventory } from "../contexts/InventoryContext";
import { db } from "../firebase";

//this page will display user profile details so they can edit their showdown name / change password
//it will also be the place a user comes to look at lootmon stats like,
//total pokemon in inv, total wins, highest amount of credits owned, total credits acquired, total credits spent
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const { currentUser, updateEmail, reauthenticate, checkUsername } = useAuth();
  const {
    userProfile,
    loadingCredits,
    loadingPokemon,
    pokemon,
    moves,
    abilities,
  } = useInventory();
  const emailRef = useRef(currentUser.email);
  const usernameRef = useRef(currentUser.displayName);
  const passwordRef = useRef();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

  async function handleSave(e) {
    e.preventDefault();
    const promises = [];
    let usernameError = false;

    if (!passwordRef.current.value) {
      return setError("Please enter your password");
    }

    if (emailRef.current.value !== currentUser.email) {
      promises.push(
        reauthenticate(passwordRef.current.value).then(() => {
          updateEmail(emailRef.current.value);
        })
      );
    }

    setLoading(true);
    if (usernameRef.current.value !== currentUser.displayName) {
      await checkUsername(usernameRef.current.value).then((snap) => {
        if (snap.empty) {
          promises.push(
            currentUser.updateProfile({
              displayName: usernameRef.current.value,
            })
          );
          promises.push(
            updateDoc(doc(db, `users/${currentUser.uid}`), {
              username: usernameRef.current.value,
            })
          );
        } else {
          usernameError = true;
          setError("Username Already exists");
          setLoading(false);
        }
      });
    }

    if (!usernameError) {
      setError("");
      Promise.all(promises)
        .then(() => {
          setMessage("Successfully updated profile");
          console.log("Saved");
        })
        .catch((error) => {
          console.log(error);
          setError(error.message);
        })
        .finally(() => {
          setLoading(false);
          setEditing(!editing);
        });
    }
  }

  useEffect(() => {
    //remove the logout notification / error after 5 sec
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer); //cleanup timer
    }
  }, [message, error]);

  function getTotal(array) {
    let count = 0;
    array.forEach((item) => {
      count += item.count;
    });
    return count;
  }

  return (
    <>
      <h1 className="p-4 text-center text-5xl font-bold ">Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full p-5 gap-2 ">
        <form
          onSubmit={handleSave}
          className="flex flex-col w-full p-5 card card-bordered bg-base-100 shadow-xl"
        >
          <table className="border-separate table-auto">
            <tbody>
              <tr>
                <td>Email</td>
                <td>
                  <input
                    className={`input w-full ${
                      editing ? "input-bordered" : "input-disabled"
                    } ${error ? "input-error" : ""}`}
                    type="email"
                    ref={emailRef}
                    defaultValue={currentUser.email}
                    disabled={!editing}
                  ></input>
                </td>
              </tr>
              <tr>
                <td>Username</td>
                <td>
                  <input
                    className={`input w-full ${
                      editing ? "input-bordered" : "input-disabled"
                    } ${error ? "input-error" : ""}`}
                    type="text"
                    defaultValue={currentUser.displayName}
                    ref={usernameRef}
                    disabled={!editing}
                  ></input>
                </td>
              </tr>
              {editing ? (
                <tr>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm"
                      onClick={() => setEditing(false)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-success btn-sm">
                      Save
                    </button>
                  </td>

                  <td className="indicator  w-full">
                    <span className="indicator-item badge badge-error badge-sm">
                      *
                    </span>
                    <input
                      type="password"
                      placeholder="Confirm Password"
                      required
                      className={`input input-bordered  w-full ${
                        error ? "input-error" : ""
                      }`}
                      ref={passwordRef}
                    />
                  </td>
                </tr>
              ) : (
                <tr>
                  <button
                    className="btn btn-primary"
                    onClick={() => setEditing(!editing)}
                  >
                    Edit profile
                  </button>
                </tr>
              )}
            </tbody>
          </table>
          {error && (
            <div className="alert alert-error shadow-lg my-5">
              <div>
                <span>{error}</span>
              </div>
            </div>
          )}
          {message && (
            <div className="alert alert-success shadow-lg my-5">
              <div>
                <span>{message}</span>
              </div>
            </div>
          )}
          {loading && <progress className="progress w-full"></progress>}
        </form>
        <div className="flex flex-col w-full p-5 card card-bordered bg-base-100 shadow-xl">
          {!loadingCredits ? (
            <table>
              <tbody>
                <tr>
                  <td>Games Played</td>
                  <td>{userProfile.games_played}</td>
                </tr>
                <tr>
                  <td>Total Wins</td>
                  <td>{userProfile.wins}</td>
                </tr>
                <tr>
                  <td>Current LootCreds</td>
                  <td>{userProfile.credits}</td>
                </tr>
                <tr>
                  <td>Total LootCreds Gained</td>
                  <td>{userProfile.lifetime_credits}</td>
                </tr>
                <tr>
                  <td>Boxes Opened</td>
                  <td>{userProfile.boxes_opened}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <>
              <div className="btn btn-ghost loading">Loading Profile</div>
            </>
          )}
        </div>
        <div className="flex flex-col w-full p-5 card card-bordered bg-base-100 shadow-xl">
          {!loadingPokemon ? (
            <table>
              <tbody>
                <tr>
                  <td>Unique Pokemon</td>
                  <td>{pokemon.length}</td>
                </tr>
                <tr>
                  <td>Total Pokemon</td>
                  <td>{getTotal(pokemon)}</td>
                </tr>
                <tr>
                  <td>Unique Moves</td>
                  <td>{moves.length}</td>
                </tr>
                <tr>
                  <td>Total Moves</td>
                  <td>{getTotal(moves)}</td>
                </tr>
                <tr>
                  <td>Unique Abilities</td>
                  <td>{abilities.length}</td>
                </tr>
                <tr>
                  <td>Total Abilities</td>
                  <td>{getTotal(abilities)}</td>
                </tr>
              </tbody>
            </table>
          ) : (
            <>
              <div className="btn btn-ghost loading">Loading Inventory</div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
