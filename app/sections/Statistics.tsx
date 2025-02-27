"use client"; // Ensure the component runs only on the client

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend, ResponsiveContainer } from "recharts";

interface CoalData {
  coaltype: string;
  gcv: number;
  burntamount: number;
  carbonemission: number;
  createdAt: string;
}

function Statistics() {
  const [coalData, setCoalData] = useState<CoalData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoalData = async () => {
      try {
        const response = await fetch("/api/coal-usage");
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setCoalData(data);
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
        {/* Heading */}
        <h2 className="text-3xl font-bold text-center mb-6">Coal Usage Statistics</h2>

        {/* 📊 Show Loader if Data is Not Available */}
        {loading ? (
          <p className="text-center text-lg font-semibold text-gray-600">Loading data...</p>
        ) : (
          <>
            {/* 📊 Line Chart - Carbon Emission Trend */}
            <div className="bg-white p-6 shadow-md rounded-lg mb-8">
              <h3 className="text-lg font-semibold mb-4">Carbon Emission Trend</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={coalData}>
                  <XAxis dataKey="createdAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
                  <YAxis />
                  <CartesianGrid stroke="#ccc" />
                  <Tooltip />
                  <Line type="monotone" dataKey="carbonemission" stroke="#FF5733" strokeWidth={2} name="Carbon Emission (tons)" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* 📊 Bar Chart - Burnt Coal Amount by Type */}
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

            {/* 📊 Bar Chart - GCV by Coal Type */}
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
