(function () {
    var $chartDataSelect = $('#chartDataSelect');
    var $seriesTypeSelect = $('#seriesTypeSelect');
    var $scaleTypeSelect = $('#scaleTypeSelect');
    var $indicatorTypeSelect = $('#indicatorTypeSelect');
    var $indicatorSettingsModal = $('#indicatorSettingsModal');
    var $resetBtn = $('#resetButton');
    var $addIndicatorBtn = $('#addIndicatorButton');
    var $indicatorNavPanel = $('#indicatorNavPanel');
    var $indicatorForm = $('#indicatorForm');

    var savedSettings = {};
    savedSettings['data'] = $chartDataSelect.val();
    savedSettings['chartType'] = $seriesTypeSelect.val();
    savedSettings['scale'] = $scaleTypeSelect.val();
    savedSettings['indicators'] = {};

    var dataPattern = 'get_xxx_daily_short_data';
    var container = 'chart-container';
    var firstInitData = {
        data: get_msft_daily_short_data(),
        name: 'MSFT'
    };

    var indicator = {
        name: '',
        plotIndex: 0,
        defaultSettings: {
            ama: {
                period: 20,
                fastPeriod: 2,
                slowPeriod: 30,
                seriesType: 'line'
            },
            aroon: {
                period: 20,
                upSeriesType: 'line',
                downSeriesType: 'line'
            },
            atr: {
                period: 14,
                seriesType: 'line'
            },
            bbands: {
                period: 20,
                deviation: 2,
                upperSeriesType: 'line',
                lowerSeriesType: 'line',
                middleSeriesType: 'line'
            },
            bbandsB: {
                period: 20,
                deviation: 2,
                seriesType: 'line'
            },
            bbandsWidth: {
                period: 20,
                deviation: 2,
                seriesType: 'line'
            },
            ema: {
                period: 20,
                seriesType: 'line'
            },
            stochastic: {
                kPeriod: 14,
                kMAPeriod: 1,
                dPeriod: 3,
                smoothingType: ['sma', 'ema'],
                kMAType: 'sma',
                dMAType: 'sma',
                kSeriesType: 'line',
                dSeriesType: 'line'
            },
            fastStochastic: {
                kPeriod: 20,
                kMAPeriod: 10,
                dPeriod: 3,
                smoothingType: ['sma', 'ema'],
                kMAType: 'sma',
                dMAType: 'sma',
                kSeriesType: 'line',
                dSeriesType: 'line'
            },
            slowStochastic: {
                kPeriod: 14,
                kMAPeriod: 3,
                dPeriod: 3,
                smoothingType: ['sma', 'ema'],
                kMAType: 'sma',
                dMAType: 'sma',
                kSeriesType: 'line',
                dSeriesType: 'line'
            },
            kdj: {
                kPeriod: 14,
                kMAPeriod: 5,
                dPeriod: 5,
                smoothingType: ['sma', 'ema'],
                kMAType: 'ema',
                dMAType: 'ema',
                kMultiplier: -2,
                dMultiplier: 3,
                kSeriesType: 'line',
                dSeriesType: 'line',
                jSeriesType: 'line'
            },
            mma: {
                period: 20,
                seriesType: 'line'
            },
            macd: {
                fastPeriod: 12,
                slowPeriod: 26,
                signalPeriod: 9,
                macdSeriesType: 'line',
                signalSeriesType: 'line',
                histogramSeriesType: 'column'
            },
            roc: {
                period: 20,
                seriesType: 'line'
            },
            rsi: {
                period: 14,
                seriesType: 'line'
            },
            sma: {
                period: 20,
                seriesType: 'line'
            }
        },
        overviewIndicator: {
            ama: {
                title: 'Adaptive Moving Average'
            },
            aroon: {
                title: 'Aroon'
            },
            atr: {
                title: 'Average True Range'
            },
            bbands: {
                title: 'Bollinger Bands',
                description: 'Bollinger Bands are a volatility indicator that is displayed as two lines (bands): one drawn above a simple moving average of the price and one - below. These bands move closer to the moving average when price volatility is low and move farther away from the moving average when price volatility increases.',
                parameters: 'Bollinger Bands parameters can be adjusted. The default parameters are: 20 periods for the simple moving average and 2 for the standard deviations (the distance between each band and the SMA). Increasing the number of periods - decreases the volatility of the SMA, and decreasing their number - increases the volatility of the SMA. Increasing the number of standard deviations moves the bands farther away from the SMA, and decreasing - moves the bands closer to the SMA.',
                function: 'Bollinger Bands are used to determine how volatile a stock is. Stocks move between levels of high and low volatility, and when the Bollinger bands grip a stock, it is a sign that the stock is consolidating and that a breakout is inevitable. When the Bollinger bands widen, it is a sign that the stock has burst out into a new trend.'
            },
            bbandsB: {
                title: 'Bollinger Bands %B'
            },
            bbandsWidth: {
                title: 'Bollinger Bands Width'
            },
            ema: {
                title: 'Exponential moving average',
                description: 'An Exponential Moving Average is a trending indicator - a single line that shows the weighted mean of the stock price during a specified period of time. This type of moving average that is similar to a Simple Moving Average, except that more weight is given to the latest data.',
                parameters: 'EMA period parameter can be adjusted. The default parameter is 20 periods. Increasing the number of periods will decrease the volatility, and decreasing the number of periods will increase the volatility.',
                function: 'Exponential Moving Averages are used by traders to detect the trend of the stock and to identify possible levels of support and resistance. If the Exponential Moving Average is trending higher and the price is above it, the stock is considered to be in an uptrend, in other case - if it is trending lower and the price is below it, the stock is considered to be in a downtrend. Also, when the price is above an uptrending EMA line, the Exponential Moving Average can act as a possible support level. In the same way, when the price below a downtrending EMA line - the Exponential Moving Average can act as a possible resistance level.'
            },
            stochastic: {
                title: 'Stochastic Oscillator (Full)',
                description: 'The Full Stochastic Oscillator is a momentum indicator that consists of two lines - %K and %D, these lines move in a range between 0 and 100. The full stochastic shows the interrelation of the current closing price to the trading range in the past. If the current closing price is toward the top of the past trading range, %K moves higher. If the current closing price is toward the bottom of the past trading range, %K moves lower.',
                parameters: 'The full stochastic parameters can be adjusted. The default parameters are 20 periods for the time frame, 5 periods for the %K, and 3 periods for the %D smoothing. Increasing the number of periods for the time frame decreases the volatility of the full stochastic, decreasing the number of periods for the time frame increases the volatility of the full stochastic. Increasing the number of periods for the %K decreases the volatility of the %K line, and decreasing the number of periods for the time frame increases the volatility of the %K line. Also, increasing the number of periods for the %D smoothing decrease the volatility of the %D line, and decreasing the number of periods for the time frame increases the volatility of the %D line.',
                function: 'The Full Stochastic Oscillator is used to determine is there bullish or bearish momentum behind a stock. When %K is above %D, the full stochastic shows bullish momentum, %K below %D - shows bearish momentum. Also, %K above 80 shows the market may be overbought, and %K below 20 - the market may be oversold.'
            },
            fastStochastic: {
                title: 'Stochastic Oscillator (Fast)',
                description: 'The Fast Stochastic Oscillator is a momentum indicator that consists of two lines - %K and %D, these lines move in the range between 0 and 100. The fast stochastic shows the interrelation of the current closing price to the trading range in the past. When the current closing price is toward the top of the past trading range, %K moves higher. If the current closing price is toward the bottom of the past trading range, %K moves lower.',
                parameters: 'The fast stochastic parameters can be adjusted. The default parameters are 20 periods for the time frame and 3 periods for the %D smoothing. Increasing the number of periods for the time frame decreases the volatility of the indicator, and decreasing the number of periods - decreases the volatility. Increasing the number of periods for the %D smoothing decreases the volatility of the %D line and decreasing the number of periods for the time frame increases the volatility of the %D line.',
                function: 'The Fast Stochastic Oscillator is used to determine whether there is bullish or bearish momentum behind a stock. %K above %D in the fast stochastic shows a bullish momentum, and %K below %D - shows a bearish momentum. Also, when %K is above 80, it shows that the market may be overbought, and %K below 20 - shows the market may be oversold.'
            },
            slowStochastic: {
                title: 'Stochastic Oscillator (Slow)',
                description: 'The Slow Stochastic Oscillator is a momentum indicator that consists of two lines - %K and %D, these lines move in the range between 0 and 100. The slow stochastic shows the interrelation of the current closing price to the trading range in the past. If the current closing price is toward the top of the past trading range, %K moves higher. If the current closing price is toward the bottom of the past trading range, %K moves lower.',
                parameters: 'Slow stochastic parameters can be adjusted. The default parameters are 20 periods for the time frame and 5 periods for the %D smoothing. Increasing the number of periods for the time frame decreases the volatility of the slow stochastic, and decreasing the number of periods for the time frame will increase the volatility of the slow stochastic. Also, increasing the number of periods for the %D smoothing decreases the volatility of the %D line, and decreasing the number of periods for the time frame increases the volatility of the %D line.',
                function: 'The Slow Stochastic Oscillator is used to determine whether there is bullish or bearish momentum behind a stock. %K above %D in the slow stochastic shows bullish momentum, and %K below %D - shows bearish momentum. Also, when %K is above 80, it shows the market may be overbought, and when %K is below 20 - shows the market may be oversold.'
            },
            kdj: {
                title: 'KDJ'
            },
            mma: {
                title: 'Modified Moving Average'
            },
            macd: {
                title: 'Moving Average Convergence/Divergence',
                description: 'The Moving Average Convergence/Divergence (MACD) is a momentum indicator that consists of two lines - an indicator line and a signal line. The indicator line displays the difference between two exponential moving averages with different smoothing factors, and the signal line displays an exponential moving average of the difference between mentioned two exponential moving averages.',
                parameters: 'MACD parameters can be adjusted. The default parameters are 26 for the slow exponential moving average, 12 for the fast exponential moving average and 20 for the signal line. Decreasing any of the parameters decreases the volatility of the related line, and increasing them - increases the volatility of the related line.',
                function: 'The MACD is used to determine is there bullish or bearish momentum behind a stock. When the indicator line is above the signal line, the MACD shows bullish momentum, and the indicator line below the signal line in the MACD shows bearish momentum.'
            },
            roc: {
                title: 'Rate of Change (ROC)',
                description: 'The Rate of Change oscillator is a momentum indicator that consists of one line. The ROC measures the percentage change in the price from one trading period to the next. If the percentage change is big, the ROC line moves harshly up or down, depending on price changing direction. In other case - if the percentage change is small, the ROC line moves slowly up or down, depending on the price changing direction.',
                parameters: 'The ROC indicator parameters can be adjusted. The default parameter is 12 periods for the time frame. Increasing the number of periods for the time frame decreases the volatility of the ROC indicator, and decreasing the number of periods for the time frame increases the volatility of the ROC indicator.',
                function: 'The ROC oscillator is used to determine is there bullish or bearish momentum behind a stock. The ROC line above the zero line shows bullish momentum, and the ROC line below the zero line shows bearish momentum.'
            },
            rsi: {
                title: 'Relative Strength Index (RSI)',
                description: 'The Relative Strength Index (RSI) oscillator is a momentum indicator that consists of one line that moves in a range between 0 and 100.',
                parameters: 'The RSI parameters are adjustable. The default parameter is 14 periods for the time frame. Increasing the number of periods for the time frame decreases the volatility of the RSI, and decreasing the number of periods for the time frame decreases it.',
                function: 'The RSI oscillator is used to determine is there bullish or bearish momentum behind a stock. The RSI line moving higher shows bullish momentum, and the RSI line moving lower shows bearish momentum. Also, the RSI line above 70 shows the market may be overbought, and the RSI line below 30 - the market may be oversold.'
            },
            sma: {
                title: 'Simple Moving Average',
                description: 'A Simple Moving Average is a trending indicator that is displayed as a single line that shows the mean price during a specified period of time. For example, a 20-day SMA shows the average stock price during the last 20 trading periods (including the current period).',
                parameters: 'SMA period parameter can be adjusted. The default parameter is 20 periods. Increasing the number of periods will decrease the volatility, and decreasing the number of periods will increase the volatility.',
                usage: 'Simple Moving Averages are used by traders to detect the trend of the stock and to identify possible levels of support and resistance. If the Simple Moving Average is trending higher and the price is above it, the stock is considered to be in an uptrend, in other case - if it is trending lower and the price is below it, the stock is considered to be in a downtrend. Also, when the price is above an uptrending SMA line, the Simple Moving Average can act as a possible support level. In the same way, when the price below a downtrending SMA line - the Simple Moving Average can act as a possible resistance level.'
            }
        },
        seriesType: [
            'area',
            'column',
            'jumpLine',
            'line',
            'marker',
            'spline',
            'splineArea',
            'stepArea',
            'stepLine',
            'stick'
        ]
    };

    var chart;
    var dataTable;

    var inputHtml =
        '<div class="col-sm-4">' +
        '<div class="form-group" id="indicatorFormGroup">' +
        '<label for="" class="control-label"></label>' +
        '<input type="number" class="form-control" id="">' +
        '</div>' +
        '</div>';

    var selectHtml =
        '<div class="col-sm-4">' +
        '<div class="form-group" id="indicatorFormGroup">' +
        '<label for="" class="control-label"></label>' +
        '<select class="form-control select show-tick" id=""></select>' +
        '</div>' +
        '</div>';

    var app = {
        createChart: createChart,
        removeChart: removeChart
    };

    anychart.onDocumentReady(function () {
        initHeightChart();

        // init, create chart
        app.createChart(container, firstInitData);

        // event to set data to chart
        $chartDataSelect.on('change', function () {
            var name = $(this).val();
            var data = dataPattern.replace('xxx', name) + '()';

            dataTable.addData(eval(data));
            chart.plot().getSeries(0).name(name);

            // save chart data
            savedSettings['data'] = $(this).val();
        });

        // event to set chart type
        $seriesTypeSelect.on('change', function () {
            var type = $(this).val();

            // set chart type
            chart.plot().getSeries(0).seriesType(type);
            // save chart type
            savedSettings['chartType'] = type;
        });

        // event to show modal indicator settings
        $indicatorTypeSelect.on('change', function () {
            if ($(this).val() === null || $(this).val().length < Object.keys(savedSettings.indicators).length) {

                app.removeChart();

                if ($(this).val() !== null) {
                    for (keyIndicator in savedSettings.indicators) {
                        if (!~$(this).val().indexOf(keyIndicator)) {
                            delete savedSettings.indicators[keyIndicator]
                        }
                    }
                } else {
                    savedSettings.indicators = {};
                }

                app.createChart(container, null, true);

                return
            }

            for (var i = 0; i < $(this).val().length; i++) {
                if (!~Object.keys(savedSettings.indicators).indexOf($(this).val()[i])) {
                    // set indicator name
                    indicator.name = $(this).val()[i];
                    break;
                }
            }

            // set plot index
            indicator.plotIndex = $(this).find('option[value="' + indicator.name + '"]').data().plotIndex;

            // create html if form (input/select)
            createHtmlToIndicatorForm();
            // set default indicator settings to input/select
            setDefaultIndicatorSettings();

            // show indicator settings modal
            $indicatorSettingsModal.modal('show');
            // hide dropdown menu, select
            $indicatorNavPanel.find('.select.open').removeClass('open');
        });

        // event to change scale
        $scaleTypeSelect.on('change', function () {
            app.removeChart();
            // save scale type
            savedSettings['scale'] = $(this).val();
            app.createChart(container, null, true);
        });

        // remove selected class, if indicator not selected
        $indicatorSettingsModal.on('hidden.bs.modal', function () {
            var lastAddedIndicator;

            for (var i = 0; i < $indicatorTypeSelect.val().length; i++) {
                if (!~Object.keys(savedSettings.indicators).indexOf($indicatorTypeSelect.val()[i])) {
                    // set indicator name
                    lastAddedIndicator = $indicatorTypeSelect.val()[i];
                    break;
                }
            }

            if (!lastAddedIndicator) {
                return false
            }

            var indexOption = $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').index();

            // unselect option
            $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').removeAttr('selected');
            // remove selected class
            $indicatorTypeSelect.prev('.dropdown-menu').find('li[data-original-index="' + indexOption + '"]').removeClass('selected');
        });

        // reset all settings
        $resetBtn.on('click', function (e) {
            e.preventDefault();

            app.removeChart();
            // reset saved settings
            savedSettings['indicators'] = {};
            savedSettings['scale'] = {};
            savedSettings['data'] = {};
            savedSettings['chartType'] = {};

            $chartDataSelect.val('msft').selectpicker('refresh');
            $seriesTypeSelect.val('line').selectpicker('refresh');
            $indicatorTypeSelect.val('').selectpicker('refresh');
            $scaleTypeSelect.val('linear').selectpicker('refresh');

            // init, create chart
            app.createChart(container, firstInitData);
        });

        // event to add indicator
        $addIndicatorBtn.on('click', function () {
            var mapping = dataTable.mapAs({'value': 1, 'open': 1, 'high': 2, 'low': 3, 'close': 4});
            var keys = Object.keys(indicator.defaultSettings[indicator.name]);
            var settings = [mapping];
            var indicatorName = indicator.name;

            // for slow/fast stochastic
            if (~indicatorName.toLowerCase().indexOf('stochastic')) {
                indicatorName = 'stochastic';
            }

            for (var i = 0; i < keys.length; i++) {
                if (keys[i] !== 'smoothingType') {
                    settings.push($('#' + keys[i]).val());
                }
            }

            // save settings for indicator
            savedSettings['indicators'][indicator.name] = {};
            savedSettings['indicators'][indicator.name]['settings'] = settings;
            savedSettings['indicators'][indicator.name]['plotIndex'] = indicator.plotIndex;

            var plot = chart.plot(indicator.plotIndex);
            plot[indicatorName].apply(plot, settings);
            // hide indicator settings modal
            $indicatorSettingsModal.modal('hide');
        });
    });

    $(window).on('resize', initHeightChart);

    function initHeightChart() {
        var creditsHeight = 10;
        $('#chart-container').height($(window).height() - $indicatorNavPanel.outerHeight() - creditsHeight);
    }

    function createChart(container, settings, updateChart) {
        // The data used in this sample can be obtained from the CDN
        // http://cdn.anychart.com/csv-data/msft-daily-short.js
        // http://cdn.anychart.com/csv-data/orcl-daily-short.js
        // http://cdn.anychart.com/csv-data/csco-daily-short.js
        // http://cdn.anychart.com/csv-data/ibm-daily-short.js

        // create data table on loaded data
        dataTable = anychart.data.table();

        var lineSeries;

        // map loaded data
        var mapping = dataTable.mapAs({'value': 1, 'open': 1, 'high': 2, 'low': 3, 'close': 4});

        // create stock chart
        chart = anychart.stock();

        // create plot on the chart
        var plot = chart.plot(0);

        if (updateChart) {
            var name = savedSettings['data'];
            var data = dataPattern.replace('xxx', name) + '()';

            dataTable.addData(eval(data));
            // create line series
            lineSeries = plot[savedSettings['chartType']](mapping);
            lineSeries.name(name);
            var indicatorName;

            plot.yScale(savedSettings['scale']);

            for (keyIndicator in savedSettings['indicators']) {
                indicatorName = keyIndicator;

                // for slow/fast stochastic
                if (~indicatorName.toLowerCase().indexOf('stochastic')) {
                    indicatorName = 'stochastic';
                }

                if (savedSettings['indicators'].hasOwnProperty(keyIndicator)) {
                    var indicatorPlot = chart.plot(savedSettings['indicators'][keyIndicator]['plotIndex']);
                    indicatorPlot[indicatorName].apply(indicatorPlot, savedSettings['indicators'][keyIndicator]['settings']);
                    indicatorPlot.yScale(savedSettings['scale']);
                }
            }

        } else {
            dataTable.addData(settings.data);
            // create line series
            lineSeries = plot.line(mapping);
            lineSeries.name(settings.name);
        }

        lineSeries.stroke('2px #64b5f6');

        // adding extra Y axis to the right side
        var yAxis = plot.yAxis(1);
        yAxis.orientation('right');
        // setting chart padding to fit both Y axes
        chart.padding(10, 50, 20, 50);

        // create scroller series with mapped data
        chart.scroller().line(mapping);

        // set chart selected date/time range
        chart.selectRange('2004-11-14', '2007-11-15');

        // set container id for the chart
        chart.container(container);

        // initiate chart drawing
        chart.draw();

        // create range picker
        rangePicker = anychart.ui.rangePicker();
        // init range picker
        rangePicker.render(chart);

        // create range selector
        rangeSelector = anychart.ui.rangeSelector();
        // init range selector
        rangeSelector.render(chart);

        chart.listen('chartDraw', function () {
            $('#loader').hide();
        });
    }

    function removeChart() {
        if (chart) {
            chart.dispose();
            chart = null;
        }
    }

    function createHtmlToIndicatorForm() {
        var $indicatorFormGroup;
        var isSmoothingType;
        var indicatorSettings = indicator.defaultSettings[indicator.name];
        var $option;
        var i = 0;

        $('#indicatorSettingsModalTitle').text(indicator.overviewIndicator[indicator.name].title);

        // empty form
        $indicatorForm.empty();
        // create row
        $indicatorForm.append('<div class="row"></div>');
        var $indicatorFormRow = $indicatorForm.find('.row');

        for (key in indicatorSettings) {
            if (indicatorSettings.hasOwnProperty(key)) {
                if (typeof indicatorSettings[key] === 'string') {
                    $indicatorFormRow.append(selectHtml);
                    $indicatorFormGroup = $('#indicatorFormGroup');
                    $indicatorFormGroup.find('select').attr('id', key);
                    $indicatorFormGroup.find('label').attr('for', key).text(getText(key));

                    isSmoothingType = false;

                    if (indicatorSettings.hasOwnProperty('smoothingType')) {
                        for (i = 0; i < indicatorSettings.smoothingType.length; i++) {
                            if (indicatorSettings[key] == indicatorSettings.smoothingType[i]) {
                                isSmoothingType = true;
                                break;
                            }
                        }
                    }

                    if (isSmoothingType) {
                        for (i = 0; i < indicatorSettings.smoothingType.length; i++) {
                            $option = $('<option></option>');
                            $option.val(indicatorSettings.smoothingType[i].toLowerCase());
                            $option.text(indicatorSettings.smoothingType[i].toUpperCase());
                            $indicatorFormGroup.find('select').append($option);
                        }
                    } else {
                        for (i = 0; i < indicator.seriesType.length; i++) {
                            $option = $('<option></option>');
                            $option.val(indicator.seriesType[i].toLowerCase());
                            $option.text(getText(indicator.seriesType[i]));
                            $indicatorFormGroup.find('select').append($option);
                        }
                    }

                    $indicatorFormGroup.removeAttr('id');

                } else if (typeof indicatorSettings[key] === 'number') {
                    $indicatorFormRow.append(inputHtml);
                    $indicatorFormGroup = $('#indicatorFormGroup');
                    $indicatorFormGroup.find('input').attr('id', key);

                    $indicatorFormGroup.removeAttr('id').find('label').attr('for', key).text(getText(key));
                }
            }
        }

        // col class to form el
        setColClass();
        // indicator overview text
        overviewText();
        // init selectpicker to all select in form
        $indicatorForm.find('.select').selectpicker();
    }

    function overviewText() {
        $indicatorForm.find($("[class*='col-sm-']")).last().after('<div class="col-xs-12" id="overviewText"></div>');

        for (keyIndicator in indicator.overviewIndicator[indicator.name]) {
            if (indicator.overviewIndicator[indicator.name].hasOwnProperty(keyIndicator) && keyIndicator !== 'title') {
                $indicatorForm.find('#overviewText').append(
                    '<h5>' + keyIndicator[0].toUpperCase() + keyIndicator.substr(1) + '</h5>' +
                    '<p>' + indicator.overviewIndicator[indicator.name][keyIndicator] + '</p>'
                );
            }
        }
    }

    function setColClass() {
        // column count for row
        var ROW_COUNT = 12;
        var COLUMN_COUNT = 3;
        var index = $indicatorForm.find('.col-sm-4').length;
        var lastIndex = $indicatorForm.find('.col-sm-4').last().index();
        var colClass;

        if (index === COLUMN_COUNT) {
            return
        }

        if (index > COLUMN_COUNT) {
            while (index > COLUMN_COUNT) {
                index -= COLUMN_COUNT;
            }
        }

        colClass = ROW_COUNT / index;

        while (index) {
            --index;
            $indicatorForm.find($("[class*='col-sm-']")).eq(lastIndex - index).removeClass('col-sm-4').addClass('col-sm-' + colClass);
        }
    }

    function getText(keyText) {
        var text = '';
        var result = [];

        keyText.split(/(?=[A-Z])/).filter(function (item) {
            if (item.length == 1) {
                text += item;
            } else {
                text += ' ';
                text += item;
            }
        });
        text = text.trim();
        text = text[0].toUpperCase() + text.substr(1);

        text.split(' ').filter(function (item, index) {
            if (item.length == 1 && index !== text.split(' ').length - 1) {
                result.push(item + '-');
            } else {
                result.push(item);
            }
        });

        return result.join(' ').replace(/-\s/, '-');
    }

    function setDefaultIndicatorSettings() {
        var indicatorSettings = indicator.defaultSettings[indicator.name];

        for (key in indicatorSettings) {
            if (indicatorSettings.hasOwnProperty(key)) {
                $('#' + key).val(indicatorSettings[key]);
            }
        }
    }
})();




