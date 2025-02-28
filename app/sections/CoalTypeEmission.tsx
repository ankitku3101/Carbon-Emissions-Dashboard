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
        headers: {
          "Content-Type": "application/json",
        },
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
    <div className="p-6 max-w-3xl mx-auto bg-white text-black rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Coal Type Emissions</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <Input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        <Button onClick={fetchEmissions} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        {aggregatedData.length > 0 ? (
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-2">Average Emissions by Coal Type</h3>
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={aggregatedData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#ddd" />
                <XAxis dataKey="type" label={{ value: 'Coal Type', position: 'insideBottomRight', offset: 0 }} />
                <YAxis label={{ value: 'Average Emissions (kg)', angle: -90, position: 'insideLeft' }} />
                <Tooltip formatter={(value) => [`Average Emission: ${value} kg`]} />
                <Legend verticalAlign="top" height={36} />
                <Bar dataKey="averageEmission" fill="#8884d8" barSize={60}>
                  <LabelList dataKey="averageEmission" position="top" />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center">No data available</p>
        )}
      </div>
    </div>
  );
}
