package com.burnupcalculator.features

import org.joda.time.{LocalDate, DateTime}

case class FeatureSpread(ten: LocalDate, fifty: LocalDate, ninety: LocalDate)

object FeaturesCalculator {
  def spreads(firstIterationEndDate: LocalDate, features: Seq[Double], velocities: Seq[Double]): Seq[FeatureSpread] = {
    val effectiveVelocity = velocities.drop(math.max(0, velocities.size-3)).sum / math.min(3, velocities.size)
    val cumulativeFeatures = features.scan(0.0)(_+_) drop 1

    def iterationEndWithPointsCompleted(points: Double) = firstIterationEndDate.plusWeeks(math.ceil(points/effectiveVelocity).toInt)
    def spread(feature: Double) = FeatureSpread(iterationEndWithPointsCompleted(feature), iterationEndWithPointsCompleted(feature*1.4), iterationEndWithPointsCompleted(feature*1.8))
    cumulativeFeatures map spread
  }
}