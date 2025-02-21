import { BarChart2, ShoppingBag, Users, Zap } from "lucide-react";
import { motion } from "framer-motion";
import Header from "../components/common/Header";
import StatCard from "../components/common/StatCard";
import DynamicNetworkGraph from "../components/overview/DynamicNetworkGraph";
import GrafanaWidget from "../components/overview/GrafanaWidget"; // Import GrafanaWidget

const OverviewPage = () => {
  // Grafana panel URLs (replace with your actual URLs)
  const grafanaUrls = [
	'http://localhost:3000/d-solo/fecviqc3ctmo0c/hl-int?orgId=1&from=now-5m&to=now&timezone=browser&panelId=1&refresh=15s', // Panel 1 (hl-int)
	'http://localhost:3000/d-solo/eecvj584xvy80d/tc-int?orgId=1&from=now-5m&to=now&timezone=browser&panelId=1&refresh=15s', // Panel 2 (tc-int)
	'http://localhost:3000/d-solo/aecvj8vz8yayoc/avg-d?orgId=1&from=1739376972102&to=1739398572102&timezone=browser&panelId=1&__feature.dashboardSceneSolo&refresh=15s',  // Panel 3 (avg-d)
	'http://localhost:3000/d-solo/cecvjary7hh4wd/std-d?orgId=1&from=now-5m&to=now&timezone=browser&panelId=1&refresh=15s'   // Panel 4 (std-d)
  ];
  

  return (
    <div className="flex-1 overflow-auto relative z-10">
      <Header title="Overview" />

      <main className="max-w-7xl mx-auto py-6 px-4 lg:px-8">
        {/* STATS */}
        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <StatCard name="Total Sales" icon={Zap} value="$12,345" color="#6366F1" />
          <StatCard name="New Users" icon={Users} value="1,234" color="#8B5CF6" />
          <StatCard name="Total Products" icon={ShoppingBag} value="567" color="#EC4899" />
          <StatCard name="Conversion Rate" icon={BarChart2} value="12.5%" color="#10B981" />
        </motion.div>

        {/* New section for Network Graph */}
        <div className="mb-8 bg-gray-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Network Topology</h2>
          <DynamicNetworkGraph />
        </div>

        {/* GRAFANA WIDGETS FOR NETWORK METRICS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <GrafanaWidget panelUrl={grafanaUrls[0]} title="hl_int" />
          <GrafanaWidget panelUrl={grafanaUrls[1]} title="tc_int" />
          <GrafanaWidget panelUrl={grafanaUrls[2]} title="avg(d)" />
          <GrafanaWidget panelUrl={grafanaUrls[3]} title="std(d)" />
        </div>
      </main>
    </div>
  );
};

export default OverviewPage;
