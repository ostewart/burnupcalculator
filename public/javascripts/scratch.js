
pathContainers.enter().append('g')
    .attr('class', 'line')
    .attr("style", function(d) {
        return "stroke: " + color_hash[dataset.indexOf(d)][1];
    });

pathContainers.selectAll('path')
    .data(function (d) { return [d]; }) // continues the data from the pathContainer
    .enter().append('path')
    .attr('d', d3.svg.line()
        .x(function (d) { return xScale(d.x); })
        .y(function (d) { return yScale(d.y); })
    );

// add circles
pathContainers.selectAll('circle')
    .data(function (d) { return d; })
    .enter().append('circle')
    .attr('cx', function (d) { return xScale(d.x); })
    .attr('cy', function (d) { return yScale(d.y); })
    .attr('r', 3);