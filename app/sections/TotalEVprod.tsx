'use client'

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface ProductionData {
  _id: string;
  production: number;
  createdAt: string;
}

export default function TotalEVprod() {
  const [startDate, setStartDate] = useState("2025-02-27");
  const [endDate, setEndDate] = useState("2026-04-09");
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductionData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/total-ev-prod", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });

      const data = await response.json();
      if (response.ok) {
        setProductionData(data.data);
        toast.success("Data fetched successfully");

        // ✅ **Format Data for Chart**
        const processedData = data.data.map((item) => ({
          date: format(new Date(item.createdAt), "MMM dd, yyyy"), // Date formatting
          production: item.production,
        }));

        setChartData(processedData);
      } else {
        toast.error(data.error || "Failed to fetch data");
      }
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductionData();
  }, []);

  return (
    <div id="coalproduction" className="p-10 m-20 max-w-6xl mx-auto bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-blue-600">Coal Production Tracker</h2>

      {/* ✅ **Date Inputs** */}
      <div className="flex flex-col md:flex-row gap-6 mb-8 justify-center">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="p-3 rounded-md border border-gray-400 bg-gray-100 text-black shadow-sm w-56"
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="p-3 rounded-md border border-gray-400 bg-gray-100 text-black shadow-sm w-56"
        />
        <Button 
          onClick={fetchProductionData} 
          disabled={loading} 
          className="p-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold w-40"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>

      {/* ✅ **Chart Section** */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-gray-700">Production Overview</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
              <XAxis dataKey="date" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="production" fill="#ff6600" name="Coal Production" barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 text-lg">No production data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
}
