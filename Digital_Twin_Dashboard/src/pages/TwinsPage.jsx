import Header from "../components/common/Header";
import DigitalTwinTable from "../components/twins/DigitalTwinTable";


const TwinsPage = () => {
	return (
		<div className='flex-1 overflow-auto relative z-10'>
			<Header title='Things' />

			<main className='max-w-7xl mx-auto py-6 px-4 lg:px-8'>
				{/* DIGITAL TWIN TABLE */}
				<DigitalTwinTable />

			</main>
		</div>
	);
};

export default TwinsPage;
