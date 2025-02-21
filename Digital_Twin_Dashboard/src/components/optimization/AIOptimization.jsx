import { motion } from "framer-motion";
import { Settings, Database } from "lucide-react";

const OPTIMIZATION_INSIGHTS = [
	{
		icon: Settings,
		color: "text-red-500",
		insight:
			"Here you can select the Optimization algorithm you want to use for optimizing OLSR.",
	},
];

const DISTRIBUTION_SHIFT_INSIGHTS = [
	{
		icon: Database,
		color: "text-indigo-500",
		insight:
			"You can utilize the distribution shift scenario which synthesizes a fake dataset with a different distribution than the original data and test the model's robustness.",
	},
];

const InsightCard = ({ title, insights }) => {
	return (
		<motion.div
			className='bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 1.0 }}
		>
			<h2 className='text-xl font-semibold text-gray-100 mb-4'>{title}</h2>
			<div className='space-y-4'>
				{insights.map((item, index) => (
					<div key={index} className='flex items-center space-x-3'>
						<div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
							<item.icon className={`size-6 ${item.color}`} />
						</div>
						<p className='text-gray-300'>{item.insight}</p>
					</div>
				))}
			</div>
		</motion.div>
	);
};

const OptimizationAlgorithm = () => (
	<InsightCard title='Optimization Algorithm Selection' insights={OPTIMIZATION_INSIGHTS} />
);

const DistributionShiftScenario = () => (
	<InsightCard title='Distribution Shift Testing' insights={DISTRIBUTION_SHIFT_INSIGHTS} />
);

export { OptimizationAlgorithm, DistributionShiftScenario };
