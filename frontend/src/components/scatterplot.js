import * as d3 from "d3";
import { useEffect, useRef } from "react";


function isBrushed(brush_coords, cx, cy) {
	var x0 = brush_coords[0][0],
			x1 = brush_coords[1][0],
			y0 = brush_coords[0][1],
			y1 = brush_coords[1][1];
 return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}


function Scatterplot({ xAxisFeature, yAxisFeature, year, selectedCountries, handleCountrySelection, handleCountriesDefault }) {
	const scatterPlotSvgRef = useRef();
	const xAxisRef = useRef(null);
	const yAxisRef = useRef(null);
	const xScale = useRef(null);
	const yScale = useRef(null);
	const svgRef = useRef(null);
	const featureList = [
		"Adjusted_school_years",
		"Alcohol_consumption_per_capita",
		"BCG_immunization",
		"Cantril_ladder_score",
		"Code",
		"Corruption_index",
		"DTP3_immunization",
		"Deaths_due_to_air_pollution",
		"Drug_use_death_rate",
		"Entity",
		"Expenditure_estimates",
		"Female_no_education_rate",
		"GDP_PPP",
		"Gender_Inequality_Index",
		"Global_Hunger_Index",
		"HDI",
		"HepB3_immunization",
		"Hib3_immunization",
		"High_corruption_index",
		"IPV1_immunization",
		"Life_expectancy_at_birth",
		"Literacy_estimates",
		"Low_corruption_index",
		"Lower_secondary_completion_rate",
		"MCV1_immunization",
		"Mean_income_consumption",
		"Mean_schooling_years",
		"PCV3_immunization",
		"Patent_applications_per_million",
		"Pol3_immunization",
		"Primary_completion_rate",
		"Primary_school_enrollment",
		"Public_admin_index",
		"RCV1_immunization",
		"Researchers_per_million",
		"RotaC_immunization",
		"Rule_of_law_index",
		"Secondary_school_enrollment",
		"Tertiary_school_enrollment",
		"Under_fifteen_mortality_rate",
		"Under_five_mortality_rate",
		"Upper_secondary_completion_rate",
		"YFV_immunization",
		"Year"
	]

	const isFeatureCategorical = {
		"Adjusted_school_years": false,
		"Alcohol_consumption_per_capita": false,
		"BCG_immunization": false,
		"Cantril_ladder_score": false,
		"Code": false,
		"Corruption_index": false,
		"DTP3_immunization": false,
		"Deaths_due_to_air_pollution": false,
		"Drug_use_death_rate": false,
		"Entity": false,
		"Expenditure_estimates": false,
		"Female_no_education_rate": false,
		"GDP_PPP": false,
		"Gender_Inequality_Index": false,
		"Global_Hunger_Index": false,
		"HDI": false,
		"HepB3_immunization": false,
		"Hib3_immunization": false,
		"High_corruption_index": false,
		"IPV1_immunization": false,
		"Life_expectancy_at_birth": false,
		"Literacy_estimates": false,
		"Low_corruption_index": false,
		"Lower_secondary_completion_rate": false,
		"MCV1_immunization": false,
		"Mean_income_consumption": false,
		"Mean_schooling_years": false,
		"PCV3_immunization": false,
		"Patent_applications_per_million": false,
		"Pol3_immunization": false,
		"Primary_completion_rate": false,
		"Primary_school_enrollment": false,
		"Public_admin_index": false,
		"RCV1_immunization": false,
		"Researchers_per_million": false,
		"RotaC_immunization": false,
		"Rule_of_law_index": false,
		"Secondary_school_enrollment": false,
		"Tertiary_school_enrollment": false,
		"Under_fifteen_mortality_rate": false,
		"Under_five_mortality_rate": false,
		"Upper_secondary_completion_rate": false,
		"YFV_immunization": false,
		"Year": false
	}

	useEffect(() => {

		var svgSelected = d3.select('#scatterplot');
		svgSelected.selectAll('*').remove();

		let xlabel = xAxisFeature
		let ylabel = yAxisFeature

		var margin = { top: 30, bottom: 60, left: 80, right: 10 };
		var width = 500 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		svgRef.current = d3.select(scatterPlotSvgRef.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		svgRef.current.append('g')
			.append("text")
			.attr("x", width / 2)
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("text-decoration", "underline")
			.style("font", "bold 16px Comic Sans MS")
			.text(`${ylabel} vs ${xlabel}`);

		d3.json(`/apis/data/scatterplot/${year}`).then(function (scatterplotData) {
			// create and place the x axis
			if (isFeatureCategorical[xAxisFeature]) {
				xScale.current = d3.scaleBand()
					.domain(Array.from(new Set(scatterplotData['data'].map(d => d[xAxisFeature]))))
					.range([0, width])
					.padding(0.2)
				xAxisRef.current = svgRef.current.append('g')
					.attr('transform', `translate(0, ${height})`) // used to place the x axis at the bottom of the svg
					.call(d3.axisBottom(xScale.current))
				xAxisRef.current
					.transition()
					.duration(1000)
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style("font", "bold 16px Comic Sans MS")
					.style('text-anchor', 'end')
			}
			else {
				let maxVal = 0
				for (const item of scatterplotData['data']) {
					maxVal = Math.max(maxVal, item[xAxisFeature])
				}
				xScale.current = d3.scaleLinear()
					.domain([0, 150])
					.range([0, width])
				xAxisRef.current = svgRef.current.append('g')
					.call(d3.axisBottom(xScale.current))
					.attr('transform', `translate(0, ${height})`) // used to place the x axis at the bottom of the svg
				xAxisRef.current
					.transition()
					.duration(1000)
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style("font", "bold 16px Comic Sans MS")
					.style('text-anchor', 'end')
			}

			// x axis label
			svgRef.current.append('g')
				.append('text')
				.attr("x", (width)/2)
				.attr("y", height + margin.bottom*4/5)
				.attr("fill", "currentColor")
				.style("text-anchor", "middle")
				.style("font", "bold 16px Comic Sans MS")
				.text(`${xlabel} →`)

			//create and place the y axis. 
			if (isFeatureCategorical[yAxisFeature]) {
				yScale.current = d3.scaleBand()
					.domain(Array.from(new Set(scatterplotData['data'].map(d => d[yAxisFeature]))))
					.range([height, 0])
					.padding(0.2);
				yAxisRef.current = svgRef.current.append('g')
					.transition()
					.duration(1000)
					.call(d3.axisLeft(yScale.current))
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style('text-anchor', 'end')
					.style("font", "bold 16px Comic Sans MS")
			}
			else {
				let maxVal = 0;
				for (const item of scatterplotData['data']) {
					maxVal = Math.max(maxVal, item[yAxisFeature])
				}
				yScale.current = d3.scaleLinear()
					.domain([0, 1])
					.range([height, 0])
				yAxisRef.current = svgRef.current.append('g')
					.transition()
					.duration(1000)
					.call(d3.axisLeft(yScale.current))
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style('text-anchor', 'end')
					.style("font", "bold 16px Comic Sans MS")
			}

			svgRef.current.append('g')
				.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left)
				.attr("x", 0 - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.style("font", "bold 16px Comic Sans MS")
				.text(`${ylabel} →`);

			var tooltip = d3
				.select('body')
				.append('div')
				.attr('class', 'd3-tooltip')
				.style('position', 'absolute')
				.style('z-index', '10')
				.style('visibility', 'hidden')
				.style('padding', '10px')
				.style('background', 'rgba(0,0,0,0.6)')
				.style('border-radius', '4px')
				.style('color', '#fff')
				.text('a simple tooltip');

			// Add dots
			svgRef.current.append('g')
				.selectAll("dot")
				.data(scatterplotData['data'].filter(function(d) {
					// Check that both required features are non-null
					return d[xAxisFeature] != null && d[yAxisFeature] != null;
			}))
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					let jitter = 0; // Initialize jitter to 0
					// Apply jitter if xAxis is categorical
					if (isFeatureCategorical[xAxisFeature] && isFeatureCategorical[yAxisFeature]) {
						jitter = (Math.random()) * xScale.current.bandwidth();
					}
					// Return position with optional jitter
					return xScale.current(d[xAxisFeature]) + (isFeatureCategorical[xAxisFeature] ? jitter : 0);
				})
				.attr("cy", function (d) {
					let jitter = 0; // Initialize jitter to 0
					// Apply jitter if yAxis is categorical
					if (isFeatureCategorical[xAxisFeature] && isFeatureCategorical[yAxisFeature]) {
						jitter = (Math.random()) * yScale.current.bandwidth();
					}
					// Return position with optional jitter
					return yScale.current(d[yAxisFeature]) + (isFeatureCategorical[yAxisFeature] ? jitter : 0);
				})
				.attr("r", 7)
				.attr('opacity', 0.5)
				.style("fill", "#69b3a2")
				.on('mouseover', function (event, data) {
					d3.select(this).transition().attr('fill', '#eec42d');
				})
				.on('mouseout', function () {
					d3.select(this).transition().attr('fill', 'steelblue');
				})

			function brushed(event) {
				if (!event.selection) {
					handleCountriesDefault();
					return;
				}
				let extent = event.selection;

				svgRef.current.selectAll('circle')
					.style("opacity", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? 1 : 0.5)
					.style("fill", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? "purple" : "#69b3a2")
					.style("stroke", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? "black" : null)
					.style("stroke-width", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? 1 : 0);

				const brushedCountries = scatterplotData['data'].filter(d =>
					isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature]))
				).map(d => d.Code);
				handleCountrySelection(brushedCountries)
			}

			svgRef.current.append('g')
				.call(d3.brush()
					.extent([[0, 0], [width, height]])
					.on("start brush", event => brushed(event))
					.on("end", (event) => {
						if (!event.selection) {
							handleCountriesDefault()
						}
					})
				)
		})

	}, [xAxisFeature, yAxisFeature])

	useEffect(() => {
		d3.json(`/apis/data/scatterplot/${year}`).then(function (scatterplotData) {
			svgRef.current.selectAll('circle').remove();

			var margin = { top: 30, bottom: 60, left: 80, right: 10 };
			var width = 500 - margin.left - margin.right,
				height = 300 - margin.top - margin.bottom;

			svgRef.current.append('g')
				.selectAll("dot")
				.data(scatterplotData['data'].filter(function (d) {
					// Check that both required features are non-null
					return d[xAxisFeature] != null && d[yAxisFeature] != null;
				}))
				.enter()
				.append("circle")
				.attr("cx", function (d) {
					let jitter = 0; // Initialize jitter to 0
					// Apply jitter if xAxis is categorical
					if (isFeatureCategorical[xAxisFeature] && isFeatureCategorical[yAxisFeature]) {
						jitter = (Math.random()) * xScale.current.bandwidth();
					}
					// Return position with optional jitter
					return xScale.current(d[xAxisFeature]) + (isFeatureCategorical[xAxisFeature] ? jitter : 0);
				})
				.attr("cy", function (d) {
					let jitter = 0; // Initialize jitter to 0
					// Apply jitter if yAxis is categorical
					if (isFeatureCategorical[xAxisFeature] && isFeatureCategorical[yAxisFeature]) {
						jitter = (Math.random()) * yScale.current.bandwidth();
					}
					// Return position with optional jitter
					return yScale.current(d[yAxisFeature]) + (isFeatureCategorical[yAxisFeature] ? jitter : 0);
				})
				.attr("r", 7)
				.attr('opacity', 0.5)
				.style("fill", "#69b3a2")
				.on('mouseover', function (event, data) {
					d3.select(this).transition().attr('fill', '#eec42d');
				})
				.on('mouseout', function () {
					d3.select(this).transition().attr('fill', 'steelblue');
				})

			function brushed(event) {
				if (!event.selection) {
					handleCountriesDefault();
					return;
				}
				let extent = event.selection;

				svgRef.current.selectAll('circle')
					.style("opacity", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? 1 : 0.5)
					.style("fill", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? "purple" : "#69b3a2")
					.style("stroke", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? "black" : null)
					.style("stroke-width", d => isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature])) ? 1 : 0);

				const brushedCountries = scatterplotData['data'].filter(d =>
						isBrushed(extent, xScale.current(d[xAxisFeature]), yScale.current(d[yAxisFeature]))
					).map(d => d.Code);
				handleCountrySelection(brushedCountries)
			}

			svgRef.current.append('g')
				.call(d3.brush()
					.extent([[0, 0], [width, height]])
					.on("start brush", event => brushed(event))
					.on("end", (event) => {
						if (!event.selection) {
							handleCountriesDefault()
						}
					})
			)

		}).catch(error => {
			console.error('Failed to fetch data: ', error);
		});
	}, [year]);

	useEffect(() => {
		d3.selectAll('circle')
			.style("opacity", d => selectedCountries.includes(d['Code']) ? 1 : 0.5)
			.style("fill", d => selectedCountries.includes(d['Code']) ? "purple" : "#69b3a2")
			.style("stroke", d => selectedCountries.includes(d['Code']) ? "black" : null)
			.style("stroke-width", d => selectedCountries.includes(d['Code']) ? 1 : 0);
	}, [selectedCountries])

	return (
		<svg width={500} height={300} id="scatterplot" ref={scatterPlotSvgRef}></svg>
	)
}

export default Scatterplot;