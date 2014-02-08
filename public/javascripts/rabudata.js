var startDate = moment("2014-01-29");
var iterationData = [3.5, 4, 4, 5, 5];
var totalIterations = 9;
var cumulativePoints = 0;
var rabuData = iterationData.map(function (velocity, i) {
    var remainingIterations = totalIterations - i;
    var idealPoints = remainingIterations * velocity;
    var futurePoints = [idealPoints/1.8, idealPoints/1.4, idealPoints];

    var totalPointsSpread = futurePoints.map(function (p) {
        return p + cumulativePoints;
    });
    cumulativePoints += velocity;
    return {
        iteration: startDate.clone().add('weeks', i).valueOf(),
        spread: totalPointsSpread
    };
});

var maxValues = rabuData.map(function(d) {return d.spread[2];});
