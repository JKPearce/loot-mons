/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { themeChange } from "theme-change";

const Nav = () => {
  const [themeIcon, setThemeIcon] = useState("🌙");

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
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
              <Link to="/team-builder">Build a Team</Link>
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
            <Link to="/team-builder">Build a Team</Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <button
          onClick={(e) =>
            e.currentTarget.classList.contains("ACTIVECLASS")
              ? setThemeIcon("☀️")
              : setThemeIcon("🌙")
          }
          data-toggle-theme="winter,night"
          data-act-class="ACTIVECLASS"
        >
          {themeIcon}
        </button>
      </div>
    </div>
  );
};

export default Nav;
