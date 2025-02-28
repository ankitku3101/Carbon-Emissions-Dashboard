"use client";
import { useState } from "react";

export default function Prediction() {
  const [predictedData, setPredictedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInput, setUserInput] = useState({
    gcv: 0,
    burntamount: 0,
    plf: 0,
    production: 0,
    is_lignite: true,
    is_bituminous: true,
  });

  const fetchPredictedData = async () => {
    try {
      setLoading(true);
      const response = await fetch("https://mole-model-drake.ngrok-free.app/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userInput),
      });
      const data = await response.json();
      setPredictedData(data);
    } catch (error) {
      console.error("Error fetching predicted data:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Predict Carbon Emissions</h2>
      <form className="space-y-4">
        {Object.keys(userInput).map((key) => (
          <div key={key} className="flex flex-col">
            <label className="text-gray-700 mb-2">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1').toLowerCase()}
            </label>
            {typeof userInput[key as keyof typeof userInput] === "boolean" ? (
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={userInput[key as keyof typeof userInput] as boolean}
                  onChange={(e) =>
                    setUserInput({
                      ...userInput,
                      [key]: e.target.checked,
                    })
                  }
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
              </div>
            ) : (
              <input
                type="number"
                value={userInput[key as keyof typeof userInput] as number}
                onChange={(e) =>
                  setUserInput({
                    ...userInput,
                    [key]: Number(e.target.value),
                  })
                }
                className="border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={fetchPredictedData}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Predicting..." : "Get Prediction"}
        </button>
      </form>
      {predictedData && (
        <div className="mt-6 p-4 bg-gray-100 rounded-md border border-gray-300">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Predicted Data</h3>
          <pre className="text-sm text-gray-700">{JSON.stringify(predictedData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
