import * as d3 from "d3";
import { useEffect, useRef } from "react";

function chloromap({}) {
    const chloromapref = useRef();

    useEffect(() => {
        const margin = { top: 30, bottom: 60, left: 80, right: 10 };
        const width = 500 - margin.left - margin.right;
        const height = 300 - margin.top - margin.bottom;

        const svg = d3.select(chloromapref.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // Define the projection
        const projection = d3.geoMercator()
            .scale(100)
            .translate([width / 2, height / 2]);

        // Create a path generator
        const path = d3.geoPath().projection(projection);

        // Load the GeoJSON data
        d3.json('/apis/data/choromap').then(function (chloromapData) {
            // Draw the map features
            svg.selectAll("path")
                .data(chloromapData.features)
                .enter().append("path")
                .attr("d", path)
                .style("fill", function (d) {
                    // Here, you need to specify how to color the map based on your data
                    return "steelblue"; // Change this to dynamically color based on data
                });
        });
    }, []);

    return (
        <svg ref={chloromapref} id="Chloromap"></svg>
    );
}

export default chloromap;
