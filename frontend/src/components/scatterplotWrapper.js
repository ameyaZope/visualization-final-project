import { Container } from "@mui/material";
import FeatureMenu from "./featureMenu";
import FeatureSelectionMenu from "./featureSelectionMenu";
import Scatterplot from "./scatterplot";
import { useState } from "react";

function isCategorical(feature, listOfFeatures) {
	for (const item of listOfFeatures) {
		if (item['id']===feature) {
			return item['categorical']
		}
	}
	return false;
}

function getLabel(feature, listOfFeatures) {
	for (const item of listOfFeatures) {
		if(item['id']===feature) {
			return item['disp_string'];
		}
	}
	return undefined;
}

function ScatterplotsWrapper() {
	const [xAxisFeature, setXAxisFeature] = useState('streams');

	const [yAxisFeature, setYAxisFeature] = useState(undefined)

	const [currFeature, setCurrFeature] = useState('x')
	const handleCurrFeatureChange = (event) => {
		console.log('Setting currFeature to ' + event.target.value);
		setCurrFeature(event.target.value)
	}

	const handleFeatureChange = (event) => {
		if (currFeature === 'x') {
			console.log('Setting x axis feature to ' + event.target.value)
			setXAxisFeature(event.target.value)
		}
		else if (currFeature === 'y') {
			console.log('Setting y axis feature to ' + event.target.value)
			setYAxisFeature(event.target.value)
		}
	}

	const scatterPlotMenuItems = [
		{ 'id': 'streams', disp_string: 'Streams', 'categorical': false },
		]

	return (
		<Container>
			<FeatureSelectionMenu value={currFeature} handleChange={handleCurrFeatureChange} values={['x', 'y']} labels={['x-axis', 'y-axis']} />
			<FeatureMenu initialFeature={currFeature==='x' ? xAxisFeature : yAxisFeature} handleChange={handleFeatureChange} menuItems={scatterPlotMenuItems} labelValue='Feature' />
			{xAxisFeature !== undefined && yAxisFeature !== undefined && <Scatterplot xAxisFeature={xAxisFeature} yAxisFeature={yAxisFeature} 
			xAxisCategorical={isCategorical(xAxisFeature, scatterPlotMenuItems)} 
			yAxisCategorical={isCategorical(yAxisFeature, scatterPlotMenuItems)}
			xlabel={getLabel(xAxisFeature, scatterPlotMenuItems)}
				ylabel={getLabel(yAxisFeature, scatterPlotMenuItems)} />}
		</Container>
	);
}

export default ScatterplotsWrapper;