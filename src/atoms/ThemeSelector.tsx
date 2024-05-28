export default ThemeSelector;
import { ReloadIcon } from "@radix-ui/react-icons";
import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { THEMES } from "../store/frontendTypes";
import { changeTheme } from "../store/store";


function ThemeSelector() {
  const dispatch = useDispatch();
  const frontend = useSelector((state: any) => state.frontend);
  const theme = frontend.theme;

  useEffect(() => {
    const initalHidratiedTheme = Cookies.get("theme") || THEMES.LIGHT;
    if(!Cookies.get("theme")) Cookies.set("theme", THEMES.LIGHT);
    dispatch(changeTheme(initalHidratiedTheme));
    handleSetDark(initalHidratiedTheme);
  }, []);

  useEffect(() => {
    const currentDocumentTheme =
      document.documentElement.getAttribute("data-theme");

    if (currentDocumentTheme !== theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);

  const handleSetDark = (isDark: boolean) => {
    // add dark class to the body tag, if not exist and isDark is true
    if (isDark && !document.body.classList.contains("dark")) {
      document.body.classList.add("dark");
    } else if (!isDark) {
      document.body.classList.remove("dark");
    }
  }

  return (
    !theme ? <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> :
      <select
        onChange={(e) => {
          dispatch(changeTheme(e.target.value));
          Cookies.set("theme", e.target.value);

          handleSetDark(e.target.value === THEMES.DARK);
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
