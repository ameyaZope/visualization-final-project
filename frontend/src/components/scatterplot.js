import * as d3 from "d3";
import { useEffect, useRef } from "react";


function isBrushed(brush_coords, cx, cy) {
	var x0 = brush_coords[0][0],
			x1 = brush_coords[1][0],
			y0 = brush_coords[0][1],
			y1 = brush_coords[1][1];
 return x0 <= cx && cx <= x1 && y0 <= cy && cy <= y1;    // This return TRUE or FALSE depending on if the points is in the selected area
}


function Scatterplot({ xAxisFeature, yAxisFeature }) {
	const scatterPlotSvgRef = useRef();

	useEffect(() => {

		var svgSelected = d3.select('#scatterplot');
		svgSelected.selectAll('*').remove();

		let featureList = [
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

		let isFeatureCategorical = {
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

		let xlabel = xAxisFeature
		let ylabel = yAxisFeature

		var margin = { top: 30, bottom: 60, left: 80, right: 10 };
		var width = 500 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		var svg = d3.select(scatterPlotSvgRef.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom)
			.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		svg.append("text")
			.attr("x", width / 2)
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("text-decoration", "underline")
			.style("font", "bold 16px Comic Sans MS")
			.text(`${ylabel} vs ${xlabel}`);

		d3.json('/apis/data/scatterplot').then(function (scatterplotData) {
			console.log(scatterplotData)
			let x, y;
			// create and place the x axis
			if (isFeatureCategorical[xAxisFeature]) {
				x = d3.scaleBand()
					.domain(Array.from(new Set(scatterplotData['data'].map(d => d[xAxisFeature]))))
					.range([0, width])
					.padding(0.2)
				const xAxis = svg.append('g')
					.attr('transform', `translate(0, ${height})`) // used to place the x axis at the bottom of the svg
					.call(d3.axisBottom(x))
				xAxis
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
				x = d3.scaleLinear()
					.domain([0, maxVal])
					.range([0, width])
				const xAxis = svg.append('g')
					.call(d3.axisBottom(x))
					.attr('transform', `translate(0, ${height})`) // used to place the x axis at the bottom of the svg
				xAxis
					.transition()
					.duration(1000)
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style("font", "bold 16px Comic Sans MS")
					.style('text-anchor', 'end')
			}

			// x axis label
			svg.append('g')
				.append('text')
				.attr("x", (width)/2)
				.attr("y", height + margin.bottom*4/5)
				.attr("fill", "currentColor")
				.style("text-anchor", "middle")
				.style("font", "bold 16px Comic Sans MS")
				.text(`${xlabel} →`)

			//create and place the y axis. 
			if (isFeatureCategorical[yAxisFeature]) {
				y = d3.scaleBand()
					.domain(Array.from(new Set(scatterplotData['data'].map(d => d[yAxisFeature]))))
					.range([height, 0])
					.padding(0.2)
				const yAxis = svg.append('g')
					.transition()
					.duration(1000)
					.call(d3.axisLeft(y))
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
				y = d3.scaleLinear()
					.domain([0, maxVal * 1.1])
					.range([height, 0])
				const yAxis = svg.append('g')
					.transition()
					.duration(1000)
					.call(d3.axisLeft(y))
					.selectAll('text')
					.attr('transform', 'translate(-10, 0) rotate(-45)')
					.style('text-anchor', 'end')
					.style("font", "bold 16px Comic Sans MS")
			}

			svg.append("text")
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
			svg.append('g')
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
						jitter = (Math.random()) * x.bandwidth();
					}
					// Return position with optional jitter
					return x(d[xAxisFeature]) + (isFeatureCategorical[xAxisFeature] ? jitter : 0);
				})
				.attr("cy", function (d) {
					let jitter = 0; // Initialize jitter to 0
					// Apply jitter if yAxis is categorical
					if (isFeatureCategorical[xAxisFeature] && isFeatureCategorical[yAxisFeature]) {
						jitter = (Math.random()) * y.bandwidth();
					}
					// Return position with optional jitter
					return y(d[yAxisFeature]) + (isFeatureCategorical[yAxisFeature] ? jitter : 0);
				})
				.attr("r", 4)
				.attr('opacity', 0.5)
				.style("fill", "#69b3a2")
				.on('mouseover', function (event, data) {
					tooltip
						.html(
							`<div>${xlabel} : ${data[xAxisFeature]} <br> ${ylabel} : ${data[yAxisFeature]} </div>`
						)
						.style('visibility', 'visible');
					d3.select(this).transition().attr('fill', '#eec42d');
				})
				.on('mousemove', function (d) {
					tooltip
						.style('top', d.pageY - 10 + 'px')
						.style('left', d.pageX + 10 + 'px');
				})
				.on('mouseout', function () {
					tooltip.html(``).style('visibility', 'hidden');
					d3.select(this).transition().attr('fill', 'steelblue');
				})
		})

		function updateChart() {
			extent = d3.event.selection
			myCircle.classed("selected", function(d){ return isBrushed(extent, x(d.Sepal_Length), y(d.Petal_Length) ) } )
		}

		svg
    .call( d3.brush()                 // Add the brush feature using the d3.brush function
      .extent( [ [0,0], [width,height] ] ) // initialise the brush area: start at 0,0 and finishes at width,height: it means I select the whole graph area
      .on("start brush", updateChart) // Each time the brush selection changes, trigger the 'updateChart' function
    )

	}, [xAxisFeature, yAxisFeature])

	return (
		<svg width={500} height={300} id="scatterplot" ref={scatterPlotSvgRef}></svg>
	)
}

export default Scatterplot;