import Header from "../components/common/Header";
import { OptimizationAlgorithm, DistributionShiftScenario } from "../components/optimization/AIOptimization"; // Correct syntax
import DataShift from "../components/optimization/Datashift";
import MLModelSelector from "../components/optimization/MLModelSelector";


const OptimizationPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10 bg-gray-900'>
			<Header title={"Optimization Dashboard"} />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
			    <OptimizationAlgorithm />
				{/* ML MODEL SELECTOR */}
				<div className='mb-8'>
					<MLModelSelector />
				</div>

	

				<DistributionShiftScenario  />
				{/* Adding the DataShift component at the end */}
				<div className="mt-8 bg-gray-800 rounded-lg p-6">
					<h2 className="text-xl font-semibold mb-4 text-gray-200">Data Shift Scenario</h2>
					<DataShift />
				</div>
			</main>
		</div>
	);
};
export default OptimizationPage;
