import React, { forwardRef } from "react";
import { ROUTE_PREFIX } from "../constants";

interface LinkProps {
    href?: string;
    children?: React.ReactNode;
    className?: string;
    target?: string;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const Link = forwardRef(({ ...props }: LinkProps, innerRef) => {
    let href = props.href;
    if (props.href?.startsWith("/")) {
        href = ROUTE_PREFIX + props.href;
    }
    const children = props.children;
    delete props.href;
    delete props.children;

    // @ts-ignore
    return <a ref={innerRef} href={href} {...props}>{children}</a>;
});

export function navigateSearch(search, resetAll = true, pathName = null) {
    let searchParams = new URLSearchParams(window.location.search);
    if (resetAll) {
        searchParams.forEach((_, key) => {
            searchParams.delete(key);
        });
        searchParams = new URLSearchParams();
    }
    Object.keys(search).forEach(key => {
        if (search[key] == null) {
            if (key in search) {
                searchParams.delete(key);
            }
            delete search[key];
        } else {
            searchParams.set(key, search[key])
        }
    });
    var newRelativePathQuery = (pathName ? pathName : window.location.pathname) + '?' + searchParams.toString();

    window.history.pushState({}, '', newRelativePathQuery);
}

export function navigate(path, search = {}, resetAll = true) {
    navigateSearch(search, resetAll, path);
}