define(["d3", "moment"], function (d3, moment) {
    return {
        draw: function (rabu, totalWidth, totalHeight, anchor, features) {
            var totalWidth = totalWidth || 800;
            var totalHeight = totalHeight || 400;
            var anchor = anchor || "body";

            var margin = {top: 30, right: 50, bottom: 70, left: 50};
            var width = totalWidth - margin.left - margin.right;
            var height = totalHeight - margin.top - margin.bottom;

            var svg = d3.select(anchor).append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .attr("class", "box");
            var grid = svg.append("g")
                .attr("width", width)
                .attr("height", height)
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            var x = d3.time.scale()
                .domain([moment(rabu.data[0].date).subtract("weeks", 1).valueOf(), moment(rabu.iterationDates[rabu.iterationDates.length-1]).valueOf()])
                .range([0, width]);
            var y = d3.scale.linear()
                .domain([0, Math.max(d3.max(rabu.maxValues), d3.sum(features)) + 5])
                .range([height, 0]);


            var xAxis = d3.svg.axis()
                .scale(x)
                .tickValues(rabu.iterationDates)
                .tickFormat(d3.time.format("%m/%d"))
                .orient("bottom");

            var yAxis = d3.svg.axis()
                .scale(y)
                .orient("left");

            // draw y axis
            svg.append("g")
                .attr("class", "y axis")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
                .call(yAxis)
                .append("text") // and text1
                .attr("transform", "rotate(-90)")
                .attr("y", 6)
                .attr("dy", ".71em")
                .style("text-anchor", "end")
                .style("font-size", "16px")
                .text("Points");

            // draw x axis
            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(" + margin.left + "," + (height + margin.top) + ")")
                .call(xAxis)
                .append("text")             // text label for the x axis
                .attr("x", (width / 2))
                .attr("y", 20)
                .attr("dy", ".71em")
                .style("text-anchor", "middle")
                .style("font-size", "16px")
                .text("Iteration");

            var min = 0;
            var max = d3.max(d3.merge(rabu.data.map(function (d) {
                return d.spread
            })));


            var area = d3.svg.area()
                .interpolate("linear")
                .x(function (d) {
                    return x(d.date);
                })
                .y0(height)
                .y1(function (d) {
                    return y(d.cumulativePoints);
                });

            if (features) {
                var featureColors = ["lightcoral", "lightsalmon", "#9999FF", "#FF6600", "#99FF99", "#336699", "#999966"].slice(0, features.length).reverse();
                var cumFeaturePoints = 0;
                var featureTotals = features.map(function(f,i) {
                    var total = cumFeaturePoints + f;
                    cumFeaturePoints += f;
                    return total;
                });
                featureTotals.sort().reverse().forEach(function(featurePoints, i) {
                grid.append("path")
                    .attr("class", "feature-area")
                    .attr("fill", featureColors[i%featureColors.length])
                    .attr("d", area([
                        {date: moment(rabu.data[0].date).clone().subtract('weeks', 1).toDate(), points: featurePoints, cumulativePoints: featurePoints}
                    ].concat(rabu.data.map(function (d) {
                        return {date: d.date, points: featurePoints, cumulativePoints: featurePoints}
                    }))));

                });
            }

            var boxWidth = 10;

            grid.selectAll(".box")
                .data(rabu.data)
                .enter().append("g")
                .attr("class", "box")
                .attr("width", boxWidth)
                .attr("height", height)
                .attr("transform", function (d) {
                    return "translate(" + (x(d.date) - (boxWidth / 2)) + ",0)";
                })
                .call(drawBox);


            function drawBox(g) {
                g.each(function (iteration, i) {
                    var g = d3.select(this);
                    var x1 = d3.scale.linear()
                        .domain([min, max])
                        .range([height, 0]);

                    var whiskerData = iteration.spread;
                    var whisker = g.selectAll("line.whisker")
                        .data(whiskerData);

                    whisker.enter().insert("line", "circle, text")
                        .attr("class", "whisker")
                        .attr("x1", 0)
                        .attr("y1", y)
                        .attr("x2", boxWidth)
                        .attr("y2", y)
                        .style("opacity", 1);

                    var whiskerVertical = g.selectAll("line.whisker-vertical")
                        .data(whiskerData ? [whiskerData] : []);

                    whiskerVertical.enter().insert("line", "rect")
                        .attr("class", "whisker-vertical")
                        .attr("x1", boxWidth / 2)
                        .attr("x2", boxWidth / 2)
                        .style("opacity", 1)
                        .attr("y1", function (d) {
                            return y(d[0]);
                        })
                        .attr("y2", function (d) {
                            return y(d[2]);
                        });

                    var whiskerTick = g.selectAll("text.whisker")
                        .data(iteration.spread);
                    whiskerTick.enter().append("text")
                        .attr("class", "whisker")
                        .attr("dy", ".3em")
                        .attr("dx", 6)
                        .attr("x", boxWidth)
                        .attr("y", y)
                        .text(function (d) {
                            return d;
                        })
                        .style("opacity", 1);
                });

                drawComplete(rabu.data);
            }

            function drawComplete(completeData) {
                var allIterations = [
                    {date: moment(completeData[0].date).clone().subtract('weeks', 1).toDate(), points: 0, cumulativePoints: 0}
                ].concat(completeData);
                console.log("allIterations: " + allIterations);
                var complete = grid.append("g")
                    .attr("class", "complete");

                var lastIteration = allIterations[allIterations.length - 1];
                complete.append("clipPath")
                    .attr("id", "clip")
                    .append("rect")
                    .attr("width", x(lastIteration.date))
                    .attr("height", height);

                var area = d3.svg.area()
                    .interpolate("linear")
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y0(height)
                    .y1(function (d) {
                        return y(d.cumulativePoints);
                    });

                // Add the area path.
                complete.append("path")
                    .attr("class", "area")
                    .attr("clip-path", "url(#clip)")
                    .attr("d", area(allIterations));


                // A line generator, for the dark stroke.
                var line = d3.svg.line()
                    .interpolate("linear")
                    .x(function (d) {
                        return x(d.date);
                    })
                    .y(function (d) {
                        return y(d.cumulativePoints);
                    });

                // Add the line path.
                complete.append("path")
                    .attr("class", "line")
                    .attr("clip-path", "url(#clip)")
                    .attr("d", line(allIterations));

                // Add the symbol path
                complete.selectAll("circle")
                    .data(allIterations)
                    .enter().append("path")
                    .attr("transform", function (d) {
                        return "translate(" + x(d.date) + "," + y(d.cumulativePoints) + ")";
                    })
                    .attr("class", "symbol")
                    .attr("d", d3.svg.symbol());
            }
        }
    };
});
