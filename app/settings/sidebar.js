"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCircleUser, faAddressCard, faShield } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname();

  const menu = [
    { icon: faUser, link: "/settings/profile", text: "Profile" },
    // { icon: faAddressCard, link: "/settings/details", text: "Details" },
    // { icon: faShield, link: "/settings/password_and_security", text: "Password and security" },
  ];


  return (
    <div className=" top-0 left-0 z-40  border-r  w-1/2   h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto    flex justify-end">
        <ul className=" space-y-4 font-medium  text-xl mt-16 ">
          <h1 className=" text-white text-3xl mb-24">brand name</h1>

          {menu.map((value, index) => {
            const isActive = pathname.startsWith(`${value.link}`);

            return (
              <li key={index} className=" ">
                <Link href={`${value.link}`} className={` px-8 py-5 flex items-center p-2 text-gray-900  rounded-lg dark:text-white hover:bg-[#334554] dark:hover:bg-gray-700 group  ${isActive && " text-black bg-white hover:bg-white"}`}>
                  <FontAwesomeIcon icon={value.icon} size="xl" color={`${isActive ? "#000 " : "#fff"}`} />
                  <span className={`ms-3 ${isActive ? " text-black " : "text-white"}`}>{value.text}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
