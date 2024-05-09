import * as d3 from "d3";
import { useEffect, useRef } from "react";

function isBrushed(brush_coords, cx, cy) {
	var x0 = brush_coords[0][0],
		x1 = brush_coords[1][0],
		y0 = brush_coords[0][1],
		y1 = brush_coords[1][1];
	return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}

function ParallelCoordinatePlot({ year, selectedCountries, handleCountrySelection, handleCountriesDefault }) {
	let numClusters = 3;
	const pcpSvgRef = useRef();
	const brushSelections = {}; // Object to store selections for each dimension
	const svgRef = useRef(null);
	const colorRef = useRef(null);
	const pathRef = useRef(null);
	const firstLoad = useRef(null);
	const xRef = useRef(null);
	const yRef = useRef(null);

	useEffect(() => {
		const margin = { top: 80, right: 50, bottom: 15, left: 30 },
			width = 1020 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		let all_dimensions = [
			"Continent",
			"Mean years of schooling",
			"Deaths_due_to_air_pollution",
			"Drug_use_death_rate",
			"Gender_Inequality_Index",
			"BCG_immunization",
			"MCV1_immunization",
			"RCV1_immunization",
			"DTP3_immunization",
			"Life_expectancy_at_birth",
			"GDP_PPP",
			"Corruption_index",
			"Primary_school_enrollment",
			"Public_admin_index",
			"Rule_of_law_index",
			"Under_fifteen_mortality_rate",
			"Count of Women in Parliament",
			"Annual CO₂ emissions (per capita)",
			"Ozone depletion",
			"Electricity from nuclear - TWh"
		];

		let dimensions = [];
		for (let i = 0; i < all_dimensions.length; i++) {
			dimensions.push(all_dimensions[i]);
		}

		let isFeatureCategorical = {
			"Adjusted_school_years": false,
			"Alcohol_consumption_per_capita": false,
			"BCG_immunization": false,
			"Cantril_ladder_score": false,
			"Code": true,
			"Continent": true,
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
			"Year": false,
			"Mean years of schooling": false,
			"Count of Women in Parliament": false,
			"Annual CO₂ emissions (per capita)": false,
			"Ozone depletion": false,
			"Electricity from nuclear - TWh": false
		}

		let featureDomains = {
			"Adjusted_school_years": [0, 100],
			"Alcohol_consumption_per_capita": [0, 100],
			"BCG_immunization": [0, 100],
			"Cantril_ladder_score": [0, 100],
			"Code": [0, 100],
			"Continent": ['Asia', 'Europe', 'Africa', 'North America', 'South America', 'Oceania'],
			"Corruption_index": [0, 1],
			"Cereal Production": [0.0001, 36.761898],
			"DTP3_immunization": [0, 100],
			"Deaths_due_to_air_pollution": [0, 500],
			"Drug_use_death_rate": [0, 20],
			"Expenditure_estimates": [0, 16],
			"Female_no_education_rate": [0, 100],
			"GDP_PPP": [0, 23096385000000],
			"Gender_Inequality_Index": [0, 1],
			"Global_Hunger_Index": [0, 1],
			"HDI": [0, 1],
			"HepB3_immunization": [0, 100],
			"Hib3_immunization": [0, 100],
			"High_corruption_index": [0, 100],
			"IPV1_immunization": [0, 100],
			"Life_expectancy_at_birth": [20, 90],
			"Literacy_estimates": [0, 100],
			"Low_corruption_index": [0, 1],
			"Lower_secondary_completion_rate": [0, 200],
			"MCV1_immunization": [0, 100],
			"Mean_income_consumption": [0, 100],
			"Mean_schooling_years": [0, 15],
			"PCV3_immunization": [0, 100],
			"Patent_applications_per_million": [0, 3500],
			"Pol3_immunization": [0, 100],
			"Primary_completion_rate": [0, 100],
			"Primary_school_enrollment": [0, 160],
			"Public_admin_index": [-3, 5],
			"RCV1_immunization": [0, 100],
			"Researchers_per_million": [0, 9000],
			"RotaC_immunization": [0, 100],
			"Rule_of_law_index": [0, 1],
			"Secondary_school_enrollment": [0, 200],
			"Tertiary_school_enrollment": [0, 200],
			"Under_fifteen_mortality_rate": [0, 30],
			"Under_five_mortality_rate": [0, 30],
			"Upper_secondary_completion_rate": [0, 100],
			"YFV_immunization": [0, 100],
			"Year": [2000, 2020],
			"Mean years of schooling": [0, 100],
			"Count of Women in Parliament": [0, 70],
			"Annual CO₂ emissions (per capita)": [0, 70],
			"Ozone depletion": [-4500, 100000],
			"Electricity from nuclear - TWh": [0, 900]
		}

		// below line clears the svg so that next graph can be drawn on it, 
		// else there is overlap of graphs
		var svgSelected = d3.select("#pcpPlot");
		svgSelected.selectAll("*").remove();

		svgRef.current = d3.select(pcpSvgRef.current)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

		d3.json(`/apis/data/pcp/${year}`).then((pcpData) => {
			colorRef.current = d3.scaleOrdinal()
				.domain(pcpData['data'].map(d => d['clusterId']))
				.range(d3.schemeCategory10.slice(0, numClusters));

			yRef.current = {};
			dimensions.forEach((dim, i) => {
				if (isFeatureCategorical[dim]) {
					let uniqueValues = [...new Set(pcpData['data'].map(d => d[dim]))];
					yRef.current[dim] = d3.scalePoint()
						.domain(uniqueValues)
						.range([height, 0]);
				} else {
					yRef.current[dim] = d3.scaleLinear()
						.domain(featureDomains[dim])
						.range([height, 0]);
				}
			});

			xRef.current = d3.scalePoint()
				.range([0, width])
				.padding(1)
				.domain(dimensions);


			pathRef.current = function path(d) {
				return d3.line()(dimensions.map(p => { return [xRef.current(p), yRef.current[p](d[p])] }));
			}

			// Handle dragging
			const handleDrag = d3.drag()
				.on("start", function (event, d) {
					d3.select(this).raise();
				})
				.on("drag", function (event, d) {
					let newPos = Math.max(0, Math.min(width, event.x));
					let newPositionIndex = Math.round((newPos / width) * (dimensions.length - 1));
					let currentIndex = dimensions.indexOf(d);

					if (newPositionIndex !== currentIndex) {
						dimensions.splice(currentIndex, 1);
						dimensions.splice(newPositionIndex, 0, d);

						xRef.current.domain(dimensions);
						svgRef.current.selectAll(".axis")
							.attr("transform", dimension => `translate(${xRef.current(dimension)})`)
							.each(function (dimension) {
								d3.select(this).call(d3.axisLeft().scale(yRef.current[dimension]));
							});

						svgRef.current.selectAll("path.line")
							.attr("d", pathRef.current); // Recalculate the line paths
					}
				})
				.on('end', function (event, d) {
					// Create a brush for each axis
					dimensions.forEach(dim => {
						function brushed(event, dim) {
							if (!event.selection) {
								brushSelections[dim] = null; // Clear selection for this dimension
							} else {
								if (!isFeatureCategorical[dim]) {
									const [y1, y0] = event.selection.map(yRef.current[dim].invert, yRef.current[dim]);
									brushSelections[dim] = d => d[dim] >= y0 && d[dim] <= y1;
								} else {
									// Handle categorical dimension
									const positions = yRef.current[dim].domain().map(d => yRef.current[dim](d));
									brushSelections[dim] = d => {
										const position = yRef.current[dim](d[dim]);
										return position >= event.selection[0] && position <= event.selection[1];
									};
								}
							}

							// Apply global filtering logic
							svgRef.current.selectAll("path.line").style("stroke-opacity", d => {
								// Check every dimension's selection to decide if the line should be highlighted
								return Object.keys(brushSelections).every(dim => {
									const test = brushSelections[dim];
									return test ? test(d) : true; // If no selection for a dimension, consider it as passing the test
								}) ? 1 : 0;
							});

						}

						function brushended(event) {
							if (!event.selection) {
								svgRef.current.selectAll("path.line")
									.style("stroke-opacity", 0);
							}

							if (!event.selection) {
								delete brushSelections[dim]; // Remove the selection for this dimension
								// You might want to reapply the global filtering here as well
							}
						}

						const brush = d3.brushY()
							.extent([[0, 0], [width, height]])
							.on("brush", event => brushed(event, dim)) // Pass the current dimension
							.on("end", brushended);

						svgRef.current.append("g")
							.attr("class", "brush")
							.attr("transform", `translate(${xRef.current(dim)})`)
							.call(brush);
					});
				});

			// Draw the lines
			svgRef.current.selectAll("path.line")
				.data(pcpData['data'])
				.enter().append("path")
				.attr("class", "line")
				.attr("d", pathRef.current)
				.style("fill", "none")
				.style("stroke", d => { return colorRef.current(d['clusterId']) })
				.style("opacity", d => selectedCountries.includes(d.Code) ? 1 : 0);

			// Draw the axis and apply drag behavior
			svgRef.current.selectAll(".axis")
				.data(dimensions).enter()
				.append("g")
				.attr("class", "axis")
				.attr("transform", d => `translate(${xRef.current(d)})`)
				.each(function (d) { d3.select(this).call(d3.axisLeft().scale(yRef.current[d])); })
				.call(handleDrag) // Apply the drag behavior to each axis
				.append("text")
				.style("text-anchor", "middle")
				.attr("y", -9)
				.attr("transform", "translate(-10,0)rotate(-20)")
				.style("text-anchor", "start")
				.text(d => d)
				.style("fill", "black")
				.style("cursor", "all-scroll");;

			svgRef.current.append("text")
				.attr("x", width / 2)
				.attr("y", 0 - (margin.top / 1.5))
				.attr("text-anchor", "middle")
				.style("font-size", "20px")
				.style("text-decoration", "underline")
				.style("font", "bold 16px Comic Sans MS")
				.text(`Parallel Coordinate Plot`);

			// Create a brush for each axis
			dimensions.forEach(dim => {
				function brushed(event, dim) {
					if (!event.selection) {
						brushSelections[dim] = null; // Clear selection for this dimension
					} else {
						if (!isFeatureCategorical[dim]) {
							const [y1, y0] = event.selection.map(yRef.current[dim].invert, yRef.current[dim]);
							brushSelections[dim] = d => d[dim] >= y0 && d[dim] <= y1;
						} else {
							// Handle categorical dimension
							const positions = yRef.current[dim].domain().map(d => yRef.current[dim](d));
							brushSelections[dim] = d => {
								const position = yRef.current[dim](d[dim]);
								return position >= event.selection[0] && position <= event.selection[1];
							};
						}
					}

					// Apply global filtering logic
					svgRef.current.selectAll("path.line").style("stroke-opacity", d => {
						// Check every dimension's selection to decide if the line should be highlighted
						return Object.keys(brushSelections).every(dim => {
							const test = brushSelections[dim];
							return test ? test(d) : true; // If no selection for a dimension, consider it as passing the test
						}) ? 1 : 0;
					});

					console.log(brushSelections)

				}

				function brushended(event) {
					if (!event.selection) {
						svgRef.current.selectAll("path.line")
							.style("stroke-opacity", 1);
					}

					if (!event.selection) {
						delete brushSelections[dim]; // Remove the selection for this dimension
						// You might want to reapply the global filtering here as well
					}
				}

				const brush = d3.brushY()
					.extent([[-10, 0], [10, height]])
					.on("brush", event => brushed(event, dim)) // Pass the current dimension
					.on("end", brushended);

				svgRef.current.append("g")
					.attr("class", "brush")
					.attr("transform", `translate(${xRef.current(dim)})`)
					.call(brush);
				firstLoad.current = 1;
			});
		});
	}, []);

	useEffect(() => {
		if (firstLoad.current === null) {
			return;
		}
		const margin = { top: 80, right: 50, bottom: 15, left: 30 },
			width = 1020 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		let all_dimensions = [
			"Continent",
			"Mean years of schooling",
			"Deaths_due_to_air_pollution",
			"Drug_use_death_rate",
			"Gender_Inequality_Index",
			"BCG_immunization",
			"MCV1_immunization",
			"RCV1_immunization",
			"DTP3_immunization",
			"Life_expectancy_at_birth",
			"GDP_PPP",
			"Corruption_index",
			"Primary_school_enrollment",
			"Public_admin_index",
			"Rule_of_law_index",
			"Under_fifteen_mortality_rate",
			"Count of Women in Parliament",
			"Annual CO₂ emissions (per capita)",
			"Ozone depletion",
			"Electricity from nuclear - TWh"
		];

		let dimensions = [];
		for (let i = 0; i < all_dimensions.length; i++) {
			dimensions.push(all_dimensions[i]);
		}

		d3.json(`/apis/data/pcp/${year}`).then((pcpData) => {

			if (colorRef.current === null) {
				colorRef.current = d3.scaleOrdinal()
					.domain(pcpData['data'].map(d => d['clusterId']))
					.range(d3.schemeCategory10.slice(0, numClusters));
			}

			svgRef.current.selectAll('path.line').remove();

			svgRef.current.selectAll("path.line")
				.data(pcpData['data'])
				.enter().append("path")
				.attr("class", "line")
				.attr("d", pathRef.current)
				.style("fill", "none")
				.style("stroke", d => { return colorRef.current(d['clusterId']) })
				.style("opacity", d => selectedCountries.includes(d.Code) ? 1 : 0);
		});
	}, [year])

	useEffect(() => {
		if (firstLoad.current === null) {
			return;
		}

		d3.selectAll('path.line')
			.style("opacity", d => selectedCountries.length == 0 || selectedCountries.includes(d.Code) ? 1 : 0);
	}, [selectedCountries])

	return (<svg width={1200} height={300} id='pcpPlot' ref={pcpSvgRef}></svg>);
}

export default ParallelCoordinatePlot;
