"use client";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import Link from "next/link";
import MyContainer from "./Container";
import { useState, useEffect, useRef } from "react";

const Navbar = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  const handleOptionClick = () => {
    setDropdownOpen(false);
  };

  return (
    <div className="border-b">
      <MyContainer>
        <div className="flex justify-between items-center py-4">
          <Link href={"/"} className="hidden md:flex md:font-medium text-lg">
            Event Booking
          </Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/events" prefetch={false} legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    Events
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link
                  href="/my-tickets"
                  prefetch={false}
                  legacyBehavior
                  passHref
                >
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                    My Bookings
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={toggleDropdown}
                    className={navigationMenuTriggerStyle()}
                  >
                    More {dropdownOpen ? "▲" : "▼"}
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border rounded shadow-lg">
                      <Link href="/events/add" legacyBehavior passHref>
                        <a
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={handleOptionClick}
                        >
                          Add New Event
                        </a>
                      </Link>
                      <Link href="/sales" legacyBehavior passHref>
                        <a
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                          onClick={handleOptionClick}
                        >
                          Analytics
                        </a>
                      </Link>
                    </div>
                  )}
                </div>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </MyContainer>
    </div>
  );
};

export default Navbar;
