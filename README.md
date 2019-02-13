[<img src="https://cdn.anychart.com/images/logo-transparent-segoe.png?2" width="234px" alt="AnyChart - JavaScript Charts designed to be embedded and integrated">](https://www.anychart.com)

# Technical Indicators
Need to analyze your data? Our JS charts include dozens of pre-built technical indicators
and you can easily create your own.

[<img src="https://static.anychart.com/images/github/technical-indicators.png?ver1.0" alt="Technical Indicators | AnyChart">](https://www.anychart.com/solutions/technical-indicators/)

## Modifying source code
There are two possible options of modifying demo source code, [using Node.js and npm](#using-nodejs-and-npm)
and [with no additional requirements](#with-no-additional-requirements).

### Using Node.js and npm
This option is recommended because it runs all development environment you need:
* Runs Node.js server with the demo on `http://localhost:3000/`.
* Watches for changes in source files and rebuilds distribution files on the fly.
* Dynamically reload web page using [browser-sync](https://www.browsersync.io/) tool.

Please, make sure you have all [requirements](#installing-requirements) installed before running.  
To run demo with Nodej.js and npm use following commands:
```
git clone git@github.com:anychart-solutions/technical-indicators.git
cd technical-indicators
gulp
```

When all environment is up and running, you may use following instructions to modify source code:
* To modify demo stylesheets edit `src/sass/*.scss` files.
* To modify demo JavaScript edit `src/js/index.js` file.
* To modify demo markup edit `src/index.html` file.
* To modify available indicators and default settings edit `src/indicators.xml` file.
* To modify available data sources edit `chartDataSelect` select options.

### With no additional requirements
This option doesn't require Node.js and npm installation but you have to run web-server anyway.
Also it imposes some limitations on demo source code modification process.
* To run demo, please, open index.html page with your web-server.
* To modify demo stylesheets add your own `<styles>` section to `src/index.html` file.
* To modify demo JavaScript code add your own `<script>` section to `src/index.html` file.
* To modify demo markup edit `src/index.html` file.
* To modify list of available indicators and default settings edit `src/indicators.xml` file.
* To modify data sources edit `chartDataSelect` select options.
* To make a production build you need to copy all required files to distribution folder by your own.

## Running on production
All production files are located in [distribution](https://github.com/anychart-solutions/technical-indicators/tree/master/dist) folder.
In case you did some modification of the source code you need to rebuild production files as mentioned in [Using Node.js and npm](#using-node.js-and-npm) section or manually using following command.
```
gulp prod
```

## Installing requirements
To run demo development environment, please, make sure you have installed [Git](https://git-scm.com/), [Node.js](https://nodejs.org/), [npm](https://www.npmjs.com/) and [gulp](http://gulpjs.com/), overwise:
* To install Node.js and npm, visit [installation instructions](https://docs.npmjs.com/getting-started/installing-node) page.
* To install gulp globally using `npm install gulp -g` command.
* To install git, visit [installation instructions](https://git-scm.com/book/en/v1/Getting-Started-Installing-Git) page.

## Links
* [Technical Indicators Demo at AnyChart.Com](https://www.anychart.com/solutions/technical-indicators/)
* [Documentation](https://docs.anychart.com)
* [JavaScript API Reference](https://api.anychart.com)
* [Code Playground](https://playground.anychart.com)
* [Technical Support](https://www.anychart.com/support)

## License
AnyChart Technical Indicators solution sample includes two parts:
- code of the solution sample that allows to use Javascript library (in this case, AnyChart). You can use, edit, modify it, use it with other Javascript libraries without any restrictions. It is released under [Apache 2.0 License](https://github.com/anychart-solutions/technical-indicators/blob/master/LICENSE).
- AnyChart JavaScript library. It is released under Commercial license. You can test this plugin with the trial version of AnyChart. Our trial version is not limited by time and doesn't contain any feature limitations. Check details [here](https://www.anychart.com/buy/)

If you have any questions regarding licensing - please contact us. <sales@anychart.com>
[![Analytics](https://ga-beacon.appspot.com/UA-228820-4/Solutions/technical-indicators?pixel&useReferer)](https://github.com/igrigorik/ga-beacon)
