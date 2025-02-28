'use client'

import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';

interface EmissionData {
  _id: string; // Coal type
  dates: string[];
  emissions: number[];
}

export default function CoalTypeEmission() {
  const [startDate, setStartDate] = useState("2025-02-27");
  const [endDate, setEndDate] = useState("2026-04-09");
  const [emissionsData, setEmissionsData] = useState<EmissionData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEmissions();
  }, []);

  const fetchEmissions = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/coal-type-emission", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });
      const data = await response.json();
      if (response.ok) {
        setEmissionsData(data.data);
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

  // Aggregate data for the bar chart
  const aggregatedData = emissionsData.map(item => ({
    type: item._id,
    averageEmission: item.emissions.reduce((a, b) => a + b, 0) / item.emissions.length,
  }));

  return (
    <div className="p-10 m-20 max-w-4xl mx-auto bg-white text-black rounded-lg shadow-lg space-y-8">
      {/* ✅ **Heading Section (Stylish UI)** */}
      <h2 className="text-3xl font-bold text-center text-green-600">Coal Type Emissions</h2>

      {/* ✅ **Input Fields Section (Better Spacing & Alignment)** */}
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
          onClick={fetchEmissions} 
          disabled={loading} 
          className="p-3 bg-blue-500 hover:bg-blue-400 text-white font-semibold w-44"
        >
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>

      {/* ✅ **Chart Section (Better Design & Spacing)** */}
      <div className="bg-gray-100 p-8 rounded-lg shadow-md">
        <h3 className="text-2xl font-semibold mb-6 text-center text-blue-600">Average Emissions by Coal Type</h3>

        {aggregatedData.length > 0 ? (
          <div className="w-full h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={aggregatedData} margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.2)" />
                <XAxis dataKey="type" stroke="#333" />
                <YAxis stroke="#333" />
                <Tooltip formatter={(value) => [`Average Emission: ${value} kg`]} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="averageEmission" fill="#8884d8" barSize={60}>
                  <LabelList dataKey="averageEmission" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-gray-500 text-lg">No data available for the selected date range.</p>
        )}
      </div>
    </div>
  );
}
