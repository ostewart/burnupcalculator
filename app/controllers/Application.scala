package controllers

import play.api._
import play.api.mvc._

object Application extends Controller {

  def index = Action {
    Ok(views.html.index("Your new application is ready."))
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