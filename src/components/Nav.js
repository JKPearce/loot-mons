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
    <nav className="w-full navbar bg-base-300">
      <div className="flex-1">
        <Link to="/">
          <span className="btn btn-ghost normal-case text-xl">Loot Mons</span>
        </Link>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li>
            <Link to="/">
              <button className="btn btn-link btn-sm">Home</button>
            </Link>
          </li>
          <li>
            <Link to="/inventory">
              <button className="btn btn-link btn-sm">Inventory</button>
            </Link>
          </li>
          <li>
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
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Nav;
