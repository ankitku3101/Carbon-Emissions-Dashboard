"use client";

import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from "recharts";

function Statistics() {
  const [coalEmissionsData, setCoalEmissionsData] = useState([]);

  useEffect(() => {
    // Replace with your actual API endpoint
    fetch("/api/coal-emissions")
      .then((res) => res.json())
      .then((data) => setCoalEmissionsData(data))
      .catch((error) => console.error("Error fetching coal emissions data:", error));
  }, []);

  return (
    <div className="h-screen flex flex-col items-center justify-between p-10">
      <h2 className="text-2xl font-bold mb-6">Coal Emissions Statistics</h2>

      {/* Line Chart - Coal CO₂ Emissions Over Time */}
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Coal CO₂ Emissions Trend</h3>
        <LineChart width={600} height={300} data={coalEmissionsData}>
          <XAxis dataKey="Month" />
          <YAxis />
          <CartesianGrid stroke="#ccc" />
          <Tooltip />
          <Line type="monotone" dataKey="Emissions from Coal (mil t)" stroke="#FF5733" strokeWidth={2} name="Coal Emissions" />
        </LineChart>
      </div>

      {/* Bar Chart - Coal Type Contribution */}
      <div className="bg-white p-6 shadow-md rounded-lg w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-2">Coal Type Contribution</h3>
        <BarChart width={600} height={300} data={coalEmissionsData}>
          <XAxis dataKey="Month" />
          <YAxis />
          <CartesianGrid strokeDasharray="3 3" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Anthracite" fill="#FF5733" name="Anthracite" />
          <Bar dataKey="Bituminous" fill="#33B5E5" name="Bituminous" />
          <Bar dataKey="Sub-bituminous" fill="#FFC300" name="Sub-bituminous" />
          <Bar dataKey="Lignite" fill="#28A745" name="Lignite" />
        </BarChart>
      </div>
    </div>
  );
}

export default Statistics;
