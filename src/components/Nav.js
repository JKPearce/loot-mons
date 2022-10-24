/* eslint-disable jsx-a11y/anchor-is-valid */
import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Link, redirect } from "react-router-dom";
import { themeChange } from "theme-change";
import { useAuth } from "../contexts/AuthContext";
import { db } from "../firebase";

const Nav = () => {
  const [logoutNotification, setLogoutNotification] = useState();
  const [notificationList, setNotificationList] = useState([]);
  const { currentUser, logout } = useAuth();
  const themes = [
    "light",
    "dark",
    "cupcake",
    "bumblebee",
    "emerald",
    "corporate",
    "synthwave",
    "retro",
    "cyberpunk",
    "valentine",
    "halloween",
    "garden",
    "forest",
    "aqua",
    "lofi",
    "pastel",
    "fantasy",
    "wireframe",
    "black",
    "luxury",
    "dracula",
    "cmyk",
    "autumn",
    "business",
    "acid",
    "lemonade",
    "night",
    "coffee",
    "winter",
  ];

  function handleLogout() {
    logout()
      .then(() => {
        setLogoutNotification("Successfully logged out");
      })
      .catch((error) => {
        setLogoutNotification(error.message);
      })
      .finally(() => {
        window.location.reload();
        redirect("/login");
      });
  }

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
    if (currentUser) {
      const q = query(
        collection(db, `users/${currentUser.uid}/notifications`),
        where("read", "==", false)
      );
      const unsubscribe = onSnapshot(q, (snapshot) => {
        let notificationArray = [];
        snapshot.docs.forEach((doc) => {
          notificationArray.push({ ...doc.data() });
        });
        setNotificationList(notificationArray);
        console.log(notificationArray);
      });

      return () => {
        unsubscribe();
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    //remove the logout notification / error after 3 sec
    if (logoutNotification) {
      const timer = setTimeout(() => {
        setLogoutNotification("");
      }, 2000);
      return () => clearTimeout(timer); //cleanup timer
    }
  }, [logoutNotification]);

  function handleBlur(e) {
    console.log(e);
    if (notificationList.length < 0) return;
    notificationList.forEach((notification) => {
      updateDoc(
        doc(db, `users/${currentUser.uid}/notifications/${notification.id}`),
        {
          read: true,
        }
      );
    });
  }

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
            <>
              <button
                onBlur={handleBlur}
                className="btn btn-ghost btn-circle dropdown dropdown-end dropdown-content "
              >
                <div className="indicator">
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
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                    />
                  </svg>
                  {notificationList.length > 0 ? (
                    <>
                      <span className="badge badge-xs badge-primary indicator-item">
                        {notificationList.length}
                      </span>
                      <ul className="dropdown-content mt-10 p-2 shadow bg-neutral text-neutral-content rounded-box w-52 gap-2 normal-case">
                        {notificationList.map((notification) => {
                          return (
                            <li key={notification.id}>
                              <div>{notification.message}</div>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  ) : (
                    <p className="dropdown-content mt-10 p-2 shadow bg-neutral text-neutral-content rounded-box w-52 gap-2 normal-case">
                      No notifications
                    </p>
                  )}
                </div>
              </button>
              <div className="dropdown dropdown-end dropdown-content flex flex-row">
                <div className="flex btn btn-ghost gap-3">
                  <button className=" normal-case">
                    {currentUser.displayName ? currentUser.displayName : ""}
                  </button>
                </div>
                <ul
                  tabIndex={0}
                  className="menu menu-compact dropdown-content mt-14 p-2 shadow bg-neutral text-neutral-content rounded-box w-52 gap-2"
                >
                  <li>
                    <Link to="/profile">Profile</Link>
                  </li>
                  <li>
                    <Link to="/change-password">Change Password</Link>
                  </li>
                  <li>
                    <select data-choose-theme className="select select-primary">
                      {themes.map((theme) => {
                        return (
                          <option value={theme} key={theme}>
                            {theme}
                          </option>
                        );
                      })}
                    </select>
                  </li>
                  <li>
                    <button className="btn btn-error" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            </>
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
        </div>
      </div>
      {logoutNotification && (
        <div className="toast toast-top toast-end top-20">
          <div className="alert alert-warning">
            <div>
              <span>{logoutNotification}</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Nav;
