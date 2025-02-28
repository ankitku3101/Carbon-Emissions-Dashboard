'use client'
import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface CoalUsage {
  _id: string;
  coaltype: string;
  carbonemission: number;
}

interface EmissionData {
  _id: string;
  coalusages: CoalUsage[];
  totalemission: number;
}

export default function TotalEmissions() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [emissionsData, setEmissionsData] = useState<EmissionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchEmissions = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/total-emission", {
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

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Total Emissions Tracker</h2>
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
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Coal Type</th>
              <th className="border border-gray-700 px-4 py-2">Carbon Emission</th>
              <th className="border border-gray-700 px-4 py-2">Total Emission</th>
            </tr>
          </thead>
          <tbody>
            {emissionsData.length > 0 ? (
              emissionsData.map((item, index) => (
                <tr key={index} className="border border-gray-700">
                  <td className="border border-gray-700 px-4 py-2">
                    {item.coalusages?.map((usage) => usage.coaltype).join(", ")}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">
                    {item.coalusages?.map((usage) => usage.carbonemission).join(", ")}
                  </td>
                  <td className="border border-gray-700 px-4 py-2">{item.totalemission}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="text-center border border-gray-700 px-4 py-2">
                  No data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
