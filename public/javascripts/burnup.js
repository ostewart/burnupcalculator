var startDate = moment("2014-01-29");
var iterationData = [3.5, 4, 4, 5, 5];
var plannedIterations = 9;
var iterationDates = new Array(5).map(function(e,i) {return startDate.clone().add('weeks', i).valueOf();});
var cumulativePoints = 0;
var rabuData = iterationData.map(function (velocity, i) {
    var remainingIterations = plannedIterations - i;
    var idealPoints = remainingIterations * velocity;
    var futurePoints = [idealPoints/1.8, idealPoints/1.4, idealPoints];

    var totalPointsSpread = futurePoints.map(function (p) {
        return p + cumulativePoints;
    });
    cumulativePoints += velocity;
    return {
        date: startDate.add('weeks', i).valueOf(),
        spread: totalPointsSpread
    };
});

var maxValues = rabuData.map(function(d) {return d.spread[2];});

var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

var x = d3.time.scale()
    .domain([rabuData[0].date, moment("2014-03-31").valueOf()])
    .range([0,width]);
var y = d3.scale.linear()
    .domain([0, d3.max(maxValues) + 5])
    .range([height, 0]);
var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
var yAxis = d3.svg.axis().scale(y).ticks(4).orient("right");


var area = d3.svg.area()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y0(height)
    .y1(function(d) { return y(d.spread[0]); });

// A line generator, for the dark stroke.
var line = d3.svg.line()
    .interpolate("linear")
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.spread[2]); });

var symbol = d3.svg.symbol()
    .type("circle");

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Add the x-axis.
svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

// Add the y-axis.
svg.append("g")
    .attr("class", "y axis")
    .attr("transform", "translate(" + width + ",0)")
    .call(yAxis);

// Add the clip path.
//svg.append("clipPath")
//    .attr("id", "clip")
//    .append("rect")
//    .attr("width", width)
//    .attr("height", height);

// Add the area path.
svg.append("path")
    .attr("class", "area")
//    .attr("clip-path", "url(#clip)")
    .attr("d", area(rabuData));

// Add the line path.
svg.append("path")
    .attr("class", "line")
//    .attr("clip-path", "url(#clip)")
    .attr("d", line(rabuData));

// Add the symbol path
svg.selectAll("circle")
    .data(rabuData)
    .enter().append("path")
    .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.spread[1]) + ")"; })
    .attr("class", "symbol")
    .attr("d", d3.svg.symbol());



/// begin blarg

