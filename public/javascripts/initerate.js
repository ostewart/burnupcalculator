define(["moment"], function(moment) {
    function genIterations(startDateMoment, plannedIterations) {
        return Array.apply(null, Array(plannedIterations)).map(function(e,i) {return startDateMoment.clone().add('weeks', i).toDate();})
    }

    function roundPoints(d) {
        return (Math.round(d * 2) / 2);
    }

    return {
        init: function(startDate, iterationPoints, plannedIterations) {
            var startDateMoment = moment(startDate);
            var iterationDates = genIterations(startDateMoment, plannedIterations);
            var cumulativePoints = 0;
            var rabuData = iterationPoints.map(function (velocity, i) {
                var remainingIterations = plannedIterations - i;
                var idealPoints = remainingIterations * velocity;
                var futurePoints = [roundPoints(idealPoints/1.8), roundPoints(idealPoints/1.4), roundPoints(idealPoints)];

                var totalPointsSpread = futurePoints.map(function (p) {
                    return p + cumulativePoints;
                });
                cumulativePoints += velocity;
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