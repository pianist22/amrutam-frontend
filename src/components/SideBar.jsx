
'use client';

import { useUser } from "@clerk/nextjs";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "./ui/sheet";
import { Skeleton } from "./ui/skeleton";
import clsx from "clsx";
import { Menu, ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { sidebarItems } from "./sidebarItem";
import { usePathname } from "next/navigation";

// SidebarLink renders parent or child links with conditional highlight, toggle arrow,
// and now a '>' icon at the end for all items
const SidebarLink = ({
  label,
  icon,
  href,
  isOpen,
  toggle,
  isCollapsible,
  isActive,
  children,
  onClick,
}) => {
  if (isCollapsible) {
    // Collapsible parent: clickable toggle button with submenu and chevron down arrow
    return (
      <button
        type="button"
        onClick={toggle}
        className={clsx(
          "flex items-center justify-between w-full px-3 py-2 rounded-lg transition-colors text-left group",
          isOpen
            ? "bg-gray-200 text-black font-semibold"
            : "hover:bg-gray-100 text-gray-700",
          isActive && "bg-gray-200 text-black font-bold"
        )}
        tabIndex={0}
      >
        <div className="flex items-center gap-2">
          {icon}
          <span>{label}</span>
        </div>
        {/* The toggle arrow */}
        <ChevronDown
          className={clsx(
            "w-5 h-5 ml-1 transition-transform text-gray-400 group-hover:text-black",
            isOpen ? "rotate-180" : "rotate-0"
          )}
        />
      </button>
    );
  }

  // Non-collapsible: a simple Link with highlight if active and a '>' arrow at right
  return (
    <Link
      href={href}
      onClick={onClick}
      className={clsx(
        "flex items-center justify-between px-3 py-2 rounded-lg transition-colors",
        isActive
          ? "bg-gray-200 text-black font-semibold"
          : "hover:bg-gray-100 text-gray-700"
      )}
    >
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-black" />
    </Link>
  );
};

export default function Sidebar() {
  const { isLoaded } = useUser();
  const [open, setOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);
  const pathname = usePathname();

  if (!isLoaded) {
    return (
      <aside className="hidden md:flex flex-col w-[232px] min-h-[calc(100vh-48px)] bg-white border-r px-5 py-6 mt-6 ml-6 rounded-2xl shadow-lg">
        <Skeleton className="w-full h-9 mb-6 rounded bg-gray-400/70 animate-pulse" />
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <Skeleton
              className="w-full h-9 mb-3 rounded bg-gray-400/70 animate-pulse"
              key={i}
            />
          ))}
      </aside>
    );
  }

  const isLinkActive = (href) => {
    if (!href) return false;
    if (href === '/') return pathname === '/';
    if (pathname === href) return true;
    return pathname.startsWith(href + '/');
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className="hidden md:flex flex-col w-[232px] bg-white border border-gray-200 shadow-lg mt-20 ml-6 rounded-2xl pt-4 px-1 h-fit mb-2"
      >
        <div className="flex flex-col gap-1">
          {sidebarItems.map(({ label, icon, href, children }) => {
            const isCollapsible = label === "Ingredients";
            const activeParent = isLinkActive(href);
            return (
              <div key={label} className="flex flex-col">
                <SidebarLink
                  label={label}
                  icon={icon}
                  href={!isCollapsible ? href : undefined}
                  isCollapsible={isCollapsible}
                  isOpen={ingredientsOpen}
                  toggle={
                    isCollapsible
                      ? () => setIngredientsOpen((open) => !open)
                      : undefined
                  }
                  isActive={activeParent}
                />
                {isCollapsible && ingredientsOpen && children && (
                  <div className="ml-8 mt-1 flex flex-col gap-1">
                    {children.map((child) => {
                      const activeChild = isLinkActive(child.href);
                      return (
                        <Link
                          key={child.label}
                          href={child.href}
                          className={clsx(
                            "flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-600 text-sm",
                            activeChild && "bg-gray-200 text-green-800 font-bold"
                          )}
                        >
                          <div className="flex items-center gap-2">
                            {child.icon}
                            <span>{child.label}</span>
                          </div>
                          <ChevronRight className="w-5 h-5 text-gray-400 hover:text-green-800" />
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </aside>

      {/* Mobile Sidebar (Sheet/Drawer) */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <button
            className="fixed top-[75px] z-50 md:hidden bg-white border border-green-100 shadow rounded-full p-2 focus:outline-none "
            aria-label="Open sidebar"
          >
            <Menu className="w-7 h-7 text-green-800" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[232px] px-3 pt-6 bg-white h-fit border-r rounded-r-2xl shadow-xl mt-3"
          style={{ marginTop: "16px" }}
        >
          <SheetTitle className="sr-only">Sidebar Menu</SheetTitle>
          <div className="flex flex-col gap-1">
            {sidebarItems.map(({ label, icon, href, children }) => {
              const isCollapsible = label === "Ingredients";
              const activeParent = isLinkActive(href);
              return (
                <div key={label} className="flex flex-col">
                  <SidebarLink
                    label={label}
                    icon={icon}
                    href={!isCollapsible ? href : undefined}
                    isCollapsible={isCollapsible}
                    isOpen={ingredientsOpen}
                    toggle={
                      isCollapsible
                        ? () => setIngredientsOpen((open) => !open)
                        : undefined
                    }
                    isActive={activeParent}
                    onClick={() => {
                      if (!isCollapsible) setOpen(false);
                    }}
                  />
                  {isCollapsible && ingredientsOpen && children && (
                    <div className="ml-8 mt-1 flex flex-col gap-1">
                      {children.map((child) => {
                        const activeChild = isLinkActive(child.href);
                        return (
                          <Link
                            key={child.label}
                            href={child.href}
                            className={clsx(
                              "flex items-center justify-between gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700 text-sm",
                              activeChild && "bg-gray-100 text-green-800 font-semibold"
                            )}
                            onClick={() => setOpen(false)}
                          >
                            <div className="flex items-center gap-2">
                              {child.icon}
                              <span>{child.label}</span>
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-400 hover:text-green-800" />
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

