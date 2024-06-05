export default ThemeSelector;
import Cookies from "js-cookie";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { THEMES } from "../store/frontendTypes";
import { changeTheme } from "../store/store";

function ThemeSelector() {
  const dispatch = useDispatch();
  const frontend = useSelector((state: any) => state.frontend);
  const theme = frontend.theme

  console.log("ThemeSelector", theme, frontend.theme);

  useEffect(() => {
    const currentDocumentTheme =
      document.documentElement.getAttribute("data-theme");

    if (currentDocumentTheme !== theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  return (
    <select
      onChange={(e) => {
        dispatch(changeTheme(e.target.value));
        Cookies.set("theme", e.target.value);
      }}
      value={theme}
      className="select select-sm w-full"
    >
      {Object.values(THEMES).map((_theme) => (
        <option key={_theme} value={_theme}>
          {_theme}
        </option>
      ))}
    </select>)
}
