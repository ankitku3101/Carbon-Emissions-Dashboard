'use client'

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

interface CoalUsage {
  _id: string;
  coaltype: string;
  carbonemission: number;
}

interface EmissionProductionData {
  _id: string;
  coalusages: CoalUsage[];
  totalemission: number;
  production: number;
  createdAt: string;
}

export default function EmissionProductionTracker() {
  const [startDate, setStartDate] = useState("2025-02-27");
  const [endDate, setEndDate] = useState("2026-04-09");
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmissionProduction();
  }, []);

  const fetchEmissionProduction = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/emission-production", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });
      const data = await response.json();
      if (response.ok) {
        const formattedData = data.data.map((item: EmissionProductionData) => ({
          date: new Date(item.createdAt).toLocaleDateString(),
          totalEmission: item.totalemission,
          production: item.production,
        }));
        setChartData(formattedData);
        toast.success("Data fetched successfully");
      } else {
        toast.error(data.error || "Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="tracker" className="p-10 m-20 max-w-4xl mx-auto bg-white text-black rounded-lg shadow-lg space-y-8">
      <h2 className="text-3xl font-bold text-center text-green-600">Emission & Production Tracker</h2>

      {/* ✅ **Input Fields Section (Fixed Spacing)** */}
      <div className="flex flex-col md:flex-row gap-6 mb-6 justify-center items-center">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 rounded-md border border-gray-400 bg-gray-100 text-black shadow-sm w-64"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 rounded-md border border-gray-400 bg-gray-100 text-black shadow-sm w-64"
        />
        <Button 
          onClick={fetchEmissionProduction} 
          disabled={loading} 
          className="p-3 bg-green-500 hover:bg-green-400 text-white font-semibold w-44"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>

      {/* ✅ **Chart Section (Fixed Margin & Spacing)** */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600">Emission & Production Overview</h3>
        <div className="w-full h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
              <XAxis dataKey="date" stroke="#333" angle={-10} textAnchor="end" />
              <YAxis stroke="#333" />
              <Tooltip cursor={{ stroke: "#8884d8", strokeWidth: 2 }} />
              <Legend />
              <Line type="monotone" dataKey="totalEmission" stroke="#ff6600" name="Total Emission" strokeWidth={3} />
              <Line type="monotone" dataKey="production" stroke="#387908" name="Production" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
