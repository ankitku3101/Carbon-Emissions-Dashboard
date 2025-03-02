"use client";

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";

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
  coaltype:string,
  gcv:number,
  totalemissions:number,
  totalBurntAmountOfLatestEntry:number
}

interface ResponseData{
  coaltype:string,
  gcv:number,
  plf:number,
  production:number,
  totalemissions:number,
  totalBurntAmountOfLatestEntry:number
      
}

export default function Suggestion() {
  const [latestData, setLatestData] = useState<LatestData | null>(null);
  const [suggestion, setSuggestion] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDataAndSuggestion = async () => {
      await fetchLatestData();
      if (latestData) {
        console.log('Executing send segguestion');
        await sendSuggestionRequest();
      }
    };

    fetchDataAndSuggestion();
  }, []);

  useEffect(()=>{
    const executingSuggestion = async() =>{
      if (latestData) {
        console.log('Executing send segguestion');
        await sendSuggestionRequest();
      }
    }

    executingSuggestion();
  },[latestData])

  const fetchLatestData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/get-latest"); // Adjust the endpoint as needed
      const data = await response.json();
      console.log("Suggestion Data");
      console.log(data);
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
      console.log(latestData);
      const {
        coaltype,gcv,totalBurntAmountOfLatestEntry,plf,production,totalemission
      } = latestData;
      // const response = await fetch("https://mole-model-drake.ngrok-free.app/suggest", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     coaltype: coaltype || "",
      //     gcv: gcv || 0,
      //     burntamount: totalBurntAmountOfLatestEntry || 0,
      //     plf: plf || 0,
      //     production: production || 0,
      //     totalemissions: totalemission || 0,
      //   }),
      // });
      
      // const data = await response.json();
      // console.log(data);
      
      setSuggestion("data.suggestion");
      
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
            <pre className="text-sm text-gray-700">{suggestion}</pre>
          </div>
        )
      )}
    </div>
  );
}
