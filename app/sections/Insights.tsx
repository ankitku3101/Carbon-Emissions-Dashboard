"use client";

import React, { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, Cell,
} from "recharts";

// Updated Dummy Data
const coalData = {
  _id: "956875b7-d705-4285-89e4-22042e00ad4b",
  coaluses: [
    { coaltype: "bituminous", gcv: 5845.68, burntamount: 229.14, carbonemission: 52080.81 },
    { coaltype: "anthracite", gcv: 5114.96, burntamount: 441.19, carbonemission: 104635.49 },
    { coaltype: "lignite", gcv: 3317.74, burntamount: 302.44, carbonemission: 101060.46 }
  ],
  plf: 63.9,
  production: 2583,
  totalemission: 1968867.75,
};

const COLORS = ["#98FB98", "#F5F5DC", "#00CED1"]; // Mint Green, Off-White, Cyan

const Insights = () => {
  const [selectedFeature, setSelectedFeature] = useState("production");

  // Feature-Based Data
  const featureData = {
    production: [
      { month: "Jan", value: 2000 },
      { month: "Feb", value: 2500 },
      { month: "Mar", value: 2700 },
    ],
    plf: [
      { month: "Jan", value: 60 },
      { month: "Feb", value: 65 },
      { month: "Mar", value: 70 },
    ],
    coalusage: [
      { coaltype: "Bituminous", value: 500 },
      { coaltype: "Anthracite", value: 400 },
      { coaltype: "Lignite", value: 300 },
    ],
  };

  return (
    <div>
      <section className="p-16 min-h-screen bg-gray-100">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">Data Trends & Insights</h2>
        <div className="bg-white p-8 shadow-lg rounded-lg mb-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600">Total Emissions</h3>
            <p className="text-2xl font-bold text-red-500">{coalData.totalemission} tons</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600">Plant Load Factor (PLF)</h3>
            <p className="text-2xl font-bold text-blue-500">{coalData.plf}%</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600">Total Production</h3>
            <p className="text-2xl font-bold text-green-500">{coalData.production} MWh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">📈 Carbon Emissions Trend</h3>
            <LineChart width={350} height={300} data={coalData.coaluses} className="mx-auto">
              <XAxis dataKey="coaltype" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="carbonemission" stroke="#FF5733" strokeWidth={2} />
            </LineChart>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">🔥 Burnt Coal vs CO₂ Emissions</h3>
            <BarChart width={350} height={300} data={coalData.coaluses} className="mx-auto">
              <XAxis dataKey="coaltype" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="burntamount" fill="#33B5E5" />
              <Bar dataKey="carbonemission" fill="#FF5733" />
            </BarChart>
          </div>

          <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-center mb-4">⛏️ Coal Type Contribution</h3>
            <PieChart width={300} height={300}>
              <Pie data={coalData.coaluses} dataKey="carbonemission" nameKey="coaltype" cx="50%" cy="50%" outerRadius={100} label>
                {coalData.coaluses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>
        </div>
      </section>

      <section className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl mx-auto mt-10">
        <h2 className="text-2xl font-bold text-gray-700 mb-4 text-center">📊 Feature-Based Visualization</h2>

        <div className="flex justify-center gap-3 mb-5">
          {["production", "plf", "coalusage"].map((feature) => (
            <button
              key={feature}
              onClick={() => setSelectedFeature(feature)}
              className={`px-4 py-2 rounded-lg transition-all ${
                selectedFeature === feature ? "bg-gray-300 text-gray-700 shadow-md" : "bg-[#f5f5dc] text-gray-600 hover:bg-gray-200"
              }`}
            >
              {feature.charAt(0).toUpperCase() + feature.slice(1)}
            </button>
          ))}
        </div>

        <div className="bg-gray-100 p-5 rounded-lg shadow-md flex justify-center">
          <div className="w-[60%] max-w-md">
            {selectedFeature === "coalusage" ? (
              <PieChart width={300} height={300}>
                <Pie data={featureData[selectedFeature]} dataKey="value" nameKey="coaltype" cx="50%" cy="50%" outerRadius={100} label>
                  {featureData[selectedFeature].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            ) : (
              <LineChart width={350} height={250} data={featureData[selectedFeature]}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Line type="monotone" dataKey="value" stroke="#007BFF" strokeWidth={2} />
              </LineChart>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
