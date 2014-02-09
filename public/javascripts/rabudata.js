var startDate = moment("2014-01-29");
var iterationData = [3.5, 4, 4, 5, 5];
var plannedIterations = 9;
var iterationDates = Array.apply(null, Array(plannedIterations)).map(function(e,i) {return startDate.clone().add('weeks', i).toDate();});
var cumulativePoints = 0;
var rabuData = iterationData.map(function (velocity, i) {
    var remainingIterations = plannedIterations - i;
    var idealPoints = remainingIterations * velocity;
    var futurePoints = [roundPoints(idealPoints/1.8), roundPoints(idealPoints/1.4), roundPoints(idealPoints)];

    var totalPointsSpread = futurePoints.map(function (p) {
        return p + cumulativePoints;
    });
    cumulativePoints += velocity;
    return {
        date: startDate.clone().add('weeks', i).valueOf(),
        spread: totalPointsSpread,
        points: velocity,
        cumulativePoints: cumulativePoints
    };
});

var maxValues = rabuData.map(function(d) {return d.spread[2];});

function roundPoints(d) {
    return (Math.round(d * 2) / 2);
}