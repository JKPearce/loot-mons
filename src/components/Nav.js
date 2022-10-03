import React, { useEffect } from "react";
import { themeChange } from "theme-change";

const Nav = () => {
  useEffect(() => {
    themeChange(false);
    // 👆 false parameter is required for react project
  }, []);

  return (
    <div>
      <p>Nav</p>
      <button data-toggle-theme="luxury,emerald" data-act-class="ACTIVECLASS">
        Toggle Theme
      </button>
    </div>
  );
};

export default Nav;
