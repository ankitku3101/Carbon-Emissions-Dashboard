"use client";
import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface CoalUse {
  coaltype: string;
  gcv: number;
  burntamount: number;
  carbonemission: number;
}

interface ApiResponse {
  data: {
    coaluses: CoalUse[];
    createdAt: string;
  }[];
}

function Statistics() {
  const [coalData, setCoalData] = useState<CoalUse[]>([]);
  const [loading, setLoading] = useState(true);
  const [createdAt, setCreatedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchCoalData = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/get-data", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            start: "2025-02-27",
            end: "2026-04-09",
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data: ApiResponse = await response.json();
        console.log("Fetched data:", data); // Log the data for debugging

        // Check if data is valid before setting state
        if (data && data.data && data.data.length > 0) {
          const { coaluses, createdAt } = data.data[0]; // Assuming the first element contains the relevant data
          setCoalData(coaluses);
          setCreatedAt(createdAt);
        } else {
          console.error("Invalid data structure:", data);
        }
      } catch (error) {
        console.error("Error fetching coal data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoalData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 pt-10 pb-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6">Coal Usage Statistics</h2>
        {loading ? (
          <p className="text-center text-lg font-semibold text-gray-600">
            Loading data...
          </p>
        ) : (
          <>
            {createdAt && (
              <div className="bg-white p-6 shadow-md rounded-lg mb-8">
                <h3 className="text-lg font-semibold mb-4">Carbon Emission Trend</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={[{ createdAt, carbonemission: coalData.reduce((sum, use) => sum + use.carbonemission, 0) }]}>
                    <XAxis
                      dataKey="createdAt"
                      tickFormatter={(date) => new Date(date).toLocaleDateString()}
                    />
                    <YAxis />
                    <CartesianGrid stroke="#ccc" />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="carbonemission"
                      stroke="#FF5733"
                      strokeWidth={2}
                      name="Carbon Emission (tons)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Burnt Coal Amount by Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coalData}>
                  <XAxis dataKey="coaltype" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="burntamount" fill="#33B5E5" name="Burnt Coal (tons)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white p-6 shadow-md rounded-lg">
              <h3 className="text-lg font-semibold mb-4">Gross Calorific Value (GCV) by Coal Type</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={coalData}>
                  <XAxis dataKey="coaltype" />
                  <YAxis />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="gcv" fill="#FFC300" name="GCV (MJ/kg)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Statistics;
