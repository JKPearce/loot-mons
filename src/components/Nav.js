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
              <Link to="/">
                <a>Home</a>
              </Link>
            </li>
            <li>
              <Link to="/inventory">
                <a>Inventory</a>
              </Link>
            </li>
            <li>
              <Link to="/team-builder">
                <a>Build a Team</a>
              </Link>
            </li>
          </ul>
        </div>
        <Link to="/">
          <a className="btn btn-ghost normal-case text-xl">Loot-Mons</a>
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/">
              <a>Home</a>
            </Link>
          </li>
          <li>
            <Link to="/inventory">
              <a>Inventory</a>
            </Link>
          </li>
          <li>
            <Link to="/team-builder">
              <a>Build a Team</a>
            </Link>
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
          data-toggle-theme="winter,dracula"
          data-act-class="ACTIVECLASS"
        >
          {themeIcon}
        </button>
      </div>
    </div>
    // <nav className="w-full navbar bg-base-300">
    //   <div className="flex-1">
    //     <Link to="/">
    //       <span className="btn btn-ghost normal-case text-xl">Loot Mons</span>
    //     </Link>
    //   </div>
    //   <div className="flex-none">
    //     <ul className="menu menu-horizontal p-0">
    // <li>
    //   <Link to="/">
    //     <button className="btn btn-link btn-sm">Home</button>
    //   </Link>
    // </li>
    // <li>
    //   <Link to="/inventory">
    //     <button className="btn btn-link btn-sm">Inventory</button>
    //   </Link>
    // </li>
    // <li>
    //         <button
    //           onClick={(e) =>
    //             e.currentTarget.classList.contains("ACTIVECLASS")
    //               ? setThemeIcon("☀️")
    //               : setThemeIcon("🌙")
    //           }
    //           data-toggle-theme="winter,night"
    //           data-act-class="ACTIVECLASS"
    //         >
    //           {themeIcon}
    //         </button>
    //       </li>
    //     </ul>
    //   </div>
    // </nav>
  );
};

export default Nav;
