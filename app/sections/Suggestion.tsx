"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface CoalUsage {
  coaltype: string;
  gcv: number;
  burntamount: number;
}

interface LatestData {
  _id: string;
  coalusage: CoalUsage[];
  plf: number;
  production: number;
  totalemission: number;
}

export default function Suggestion() {
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataAndSuggestion = async () => {
      await fetchLatestData();
      if (latestData) {
        await sendSuggestionRequest();
      }
    };

    fetchDataAndSuggestion();
  }, []);

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-latest"); // Adjust the endpoint as needed
      const data = await response.json();
      if (response.ok) {
        setLatestData(data.latestData[0]);
      } else {
        toast.error(data.error || "Failed to fetch latest data");
      }
    } catch (error) {
      toast.error("Error fetching latest data");
    } finally {
      setLoading(false);
    }
  };

  const sendSuggestionRequest = async () => {
    if (!latestData) {
      toast.error("No data available to send suggestion request");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("https://mole-model-drake.ngrok-free.app/suggest", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coaltype: latestData.coalusage[0]?.coaltype || "",
          gcv: latestData.coalusage[0]?.gcv || 0,
          burntamount: latestData.coalusage[0]?.burntamount || 0,
          plf: latestData.plf || 0,
          production: latestData.production || 0,
          totalemissions: latestData.totalemission || 0,
        }),
      });
      const data = await response.json();
      setSuggestion(data);
      console.log("Suggestion data received:", data); // Debugging log
    } catch (error) {
      toast.error("Error sending suggestion request");
      console.error("Error sending suggestion request:", error); // Debugging log
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Suggestion state updated:", suggestion); // Debugging log
  }, [suggestion]);

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Suggestion Based on Latest Data</h2>
      {loading ? (
        <p className="text-center text-gray-700">Loading...</p>
      ) : (
        suggestion && (
          <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300">
            <h3 className="text-lg font-semibold mb-2 text-gray-800">Suggestion</h3>
            <pre className="text-sm text-gray-700">{JSON.stringify(suggestion, null, 2)}</pre>
          </div>
        )
      )}
    </div>
  );
}
