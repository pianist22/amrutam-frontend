'use client'
import React, { useEffect, useState } from "react";
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import { Button } from "./ui/button";
import amrutamLogo from "../public-image/amrutam_logo.png";
import { useRouter } from "next/navigation";

export default function Navbar({ logo }) {
  const { isLoaded, isSignedIn, user } = useUser();
  const [showNav, setShowNav] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setShowNav(true);
  }, []);

  const Spinner = () => (
    <div className="flex w-full h-[72px] justify-center items-center">
      <svg className="animate-spin h-8 w-8 text-green-800" fill="none" viewBox="0 0 24 24">
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
      </svg>
    </div>
  );

  if (!showNav || !isLoaded) return <CustomLoader logo={amrutamLogo.src}/>;

  return (
    <header
      className="bg-white shadow-[0_0_14px_0_rgba(204,204,204,0.25)]"
      style={{ opacity: 1 }}
    >
      <div
        className="mx-auto max-w-[1280px] h-18 px-2 sm:px-4 md:px-8 py-2 sm:py-3 flex items-center justify-between"
        style={{ height: "72px" }}
      >
        {/* Logo and name container */}
        <div
          className="
            flex items-center 
            sm:justify-start md:justify-start  /* left aligned from sm and up */
            flex-1               /* take available space on small for pushing user buttons right */
          " onClick={()=>router.push('/')}
        >
          {logo}
          <span className=" text-lg sm:text-xl md:text-2xl uppercase font-bold text-green-800" onClick={()=>router.push('/')}>
            amrutam
          </span>
        </div>

        {/* Auth Buttons/User container with small left margin on small screens */}
        <div
          className="
            flex gap-1 sm:gap-2 items-center 
            ml-2 sm:ml-4        /* small margin left from logo */
            shrink-0            /* prevent shrinking */
          "
        >
          <SignedOut>
            <SignInButton mode="modal">
              <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-2 sm:px-4">
                Sign Up
              </Button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            {isLoaded && isSignedIn && (
              <div className="flex gap-2 items-center justify-center">
                <div className="flex flex-col items-end">
                  <div className="font-semibold text-green-800 text-sm sm:text-base md:text-lg">
                    {user?.firstName}
                  </div>
                  <div className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base">
                    Admin Dept
                  </div>
                </div>
                <UserButton/>
              </div>
            )}
          </SignedIn>
        </div>
      </div>
    </header>
  );
}

function CustomLoader({ logo, size = 110 }) {
  return (
    <div className="flex items-center justify-center w-full h-[72px] mt-6">
      <div
        className={`rounded-full border-4 border-green-200 shadow-lg p-3 animate-glow`}
        style={{ width: size, height: size }}
      >
        <img
          src={typeof logo === "string" ? logo : "/fallback-logo.png"}
          alt="Loading..."
          className="w-full h-full object-contain animate-[spin_3s_linear_infinite,pulse-bounce_2s_ease-in-out_infinite]"
        />
      </div>
    </div>
  );
}

