"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged, sendPasswordResetEmail, signOut, updateEmail, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { toast } from "react-toastify";


export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [password, setPassword] = useState("");
  const [updatingEmail, setUpdatingEmail] = useState(false);
  const [showPasswordField, setShowPasswordField] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        setLoading(false);
      } else {
        router.push("/");
        toast.error("Please log in to access your profile.");
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleEmailChange = async (e) => {
    e.preventDefault();

    if (!newEmail || !newEmail.trim()) {
      toast.error("Please enter a valid email address.", {
        position: "top-center",
      });
      return;
    }

    if (newEmail === user?.email) {
      toast.error("New email must be different from current email.", {
        position: "top-center",
      });
      return;
    }

    if (!showPasswordField) {
      setShowPasswordField(true);
      return;
    }

    if (!password || !password.trim()) {
      toast.error("Please enter your password to confirm the email change.", {
        position: "top-center",
      });
      return;
    }

    setUpdatingEmail(true);

    try {
      if (!auth.currentUser || !user?.email) {
        throw new Error("User not authenticated");
      }

      // Re-authenticate user with current email and password
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update email after successful re-authentication
      await updateEmail(auth.currentUser, newEmail);

      toast.success("Email updated successfully!", {
        position: "top-center",
      });
      setIsEditingEmail(false);
      setNewEmail("");
      setPassword("");
      setShowPasswordField(false);
    } catch (error) {
      console.error("Email update error:", error);
      let errorMessage = "Failed to update email.";
      if (error.code === "auth/email-already-in-use") {
        errorMessage = "This email is already in use by another account.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/wrong-password" || error.code === "auth/invalid-credential") {
        errorMessage = "Incorrect password. Please try again.";
        setPassword("");
      } else if (error.code === "auth/requires-recent-login") {
        errorMessage = "Please log out and log in again before changing your email.";
      } else if (error.code === "auth/network-request-failed") {
        errorMessage = "Network error. Please check your internet connection.";
      } else if (error.message) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setUpdatingEmail(false);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!user?.email) {
      toast.error("No email found. Please log in again.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent! Please check your inbox.", {
        position: "top-center",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      let errorMessage = "Failed to send password reset email.";
      if (error.code === "auth/user-not-found") {
        errorMessage = "User not found.";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Invalid email address.";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Too many requests. Please try again later.";
      }
      toast.error(errorMessage, {
        position: "top-center",
      });
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out successfully!");
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-blue-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-br from-blue-100 via-white to-blue-100 px-10 py-6">
      <div className="w-full max-w-md mt-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center">Profile Page</h1>

        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            {!isEditingEmail ? (
              <div className="flex items-center justify-between">
                <p className="text-gray-900 font-semibold">{user?.email}</p>
                <button
                  onClick={() => {
                    setIsEditingEmail(true);
                    setNewEmail(user?.email || "");
                  }}
                  className="ml-4 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 text-gray-700 rounded transition-colors"
                >
                  Change
                </button>
              </div>
            ) : (
              <form onSubmit={handleEmailChange} className="space-y-3">
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter new email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                  disabled={updatingEmail}
                />
                {showPasswordField && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your current password"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                      required
                      disabled={updatingEmail}
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Please enter your password to confirm the email change.
                    </p>
                  </div>
                )}
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={updatingEmail}
                    className="flex-1 py-2 px-4 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {updatingEmail ? "Updating..." : showPasswordField ? "Update Email" : "Continue"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditingEmail(false);
                      setNewEmail("");
                      setPassword("");
                      setShowPasswordField(false);
                    }}
                    disabled={updatingEmail}
                    className="flex-1 py-2 px-4 bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold rounded-lg transition-all duration-200 disabled:bg-gray-200 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              User ID
            </label>
            <p className="text-gray-600 text-sm break-all">{user?.uid}</p>
          </div> */}

          <button
            onClick={handlePasswordReset}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-4"
          >
            Reset Password
          </button>

          <button
            onClick={handleLogout}
            className="w-full py-3 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-200 mt-6"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() => router.push("/map")}
          className="mb-4 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium transition"
        >
          Back to Map
        </button>

      </div>
    </div>
  );
}