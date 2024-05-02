
import scala.concurrent.duration._

import io.gatling.core.Predef._
import io.gatling.http.Predef._
import io.gatling.jdbc.Predef._

class Wiq6bRecordedSimulation extends Simulation {

  private val httpProtocol = http
    .baseUrl("http://localhost:8000")
    .inferHtmlResources(AllowList(), DenyList(""".*\.js""", """.*\.css""", """.*\.gif""", """.*\.jpeg""", """.*\.jpg""", """.*\.ico""", """.*\.woff""", """.*\.woff2""", """.*\.(t|o)tf""", """.*\.png""", """.*\.svg""", """.*detectportal\.firefox\.com.*"""))
    .acceptHeader("application/json, text/plain, */*")
    .acceptEncodingHeader("gzip, deflate")
    .acceptLanguageHeader("es-ES,es;q=0.8,en-US;q=0.5,en;q=0.3")
    .userAgentHeader("Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0")
  
  private val headers_0 = Map(
  		"Accept" -> "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  		"If-None-Match" -> """"3c862bbc1ba2a89e451c9d8d3d365a19827dc2ae"""",
  		"Upgrade-Insecure-Requests" -> "1"
  )
  
  private val headers_1 = Map(
  		"Accept" -> "*/*",
  		"Access-Control-Request-Headers" -> "content-type",
  		"Access-Control-Request-Method" -> "POST",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_2 = Map(
  		"Content-Type" -> "application/json",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_3 = Map(
  		"If-None-Match" -> """W/"a5c-r9xOtMWbZEzZI2TqL9O6Tdf1bqY"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_6 = Map(
  		"If-None-Match" -> """W/"34a-FUrjyaJDVQQDWO4HbzuGW49wDMI"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_9 = Map(
  		"If-None-Match" -> """W/"6c2-i6K5S4RHJ2BcaN1W6mditMzLriA"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_10 = Map(
  		"If-None-Match" -> """W/"8cf-yHmo8Sw2yNOecfGQBNNcYQsDnjg"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_11 = Map(
  		"If-None-Match" -> """W/"f7-YI2arCNvYhzAHRVLlO3TB36U2So"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_12 = Map(
  		"If-None-Match" -> """W/"115-PA+rrpyQFydlm4/0l+EhgSICZuM"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_15 = Map(
  		"If-None-Match" -> """W/"127-YbiWZMpirJu7Rka184SS84CBlQI"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_17 = Map(
  		"If-None-Match" -> """W/"100-/EYlHGp0eIVjPTlcmVf1Ls/Brik"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_20 = Map(
  		"If-None-Match" -> """W/"d9-FI8Dt0Fbnr6hNv/VRMxA+FpCJLc"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_22 = Map(
  		"If-None-Match" -> """W/"122-GCG8moAuGSQg1s7KtPlOh7xD21w"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_25 = Map(
  		"If-None-Match" -> """W/"101-FzG5ePEDcv7vr6TMOZS3F8UT958"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_27 = Map(
  		"If-None-Match" -> """W/"100-CYJ6sQ0+shbhwj5rCWGwSh8rQEE"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_30 = Map(
  		"If-None-Match" -> """W/"11e-F2Jou1xGkwAYHwp8OpIG3t/3Xas"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_32 = Map(
  		"If-None-Match" -> """W/"101-lH9XV76sMe2sZBk6gzOT0pyGtIU"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_39 = Map(
  		"If-None-Match" -> """W/"10f-0GM+TtVx85iXPKtQL1voQu9Tc/0"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val headers_41 = Map(
  		"If-None-Match" -> """W/"75e-gx9ZUg6kIR0udbJav7fuPIXztnE"""",
  		"Origin" -> "http://localhost:3000"
  )
  
  private val uri1 = "localhost"

  private val scn = scenario("Wiq6bRecordedSimulation")
    .exec(
      http("request_0")
        .get("http://" + uri1 + ":3000/")
        .headers(headers_0),
      pause(4),
      http("request_1")
        .options("/login")
        .headers(headers_1)
        .resources(
          http("request_2")
            .post("/login")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0002_request.json")),
          http("request_3")
            .get("/getAllUsers")
            .headers(headers_3),
          http("request_4")
            .options("/createUserRank")
            .headers(headers_1),
          http("request_5")
            .post("/createUserRank")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0005_request.json")),
          http("request_6")
            .get("/actRanking")
            .headers(headers_6),
          http("request_7")
            .options("/updateAllRanking")
            .headers(headers_1),
          http("request_8")
            .post("/updateAllRanking")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0008_request.json")),
          http("request_9")
            .get("/getRecords/luismi")
            .headers(headers_9)
        ),
      pause(1),
      http("request_10")
        .get("/obtainRank")
        .headers(headers_10),
      pause(6),
      http("request_11")
        .get("/getRandomQuestionSports")
        .headers(headers_11),
      pause(3),
      http("request_12")
        .get("/getRandomQuestionSports")
        .headers(headers_12)
        .resources(
          http("request_13")
            .options("/addGeneratedQuestion")
            .headers(headers_1),
          http("request_14")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0014_request.json"))
        ),
      pause(3),
      http("request_15")
        .get("/getRandomQuestionSports")
        .headers(headers_15)
        .resources(
          http("request_16")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0016_request.json"))
        ),
      pause(3),
      http("request_17")
        .get("/getRandomQuestionSports")
        .headers(headers_17)
        .resources(
          http("request_18")
            .options("/addGeneratedQuestion")
            .headers(headers_1),
          http("request_19")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0019_request.json"))
        ),
      pause(3),
      http("request_20")
        .get("/getRandomQuestionSports")
        .headers(headers_20)
        .resources(
          http("request_21")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0021_request.json"))
        ),
      pause(3),
      http("request_22")
        .get("/getRandomQuestionSports")
        .headers(headers_22)
        .resources(
          http("request_23")
            .options("/addGeneratedQuestion")
            .headers(headers_1),
          http("request_24")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0024_request.json"))
        ),
      pause(3),
      http("request_25")
        .get("/getRandomQuestionSports")
        .headers(headers_25)
        .resources(
          http("request_26")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0026_request.json"))
        ),
      pause(3),
      http("request_27")
        .get("/getRandomQuestionSports")
        .headers(headers_27)
        .resources(
          http("request_28")
            .options("/addGeneratedQuestion")
            .headers(headers_1),
          http("request_29")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0029_request.json"))
        ),
      pause(3),
      http("request_30")
        .get("/getRandomQuestionSports")
        .headers(headers_30)
        .resources(
          http("request_31")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0031_request.json"))
        ),
      pause(3),
      http("request_32")
        .get("/getRandomQuestionSports")
        .headers(headers_32)
        .resources(
          http("request_33")
            .options("/addGeneratedQuestion")
            .headers(headers_1),
          http("request_34")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0034_request.json")),
          http("request_35")
            .options("/addRecord")
            .headers(headers_1),
          http("request_36")
            .post("/addRecord")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0036_request.json")),
          http("request_37")
            .options("/updateRanking")
            .headers(headers_1),
          http("request_38")
            .post("/updateRanking")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0038_request.json"))
        ),
      pause(3),
      http("request_39")
        .get("/getRandomQuestionSports")
        .headers(headers_39)
        .resources(
          http("request_40")
            .post("/addGeneratedQuestion")
            .headers(headers_2)
            .body(RawFileBody("wiq6brecordedsimulation/0040_request.json"))
        ),
      pause(2),
      http("request_41")
        .get("/getRecords/luismi")
        .headers(headers_41)
    )

	setUp(scn.inject(constantUsersPerSec(1).during(30.seconds).randomized).protocols(httpProtocol))
}
