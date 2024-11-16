import axios from "axios";
import { CryptoData } from "@/types/CryptoData";

const CACHE_TTL = 3600000; // 1 hour (in milliseconds)

export const fetchData = async (selectedCoin: string): Promise<CryptoData | null> => {
  // Check if data is in cache and still valid
  const cachedData = localStorage.getItem(selectedCoin);
  if (cachedData) {
    const cached = JSON.parse(cachedData);
    const now = Date.now();
    if (now - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
  }

  const fetchWithRetry = async (retries: number = 3, delay: number = 1000): Promise<CryptoData | null> => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL
    try {
      const response = await axios.get<{ [key: string]: CryptoData }>(
        `${API_URL}?ids=${selectedCoin}&vs_currencies=usd&include_24hr_change=true`
      );
      const coinData = response.data[selectedCoin];
      
      if (coinData) {
        // Cache the fetched data with a timestamp
        localStorage.setItem(selectedCoin, JSON.stringify({ data: coinData, timestamp: Date.now() }));
        return coinData;
      } else {
        console.error("Coin not found in response:", selectedCoin);
        return null;
      }
    } catch (error: any) {
      if (error.response && error.response.status === 429 && retries > 0) {
        // If we hit rate limit (status 429), retry after some delay
        console.warn("Rate limit hit. Retrying...");
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(retries - 1, delay * 2); // Exponential backoff
      } else {
        console.error("Error fetching data:", error);
        return null;
      }
    }
  };

  return await fetchWithRetry(); // Start the fetch with retry logic
};
