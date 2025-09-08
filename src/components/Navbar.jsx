
// 'use client'
// import React, { useEffect, useState } from "react";
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
//   useUser,
// } from "@clerk/nextjs";
// import { Button } from "./ui/button";
// import amrutamLogo from "../public-image/amrutam_logo.png";
// import { useRouter } from "next/navigation";

// export default function Navbar({ logo }) {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [showNav, setShowNav] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setShowNav(true);
//   }, []);

//   if (!showNav || !isLoaded) return <CustomLoader logo={amrutamLogo.src} />;

//   return (
//     <header className="bg-white shadow-[0_0_14px_0_rgba(204,204,204,0.25)] w-full">
//       <div
//         className="mx-auto max-w-[1280px] px-3 sm:px-4 md:px-8 py-2 sm:py-3 flex items-center justify-between gap-3"
//         style={{ height: "72px" }}
//       >
//         {/* Logo & Name */}
//         <div
//           className="flex items-center gap-2 cursor-pointer flex-shrink-0"
//           onClick={() => router.push("/")}
//         >
//           <div className="w-8 sm:w-10 md:w-12 flex-shrink-0">
//             {logo}
//           </div>
//           <span className="text-base sm:text-xl md:text-2xl uppercase font-bold text-green-800">
//             amrutam
//           </span>
//         </div>

//         {/* Auth Section */}
//         <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-center shrink-0">
//           <SignedOut>
//             <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
//               <SignInButton mode="modal">
//                 <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4">
//                   Sign In
//                 </Button>
//               </SignInButton>
//               <SignUpButton mode="modal">
//                 <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4">
//                   Sign Up
//                 </Button>
//               </SignUpButton>
//             </div>
//           </SignedOut>

//           <SignedIn>
//             {isLoaded && isSignedIn && (
//               <div className="flex items-center gap-2 sm:gap-3">
//                 <div className="flex flex-col items-end text-right max-w-[120px] sm:max-w-none truncate">
//                   <div className="font-semibold text-green-800 text-sm sm:text-base md:text-lg truncate">
//                     {user?.firstName}
//                   </div>
//                   <div className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base truncate">
//                     Admin Dept
//                   </div>
//                 </div>
//                 <UserButton />
//               </div>
//             )}
//           </SignedIn>
//         </div>
//       </div>
//     </header>
//   );
// }

// function CustomLoader({ logo, size = 110 }) {
//   return (
//     <div className="flex items-center justify-center w-full h-[72px] mt-6">
//       <div
//         className="rounded-full border-4 border-green-200 shadow-lg p-3 animate-glow"
//         style={{ width: size, height: size }}
//       >
//         <img
//           src={typeof logo === "string" ? logo : "/fallback-logo.png"}
//           alt="Loading..."
//           className="w-full h-full object-contain animate-[spin_3s_linear_infinite,pulse-bounce_2s_ease-in-out_infinite]"
//         />
//       </div>
//     </div>
//   );
// }

// 'use client';
// import React, { useEffect, useState } from "react";
// import {
//   SignInButton,
//   SignUpButton,
//   SignedIn,
//   SignedOut,
//   UserButton,
//   useUser,
// } from "@clerk/nextjs";
// import { Button } from "./ui/button";
// import amrutamLogo from "../public-image/amrutam_logo.png";
// import { useRouter } from "next/navigation";

// export default function Navbar({ logo }) {
//   const { isLoaded, isSignedIn, user } = useUser();
//   const [showNav, setShowNav] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     setShowNav(true);
//   }, []);

//   if (!showNav || !isLoaded) return <CustomLoader logo={amrutamLogo.src} />;

//   return (
//     <header className="sticky top-0 inset-x-0 z-50 w-full bg-white shadow-[0_0_14px_0_rgba(204,204,204,0.25)]">
//       <div className="mx-auto max-w-screen-xl w-full px-3 sm:px-4 md:px-8 h-16 sm:h-[72px] flex items-center justify-between gap-3 ">
//         {/* Logo & Name */}
//         <div
//           className="flex items-center gap-2 cursor-pointer shrink-0"
//           onClick={() => router.push("/")}
//         >
//           <div className="w-8 sm:w-10 md:w-12 shrink-0">
//             {logo}
//           </div>
//           <span className="text-base sm:text-xl md:text-2xl uppercase font-bold text-green-800">
//             amrutam
//           </span>
//         </div>

//         {/* Auth Section */}
//         <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-center shrink-0 min-w-0">
//           <SignedOut>
//             <div className="flex flex-col xs:flex-row gap-2 w-full xs:w-auto">
//               <SignInButton mode="modal">
//                 <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4">
//                   Sign In
//                 </Button>
//               </SignInButton>
//               <SignUpButton mode="modal">
//                 <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4">
//                   Sign Up
//                 </Button>
//               </SignUpButton>
//             </div>
//           </SignedOut>

//           <SignedIn>
//             {isLoaded && isSignedIn && (
//               <div className="flex items-center gap-2 sm:gap-3 min-w-0">
//                 <div className="flex flex-col items-end text-right max-w-[120px] sm:max-w-none truncate">
//                   <div className="font-semibold text-green-800 text-sm sm:text-base md:text-lg truncate">
//                     {user?.firstName}
//                   </div>
//                   <div className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base truncate">
//                     Admin Dept
//                   </div>
//                 </div>
//                 <UserButton />
//               </div>
//             )}
//           </SignedIn>
//         </div>
//       </div>
//     </header>
//   );
// }

// function CustomLoader({ logo, size = 110 }) {
//   return (
//     <div className="flex items-center justify-center w-full h-[72px] mt-6">
//       <div
//         className="rounded-full border-4 border-green-200 shadow-lg p-3 animate-glow"
//         style={{ width: size, height: size }}
//       >
//         <img
//           src={typeof logo === "string" ? logo : "/fallback-logo.png"}
//           alt="Loading..."
//           className="w-full h-full object-contain animate-[spin_3s_linear_infinite,pulse-bounce_2s_ease-in-out_infinite]"
//         />
//       </div>
//     </div>
//   );
// }

'use client';
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

  if (!showNav || !isLoaded) return <CustomLoader logo={amrutamLogo.src} />;

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full bg-white shadow-[0_0_14px_0_rgba(204,204,204,0.25)]">
      {/* Full-width row without max-w constraint */}
      <div className="w-full px-3 sm:px-4 md:px-8 h-16 sm:h-[72px] flex items-center gap-3">
        {/* Left: Logo + Name */}
        <div
          className="flex items-center gap-2 cursor-pointer shrink-0 min-w-0"
          onClick={() => router.push("/")}
        >
          <div className="w-8 sm:w-10 md:w-12 shrink-0">
            {logo}
          </div>
          {/* Hide the wordmark on the tiniest screens to preserve spacing */}
          <span className="hidden sm:inline text-base sm:text-xl md:text-2xl uppercase font-bold text-green-800 whitespace-nowrap">
            amrutam
          </span>
        </div>

        {/* Flexible spacer that always consumes the middle space */}
        <div className="flex-1 min-w-0" />

        {/* Right: Auth/User */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0 min-w-0">
          <SignedOut>
            <div className="flex gap-2">
              <SignInButton mode="modal">
                <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4 whitespace-nowrap">
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button className="bg-green-800 hover:bg-green-700 text-xs sm:text-sm px-3 py-1 sm:px-4 whitespace-nowrap">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          </SignedOut>

          <SignedIn>
            {isLoaded && isSignedIn && (
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <div className="flex flex-col items-end text-right max-w-[120px] sm:max-w-none">
                  <div className="font-semibold text-green-800 text-sm sm:text-base md:text-lg truncate">
                    {user?.firstName}
                  </div>
                  <div className="font-semibold text-gray-500 text-xs sm:text-sm md:text-base truncate">
                    Admin Dept
                  </div>
                </div>
                <UserButton />
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
        className="rounded-full border-4 border-green-200 shadow-lg p-3 animate-glow"
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

