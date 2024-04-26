import * as d3Base from 'd3';
import { lineChunked } from 'd3-line-chunked';
import { legendColor } from 'd3-svg-legend';
import { useEffect, useRef } from "react";
import { feature } from 'topojson-client';

function ChoroplethMap() {
	const d3 = Object.assign(d3Base, { legendColor, lineChunked })
	const choroplethMapSvgRef = useRef();

	useEffect(() => {
		var svgSelected = d3.select('#choroplethMap');
		svgSelected.selectAll('*').remove();

		var margin = { top: 30, bottom: 60, left: 80, right: 10 };
		var width = 500 - margin.left - margin.right,
			height = 300 - margin.top - margin.bottom;

		var svg = d3.select(choroplethMapSvgRef.current)
			.attr('width', width + margin.left + margin.right)
			.attr('height', height + margin.top + margin.bottom + 50)
			.append('g')
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		svg.append('g')
			.append("text")
			.attr("x", width / 2)
			.attr("y", 0 - (margin.top / 2))
			.attr("text-anchor", "middle")
			.style("text-decoration", "underline")
			.style("font", "bold 16px Comic Sans MS")
			.text(`Choropleth Map`);

		const projection = d3.geoEqualEarth()
			.scale(85)
			.center([0, 0])
			.translate([width / 2.2, height / 2]);

		const path = d3.geoPath()
			.projection(projection);

		// set color scale
		const color = d3.scaleThreshold()
			.domain([0.25, 0.5, 0.75, 1.0])
			.range(["#8FBC8F", "#3CB371", "#2E8B57", "#006400"]) // DarkSeaGreen to MediumSeaGreen to SeaGreen to DarkGreen
			.unknown("#E6E6E6");

		//declare polygon and polyline
		const poly = svg.append("g");
		const line = svg.append("g");

		const dataUrl = "/apis/data/choroplethmap"
		const polygonUrl = "/apis/data/geospatial/world/polygons"
		const polylinesUrl = "/apis/data/geospatial/world/lines";


		const promises = [
			d3.json(dataUrl),
			d3.json(polygonUrl)
		]

		Promise.all(promises).then(([choroplethMapData, topology]) => {

			const data = {};
			choroplethMapData = choroplethMapData['data']
			for (let i = 0; i < choroplethMapData.length; i++) {
				data[choroplethMapData[i]['Code']] = +choroplethMapData[i]['Corruption_index']
			}

			const mouseover = function (d) {
				d3.selectAll(".countries")
					.transition()
					.duration(100)
					.style("opacity", .3)
				d3.select(this)
					.transition()
					.duration(100)
					.style("opacity", 1)
			};

			const mouseleave = function (d) {
				d3.selectAll(".countries")
					.transition()
					.duration(100)
					.style("opacity", 1)
				d3.select(this)
					.transition()
					.duration(100)
					.style("opacity", 1)
			};
			const countries = poly
				.selectAll("path")
				.data(feature(topology, topology.objects.world_polygons_simplified).features)
				.join("path")
				.attr("fill", function (d) {
					return color(d['Corruption_index'] = data[d.properties.color_code])
				})
				.attr("d", path)
				.attr("class", function (d) { return "countries" })
				.on("mouseover", mouseover)
				.on("mouseleave", mouseleave)
				.append("title")
				.text(function (d) {
					return `Country: ${d['properties']['gis_name']}\nCorruption Index: ${d3.format(",")(d['Corruption_index'])}`
				})

			d3.json(polylinesUrl).then(function (topology) {
				line
					.selectAll("path")
					.data(feature(topology, topology.objects.world_lines_simplified).features)
					.enter()
					.append("path")
					.attr("d", path)
					.style("fill", "none")
					.style("stroke", "white")
					.style("stroke-width", "0.5px")
					.attr("class", function (d) { return d.properties.type; })
			});

			//zoom function
			const zoom = true
			if (zoom) {
				var zoomFunction = d3.zoom()
					.scaleExtent([1, 8])
					.on('zoom', function (event) {
						poly.selectAll('path')
							.attr('transform', event.transform);
						line.selectAll('path')
							.attr('transform', event.transform);
					});
				svg.call(zoomFunction);
			};


			// set legend
			svg.append("g")
				.attr("class", "legendThreshold")
				.attr("transform", `translate(5,${height})`);

			const legend = d3.legendColor()
				.labelFormat(d3.format(",.2f"))
				.labels(function ({
					i,
					genLength,
					generatedLabels,
					labelDelimiter
				}) {
					if (i === 0) {
						const values = generatedLabels[i].split(` ${labelDelimiter} `)
						return `Less than ${values[1]}`
					} else if (i === genLength - 1) {
						const values = generatedLabels[i].split(` ${labelDelimiter} `)
						return `${values[0]} or more`
					}
					return generatedLabels[i]
				})
				.shapePadding(2)
				.orient('horizontal')
				.shapeWidth(60)
				.scale(color);

			const legendG = svg.append("g")
				.attr("class", "legendThreshold")
				.attr("transform", `translate(100,${height})`)
				.call(legend)
			legendG.selectAll("text")
				.style("text-anchor", "start")
				.style("font", "bold 16px Comic Sans MS")
				.attr("transform", "rotate(15) translate(10, 30)")

			legendG.selectAll("rect")
				.data(color.range().map(color.invertExtent))
				.on("mouseover", function (e, d) {
					const [min, max] = d;
					d3.selectAll(".countries").transition()
						.duration(100)
						.style("opacity", b => { 
							if(min != undefined && max!=undefined) {
								return (data[b.properties.color_code] >= min && data[b.properties.color_code] < max) ? 1 : 0.3
							}
							else if(min == undefined) {
								return (data[b.properties.color_code] < max) ? 1 : 0.3
							}
							else if(max==undefined) {
								return (data[b.properties.color_code] >= min) ? 1 : 0.3
							}
						});
				})
				.on("mouseout", function () {
					d3.selectAll(".countries").transition()
						.duration(100)
						.style("opacity", 1);
				});
		})
	}, [])

	return (
		<svg width={500} height={300} id="choroplethMap" ref={choroplethMapSvgRef}></svg>
	)
}

export default ChoroplethMap;