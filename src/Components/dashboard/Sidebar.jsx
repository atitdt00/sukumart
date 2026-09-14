"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    {
      name: "Dashboard",
      href: "/dashboard",
    },
    {
      name: "Products",
      href: "/dashboard/products",
    },
    {
      name: "Categories",
      href: "/dashboard/categories",
    },
    {
      name: "Users",
      href: "/dashboard/users",
    },
    {
      name: "Orders",
      href: "/dashboard/orders",
    },
     {
      name: "Contact",
      href: "/dashboard/contact",
    },
  ];

  return (
    <aside className="fixed left-0 top-0 w-64 h-screen bg-[#002D62] text-white p-5">
      
      <h1 className="text-2xl font-bold mb-8">
        SukuMart
      </h1>

      <nav className="space-y-2">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`block px-4 py-3 rounded-lg ${
              pathname === link.href
                ? "bg-[#0055B3]"
                : "hover:bg-[#0055B3]"
            }`}
          >
            {link.name}
          </Link>
        ))}
      </nav>

    </aside>
  );
}