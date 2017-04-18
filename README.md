# Real Picks

This project was meant as a way for a group of people to pick each weeks games NFL games. The choices are stored, and users could see how they did each week, and over the course of the season. There are also pages that show each teams schedule, and the overall league standings.  

Visitors who are not registered users can still view each weeks games and results, the team schedules, and the league standings. 

Registered user:

[https://realpicks.herokuapp.com/index.html#/?user=william&group=sla](https://realpicks.herokuapp.com/index.html#/?user=william&group=sla)

Visitor:

[https://realpicks.herokuapp.com/index.html](https://realpicks.herokuapp.com/index.html)

The first version of the project was written in vanilla JavaScript/ES2015, and then was re-written in React.js. 

* Front End:
  * React.js and ES2015 
  * React Router, for navigation between components.
  * [SuperAgent] to handle getting the JSON into and out of the database.
* Back End:
  * PHP 5.5.38 for database connection and JSON formatting
  * PostgreSQL 9.6.2
  * Apache 2.4.25
* Development Environment:
  * NPM for package and dependency management
  * [Webpack] v2 as a build tool
  * [Babel] for transpiling the ES2015
  * [webpack-dev-server] with [Browsersync] as a dev server/browser testing 
  * [StandardJS] for JavaScript linting
  * [Mocha], with [Chai] and [Enzyme] for running tests
  * [isparta] for code coverage

[SuperAgent]: https://github.com/visionmedia/superagent
[Webpack]: https://webpack.js.org/
[webpack-dev-server]: https://webpack.js.org/guides/development/#webpack-dev-server
[Browsersync]: https://www.browsersync.io/
[StandardJS]: https://standardjs.com/
[Babel]: https://babeljs.io/
[Mocha]: https://mochajs.org/
[Chai]: http://chaijs.com/
[Enzyme]: https://github.com/airbnb/enzyme
[isparta]: https://github.com/douglasduteil/isparta 



