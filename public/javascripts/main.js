require(["jquery","d3","moment","initerate","rabu-chart"],function($,d3,moment,initerate,chart) {
    var rabu = initerate.init("2014-01-29", [3.5, 4, 4, 5, 5], 9);
    console.log(rabu.iterationDates);
    chart.draw(rabu);
});
