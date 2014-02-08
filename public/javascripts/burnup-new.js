var margin = {top: 30, right: 50, bottom: 70, left: 50};
var width = 800 - margin.left - margin.right;
var height = 400 - margin.top - margin.bottom;



var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("class", "box")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var x = d3.time.scale()
    .domain([moment(rabuData[0].date).subtract("weeks", 1).valueOf(), moment("2014-03-31").valueOf()])
//    .tickFormat(function(t){return "blah";})
    .range([0,width]);
var y = d3.scale.linear()
    .domain([0, d3.max(maxValues) + 5])
    .range([height, 0]);
//    .range([height + margin.top, 0 + margin.top]);



var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(iterationDates)
    .tickFormat(d3.time.format("%m/%d"))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left");

// draw y axis
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(0," + margin.top + ")")
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
    .attr("transform", "translate(0," + (height + margin.top) + ")")
    .call(xAxis)
    .append("text")             // text label for the x axis
    .attr("x", (width / 2))
    .attr("y", 20)
    .attr("dy", ".71em")
    .style("text-anchor", "middle")
    .style("font-size", "16px")
    .text("Iteration");

var min = 0;
var max = d3.max(d3.merge(rabuData.map(function (d) {
    return d.spread
})));


//var chart = d3.box()
//    .whiskers(function(d,i) {return [d.spread[0], d.spread[2]]})
//    .height(height)
//    .domain([min, max]);

var boxWidth = 10;

svg.selectAll(".box")
    .data(rabuData)
    .enter().append("g")
    .attr("width", boxWidth)
    .attr("transform", function (d) {
        return "translate(" + (x(d.date) - (boxWidth/2)) + "," + margin.top + ")";
    })
    .call(drawBox);


function drawBox(g) {
    g.each(function(iteration,i) {
        var g = d3.select(this);
        var x1 = d3.scale.linear()
            .domain([min, max])
            .range([height, 0]);

        var medianLine = g.selectAll("line.median")
            .data([iteration.spread[1]]);

        medianLine.enter().append("line")
            .attr("class", "median")
            .attr("x1", 0)
            .attr("y1", x1)
            .attr("x2", boxWidth)
            .attr("y2", x1);
        console.log("medianLine: " + medianLine);
        console.log("d: " + iteration.spread);


        var whiskerData = [iteration.spread[0], iteration.spread[2]];
        var whisker = g.selectAll("line.whisker")
            .data(whiskerData);

        whisker.enter().insert("line", "circle, text")
            .attr("class", "whisker")
            .attr("x1", 0)
            .attr("y1", x1)
            .attr("x2", boxWidth)
            .attr("y2", x1)
            .style("opacity", 1);

        var whiskerVertical = g.selectAll("line.whisker-vertical")
            .data(whiskerData ? [whiskerData] : []);

        whiskerVertical.enter().insert("line", "rect")
            .attr("class", "whisker-vertical")
            .attr("x1", boxWidth / 2)
            .attr("x2", boxWidth / 2)
            .style("opacity", 1)
            .attr("y1", function(d) { return x1(d[0]); })
            .attr("y2", function(d) { return x1(d[1]); });

        var whiskerTick = g.selectAll("text.whisker")
            .data(iteration.spread);
            whiskerTick.enter().append("text")
                .attr("class", "whisker")
                .attr("dy", ".3em")
                .attr("dx", 6)
                .attr("x", boxWidth)
                .attr("y", x1)
                .text(x1.tickFormat(8))
                .style("opacity", 1);
    });

    drawComplete(rabuData);
}

function drawComplete(completeData) {
    var allIterations = [{date: moment(completeData[0].date).clone().subtract('weeks', 1).toDate(), points: 0, cumulativePoints: 0}].concat(completeData);
    console.log("allIterations: " + allIterations);
    var complete = svg.append("g")
        .attr("class", "complete")
        .attr("transform", "translate(0," + margin.top + ")");



    var area = d3.svg.area()
        .interpolate("linear")
        .x(function(d) { return x(d.date); })
        .y0(height)
        .y1(function(d) { return y(d.cumulativePoints); });

// A line generator, for the dark stroke.
    var line = d3.svg.line()
        .interpolate("linear")
        .x(function(d) { return x(d.date); })
        .y(function(d) { return y(d.cumulativePoints); });


    var lastIteration = allIterations[allIterations.length - 1];
    complete.append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("width", x(lastIteration.date))
        .attr("height", height);

// Add the area path.
    complete.append("path")
        .attr("class", "area")
        .attr("clip-path", "url(#clip)")
        .attr("d", area(allIterations));

// Add the line path.
    complete.append("path")
        .attr("class", "line")
        .attr("clip-path", "url(#clip)")
        .attr("d", line(allIterations));

// Add the symbol path
    complete.selectAll("circle")
        .data(allIterations)
        .enter().append("path")
        .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.cumulativePoints) + ")"; })
        .attr("class", "symbol")
        .attr("d", d3.svg.symbol());

}