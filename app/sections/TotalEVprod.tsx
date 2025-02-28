'use client'

import { useState } from "react";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface ProductionData {
  _id: string;
  production: number;
  createdAt: string;
}

export default function TotalEVprod() {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [productionData, setProductionData] = useState<ProductionData[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductionData = async () => {
    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }
    setLoading(true);
    try {
      const response = await fetch("/api/total-ev-prod", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ start: startDate, end: endDate }),
      });
      const data = await response.json();
      if (response.ok) {
        setProductionData(data.data);
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
    <div className="p-6 max-w-3xl mx-auto bg-gray-900 text-white rounded-lg shadow-md m-10">
      <h2 className="text-2xl font-bold mb-4">Coal Production Tracker</h2>
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
        <Button onClick={fetchProductionData} disabled={loading}>
          {loading ? "Loading..." : "Fetch Data"}
        </Button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-700">
          <thead>
            <tr className="bg-gray-800">
              <th className="border border-gray-700 px-4 py-2">Production</th>
              <th className="border border-gray-700 px-4 py-2">Date</th>
            </tr>
          </thead>
          <tbody>
            {productionData.length > 0 ? (
              productionData.map((item) => (
                <tr key={item._id} className="border border-gray-700">
                  <td className="border border-gray-700 px-4 py-2">{item.production}</td>
                  <td className="border border-gray-700 px-4 py-2">{new Date(item.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={2} className="text-center border border-gray-700 px-4 py-2">
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
