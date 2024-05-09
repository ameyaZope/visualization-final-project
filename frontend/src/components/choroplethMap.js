import * as d3 from "d3";
import { useEffect, useRef } from "react";
import { feature } from 'topojson-client';

function ChoroplethMap({ year, selectedCountries, selectedFeature, handleCountrySelection, handleCountriesDefault, handleCountriesAppend }) {
	const choroplethMapSvgRef = useRef();
	const selectedCountriesRef = useRef(selectedCountries);
	const svgRef = useRef(null);
	const colorRef = useRef(null);
	const pathRef = useRef(null);
	const countriesRef = useRef(null);
	const polyRef = useRef(null);
	const lineRef = useRef(null);

	let featureDomains = {
		'Annual CO₂ emissions (per capita)': [0.019352028, 67.493744],
		'BCG_immunization': [0.0, 100.0],
		'Cantril_ladder_score': [2.5229, 7.85574],
		'Cereal Production': [0.0, 36.761898],
		'Code': ['AFG', 'ZWE'],
		'Continent': ['Africa', 'South America'],
		'Corruption_index': [0.0, 1],
		'Count of Women in Parliament': [0.0, 63.75],
		'DTP3_immunization': [19.0, 100.0],
		'Deaths_due_to_air_pollution': [2.6605287, 497.20084],
		'Drug_use_death_rate': [0.0, 18.83],
		'Electricity from nuclear - TWh': [0.0, 809.41],
		'Entity': ['Afghanistan', 'Zimbabwe'],
		'Expenditure_estimates': [0.12717403, 15.158183],
		'GDP_PPP': [32781462.0, 22996385000000.0],
		'GDP_Per_capita': [628.6933, 120647.82],
		'Gender_Inequality_Index': [0.0, 1],
		'HDI': [0.0, 1],
		'HepB3_immunization': [0.0, 100.0],
		'Hib3_immunization': [0.0, 100.0],
		'High_corruption_index': [0.0, 1.0],
		'IPV1_immunization': [0.0, 100.0],
		'Life_expectancy_at_birth': [41.9572, 86.5424],
		'Literacy Rate': [0.0, 100.0],
		'Literacy rate, adult total (% of people ages 15 and above)': [14.37604, 99.99995],
		'Low_corruption_index': [0.0, 1.0],
		'Lower_secondary_completion_rate': [3.95885, 196.342],
		'MCV1_immunization': [0.0, 100.0],
		'Mean years of schooling': [0.55942, 14.13215],
		'Mean_income_consumption': [0, 100],
		'Observation value - Unit of measure: Deaths per 100 live births - Indicator: Under-five mortality rate - Sex: Both sexes - Wealth quintile: All wealth quintiles_x': [0.17836553, 22.850826],
		'Observation value - Unit of measure: Deaths per 100 live births - Indicator: Under-five mortality rate - Sex: Both sexes - Wealth quintile: All wealth quintiles_y': [0.17836553, 22.850826],
		'Ozone depletion': [-4328.66, 90877.7],
		'PCV3_immunization': [0.0, 100.0],
		'Patent_applications_per_million': [0.010300319, 3481.109],
		'Pol3_immunization': [8.0, 100.0],
		'Primary completion rate, total (% of relevant age group)_x': [16.56425, 152.80666],
		'Primary completion rate, total (% of relevant age group)_y': [16.57523, 134.54251],
		'Primary_school_enrollment': [22.16299, 150.41019],
		'Public_admin_index': [-2.848, 4.046],
		'RCV1_immunization': [0.0, 100.0],
		'Researchers_per_million': [5.91183, 8713.594],
		'RotaC_immunization': [0.0, 100.0],
		'Rule_of_law_index': [0.0, 1.0],
		'Secondary_school_enrollment': [6.07717, 164.07982],
		'Tertiary_school_enrollment': [0.11737, 143.31068],
		'Under_fifteen_mortality_rate': [0.23066321, 26.790155],
		'Upper_secondary_completion_rate': [0.0, 100.0],
		'YFV_immunization': [0.0, 100.0],
		'Year': [2000, 2020]
	};

	useEffect(() => {
		var svgSelected = d3.select('#choroplethMap');
		svgSelected.selectAll('*').remove();

		var margin = { top: 50, bottom: 60, left: 0, right: 10 };
		var width = 450 - margin.left - margin.right,
			height = 330 - margin.top - margin.bottom;

		svgRef.current = d3.select(choroplethMapSvgRef.current)
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
			.text(`${selectedFeature}`);

		const projection = d3.geoEqualEarth()
			.scale(100)
			.center([0, 0])
			.translate([width / 2.2, height / 2]);

		pathRef.current = d3.geoPath()
			.projection(projection);

		let colorDomain = []
		let numDivisions = 4
		for(let i=0;i<numDivisions;i++) {
			colorDomain.push(featureDomains[selectedFeature][1]*(i+1)/numDivisions)
		}
		
		colorRef.current = d3.scaleThreshold()
			.domain(colorDomain)
			.range(["#aad9b5", "#5ba97d", "#307d56", "#13542d"])
			.unknown("#E6E6E6");

		//declare polygon and polyline
		polyRef.current = svgRef.current.append("g");
		lineRef.current = svgRef.current.append("g");

		const dataUrl = `/apis/data/choroplethmap/${year}`
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
				data[choroplethMapData[i]['Code']] = +choroplethMapData[i][selectedFeature]
			}

			const mouseover = function (d) {
				d3.selectAll(".countries")
					.transition()
					.duration(100)
					.style("opacity", 0.3)
				d3.select(this)
					.transition()
					.duration(100)
					.style("opacity", 1)
			};

			const mouseleave = function (d) {
				d3.selectAll(".countries")
						.transition()
						.duration(100)
					.style("opacity", d => selectedCountriesRef.current.includes(d.properties.color_code) || selectedCountries.length == 0 ? 1 : 0.3);
			};
			countriesRef.current = polyRef.current
				.selectAll("path")
				.data(feature(topology, topology.objects.world_polygons_simplified).features)
				.join("path")
				.attr("fill", function (d) {
					return colorRef.current(d[selectedFeature] = data[d.properties.color_code])
				})
				.attr("d", pathRef.current)
				.attr("class", function (d) { return "countries" })
				.on("click", function(event, d) {
					const code = d.properties.color_code;
					handleCountriesAppend(code);  
					svgRef.current.selectAll(".country")
							.transition().duration(100)
						.style("opacity", 0.3);  
					d3.select(this)
							.transition().duration(100)
						.style("opacity", 1);
				})
				.on("mouseover", mouseover)
				.on("mouseleave", mouseleave)
				.append("title")
				.text(function (d) {
					return `Country: ${d['properties']['gis_name']}\nCorruption Index: ${d3.format(",")(d[selectedFeature])}`
				});

			d3.json(polylinesUrl).then(function (topology) {
				lineRef.current
					.selectAll("path")
					.data(feature(topology, topology.objects.world_lines_simplified).features)
					.enter()
					.append("path")
					.attr("d", pathRef.current)
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
						polyRef.current.selectAll('path')
							.attr('transform', event.transform);
						lineRef.current.selectAll('path')
							.attr('transform', event.transform);
					});
				svgRef.current.call(zoomFunction);
			};

			// set legend
			svgRef.current.append("g")
				.attr("class", "legendThreshold")
				.attr("transform", `translate(5,${height})`);

			const legendData = colorRef.current.range().map(colorRef.current.invertExtent);
			const legend = svgRef.current.append("g")
				.attr("class", "legendThreshold")
				.attr("transform", `translate(100, ${height-10})`);

				const legendColorScale = d3.scaleLinear()
        .domain([0, colorDomain.length - 1]) // Set domain based on the number of colors in the scale
        .range(colorDomain);

			legend.selectAll("rect")
				.data(legendData)
				.enter()
				.append("rect")
				.attr("x", (d, i) => i * 60)
				.attr("y", 0)
				.attr("width", 60)
				.attr("height", 20)
				.style("fill", (d, i) => { if(i==0) {return colorRef.current(0)} ;return colorRef.current(d[0]) })
				.on("mouseover", function (e, d) {
					const [min, max] = d;
					d3.selectAll(".countries").transition()
						.duration(100)
						.style("opacity", b => {
							if (min !== undefined && max !== undefined) {
								return (data[b.properties.color_code] >= min && data[b.properties.color_code] < max) ? 1 : 0.3;
							} else if (min === undefined) {
								return (data[b.properties.color_code] < max) ? 1 : 0.3;
							} else if (max === undefined) {
								return (data[b.properties.color_code] >= min) ? 1 : 0.3;
							}
						});
				})
				.on("mouseout", function () {
					d3.selectAll(".countries")
						.transition()
						.duration(100)
						.style("opacity", d => selectedCountriesRef.current.includes(d.properties.color_code) ? 1 : 0.3);
				});



			let legendText = []
			for (let item in legendData) {
				if (legendData[item][0] === undefined) {
					legendText.push(0)
				}
				else {
					legendText.push(legendData[item][0])
				}
			}
			legendText.push(legendData[legendData.length-1][1])

			legend.selectAll("text.start")
				.data(legendText)
				.enter()
				.append("text")
				.attr("class", "start")
				.attr("x", (d, i) => i * 60) 
				.attr("y", 10) 
				.attr("dy", "1em") 
				.attr("dx", -5) 
				.text(d => d3.format(",.2f")(d)) 
				.style("font", "bold 16px Comic Sans MS")
				.style("text-anchor", "start")
				.attr("transform", (d, i) => {return `translate(0, 10) rotate(25, ${i*60}, 30)`}); 
		})
	}, [selectedFeature])

	useEffect(() => {
		const dataUrl = `/apis/data/choroplethmap/${year}`
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
				data[choroplethMapData[i]['Code']] = +choroplethMapData[i][selectedFeature]
			}

			const mouseover = function (d) {
				d3.selectAll(".countries")
					.transition()
					.duration(100)
					.style("opacity", 0.3)
				d3.select(this)
					.transition()
					.duration(100)
					.style("opacity", 1)
			};

			const mouseleave = function (d) {
				d3.selectAll(".countries")
					.transition()
					.duration(100)
					.style("opacity", d => selectedCountriesRef.current.includes(d.properties.color_code) || selectedCountries.length == 0 ? 1 : 0.3);
			};

			countriesRef.current = polyRef.current
				.selectAll("path")
				.data(feature(topology, topology.objects.world_polygons_simplified).features)
				.join("path")
				.attr("fill", function (d) {
					return colorRef.current(d[selectedFeature] = data[d.properties.color_code])
				})
				.attr("d", pathRef.current)
				.attr("class", function (d) { return "countries" })
				.on("click", function (event, d) {
					const code = d.properties.color_code;
					handleCountriesAppend(code);
					svgRef.current.selectAll(".country")
						.transition().duration(100)
						.style("opacity", 0.3);
					d3.select(this)
						.transition().duration(100)
						.style("opacity", 1);
				})
				.on("mouseover", mouseover)
				.on("mouseleave", mouseleave)
				.append("title")
				.text(function (d) {
					return `Country: ${d['properties']['gis_name']}\nCorruption Index: ${d3.format(",")(d[selectedFeature])}`
				});

			const zoom = true
			if (zoom) {
				var zoomFunction = d3.zoom()
					.scaleExtent([1, 8])
					.on('zoom', function (event) {
						polyRef.current.selectAll('path')
							.attr('transform', event.transform);
						lineRef.current.selectAll('path')
							.attr('transform', event.transform);
					});
				svgRef.current.call(zoomFunction);
			};
		})
	}, [year])

	useEffect(() => {
		selectedCountriesRef.current = selectedCountries;
		d3.selectAll(".countries")
			.transition()
			.duration(100)
			.style("opacity", d => selectedCountries.includes(d.properties.color_code) || selectedCountries.length == 0 ? 1 : 0.3);
	}, [selectedCountries])

	return (
		<svg width={400} height={350} id="choroplethMap" ref={choroplethMapSvgRef}></svg>
	)
}

export default ChoroplethMap;