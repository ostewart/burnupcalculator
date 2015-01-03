name := "burnupcalculator"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)

libraryDependencies += "org.scalatest" %% "scalatest" % "2.2.1" % "test"

play.Project.playScalaSettings

requireJs += "main.js"

requireJsShim += "main.js"