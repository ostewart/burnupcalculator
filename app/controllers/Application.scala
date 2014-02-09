package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index())
  }

  def chart(firstIterationEndDate: String, iterations: List[Double], plannedIterations: Int) = Action {
    Ok(views.html.chart(firstIterationEndDate, if (iterations.isEmpty) List[Double](3.5, 4, 4, 5, 5) else iterations, plannedIterations))
  }
  def index2 = Action {
    Ok(views.html.index2("Your new application is ready."))
  }
  def noWhiskers = Action {
    Ok(views.html.noWhiskers("Your new application is ready."))
  }
  def indexAxes = Action {
    Ok(views.html.indexAxes("Box Chart With Axes"))
  }
  def burnup = Action {
    Ok(views.html.burnup("Burn Up Chart"))
  }

}