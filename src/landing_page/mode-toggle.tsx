import Cookies from "js-cookie";
import { Moon, Sun } from "lucide-react";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { THEMES } from "../store/frontendTypes";
import { changeTheme } from "../store/store";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export function ModeToggle() {
  const frontend = useSelector((state: any) => state.frontend);
  const theme = frontend.theme
  const dispatch = useDispatch();

  const setTheme = (theme: string) => {
    dispatch(changeTheme(theme));
    Cookies.set("theme", theme);
  }

  useEffect(() => {
    const currentDocumentTheme =
      document.documentElement.getAttribute("data-theme");

    if (currentDocumentTheme !== theme) {
      document.documentElement.setAttribute("data-theme", theme);
    }
  }, [theme]);


  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="ghost"
        >
          <Sun className="h-[1.1rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.1rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {Object.values(THEMES).map((_theme) => (
          <DropdownMenuItem key={_theme} onClick={() => setTheme(_theme)}>
            {_theme}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
