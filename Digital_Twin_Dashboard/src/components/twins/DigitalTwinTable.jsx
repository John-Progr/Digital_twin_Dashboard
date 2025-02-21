import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { getDigitalTwinThings } from '../../services/eclipse-ditto'; // Import the function

const DigitalTwinTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredThings, setFilteredThings] = useState([]);
  const [thingsData, setThingsData] = useState([]);

  // Fetch digital twin data on component mount
  useEffect(() => {
    const fetchData = async () => {
      const things = await getDigitalTwinThings();
      setThingsData(things);
      setFilteredThings(things); // Initialize filtered things
    };
    fetchData();
  }, []);

  // Handle search input changes
  const handleSearch = (e) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);
    const filtered = thingsData.filter(
      (thing) =>
        thing.thingId.toLowerCase().includes(term) || thing.deviceIp.toLowerCase().includes(term)
    );
    setFilteredThings(filtered);
  };

  return (
    <motion.div
      className='bg-gray-800 bg-opacity-50 backdrop-blur-md shadow-lg rounded-xl p-6 border border-gray-700'
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className='flex justify-between items-center mb-6'>
        <h2 className='text-xl font-semibold text-gray-100'>Digital Twins</h2>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search digital twins...'
            className='bg-gray-700 text-white placeholder-gray-400 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500'
            value={searchTerm}
            onChange={handleSearch}
          />
          <Search className='absolute left-3 top-2.5 text-gray-400' size={18} />
        </div>
      </div>

      <div className='overflow-x-auto'>
        <table className='min-w-full divide-y divide-gray-700'>
          <thead>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                Thing ID
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                Device IP
              </th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider'>
                Error
              </th>
            </tr>
          </thead>

          <tbody className='divide-y divide-gray-700'>
            {filteredThings.map((thing) => (
              <motion.tr
                key={thing.thingId}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm font-medium text-gray-100'>{thing.thingId}</div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap'>
                  <div className='text-sm text-gray-300'>{thing.deviceIp}</div>
                </td>

                <td className='px-6 py-4 whitespace-nowrap'>
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      thing.error === "Yes" ? "bg-red-800 text-red-100" : "bg-green-800 text-green-100"
                    }`}
                  >
                    {thing.error}
                  </span>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default DigitalTwinTable;