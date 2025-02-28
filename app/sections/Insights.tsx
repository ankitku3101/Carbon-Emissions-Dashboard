"use client";

import React, { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
  BarChart, Bar, PieChart, Pie, ScatterChart, Scatter, Cell,ResponsiveContainer
} from "recharts";
import axios from "axios";

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

interface CoalEmissionData {
  _id: string;
  dates: string[];
  emissions: number[];
}

interface ProductionData {
  _id: string;
  production: number;
  createdAt: string;
}

interface ProductionChartData {
  date: string;
  production: number;
}

const COLORS = ["#98FB98", "#F5F5DC", "#00CED1"]; // Mint Green, Off-White, Cyan

const Insights = () => {
  const [selectedFeature, setSelectedFeature] = useState("production");
  const [data,setData] = useState({totalEmission:0,totalProduction:0,averagePLF:0});
  const [plotdata, setPlotData] = useState<CoalEmissionData[]>([]);
  const [productionData, setProductionData] = useState<ProductionChartData[]>([]);

  useEffect(()=>{
    fetch("http://localhost:3000/api/overall-info")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Got data");
        const {totalEmission,totalProduction,averagePLF} = data.data[0];
        console.log(totalEmission,totalProduction,averagePLF);

        setData({totalEmission,totalProduction,averagePLF});
      })
      .catch((error) => {
        console.log(error);
      })
  },[])

  useEffect(()=>{
    const fetchData = async () => {
      try {
        
        console.log("Getting Data");
        const response = await axios.post<{ data: CoalEmissionData[] }>("http://localhost:3000/api/coal-type-emission",{start: "2025-02-27",end: "2025-04-09"});
        console.log(response?.data.data);
        setPlotData(response?.data.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  },[])

  const transformedData = plotdata[0]?.dates.map((date, index) => ({
    date: new Date(date).toLocaleDateString(), // Formatting date
    anthracite: plotdata.find((item) => item._id === "anthracite")?.emissions[index],
    bituminous: plotdata.find((item) => item._id === "bituminous")?.emissions[index],
    lignite: plotdata.find((item) => item._id === "lignite")?.emissions[index],
  }));

  useEffect(() => {
    const fetchProductionData = async () => {
      try {
        const response = await axios.post<{ data: ProductionData[] }>(
          "http://localhost:3000/api/total-ev-prod",{start: "2025-02-27",end: "2025-04-09"}
        );
        const responseData = response.data.data;
        console.log("Getting for single line graphs")
        console.log(responseData)

        // Transform data: format date & structure for recharts
        const formattedData = responseData.map(item => ({
          date: new Date(item.createdAt).toLocaleDateString(),
          production: item.production
        }));

        setProductionData(formattedData);
      } catch (error) {
        console.error("Error fetching production data:", error);
      }
    };

    fetchProductionData();
  }, []);

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
            <p className="text-2xl font-bold text-red-500">{data.totalEmission} tons</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600">Plant Load Factor (PLF)</h3>
            <p className="text-2xl font-bold text-blue-500">{data.averagePLF}%</p>
          </div>
          <div className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold text-gray-600">Total Production</h3>
            <p className="text-2xl font-bold text-green-500">{data.totalProduction} MWh</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 shadow-lg rounded-lg">
            <h3 className="text-lg font-semibold text-center mb-4">📈 Carbon Emissions Trend</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={transformedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Line type="monotone" dataKey="anthracite" stroke="#ff7300" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="bituminous" stroke="#8884d8" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="lignite" stroke="#82ca9d" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
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
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={productionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />

                  <Line type="monotone" dataKey="production" stroke="#007BFF" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Insights;
