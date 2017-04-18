[<img src="https://cdn.anychart.com/images/logo-transparent-segoe.png?2" width="234px" alt="AnyChart - Robust JavaScript/HTML5 Chart library for any project">](http://www.anychart.com)

## Technical Indicators
Need to analyze your data? Our JS charts include dozens of pre-built technical indicators and you can easily create your own.

[<img src="http://static.anychart.com/images/github/technical-indicators.png" alt=Technical Indicators | AnyChart">](http://anychart.com/solutions/big-data-speed-test/)

## Package directory
```
├── dist
│   ├── css
│        ├── app.css
│        ├── app.min.css
│   ├── js
│        ├── app.js
│        ├── app.min.js
├── src
│   ├── js
│        ├── app.js
│   ├── sass
│        ├── app.scss
│         ...
│   indicators.xml
│   gulpfile.js
│   package.json
│   LICENSE
│   README.md
│   index.html
│   ...
```

- **dist/** -
Output directory that contains compiled `js` and `css` files.

- **src/** -
Source code directory.

- **indicators.xml** -
All settings for indicators contains in this file.
If you want to add a new indicator, that allows you to build the AnyChart library, describe it in this file, similar to the other ones.

- **gulpfile.js** -
Contains automating tasks to development workflow.

- **package.json** -
Package manager configuration file.

## Build
1) Run `npm install` command to load all required npm modules.
2) Run `gulp` to start demo. Gulp watch scss, js and html files and update dist files if anything change.

## Links
* [Technical Indicators Demo at AnyChart.Com](https://www.anychart.com/solutions/technical-indicators/)
* [Documentation](https://docs.anychart.com)
* [JavaScript API Reference](https://api.anychart.com)
* [Code Playground](https://playground.anychart.com)
* [Technical Support](https://anychart.com/support)

## License
[© AnyChart.com - JavaScript charts](http://www.anychart.com). Released under the [Apache 2.0 License](https://github.com/anychart-solutions/technical-indicators/blob/master/LICENSE).
