"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";

interface CoalData {
  coaltype: string;
  gcv: number;
  burntamount: number;
  carbonemission: number;
  createdAt: string; // Using timestamps from your schema
}

function Statistics() {
  const [coalData, setCoalData] = useState<CoalData[]>([]);

  useEffect(() => {
    fetch("/api/coal-usage")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => setCoalData(data))
      .catch((error) => console.error("Error fetching coal data:", error));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-8">Coal Usage Statistics</h2>

        {/* 📊 Line Chart - Carbon Emission Trend */}
        <div className="bg-white p-6 shadow-md rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Carbon Emission Trend</h3>
          <LineChart width={700} height={300} data={coalData} className="mx-auto">
            <XAxis dataKey="createdAt" tickFormatter={(date) => new Date(date).toLocaleDateString()} />
            <YAxis />
            <CartesianGrid stroke="#ccc" />
            <Tooltip />
            <Line type="monotone" dataKey="carbonemission" stroke="#FF5733" strokeWidth={2} name="Carbon Emission (tons)" />
          </LineChart>
        </div>

        {/* 📊 Bar Chart - Burnt Coal Amount by Type */}
        <div className="bg-white p-6 shadow-md rounded-lg mb-8">
          <h3 className="text-lg font-semibold mb-4">Burnt Coal Amount by Type</h3>
          <BarChart width={700} height={300} data={coalData} className="mx-auto">
            <XAxis dataKey="coaltype" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="burntamount" fill="#33B5E5" name="Burnt Coal (tons)" />
          </BarChart>
        </div>

        {/* 📊 Bar Chart - GCV by Coal Type */}
        <div className="bg-white p-6 shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Gross Calorific Value (GCV) by Coal Type</h3>
          <BarChart width={700} height={300} data={coalData} className="mx-auto">
            <XAxis dataKey="coaltype" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Bar dataKey="gcv" fill="#FFC300" name="GCV (MJ/kg)" />
          </BarChart>
        </div>
      </div>
    </div>
  );
}

export default Statistics;
