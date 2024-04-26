import { Container } from "@mui/material";
import * as React from 'react';
import ChoroplethMap from "../components/choroplethMap";
import ParallelCoordinatePlot from "../components/parallelCoordinatePlot";
import Scatterplot from "../components/scatterplot";


function HomePage() {

	const [year, setYear] = React.useState(2020)

	return (
		<>
			<Container>
				<Scatterplot xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} />
				<ChoroplethMap />
				<ParallelCoordinatePlot year={year}/>
			</Container>
		</>
	);
};

export default HomePage;