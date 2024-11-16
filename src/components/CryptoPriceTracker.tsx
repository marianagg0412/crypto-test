import { useState, useEffect } from "react";
import { CryptoData } from "@/types/CryptoData";
import { fetchData } from "@/app/api/fetchData";

const CryptoPriceTracker = () => {
  const [selectedCoin, setSelectedCoin] = useState("bitcoin");
  const [cryptoData, setCryptoData] = useState<CryptoData | null>(null);

  const coins = [
    { id: "bitcoin", name: "Bitcoin (BTC)" },
    { id: "ethereum", name: "Ethereum (ETH)" },
    { id: "dogecoin", name: "Dogecoin (DOGE)" }, // Replace with your altcoin
  ];

  useEffect(() => {
    const getData = async () => {
      const data = await fetchData(selectedCoin);
      setCryptoData(data);
    };

    getData();
    const interval = setInterval(getData, 60000); 

    return () => clearInterval(interval);
  }, [selectedCoin]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg text-gray-900 max-w-4xl mx-auto">
      <h2 className="text-3xl font-extrabold text-center mb-6">Crypto Price Tracker</h2>

      {/* Dropdown to select the coin */}
      <select
        className="mb-6 p-2 bg-gray-100 border border-gray-300 rounded-lg text-lg w-full max-w-sm mx-auto"
        onChange={(e) => setSelectedCoin(e.target.value)}
        value={selectedCoin}
      >
        {coins.map((coin) => (
          <option key={coin.id} value={coin.id}>
            {coin.name}
          </option>
        ))}
      </select>

      {/* Display crypto data */}
      {cryptoData ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Price */}
          <div className="bg-gray-200 p-8 min-h-[120px] flex flex-col justify-center items-center rounded-lg text-center shadow-md">
            <div className="text-sm text-gray-500">Price (USD)</div>
            <div className="text-4xl font-semibold overflow-hidden text-ellipsis">{cryptoData.usd.toFixed(2)}</div>
          </div>

          {/* 24h Change */}
          <div
            className={`bg-gray-200 p-8 min-h-[120px] flex flex-col justify-center items-center rounded-lg text-center shadow-md ${
              cryptoData.usd_24h_change > 0 ? "border-l-4 border-green-500" : "border-l-4 border-red-500"
            }`}
          >
            <div className="text-sm text-gray-500">24h Change</div>
            <div
              className={`text-3xl font-semibold ${
                cryptoData.usd_24h_change > 0 ? "text-green-500" : "text-red-500"
              }`}
            >
              {cryptoData.usd_24h_change.toFixed(2)}%
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center text-xl text-gray-500 mt-4">Loading...</div>
      )}
    </div>
  );
};

export default CryptoPriceTracker;