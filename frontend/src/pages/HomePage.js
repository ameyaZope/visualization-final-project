import { Container } from "@mui/material";
import * as React from 'react';
import Scatterplot from "../components/scatterplot";
import ChoroplethMap from "../components/choroplethMap";


function HomePage() {

	return (
		<>
			<Container>
				<Scatterplot xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} />
				<ChoroplethMap />
			</Container>
		</>
	);
};

export default HomePage;