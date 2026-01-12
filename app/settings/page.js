"use client";

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation"; // ✅ Add this

export default function SettingsPage() {
  const [hand, setHand] = useState("center");
  const router = useRouter(); // ✅ Initialize router

  // Load saved hand position from localStorage
  useEffect(() => {
    const savedHand = localStorage.getItem("handPosition");
    if (savedHand) setHand(savedHand);
  }, []);

  // Save hand position to localStorage
  const handleHandChange = (position) => {
    setHand(position);
    localStorage.setItem("handPosition", position);
    toast.success(`Hand position set to ${position}`, { position: "top-center" });
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-100 px-6 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Settings</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 space-y-6 w-full max-w-md">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Button position</h2>
          <div className="flex gap-4">
            <button
              onClick={() => handleHandChange("left")}
              className={`flex-1 py-2 rounded-lg font-semibold ${hand === "left"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Left
            </button>
            <button
              onClick={() => handleHandChange("center")}
              className={`flex-1 py-2 rounded-lg font-semibold ${hand === "center"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Center
            </button>
            
            <button
              onClick={() => handleHandChange("right")}
              className={`flex-1 py-2 rounded-lg font-semibold ${hand === "right"
                  ? "bg-red-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
            >
              Right
            </button>
          </div>
        </div>
      </div>
<br></br>
      <button
        onClick={() => router.push("/map")} 
        className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
      >
        Back to Map
      </button>
    </div>
  );
}
