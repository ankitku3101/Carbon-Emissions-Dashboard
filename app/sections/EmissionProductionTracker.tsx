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
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Emission & Production Tracker</h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <Input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        <Input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        <Button onClick={fetchEmissionProduction} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="totalEmission" stroke="#ff7300" name="Total Emission" />
          <Line type="monotone" dataKey="production" stroke="#387908" name="Production" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
