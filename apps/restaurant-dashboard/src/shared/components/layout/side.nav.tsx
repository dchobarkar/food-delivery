"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { sideBarItems } from "../../../app/configs/constants";
import useRouteChange from "../../../hooks/useRouteChange";

const SideNav = () => {
  const { activeRoute, setActiveRoute } = useRouteChange();
  const pathName = usePathname();

  useEffect(() => {
    setActiveRoute(pathName);
  }, [pathName]);

  return (
    <>
      {sideBarItems.map((option: SideBarItemsTypes, index: number) => (
        <Link
          key={option.url}
          href={option.url}
          onClick={() => setActiveRoute(option.url)}
          className={`${option.url === activeRoute && "text-[rgb(_91_111_230)]"} flex items-center text-2xl px-2`}
        >
          <span className="mr-4 text-3xl">{option.icon}</span>
          {option.title}
        </Link>
      ))}
    </>
  );
};

export default SideNav;
