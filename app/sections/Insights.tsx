"use client"

import React, { useState } from 'react';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';

// Register Chart.js modules
Chart.register(...registerables);

const Insights = () => {
    const [selectedFeature, setSelectedFeature] = useState("production");

    // Dummy Data (Replace this with API data)
    const data = {
        production: { labels: ["Jan", "Feb", "Mar"], values: [2000, 2500, 2700] },
        plf: { labels: ["Jan", "Feb", "Mar"], values: [60, 65, 70] },
        coalusage: {
            labels: ["Bituminous", "Anthracite", "Lignite"],
            values: [500, 400, 300],
        }
    };

    // Chart Data Based on Selected Feature
    const chartData = {
        labels: data[selectedFeature].labels,
        datasets: [
            {
                label: selectedFeature === "coalusage" ? "Coal Usage" : "Production / PLF",
                data: data[selectedFeature].values,
                backgroundColor: selectedFeature === "coalusage"
                    ? ["#98FB98", "#F5F5DC", "#00CED1"] 
                    : ["#ADD8E6"], 
                borderColor: "#ddd",
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-5 bg-[#f8f8f8] min-h-screen flex flex-col items-center">
            {/* 🔹 Section for Data Trends (Empty for now) */}
            <section className="mb-6">
                <h2 className="text-2xl font-semibold text-gray-800">Data Trends</h2>
            </section>

            {/* 🔹 Feature-Based Visualization Section */}
            <section className="p-6 bg-white shadow-lg rounded-lg w-full max-w-3xl">
                <h2 className="text-xl font-bold text-gray-700 mb-4">Feature-Based Visualization</h2>
                
                {/* Buttons for Feature Selection */}
                <div className="flex justify-center gap-3 mb-5">
                    {["production", "plf", "coalusage"].map((feature) => (
                        <button
                            key={feature}
                            onClick={() => setSelectedFeature(feature)}
                            className={`px-4 py-2 rounded-lg transition-all ${
                                selectedFeature === feature
                                    ? "bg-gray-300 text-gray-700 shadow-md"
                                    : "bg-[#f5f5dc] text-gray-600 hover:bg-gray-200"
                            }`}
                        >
                            {feature.charAt(0).toUpperCase() + feature.slice(1)}
                        </button>
                    ))}
                </div>

                {/* 🔹 Chart Container (Responsive & Centered) */}
                <div className="bg-gray-100 p-5 rounded-lg shadow-md flex justify-center">
                    <div className="w-full max-w-md">
                        {selectedFeature === "production" && <Line data={chartData} />}
                        {selectedFeature === "plf" && <Bar data={chartData} />}
                        {selectedFeature === "coalusage" && (
                            <div className="w-[300px] h-[300px] mx-auto">
                                <Pie data={chartData} />
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Insights;
