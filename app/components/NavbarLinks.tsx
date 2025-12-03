"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navbarLinks = [
  {
    id: 0,
    name: "Home",
    href: "/",
  },
  {
    id: 1,
    name: "Explore",
    href: "/templates",
  },
  {
    id: 2,
    name: "Marketing",
    href: "/templates?category=marketing-landing",
  },
  {
    id: 3,
    name: "App UI",
    href: "/templates?category=product-app-ui",
  },
  {
    id: 4,
    name: "Dashboards",
    href: "/templates?category=dashboard-analytics",
  },
];

// Legacy links for backward compatibility
export const legacyNavbarLinks = [
  {
    id: 0,
    name: "Home",
    href: "/",
  },
  {
    id: 1,
    name: "Templates",
    href: "/products/template",
  },
  {
    id: 2,
    name: "Ui Kits",
    href: "/products/uikit",
  },
  {
    id: 3,
    name: "Icons",
    href: "/products/icon",
  },
];

export function NavbarLinks() {
  const location = usePathname();

  return (
    <div className="hidden md:flex justify-center items-center col-span-6 gap-x-2">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href ||
              (item.href !== "/" && location.startsWith(item.href.split("?")[0]))
              ? "bg-muted"
              : "hover:bg-muted hover:bg-opacity-75",
            "group flex items-center px-2 py-2 font-medium rounded-md text-sm"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
