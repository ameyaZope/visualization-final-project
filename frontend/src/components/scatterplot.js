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

	let featureDomains = {
		'Annual CO₂ emissions (per capita)': [0.019352028, 67.493744],
		'BCG_immunization': [0.0, 99.0],
		'Cantril_ladder_score': [2.5229, 7.85574],
		'Cereal Production': [0.0001, 36.761898],
		'Code': ['AFG', 'ZWE'],
		'Continent': ['Africa', 'South America'],
		'Corruption_index': [0.002, 0.967],
		'Count of Women in Parliament': [0.0, 63.75],
		'DTP3_immunization': [19.0, 99.0],
		'Deaths_due_to_air_pollution': [2.6605287, 497.20084],
		'Drug_use_death_rate': [0.06, 18.83],
		'Electricity from nuclear - TWh': [0.0, 809.41],
		'Entity': ['Afghanistan', 'Zimbabwe'],
		'Expenditure_estimates': [0.12717403, 15.158183],
		'GDP_PPP': [32781462.0, 22996385000000.0],
		'GDP_Per_capita': [628.6933, 120647.82],
		'Gender_Inequality_Index': [0.013, 0.822],
		'HDI': [0.262, 0.962],
		'HepB3_immunization': [2.0, 99.0],
		'Hib3_immunization': [0.0, 99.0],
		'High_corruption_index': [0.003, 0.981],
		'IPV1_immunization': [0.0, 99.0],
		'Life_expectancy_at_birth': [41.9572, 86.5424],
		'Literacy Rate': [0.0, 99.9999465942383],
		'Literacy rate, adult total (% of people ages 15 and above)': [14.37604, 99.99995],
		'Low_corruption_index': [0.0, 0.957],
		'Lower_secondary_completion_rate': [3.95885, 196.342],
		'MCV1_immunization': [8.0, 99.0],
		'Mean years of schooling': [0.55942, 14.13215],
		'Mean_income_consumption': [1.0010916, 93.3278],
		'Observation value - Unit of measure: Deaths per 100 live births - Indicator: Under-five mortality rate - Sex: Both sexes - Wealth quintile: All wealth quintiles_x': [0.17836553, 22.850826],
		'Observation value - Unit of measure: Deaths per 100 live births - Indicator: Under-five mortality rate - Sex: Both sexes - Wealth quintile: All wealth quintiles_y': [0.17836553, 22.850826],
		'Ozone depletion': [-4328.66, 90877.7],
		'PCV3_immunization': [0.0, 99.0],
		'Patent_applications_per_million': [0.010300319, 3481.109],
		'Pol3_immunization': [8.0, 99.0],
		'Primary completion rate, total (% of relevant age group)_x': [16.56425, 152.80666],
		'Primary completion rate, total (% of relevant age group)_y': [16.57523, 134.54251],
		'Primary_school_enrollment': [22.16299, 150.41019],
		'Public_admin_index': [-2.848, 4.046],
		'RCV1_immunization': [6.0, 99.0],
		'Researchers_per_million': [5.91183, 8713.594],
		'RotaC_immunization': [0.0, 99.0],
		'Rule_of_law_index': [0.009, 0.999],
		'Secondary_school_enrollment': [6.07717, 164.07982],
		'Tertiary_school_enrollment': [0.11737, 143.31068],
		'Under_fifteen_mortality_rate': [0.23066321, 26.790155],
		'Upper_secondary_completion_rate': [0.0, 99.0],
		'YFV_immunization': [0.0, 99.0],
		'Year': [2000, 2020]
	};

	useEffect(() => {

		var svgSelected = d3.select('#scatterplot');
		svgSelected.selectAll('*').remove();

		let xlabel = xAxisFeature
		let ylabel = yAxisFeature

		var margin = { top: 30, bottom: 60, left: 60, right: 10 };
		var width =475 - margin.left - margin.right,
			height = 330 - margin.top - margin.bottom;

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
				let minVal = Infinity
				for (const item of scatterplotData['data']) {
					maxVal = Math.max(maxVal, item[xAxisFeature])
					minVal = Math.min(minVal, item[xAxisFeature])
				}
				xScale.current = d3.scaleLinear()
					.domain(featureDomains[xAxisFeature])
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
				let minVal = Infinity;
				for (const item of scatterplotData['data']) {
					maxVal = Math.max(maxVal, item[yAxisFeature])
					minVal = Math.min(minVal, item[yAxisFeature])
				}
				yScale.current = d3.scaleLinear()
					.domain(featureDomains[yAxisFeature])
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

			var margin = { top: 30, bottom: 60, left: 60, right: 10 };
			var width = 475 - margin.left - margin.right,
				height = 330 - margin.top - margin.bottom;

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
	}, [xAxisFeature, yAxisFeature, year]);

	useEffect(() => {
		d3.selectAll('circle')
			.style("opacity", d => selectedCountries.includes(d['Code']) ? 1 : 0.5)
			.style("fill", d => selectedCountries.includes(d['Code']) ? "purple" : "#69b3a2")
			.style("stroke", d => selectedCountries.includes(d['Code']) ? "black" : null)
			.style("stroke-width", d => selectedCountries.includes(d['Code']) ? 1 : 0);
	}, [xAxisFeature, yAxisFeature, selectedCountries])

	return (
		<svg id="scatterplot" ref={scatterPlotSvgRef}></svg>
	)
}

export default Scatterplot;