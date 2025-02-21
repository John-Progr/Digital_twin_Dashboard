import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { triggerDataShiftScenario } from "../../services/fastAPI";
import { motion } from "framer-motion";

const DataShift = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleDataShift = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await triggerDataShiftScenario();
      console.log("API Response:", response);
      setData(response);
    } catch (error) {
      console.error("Error fetching data shift results:", error);
      setError("Failed to fetch data. Please try again later.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4">
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded-md"
        onClick={handleDataShift}
        disabled={loading}
      >
        {loading ? "Processing..." : "Run Data Shift Scenario"}
      </button>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {data && (
        <div className="mt-6">
          {(!data.original_distribution_info || !data.modified_distribution_info) && (
            <p className="text-red-500">Error: Distribution info missing in response!</p>
          )}

          {/* Original Data Distributions */}
          {data.original_distribution_info && (
            <>
              <h2 className="text-xl font-bold">Original Feature Distributions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data.original_distribution_info).map(([feature, featureData]) => (
                  <motion.div
                    key={feature}
                    className="bg-gray-800 p-4 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-100">{feature}</h3>

                    {featureData.histogram && (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={featureData.histogram}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="bin" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#8B5CF6" name="Frequency" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {featureData.kde && (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={featureData.kde}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="x" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="density" stroke="#F59E0B" name="Density" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {featureData.tests && (
                      <div className="mt-4 p-2 bg-gray-700 rounded-lg">
                        <h4 className="text-md font-semibold text-gray-300">Test Results</h4>
                        <pre className="text-gray-400 text-sm">
                          {JSON.stringify(featureData.tests, null, 2)}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Modified Data Distributions */}
          {data.modified_distribution_info && (
            <>
              <h2 className="text-xl font-bold mt-10">Modified Feature Distributions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(data.modified_distribution_info).map(([feature, featureData]) => (
                  <motion.div
                    key={feature}
                    className="bg-gray-800 p-4 rounded-lg shadow-lg"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-lg font-semibold text-gray-100">{feature} (Modified)</h3>

                    {featureData.histogram && (
                      <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={featureData.histogram}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="bin" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="count" fill="#34D399" name="Modified Frequency" />
                        </BarChart>
                      </ResponsiveContainer>
                    )}

                    {featureData.kde && (
                      <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={featureData.kde}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                          <XAxis dataKey="x" stroke="#9CA3AF" />
                          <YAxis stroke="#9CA3AF" />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="density" stroke="#EC4899" name="Modified Density" />
                        </LineChart>
                      </ResponsiveContainer>
                    )}

                    {featureData.tests && (
                      <div className="mt-4 p-2 bg-gray-700 rounded-lg">
                        <h4 className="text-md font-semibold text-gray-300">Test Results</h4>
                        <pre className="text-gray-400 text-sm">
                          {JSON.stringify(featureData.tests, null, 2)}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </>
          )}

          {/* Model Performance Comparison */}
          <h2 className="text-xl font-bold mt-10">Model Performance Comparison</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RMSE Comparison */}
            <motion.div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">RMSE Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "RMSE",
                      Original: data.evaluation_results.rmse_original,
                      Modified: data.evaluation_results.rmse_modified,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Original" fill="#8B5CF6" name="Original RMSE" />
                  <Bar dataKey="Modified" fill="#EF4444" name="Modified RMSE" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* R² Comparison */}
            <motion.div className="bg-gray-900 p-4 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-200 mb-2">R² Comparison</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={[
                    {
                      name: "R²",
                      Original: data.evaluation_results.r2_original,
                      Modified: data.evaluation_results.r2_modified,
                    },
                  ]}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis dataKey="name" stroke="#9CA3AF" />
                  <YAxis stroke="#9CA3AF" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Original" fill="#10B981" name="Original R²" />
                  <Bar dataKey="Modified" fill="#F43F5E" name="Modified R²" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataShift;
