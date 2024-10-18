import React from "react";
import { FloatingNav } from "./ui/floating-navbar";
import { IoFastFood } from "react-icons/io5";
import { FaHome } from "react-icons/fa";
export default function Navbar() {
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <FaHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/videos",
      icon: <IoFastFood className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}