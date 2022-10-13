/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { BsMoonFill, BsSunFill } from "react-icons/bs";
import { Link, useNavigate } from "react-router-dom";
import { themeChange } from "theme-change";
import { useAuth } from "../contexts/AuthContext";

const Nav = () => {
  const navigate = useNavigate();
  const [themeIcon, setThemeIcon] = useState("🌙");
  const [notification, setNotification] = useState();
  const { currentUser, logout } = useAuth();

  function handleLogout() {
    logout()
      .then(() => {
        setNotification("Successfully logged out");
        navigate("/login");
      })
      .catch((error) => {
        setNotification(error.message);
      });
  }

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  useEffect(() => {
    //remove the logout notification / error after 3 sec
    if (notification) {
      const timer = setTimeout(() => {
        setNotification("");
      }, 2000);
      return () => clearTimeout(timer); //cleanup timer
    }
  }, [notification]);

  return (
    <>
      <div className="navbar bg-neutral text-neutral-content">
        <div className="navbar-start">
          <div className="dropdown">
            <label tabIndex={0} className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-neutral text-neutral-content rounded-box w-52"
            >
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/inventory">Inventory</Link>
              </li>
              <li>
                <Link to="/teams">Teams</Link>
              </li>
              <li>
                <Link to="/submit-replay">Submit Replay</Link>
              </li>
            </ul>
          </div>
          <Link to="/">
            <button className="btn btn-ghost normal-case text-xl">
              Loot-Mons
            </button>
          </Link>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal p-0">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/inventory">Inventory</Link>
            </li>
            <li>
              <Link to="/teams">Teams</Link>
            </li>
            <li>
              <Link to="/submit-replay">Submit Replay</Link>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          {currentUser ? (
            <div className="dropdown dropdown-end dropdown-content flex flex-row">
              <div className="flex btn btn-ghost gap-3">
                <button className=" normal-case">
                  {currentUser.displayName ? currentUser.displayName : ""}
                </button>
                <label tabIndex={0} className=" avatar">
                  <div className="w-10 rounded-full">
                    <img src="https://placeimg.com/80/80/people" />
                  </div>
                </label>
              </div>
              <ul
                tabIndex={0}
                className="menu menu-compact dropdown-content mt-14 p-2 shadow bg-neutral text-neutral-content rounded-box w-52"
              >
                <li>
                  <Link to="/profile">Profile</Link>
                </li>
                <li>
                  <Link to="/change-password">Change Password</Link>
                </li>
                <li>
                  <button className="btn btn-error" onClick={handleLogout}>
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          ) : (
            <div className="btn-group">
              <Link to="/login" className="btn btn-active">
                Log In
              </Link>
              <Link to="/signup" className="btn">
                Sign Up
              </Link>
            </div>
          )}

          <button
            onClick={(e) =>
              e.currentTarget.classList.contains("ACTIVECLASS")
                ? setThemeIcon(<BsSunFill />)
                : setThemeIcon(<BsMoonFill />)
            }
            data-toggle-theme="winter,night"
            data-act-class="ACTIVECLASS"
          >
            {themeIcon}
          </button>
        </div>
      </div>
      {notification && (
        <div className="toast toast-top toast-end top-20">
          <div className="alert alert-warning">
            <div>
              <span>{notification}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
