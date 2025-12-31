"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function Navbar({
  goToLastQR,
  relocateToUser,
  startScanner,
  mapReady = true,
  scanning = false,
  scannedData = null,
}) {
  const [step, setStep] = useState(0);
  const pathname = usePathname();
  
  // We only show the floating map-specific buttons if we are on the home page
  const isMapPage = pathname.startsWith("/map");


  useEffect(() => {
    const seen = localStorage.getItem("map_intro_seen");
    if (!seen) setStep(1);
  }, []);

  const nextStep = () => {
    if (step === 5) {
      localStorage.setItem("map_intro_seen", "true");
      setStep(0);
    } else {
      setStep(step + 1);
    }
  };

  return (
    <>
      {/* --- FLOATING ACTIONS (Only visible on Map Page) --- */}
      {isMapPage && (
        <div className="fixed z-[1000] right-3 sm:right-5 bottom-32 flex flex-col gap-4">
          
          {/* PLAYAREA / LAST QR BUTTON */}
          <div className="relative">
            {step === 1 && (
              <Tooltip
                text="Tap here to return to your last scanned QR location."
                onNext={nextStep}
                side="left"
              />
            )}
            <button
              onClick={goToLastQR}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition active:scale-90"
            >
              <img src="/images/map.png" className="w-6 h-6 sm:w-8 sm:h-8" alt="Map" />
            </button>
          </div>

          {/* PLAYER LOCATION BUTTON */}
          <div className="relative">
            {step === 2 && (
              <Tooltip
                text="Tap here to relocate to your current position."
                onNext={nextStep}
                side="left"
              />
            )}
            <button
              onClick={relocateToUser}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white shadow-lg flex items-center justify-center transition active:scale-90"
            >
              <img
                src="/images/playericon.png"
                className="w-7 h-7 sm:w-10 sm:h-10"
                alt="Player"
              />
            </button>
          </div>
        </div>
      )}

      {/* --- MAIN BOTTOM NAVIGATION (Always visible) --- */}
      {mapReady && !scanning && !scannedData && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[1001] w-auto">
          <div className="flex items-center justify-between gap-6 px-5 py-3 bg-white rounded-full shadow-2xl border border-gray-100">

            {/* LEADERBOARD / SETTINGS */}
            <div className="relative">
              {step === 3 && (
                <Tooltip text="View leaderboard rankings here." onNext={nextStep} />
              )}
              <Link
                href="/settings"
                className="flex items-center justify-center w-11 h-11 rounded-full transition active:scale-95 hover:bg-black group"
              >
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="w-6 h-6 text-black group-hover:text-white"
                >
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
              </Link>
            </div>

            {/* SCAN BUTTON (PRIMARY ACTION) */}
            <div className="relative">
              {step === 4 && (
                <Tooltip
                  text="Scan QR codes here to earn rewards!"
                  onNext={nextStep}
                  center
                />
              )}
              <button
                onClick={startScanner}
                className="flex items-center justify-center w-14 h-14 rounded-full bg-red-600 shadow-lg transition active:scale-95 hover:bg-red-700"
              >
                <svg
                  viewBox="0 0 24 24"
                  stroke="white"
                  strokeWidth="2"
                  fill="none"
                  className="w-7 h-7"
                >
                  <path d="M3 7V3H7" />
                  <path d="M17 3H21V7" />
                  <path d="M3 17V21H7" />
                  <path d="M17 21H21V17" />
                  <rect x="8" y="8.5" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="14" y="8.5" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="8" y="13" width="2" height="2" rx="0.5" fill="white" />
                  <rect x="14" y="13" width="2" height="2" rx="0.5" fill="white" />
                </svg>
              </button>
            </div>

            {/* PROFILE / HOME LINK */}
            <div className="relative">
              {step === 5 && (
                <Tooltip text="View your profile here." onNext={nextStep} />
              )}
              <Link
                href="/profile"
                className="flex items-center justify-center w-11 h-11 rounded-full transition active:scale-95 hover:bg-black group"
              >
                <svg
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  className="w-6 h-6 text-black group-hover:text-white"
                >
                  <path d="M3 10L12 3L21 10" />
                  <path d="M5 10V21H19V10" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// INTERNAL TOOLTIP COMPONENT
function Tooltip({ text, onNext, center, side = "top" }) {
  const position =
    side === "left"
      ? "right-full top-1/2 -translate-y-1/2 mr-4"
      : center
      ? "bottom-full left-1/2 -translate-x-1/2 mb-4"
      : "bottom-full right-0 mb-4";

  const arrow =
    side === "left"
      ? "absolute top-1/2 -right-2 -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-black"
      : "absolute -bottom-2 left-1/2 -translate-x-1/2 border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-black";

  return (
    <div className={`absolute ${position} w-56 bg-black text-white text-[13px] p-4 rounded-xl shadow-2xl z-[2000] pointer-events-auto`}>
      <p className="leading-tight">{text}</p>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onNext();
        }}
        className="mt-2 text-blue-400 font-bold hover:underline block"
      >
        Got it
      </button>
      <div className={arrow} />
    </div>
  );
}