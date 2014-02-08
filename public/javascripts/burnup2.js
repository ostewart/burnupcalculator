var margin = {top: 80, right: 80, bottom: 80, left: 80},
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

//var boxMargin = margin;
//var boxHeight = height;
//var boxWidth = width;

var boxMargin = {top: 10, right: 50, bottom: 20, left: 50},
    boxWidth = 120 - boxMargin.left - boxMargin.right,
    boxHeight = 500 - boxMargin.top - boxMargin.bottom;
var min = Infinity,
    max = -Infinity;

var chart = d3.box()
    .whiskers(function() {return [0,2];})
    .width(boxWidth)
    .height(boxHeight);

var data = [];

data[0] = [10, 19, 22];
data[1] = [12, 21, 28];

chart.domain([0, d3.max(maxValues) + 5]);
//chart.domain([10, 28]);

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.selectAll("g.box")
    .data(data)
    .enter().append("g")
    .attr("class", "box")
    .attr("width", boxWidth + boxMargin.left + boxMargin.right)
    .attr("height", boxHeight + boxMargin.bottom + boxMargin.top)
    .append("g")
    .attr("transform", function(d,i) {return "translate(" + (i*120 + boxMargin.left) + "," + boxMargin.top + ")";})
    .call(chart);

//    setInterval(function() {
//        svg.datum(randomize).call(chart.duration(1000));
//    }, 2000);





var x = d3.time.scale()
    .domain([rabuData[0].date, moment("2014-03-31").valueOf()])
    .range([0,width]);
var y = d3.scale.linear()
    .domain([0, d3.max(maxValues) + 5])
    .range([height, 0]);
var xAxis = d3.svg.axis().scale(x).tickSize(-height).tickSubdivide(true);
var yAxis = d3.svg.axis().scale(y).ticks(4).orient("right");


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
