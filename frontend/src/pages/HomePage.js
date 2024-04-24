import { Container } from "@mui/material";
import * as React from 'react';
import Scatterplot from "../components/scatterplot";

function HomePage() {

	return (
		<>
			<Container>
				<Scatterplot xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} />
				<Chloromap xAxisFeature={"Secondary_school_enrollment"} yAxisFeature={"Corruption_index"} />
			</Container>
		</>
	);
};

export default HomePage;