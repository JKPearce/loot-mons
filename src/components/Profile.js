import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

//this page will display user profile details so they can edit their showdown name / change password
//it will also be the place a user comes to look at lootmon stats like,
//total pokemon in inv, total wins, highest amount of credits owned, total credits acquired, total credits spent
export default function Profile() {
  const [editing, setEditing] = useState(false);
  const { currentUser, updateEmail } = useAuth();
  const emailRef = useRef(currentUser.email);
  const usernameRef = useRef(currentUser.displayName);
  const passwordRef = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState();

  function handleSave() {
    console.log("current ref value = ", usernameRef.current);
    const promises = [];
    setLoading(true);
    setError("");

    //check if they changed any inputs and update if true
    if (usernameRef.current.value !== currentUser.displayName) {
      promises.push(
        currentUser.updateProfile({
          displayName: usernameRef.current.value,
          email: emailRef.current.value,
        })
      );
    }

    if (emailRef.current.value !== currentUser.email) {
      //TODO ADD REAUTHENTICATION
      //https://stackoverflow.com/questions/37811684/how-to-create-credential-object-needed-by-firebase-web-user-reauthenticatewith
      //https://firebase.google.com/docs/reference/js/v8/firebase.User#reauthenticatewithcredential
      promises.push(updateEmail(emailRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        console.log("Saved");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
        setMessage("Successfully updated profile");
        setError("");
        setEditing(!editing);
      });
  }

  useEffect(() => {
    //remove the logout notification / error after 5 sec
    if (message) {
      const timer = setTimeout(() => {
        setMessage("");
      }, 5000);
      return () => clearTimeout(timer); //cleanup timer
    }
  }, [message]);

  return (
    <>
      <h1 className="p-4 text-center text-5xl font-bold ">Profile</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 w-full p-5 gap-2 ">
        <form className="flex flex-col w-full p-5 card card-bordered bg-base-100 shadow-xl">
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
          {loading ? (
            <progress className="progress w-full"></progress>
          ) : editing ? (
            <div className="flex justify-between ">
              <button
                type="submit"
                className="btn btn-primary"
                onClick={handleSave}
              >
                Save
              </button>
              <div className="indicator">
                <span className="indicator-item badge badge-error badge-sm">
                  *
                </span>
                <input
                  type="password"
                  placeholder="Confirm Password"
                  required
                  className="input input-bordered"
                  ref={passwordRef}
                />
              </div>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => setEditing(!editing)}
            >
              Edit profile
            </button>
          )}
        </form>
      </div>
    </>
  );
}
