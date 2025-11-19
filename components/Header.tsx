"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: "Start", href: "/homepage" },   // ändra till "/" om ni vill
    { label: "Study plan", href: "/study-plan" },
    { label: "Practice", href: "/practice" },
  ];

  const handleNavigate = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <header className="relative bg-brandBlue text-white">
      <div className="flex w-full items-center justify-between px-8 py-4">
        {/* Logo vänster */}
        <span className="font-jockey font-bold lg:text-2xl text-lg tracking-wide">
          TECH COACH
        </span>

        {/* Hamburgermeny höger */}
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-md border border-white/50"
        >
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
          <span className="h-0.5 w-5 bg-white" />
        </button>
      </div>

      {/* Dropdown-menyn */}
      {open && (
        <div className="absolute right-8 top-full z-20 mt-2 w-40 rounded-lg bg-white py-4 text-center shadow-lg">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <button
                key={item.href}
                type="button"
                onClick={() => handleNavigate(item.href)}
                className={`block w-full px-4 py-1 text-sm ${
                  isActive
                    ? "font-semibold text-brandBlue"
                    : "text-brandBlue/80 hover:text-brandBlue"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}

export default Header;
