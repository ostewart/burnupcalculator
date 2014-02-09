name := "burnupcalculator"

version := "1.0-SNAPSHOT"

libraryDependencies ++= Seq(
  jdbc,
  anorm,
  cache
)     

play.Project.playScalaSettings

requireJs += "main.js"

requireJsShim += "main.js"