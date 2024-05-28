// @ts-ignore
import React, { useState } from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger
} from "../ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

import { GitHubLogoIcon, TriangleDownIcon } from "@radix-ui/react-icons";
import { Menu } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from 'react-scroll';
import ThemeSelector from "../atoms/ThemeSelector";
import { RootState } from "../store/store";
import { buttonVariants } from "../ui/button";
import { LogoIcon } from "./Icons";

interface RouteProps {
  href: string;
  label: string;
}

interface ListRouteProps {
  href: string;
  label: string;
  desc: string;
}

const routeList: RouteProps[] = [
  {
    href: "#features",
    label: "Features",
  },
  {
    href: "#testimonials",
    label: "Testimonials",
  },
  {
    href: "#pricing",
    label: "Pricing",
  },
  {
    href: "#faq",
    label: "FAQ",
  },
];

const navbarStartRoutes: ListRouteProps[] = [
  {
    href: "features",
    label: "Features",
    desc: "Current implemented features"
  },
  {
    href: "beta",
    label: "Beta",
    desc: "Bevome a Beta Tester"
  },
  {
    href: "models",
    label: "Language Models",
    desc: "Current supported models"
  },
  {
    href: "faq",
    label: "FAQ",
    desc: "Frequently asked questions"
  },
]

import { CalendarIcon } from "@radix-ui/react-icons";

import { Link as AtomLink } from "../atoms/Link";
import { cn } from "../lib/utils";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "../ui/hover-card";
import { Separator } from "../ui/separator";

export const UserHoverCard = ({ children }) => {
  const user = useSelector((state: RootState) => state.user.value);

  return <HoverCard>
    <HoverCardTrigger asChild>
      {children}
    </HoverCardTrigger>
    <HoverCardContent className="w-80">
      <div className="flex justify-between space-x-4">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback>VC</AvatarFallback>
        </Avatar>
        <div className="space-y-1">
          <h4 className="text-sm font-semibold">{user?.username}</h4>
          <p className="text-sm">
            {user?.uuid}
          </p>
          <div className="flex items-center pt-2">
            <CalendarIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
            <span className="text-xs text-muted-foreground">
              Joined {new Date(user?.date_joined).toDateString()}
            </span>
          </div>
        </div>
      </div>
    </HoverCardContent>
  </HoverCard>
}

export const DynamicLoginButton = ({
  loginLink = "/login",
  authenticatedLink = "/chat",
  className = ""
}) => {
  const user = useSelector<RootState>((state) => state.user.value);
  const isAuthenticated = Boolean(user)

  return !isAuthenticated ? <AtomLink
    href={loginLink}
    className={cn(
      `border ${buttonVariants({ variant: "outline" })}`,
      className
    )}
  >
    🚀
    Log-In
  </AtomLink> : <UserHoverCard>
    <AtomLink
      href={authenticatedLink}
      className={cn(
        `border border-success ${buttonVariants({ variant: "outline" })}`,
        className
      )}
    >
      ✅
      Logged-In
    </AtomLink>
  </UserHoverCard>
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, href, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <Link
          ref={ref}
          activeClass="active"
          to={href}
          spy={true}
          smooth={true}
          offset={-100}
          duration={500}
          className="w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
          {...props}
        >
          <div className="text-sm font-bold leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-none">
            {children}
          </p>
        </Link>
      </NavigationMenuLink>
    </li>
  )
})

const HomeLink = ({ href, className, logoIcon, logoTitle }) => {
  return (
    <AtomLink
      href={href}
      className={className}
    >
      {logoIcon}
      {logoTitle}
    </AtomLink>
  )
}

export const Navbar = ({
  logoIcon = <LogoIcon />,
  logoTitle = "ShadcnUI/React",
  routes = routeList,
  listRoutes = navbarStartRoutes,
  githubLink = "",
  loginLink = "/login",
  mobileFlexDir = "col",
  mobileChildren = null
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  return (
    <header className="sticky border-b-[1px] top-0 z-40 w-full backdrop-blur-xl dark:border-b-slate-700 dark:bg-background">
      <NavigationMenu className="mx-auto">
        <NavigationMenuList className="container h-14 px-4 w-screen flex justify-between ">
          {/* mobile */}
          <NavigationMenuItem className="flex md:hidden">
            <HomeLink href="/" className="ml-2 font-bold text-xl flex" logoIcon={logoIcon} logoTitle={logoTitle} />
          </NavigationMenuItem>
          <span className="flex md:hidden">
            <Sheet
              open={isOpen}
              onOpenChange={setIsOpen}
            >
              <SheetTrigger className="px-2">
                <Menu
                  className="flex md:hidden h-5 w-5"
                  onClick={() => setIsOpen(true)}
                >
                  Menu Icon
                </Menu>
              </SheetTrigger>

              <SheetContent side={"left"}>
                <SheetHeader>
                  <SheetTitle className="font-bold text-xl">
                    {logoIcon}
                    {logoTitle}
                  </SheetTitle>
                  <Separator className="mt-5" />
                </SheetHeader>
                <nav className={`grid grid-cols-4 justify-center gap-1 mt-4`}>
                  {/* Routes with sub-routes */}
                  {listRoutes.length > 0 ?
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className={`col-span-4 border ${buttonVariants({
                            variant: "ghost",
                          })}`}
                        >
                          Start
                          <TriangleDownIcon />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="hover:opacity-95">
                        <DropdownMenuGroup>
                          {listRoutes.map(({ href, label, desc }: ListRouteProps) => (
                            <DropdownMenuItem key={`menu_item_${label}`}>
                              <Link
                                activeClass="active"
                                key={`dropdown_item_${label}`}
                                to={href}
                                onClick={() => setIsOpen(false)}
                                spy={true}
                                smooth={true}
                                offset={-100}
                                duration={500}
                                className="w-full block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                              >
                                <div className="text-sm font-bold leading-none">{label}</div>
                                <p className="line-clamp-2 text-sm leading-snug">
                                  {desc}
                                </p>
                              </Link>

                            </DropdownMenuItem>

                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>

                    </DropdownMenu> : null
                  }
                  {routes.map(({ href, label }: RouteProps) => (
                    <a
                      key={label}
                      href={href}
                      onClick={() => setIsOpen(false)}

                      className={`col-span-4 border ${buttonVariants({
                        variant: "ghost",
                      })}`}
                    >
                      {label}
                    </a>
                  ))}
                  <Separator className="col-span-4 my-3" />
                  {githubLink && <AtomLink
                    href={githubLink}
                    target="_blank"
                    className={`col-span-4 sm:col-span-2 border ${buttonVariants({
                      variant: "secondary",
                    })}`}
                  >
                    <GitHubLogoIcon className="mr-2 w-5 h-5" />
                    Github
                  </AtomLink>}
                  {loginLink && <DynamicLoginButton className="col-span-4 sm:col-span-2" loginLink={loginLink} />}
                  <div className="flex col-start-2 col-end-4 justify-center my-3"><ThemeSelector /></div>
                </nav>
                {mobileChildren}
              </SheetContent>
            </Sheet>
          </span>

          {/* desktop */}
          <div className="hidden md:flex justify-start">

            <NavigationMenuItem>
              <NavigationMenuTrigger>
                <HomeLink href="/" className="ml-2 font-bold text-xl flex" logoIcon={logoIcon} logoTitle={logoTitle} />
              </NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[300px] gap-3 p-3">
                  {navbarStartRoutes.map(({ href, label, desc }: ListRouteProps) => (
                    <ListItem key={label} title={label} href={href}>
                      {desc}
                    </ListItem>
                  ))}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <nav className="hidden md:flex gap-2">
              {routes.map((route: RouteProps, i) => (
                <AtomLink
                  href={route.href}
                  key={i}
                  className={`text-[17px] ${buttonVariants({
                    variant: "ghost",
                  })}`}
                >
                  {route.label}
                </AtomLink>
              ))}
            </nav>
          </div>


          <div className="hidden md:flex gap-2 justify-center content-center items-center">
            {/** @ts-ignore */}
            {githubLink && <AtomLink
              href={githubLink}
              target="_blank"
              className={`border ${buttonVariants({ variant: "secondary" })}`}
            >
              <GitHubLogoIcon className="mr-2 w-5 h-5" />
              Github
            </AtomLink>}
            {loginLink && <DynamicLoginButton />}
            <ThemeSelector />
          </div>
        </NavigationMenuList>
      </NavigationMenu>
    </header>
  );
};
