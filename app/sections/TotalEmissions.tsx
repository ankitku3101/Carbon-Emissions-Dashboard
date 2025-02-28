'use client'

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface CoalUsage {
  _id: string;
  coaltype: string;
  carbonemission: number;
}

interface EmissionData {
  _id: string;
  coalusages: CoalUsage[];
  totalemission: number;
  createdAt: string;
}

export default function TotalEmissions() {
  const [startDate, setStartDate] = useState("2025-02-27");
  const [endDate, setEndDate] = useState("2026-04-09");
  const [emissionsData, setEmissionsData] = useState<EmissionData[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmissions = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/total-emission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });

      const data = await response.json();

      if (response.ok) {
        setEmissionsData(data.data);
        toast.success("Data fetched successfully");

        // ✅ **Format Data for Chart**
        const processedData = data.data.map((item) => {
          let entry: any = {
            date: format(new Date(item.createdAt), "MMM dd, yyyy"), 
            totalEmission: item.totalemission, 
          };

          item.coalusages.forEach((usage) => {
            entry[usage.coaltype] = usage.carbonemission;
          });

          return entry;
        });

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
    fetchEmissions();
  }, []);

  return (
    <div className="p-10 m-20 max-w-6xl mx-auto bg-white text-black rounded-lg shadow-lg">
      <h2 className="text-4xl font-bold mb-8 text-center text-green-600">Total Emissions Tracker</h2>

      {/* ✅ **Input Fields** */}
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
          onClick={fetchEmissions} 
          disabled={loading} 
          className="p-3 bg-green-500 hover:bg-green-400 text-white font-semibold w-40"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>

      {/* ✅ **Chart Section** */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600">Emissions Overview</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={450}>
            <BarChart data={chartData} margin={{ top: 20, right: 40, left: 40, bottom: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
              <XAxis dataKey="date" stroke="#333" />
              <YAxis stroke="#333" />
              <Tooltip cursor={{ fill: "rgba(0,0,0,0.1)" }} />
              <Legend />
              <Bar dataKey="totalEmission" fill="#ff6600" name="Total Emission" barSize={50} />

              {chartData.length > 0 &&
                Object.keys(chartData[0])
                  .filter((key) => key !== "date" && key !== "totalEmission")
                  .map((coalType, index) => (
                    <Bar
                      key={coalType}
                      dataKey={coalType}
                      fill={["#3498db", "#e74c3c", "#2ecc71", "#f39c12"][index % 4]} // Different colors
                      name={coalType}
                      barSize={40}
                    />
                  ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 text-lg">No emissions data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
}
