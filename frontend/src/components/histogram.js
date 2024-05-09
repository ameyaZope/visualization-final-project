import * as d3 from "d3";
import { useEffect, useRef } from "react";

function Histogram({ currColName, numBins = 20, currColDispName, year }) {
	const histogramSvgRef = useRef();
	const xAxisRef = useRef(null);
	const yAxisRef = useRef(null);
	const xScale = useRef(null);
	const yScale = useRef(null);
	const svgRef = useRef(null);
	const firstLoad = useRef(null);


	useEffect(() => {
		var margin = { top: 50, right: 20, bottom: 80, left: 50 },
			width = 300 - margin.left - margin.right,
			height = 330 - margin.top - margin.bottom;

		var svgSelected = d3.select("#histogram");
		svgSelected.selectAll("*").remove();

		svgRef.current = d3.select(histogramSvgRef.current)
			.append("svg")
			.attr("width", width + margin.left + margin.right)
			.attr("height", height + margin.top + margin.bottom)
			.append("g")
			.attr("transform",
				"translate(" + margin.left + "," + margin.top + ")");
		svgRef.current.append("text")
			.attr("x", width / 2 - 15)
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("font", "bold 16px 'JetBrains Mono'")
			.style("text-decoration", "underline")
			.text(`${currColDispName}`);

		// get the data
		d3.json(`/apis/data/histogram`).then(function (histogramData) {
			histogramData = histogramData['data']
			// Bin the data.
			const currBins = d3.bin()
				.thresholds(numBins)
				.value((d) => { return d[currColName] })
				(histogramData[year]);

			let minX = Number.POSITIVE_INFINITY;
			let maxX = Number.NEGATIVE_INFINITY;
			for (let yr = 2000; yr <= 2020; yr++) {
				let bins = d3.bin()
					.thresholds(numBins)
					.value((d) => { return d[currColName] })
					(histogramData[yr]);
				minX = Math.min(minX, bins[0].x0)
				maxX = Math.max(maxX, bins[bins.length - 1].x1)
			}

			// Declare the x (horizontal position) scale.
			xScale.current = d3.scaleLinear()
				.domain([minX, maxX])
				.range([0, width]);
			//Add the X Axis and The Label
			xAxisRef.current = svgRef.current.append("g")
				.attr("transform", `translate(0,${height})`)
				.call(d3.axisBottom(xScale.current))
				.selectAll("text")
				.attr("transform", "translate(-10,0)rotate(-45)")
				.style("text-anchor", "end")
				.style("font", "bold 16px 'JetBrains Mono'");
			svgRef.current.append("text")
				.attr("transform", `translate(${width / 2}, ${height + margin.bottom/2 + 5})`)
				.style("text-anchor", "middle")
				.style("font", "bold 16px 'JetBrains Mono'")
				.text(`${currColDispName}`);

			let maxY = Number.NEGATIVE_INFINITY;
			for (let yr = 2000; yr <= 2020; yr++) {
				let bins = d3.bin()
					.thresholds(numBins)
					.value((d) => { return d[currColName] })
					(histogramData[yr]);
					for(let i=0;i<bins.length;i++) {
						maxY = Math.max(maxY, bins[i].length)
					}
			}
			// Declare the y (vertical position) scale.
			yScale.current = d3.scaleLinear()
				.domain([0, maxY])
				.range([height, 0]);
			//Add y Axis and the label
			yAxisRef.current = svgRef.current.append("g")
				.transition()
				.duration(1000)
				.call(d3.axisLeft(yScale.current))
				.selectAll("text")
				.attr("transform", "translate(-10,0)rotate(-45)")
				.style("text-anchor", "end")
				.style("font", "bold 16px 'JetBrains Mono'");
			svgRef.current.append("text")
				.attr("transform", "rotate(-90)")
				.attr("y", 0 - margin.left)
				.attr("x", 0 - (height / 2))
				.attr("dy", "1em")
				.style("text-anchor", "middle")
				.text("Frequency")
				.style("font", "bold 16px 'JetBrains Mono'");

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

			// Add a rect for each bin.
			svgRef.current.append("g")
				.attr("fill", "#69b3a2")
				.selectAll()
				.data(currBins)
				.join("rect")
				.attr("x", (d) => xScale.current(d.x0) + 1)
				.attr("width", (d) => xScale.current(d.x1) - xScale.current(d.x0))
				.attr("y", (d) => yScale.current(0))
				.attr("height", (d) => height - yScale.current(0))
				.attr("stroke", "black") 
				.attr("stroke-width", 1)
				.on('mouseover', function (event, data) {
					tooltip
						.html(
							`<div>Frequency: ${data.length} <br> Range: [${data.x0}, ${data.x1})</div>`
						)
						.style('visibility', 'visible');
					d3.select(this).transition().attr('fill', 'purple');
				})
				.on('mousemove', function (d) {
					tooltip
						.style('top', d.pageY - 10 + 'px')
						.style('left', d.pageX + 10 + 'px');
				})
				.on('mouseout', function () {
					tooltip.html(``).style('visibility', 'hidden');
					d3.select(this).transition().attr('fill', '#69b3a2');
				});

			// Animation
			svgRef.current.selectAll("rect")
				.data(currBins)
				.transition()
				.duration(800)
				.delay((d, i) => { return i * 20 })
				.attr("y", (d) => yScale.current(d.length))
				.attr("height", (d) => yScale.current(0) - yScale.current(d.length))

			firstLoad.current = 1;

		});
	}, [currColName, numBins, currColDispName])

	useEffect(() => {
		if (firstLoad.current===null) {
			return;
		}

		var margin = { top: 50, right: 20, bottom: 80, left: 50 },
			width = 300 - margin.left - margin.right,
			height = 330 - margin.top - margin.bottom;

		d3.json(`/apis/data/histogram/${year}`).then(function (histogramData) {
			histogramData = histogramData['data']
			// Bin the data.
			const bins = d3.bin()
				.thresholds(numBins)
				.value((d) => { return d[currColName] })
				(histogramData);

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

			// Add a rect for each bin.
			svgRef.current.selectAll("rect")
				.data(bins)
				.transition()
				.duration(800)
				.attr("x", (d) => { return xScale.current(d.x0) + 1 })
				.attr("width", (d) => xScale.current(d.x1) - xScale.current(d.x0))
				.attr("y", (d) => yScale.current(d.length))
				.attr("height", (d) => yScale.current(0) - yScale.current(d.length))
				.on('end', function () {
					d3.select(this)
						.on('mouseover', function (event, data) {
							tooltip
								.html(
									`<div>Frequency: ${data.length} <br> Range: [${data.x0}, ${data.x1})</div>`
								)
								.style('visibility', 'visible');
							d3.select(this).transition().attr('fill', 'purple');
						})
						.on('mousemove', function (d) {
							tooltip
								.style('top', d.pageY - 10 + 'px')
								.style('left', d.pageX + 10 + 'px');
						})
						.on('mouseout', function () {
							tooltip.html(``).style('visibility', 'hidden');
							d3.select(this).transition().attr('fill', '#69b3a2');
						});
						});
		});
	}, [year]);

	return (
		<svg height={300} width={300} id="histogram" ref={histogramSvgRef} />
	);
}

export default Histogram;