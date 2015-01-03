package com.burnupcalculator.features

import org.joda.time.LocalDate

class FeaturesCalculatorTest extends org.scalatest.FunSpec {
  describe("features calculator") {
    it("calculates feature spreads") {
      val spreads = FeaturesCalculator.spreads(LocalDate.parse("2015-01-07"), Seq(10, 15), Seq(10, 10))
      assert(spreads === Seq(FeatureSpread(LocalDate.parse("2015-01-14"), LocalDate.parse("2015-01-21"), LocalDate.parse("2015-01-21")),
        FeatureSpread(LocalDate.parse("2015-01-28"), LocalDate.parse("2015-02-04"), LocalDate.parse("2015-02-11"))))
    }
  }
}
