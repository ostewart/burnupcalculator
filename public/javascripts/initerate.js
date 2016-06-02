define(["moment","d3"], function(moment,d3) {
    function genIterations(startDateMoment, plannedIterations) {
        return Array.apply(null, Array(plannedIterations)).map(function(e,i) {return startDateMoment.clone().add('weeks', i).toDate();})
    }

    function roundPoints(d) {
        return (Math.round(d * 2) / 2);
    }

    return {
        init: function(firstIterationEndDate, iterationPoints, plannedIterations) {
            var startDateMoment = moment(firstIterationEndDate);
            var iterationDates = genIterations(startDateMoment, plannedIterations);
            var cumulativePoints = 0;
            var rabuData = iterationPoints.map(function (velocity, i) {
                var remainingIterations = plannedIterations - 1 - i;
                var stableVelocity = d3.mean(iterationPoints.slice(Math.max(0, i-2),i+1));
                var idealPoints = remainingIterations * stableVelocity;
                var futurePoints = [roundPoints(idealPoints/1.8), roundPoints(idealPoints/1.4), roundPoints(idealPoints)];

                cumulativePoints += velocity;
                var totalPointsSpread = futurePoints.map(function (p) {
                    return p + cumulativePoints;
                });
                return {
                    date: startDateMoment.clone().add('weeks', i).valueOf(),
                    spread: totalPointsSpread,
                    points: velocity,
                    cumulativePoints: cumulativePoints
                };
            });

            return {
                data: rabuData,
                iterationDates: iterationDates,
                maxValues: rabuData.map(function(d) {return d.spread[2];})
            };
        }
    }
});