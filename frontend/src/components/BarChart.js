import * as d3 from "d3";
import { useEffect, useRef } from "react";

function Barchart({ xAxisFeature, yAxisFeature }) {
    const barChartSvgRef = useRef();

    // Function to get top N values based on a specified key from a dataset
    function getTopN(data, key, n) {
        return data
            .sort((a, b) => d3.descending(a[key], b[key]))
            .slice(0, n);
    }

    useEffect(() => {
        var svgSelected = d3.select('#BarChart');
        svgSelected.selectAll('*').remove();

        let xlabel = xAxisFeature;
        let ylabel = yAxisFeature;

        var margin = { top: 30, bottom: 60, left: 80, right: 10 };
        var width = 500 - margin.left - margin.right,
            height = 300 - margin.top - margin.bottom;

        var svg = d3.select(barChartSvgRef.current)
            .attr('width', width + margin.left + margin.right)
            .attr('height', height + margin.top + margin.bottom)
            .append('g')
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append('g')
            .append("text")
            .attr("x", width / 2)
            .attr("y", 0 - (margin.top / 2))
            .attr("text-anchor", "middle")
            .style("text-decoration", "underline")
            .style("font", "bold 16px Comic Sans MS")
            .text(`${ylabel} vs ${xlabel}`);

        d3.json('/apis/data/barchart').then(function (barPlotData) {

            // Group data by xAxisFeature and sum the yAxisFeature values within each group
            const groupedData = d3.group(barPlotData['data'], d => d[xAxisFeature]);
            const aggregatedData = Array.from(groupedData, ([key, value]) => {
                return {
                    [xAxisFeature]: key,
                    [yAxisFeature]: d3.sum(value, d => d[yAxisFeature])
                };
            });

            // Get top 10 aggregated data based on the yAxisFeature
            const top10Data = getTopN(aggregatedData, yAxisFeature, 10);

            let x, y;

            x = d3.scaleBand()
                .domain(top10Data.map(d => d[xAxisFeature]))
                .range([0, width])
                .padding(0.2);

            y = d3.scaleLinear()
                .domain([0, d3.max(top10Data, d => d[yAxisFeature])])
                .range([height, 0]);

            const xAxis = svg.append('g')
                .attr('transform', `translate(0, ${height})`)
                .call(d3.axisBottom(x))
                .selectAll('text')
                .attr('transform', 'translate(-10, 0) rotate(-45)')
                .style("font", "bold 16px Comic Sans MS")
                .style('text-anchor', 'end');

            const yAxis = svg.append('g')
                .call(d3.axisLeft(y))
                .selectAll('text')
                .attr('transform', 'translate(-10, 0) rotate(-45)')
                .style('text-anchor', 'end')
                .style("font", "bold 16px Comic Sans MS");
            
            svg.append("text")
                .attr("transform", `translate(${width / 2}, ${height + margin.bottom - 4})`)
                .style("text-anchor", "middle")
                .text(xlabel); 
            
            svg.append('text')
                .attr('transform', 'rotate(-90)')
                .attr('y', 0 - margin.left)
                .attr('x', 0 - (height / 2))
                .attr('dy', '1em')
                .style('text-anchor', 'middle')
                .style("font", "bold 16px Comic Sans MS")
                .text(ylabel);

            
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
                .style('color', '#fff');

            svg.selectAll(".bar")
                .data(top10Data)
                .enter().append("rect")
                .attr("class", "bar")
                .attr("x", d => x(d[xAxisFeature]))
                .attr("width", x.bandwidth())
                .attr("y", d => y(d[yAxisFeature]))
                .attr("height", d => height - y(d[yAxisFeature]))
                .style("fill", "#8FBC8F")
                .on('mouseover', function (event, data) {
                  tooltip
                    .html(
                      `<div>${ylabel}: ${data[yAxisFeature]}</div>`
                    )
                    .style('top', event.pageY - 10 + 'px')
                    .style('left', event.pageX + 10 + 'px')
                    .style('visibility', 'visible');
                  d3.select(this).style('fill', 'purple');
                })
                .on('mousemove', function (event,data) {
					tooltip
						.style('top', event.pageY - 10 + 'px')
						.style('left', event.pageX + 10 + 'px');
                        //d3.select(this).transition().attr('fill', '#eec42d');
                        console.log("In mouse move");
				})
                .on('mouseout', function () {
                  tooltip.html(``).style('visibility', 'hidden');
                  d3.select(this).style('fill', '#8FBC8F');
                });
        });
    }, [xAxisFeature, yAxisFeature]);

    return (
        <svg width={500} height={300} id="barchart" ref={barChartSvgRef}></svg>
    );
}

export default Barchart;
