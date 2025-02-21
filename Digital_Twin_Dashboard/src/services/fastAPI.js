import axios from 'axios';

const API_BASE_URL = 'http://192.168.1.6:8002'; // Ensure this matches your backend endpoint

// Configure axios instance with base URL and default headers
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Sends a POST request to select the algorithm.
 * @param {string} algorithm - The algorithm to select ('minimize_rcl' or 'minimize_overhead').
 * @returns {Promise} - The response from the server.
 */
export const selectAlgorithm = async (algorithm) => {
  try {
    const response = await apiClient.post('/ml/select_algorithm', { algorithm });
    return response.data;
  } catch (error) {
    console.error('Error selecting algorithm:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Sends a POST request to update the thresholds.
 * @param {number|null} rclThreshold - The new RCL threshold value (0-1) or null.
 * @param {number|null} overheadThreshold - The new overhead threshold value (0-1) or null.
 * @returns {Promise} - The response from the server.
 */
export const updateThresholds = async (rclThreshold, overheadThreshold) => {
  try {
    const response = await apiClient.post('/ml/update_thresholds', {
      rcl_threshold: rclThreshold,
      overhead_threshold: overheadThreshold,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating thresholds:', error.response?.data || error.message);
    throw error;
  }
};

/**
 * Triggers the data shift scenario and retrieves the results.
 * @returns {Promise} - The response from the server containing MSE, R², and distribution info.
 */
export const triggerDataShiftScenario = async () => {
  try {
    const response = await apiClient.get('/data-shift');
    console.log(response.data)
    return response.data; // This will return MSE, R², and distribution_info
  } catch (error) {
    console.error('Error triggering data shift scenario:', error.response?.data || error.message);
    throw error;
  }
};
