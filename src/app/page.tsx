'use client';
import CryptoPriceTracker from "@/components/CryptoPriceTracker";
import BitcoinHalvingCountdown from "@/components/BitcoinHalvingCountdown";
import { useEffect, useState } from "react";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Function to check and apply the current color scheme preference
    const handleThemeChange = (e: MediaQueryListEvent) => {
      const prefersDark = e.matches;
      setIsDarkMode(prefersDark);
      if (prefersDark) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Create a media query to detect the dark mode preference
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    // Initial theme check (set the state and apply the class)
    const prefersDark = darkModeMediaQuery.matches;
    setIsDarkMode(prefersDark);
    if (prefersDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // Listen for changes in dark mode preference
    darkModeMediaQuery.addEventListener("change", handleThemeChange);

    // Cleanup the event listener when the component is unmounted
    return () => {
      darkModeMediaQuery.removeEventListener("change", handleThemeChange);
    };
  }, []);

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4`}>
      {/* Title with Tailwind dark mode class */}
      <h1 className={`text-3xl font-bold mb-6 ${isDarkMode ? "text-white" : "text-gray-900"}`}>
        Crypto Tracker
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-3xl">
        <CryptoPriceTracker />
        <BitcoinHalvingCountdown />
      </div>
    </div>
  );
};

export default Home;
