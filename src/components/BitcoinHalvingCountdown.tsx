'use client'

import { useEffect, useState } from "react";
import axios from "axios";
import { TimeLeft } from "@/types/TimeLeft";

const BitcoinHalvingCountdown = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [halvingDate, setHalvingDate] = useState<Date | null>(null);

  useEffect(() => {
    const fetchBitcoinData = async () => {
      try {
        const response = await axios.get('/api/halving');
        const blockHeight = response.data;
        console.log("Block height:", blockHeight);
        // Estimate the next halving date
        const blocksUntilHalving = 210000 - (blockHeight % 210000);
        const timeUntilHalving = blocksUntilHalving * 10 * 60 * 1000; // 10 minutes per block
        const estimatedHalvingDate = new Date(new Date().getTime() + timeUntilHalving);

        setHalvingDate(estimatedHalvingDate);
      } catch (error) {
        console.error("Error fetching Bitcoin data:", error);
      }
    };

    fetchBitcoinData();
    const interval = setInterval(fetchBitcoinData, 60000); // Refresh every minute
    return () => clearInterval(interval); // Cleanup on component unmount
  }, []);

  useEffect(() => {
    if (halvingDate) {
      const calculateTimeLeft = () => {
        const difference = halvingDate.getTime() - new Date().getTime();

        if (difference > 0) {
          const years = Math.floor(difference / (1000 * 60 * 60 * 24 * 365.25)); // Approximate years using 365.25 days
          const days = Math.floor(difference / (1000 * 60 * 60 * 24)) % 365;
          const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
          const minutes = Math.floor((difference / 1000 / 60) % 60);
          const seconds = Math.floor((difference / 1000) % 60);

          setTimeLeft({ years, days, hours, minutes, seconds });
        } else {
          setTimeLeft(null); // Halving event occurred
        }
      };

      // Recalculate time every second to update the countdown dynamically
      const timer = setInterval(calculateTimeLeft, 1000);
      return () => clearInterval(timer); // Cleanup timer on unmount
    }
  }, [halvingDate]); // Re-run this effect when halvingDate changes

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-gray-900 max-w-6xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-6">Bitcoin Halving Countdown</h2>
      {timeLeft ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 text-lg sm:text-xl md:text-2xl font-mono">
          {/* Year */}
          <div className="bg-gray-200 flex flex-col justify-center items-center p-6 rounded-lg text-center shadow-md min-h-[150px]">
            <div className="text-sm text-gray-500">Years</div>
            <div className="text-3xl font-semibold">{timeLeft.years}</div>
          </div>

          {/* Days */}
          <div className="bg-gray-200 flex flex-col justify-center items-center p-6 rounded-lg text-center shadow-md min-h-[150px]">
            <div className="text-sm text-gray-500">Days</div>
            <div className="text-3xl font-semibold truncate">{timeLeft.days}</div>
          </div>

          {/* Hours */}
          <div className="bg-gray-200 flex flex-col justify-center items-center p-6 rounded-lg text-center shadow-md min-h-[150px]">
            <div className="text-sm text-gray-500">Hours</div>
            <div className="text-3xl font-semibold">{timeLeft.hours}</div>
          </div>

          {/* Minutes */}
          <div className="bg-gray-200 flex flex-col justify-center items-center p-6 rounded-lg text-center shadow-md min-h-[150px]">
            <div className="text-sm text-gray-500">Minutes</div>
            <div className="text-3xl font-semibold">{timeLeft.minutes}</div>
          </div>

          {/* Seconds */}
          <div className="bg-gray-200 flex flex-col justify-center items-center p-6 rounded-lg text-center shadow-md min-h-[150px]">
            <div className="text-sm text-gray-500">Seconds</div>
            <div className="text-3xl font-semibold">{timeLeft.seconds}</div>
          </div>
        </div>
      ) : (
        <p className="text-xl text-center mt-6">Halving event has occurred!</p>
      )}
    </div>
  );
};

export default BitcoinHalvingCountdown; 