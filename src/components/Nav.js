import React, { useEffect, useState } from "react";
import { themeChange } from "theme-change";

const Nav = () => {
  const [themeIcon, setThemeIcon] = useState("🌙");

  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <nav className="navbar bg-base-100">
      <div className="flex-1">
        <a className="btn btn-ghost normal-case text-xl">Loot Mons</a>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal p-0">
          <li>
            <a>Item 1</a>
          </li>
          <li tabIndex={0}>
            <a>
              Parent
              <svg
                className="fill-current"
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
              >
                <path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />
              </svg>
            </a>
            <ul className="p-2 bg-base-100">
              <li>
                <a>Submenu 1</a>
              </li>
              <li>
                <a>Submenu 2</a>
              </li>
            </ul>
          </li>
          <li>
            <a>Item 3</a>
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
    // <div>
    //   <p>Nav</p>

    //   <button
    //     className="btn"
    //     data-toggle-theme="winter,night"
    //     data-act-class="ACTIVECLASS"
    //   >
    //     Toggle Theme
    //   </button>
    // </div>
  );
};

export default Nav;
