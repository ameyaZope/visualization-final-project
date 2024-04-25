import { Container } from "@mui/material";
import * as React from 'react';
import Scatterplot from "../components/scatterplot";
import Barchart from "../components/barchart";

function HomePage() {

	return (
		<>
			<Container>
				<Scatterplot xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} />
				<Barchart xAxisFeature={"Entity"} yAxisFeature={"Corruption_index"} />
			</Container>
		</>
	);
};

export default HomePage;