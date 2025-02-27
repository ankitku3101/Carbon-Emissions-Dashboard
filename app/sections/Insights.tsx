"use client";
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, Cell,
} from "recharts";

// 🛠 Updated Dummy Data
const coalData = {
  _id: "956875b7-d705-4285-89e4-22042e00ad4b",
  coaluses: [
    {
      _id: "39daed4a-a4bc-435b-9098-521796de8cbc",
      coaltype: "bituminous",
      gcv: 5845.68,
      burntamount: 229.14,
      carbonemission: 52080.81
    },
    {
      _id: "2e31786e-3a31-4853-9871-a8c379588d13",
      coaltype: "anthracite",
      gcv: 5114.96,
      burntamount: 441.19,
      carbonemission: 104635.49
    },
    {
      _id: "796c27fd-5f70-44d9-8f90-a53a9431f409",
      coaltype: "lignite",
      gcv: 3317.74,
      burntamount: 302.44,
      carbonemission: 101060.46
    }
  ],
  plf: 63.9,
  production: 2583,
  totalemission: 1968867.75,
};

const COLORS = ["#FF5733", "#33B5E5", "#FFC300", "#28A745"];

function Insights() {
  return (
    <>
      <section className='px-6 py-12 min-h-screen bg-gray-100'>
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">📊 Data Trends & Insights</h2>

        {/* Summary Section */}
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* 1️⃣ Line Chart - Carbon Emissions Trend */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">📈 Carbon Emissions Trend</h3>
            <LineChart width={450} height={300} data={coalData.coaluses} className="mx-auto">
              <XAxis dataKey="coaltype" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Line type="monotone" dataKey="carbonemission" stroke="#FF5733" strokeWidth={2} />
            </LineChart>
          </div>

          {/* 2️⃣ Bar Chart - Burnt Coal vs CO₂ Emissions */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">🔥 Burnt Coal vs CO₂ Emissions</h3>
            <BarChart width={450} height={300} data={coalData.coaluses} className="mx-auto">
              <XAxis dataKey="coaltype" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Legend />
              <Bar dataKey="burntamount" fill="#33B5E5" />
              <Bar dataKey="carbonemission" fill="#FF5733" />
            </BarChart>
          </div>

          {/* 3️⃣ Pie Chart - Coal Type Contribution */}
          <div className="bg-white p-6 shadow-lg rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-semibold text-center mb-4">⛏️ Coal Type Contribution</h3>
            <PieChart width={300} height={300}>
              <Pie
                data={coalData.coaluses}
                dataKey="carbonemission"
                nameKey="coaltype"
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {coalData.coaluses.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          {/* 4️⃣ Scatter Chart - GCV vs CO₂ Emission Efficiency */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">⚡ GCV vs CO₂ Efficiency</h3>
            <ScatterChart width={450} height={300} className="mx-auto">
              <CartesianGrid />
              <XAxis type="number" dataKey="gcv" name="GCV" unit=" kcal/kg" />
              <YAxis type="number" dataKey="carbonemission" name="CO₂ Emission" unit=" tons" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={coalData.coaluses} fill="#28A745" />
            </ScatterChart>
          </div>

          {/* 5️⃣ Line Chart - PLF vs Production */}
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">🚀 PLF vs Production</h3>
            <LineChart width={450} height={300} data={[{ plf: coalData.plf, production: coalData.production }]} className="mx-auto">
              <XAxis dataKey="plf" />
              <YAxis />
              <CartesianGrid stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="production" stroke="#33B5E5" strokeWidth={2} />
            </LineChart>
          </div>
        </div>   
      </section> 
      <section>
        Feature based visuality
        </section>  
    </>
  );
}

export default Insights;
