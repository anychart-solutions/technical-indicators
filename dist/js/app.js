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
    savedSettings['data'] = {};
    savedSettings['chartType'] = $seriesTypeSelect.val();
    savedSettings['scale'] = $scaleTypeSelect.val();
    savedSettings['indicators'] = {};

    var container = 'chart-container';

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
                title: 'Adaptive Moving Average (AMA)',
                description: '<p>An Adaptive Moving Average (AMA) is another indicator like SMA, MMA and EMA, but has more parameters. It changes its sensitivity due to the price fluctuations. The Adaptive Moving Average becomes more sensitive during periods when price is moving in a certain direction and becomes less sensitive to price movements when it become unstable.</p> <p>AnyChart Stock allows you to add AMA with desired period to any of your charts. </p> <p>Find the mathematical description of the indicator on the <a href="https://docs.anychart.com/latest/Stock_Charts/Technical_Indicators/Mathematical_Description#adaptive_moving_average" target="_blank">Adaptive moving average (AMA) Mathematical Description</a> page.</p>',
                parameters: 'AMA indicator needs five parameters: mapping with value field in it (required), three periods: period, fast period and slow period; and a type of series. It is possible to change the series type any time using the <a target="_blank" href="https://api.anychart.com/latest/anychart.core.stock.series.Base#seriesType">seriesType()</a> method.'
            },
            aroon: {
                title: 'Aroon',
                description: '<p>Developed by Tushar Chande in 1995, Aroon is an indicator system that determines whether a stock is trending or not and how strong the trend is. \"Aroon" means \"Dawn\'s Early Light\" in Sanskrit. Chande chose this name because the indicators are designed to reveal the beginning of a new trend.</p><p>The Aroon indicators measure the number of periods since price recorded an x-day high or low. There are two separate indicators: Aroon-Up and Aroon-Down. A 25-day Aroon-Up measures the number of days since a 25-day high. A 25-day Aroon-Down measures the number of days since a 25-day low. In this sense, the Aroon indicators are quite different from typical momentum oscillators, which focus on price relative to time. Aroon is unique because it focuses on time relative to price. Chartists can use the Aroon indicators to spot emerging trends, identify consolidations, define correction periods and anticipate reversals.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#aroon" target="_blank">Aroon Mathematical Description</a>.</p>',
                parameters: 'Aroon indicator has only one type specific parameter - period: mapping with value field in it, period and types of Up and Down series.'
            },
            atr: {
                title: 'Average True Range (ATR)',
                description: '<p>Developed by J. Welles Wilder, the Average True Range (ATR) is an indicator that measures volatility. As with most of his indicators, Wilder designed ATR with commodities and daily prices in mind. Commodities are frequently more volatile than stocks. They were are often subject to gaps and limit moves, which occur when a commodity opens up or down its maximum allowed move for the session. A volatility formula based only on the high-low range would fail to capture volatility from gap or limit moves. Wilder created Average True Range to capture this "missing" volatility. It is important to remember that ATR does not provide an indication of price direction, just volatility.</p><p>Mathematical description: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#average_true_range" target="_blank">Average True Range (ATR) Mathematical Description</a>.</p>',
                parameters: 'Average True Range indicator has three parameters: mapping, period, which has to be an integer value more than 1, and series type.'
            },
            bbands: {
                title: 'Bollinger Bands (BBands)',
                description: '<p>Bollinger Bands are a technical analysis tool invented by John Bollinger in the 1980s. Having evolved from the concept of trading bands, Bollinger Bands can be used to measure the "highness" or "lowness" of the price relative to previous trades.</p><p>AnyChart Stock allows you to add Bollinger Bands with desired period to any of your charts.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#bollinger_bands" target="_blank">Bollinger Bands</a>.</p>',
                parameters: 'Bollinger Bands indicator only required parameter is the "mapping". Optional parameters are: "period", "deviation", "middle", "upper" and "lower" series types.'
            },
            bbandsB: {
                title: 'Bollinger Bands %B (BBands B)',
                description: '<p>Bollinger Bands %B is an indicator derived from <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Bollinger_Bands" target="_blank">Bollinger Bands</a>.</p>%B quantifies a security\'s price relative to the upper and lower Bollinger Band. There are six basic relationship levels: ' +
                '<ul>' +
                '<li>%B equals 1 when price is at the upper band</li>' +
                '<li>%B equals 0 when price is at the lower band</li>' +
                '<li>%B is above 1 when price is above the upper band</li>' +
                '<li>%B is below 0 when price is below the lower band</li>' +
                '<li>%B is above .50 when price is above the middle band (SMA)</li>' +
                '<li>%B is below .50 when price is below the middle band (SMA)</li>' +
                '</ul>' +
                '<p>Mathematical description of the indicator can be found on the following page: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#bollinger_bands_%b" target="_blank">Mathematical Description of Bollinger Bands %B</a></p>',
                parameters: 'Bollinger Bands %B indicator requires only the "mapping" parameter. Optional parameters are "period", "deviation" and "series type".'
            },
            bbandsWidth: {
                title: 'Bollinger Bands Width (BBands Width)',
                description: '<p>Bollinger Bands Width is an indicator derived from <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Bollinger_Bands" target="_blank">Bollinger Bands</a>.</p><p>Non-normalized Bollinger Bands Width measures the distance, or difference, between the upper band and the lower band. Bollinger Bands Width decreases as Bollinger Bands narrow and increases as Bollinger Bands widen because Bollinger Bands are based on the standard deviation.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#bollinger_bands_width" target="_blank">Mathematical Description of Bollinger Bands Width</a>.</p>',
                parameters: 'Bollinger Bands Width indicator requires only the "mapping" parameter. Optional parameters are "period", "deviation" and "series type".'
            },
            ema: {
                title: 'Exponential moving average (EMA)',
                description: '<p>An exponential moving average (EMA), sometimes also called an exponentially weighted moving average (EWMA), applies weighting factors which decrease exponentially. The weighting for each older data point decreases exponentially, giving much more importance to recent observations while still not discarding older observations entirely.</p><p>AnyChart Stock allows you to add EMA with desired period to any of your charts.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#exponential_moving_average" target="_blank">Exponential Moving Average (EMA) Mathematical Description</a>.</p>',
                parameters: 'EMA indicator need three parameters: mapping with value field in it, period and a type of series.'
            },
            stochastic: {
                title: 'Stochastic Oscillator (Full)',
                description: '<p>Stochastic oscillator is a momentum indicator introduced by George Lane in the 1950s. Stochastic oscillator helps with comparing the closing price of a commodity to its price range over a given time span. The %K and %D lines show whether it\'s better to buy or sell: the moments when those two lines cross each other are regarded as the best for money operations.</p><p>There are three most famous modifications of Stochastic Oscillator: Fast Stochastic, Slow Stochastic and Full Stochastic. AnyChart Stock allows adding all of these types using the same method with different parameters.</p><p>Mathematical description: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#stochastic_oscillator" target="_blank">Stochastic Oscillator Mathematical Description</a>.</p>',
                parameters: 'Stochastic oscillator indicator has a lot of optional parameters:' +
                '<ul>' +
                '<li>a period for the %K value</li>' +
                '<li>the moving average type of the indicator for the %K value</li>' +
                '<li>a period for the smoothed %K value</li>' +
                '<li>the moving average type of he indicator for the %D value</li>' +
                '<li>a period for the %D value\nseries type of the %K value</li>' +
                '<li>series type of the %D value.</li>' +
                '</ul>' +
                'Stochastic oscillator has two series, use <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#kSeries" target="_blank">kSeries()</a> and <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#dSeries" target="_blank">dSeries()</a> methods to configure them. <br> The series are lines by default, it is possible to change the series type any time using the <a href="https://api.anychart.com/7.13.0/anychart.core.stock.series.Base#seriesType" target="_blank">seriesType()</a> method.' +
                'There are no default values for creating the Full Stochastic Oscillator. All periods used for calculation of the %K and the %D lines have to be integer values and the modifications should be EMA and SMA.'
            },
            fastStochastic: {
                title: 'Stochastic Oscillator (Fast)',
                description: '<p>Stochastic oscillator is a momentum indicator introduced by George Lane in the 1950s. Stochastic oscillator helps with comparing the closing price of a commodity to its price range over a given time span. The %K and %D lines show whether it\'s better to buy or sell: the moments when those two lines cross each other are regarded as the best for money operations.</p><p>There are three most famous modifications of Stochastic Oscillator: Fast Stochastic, Slow Stochastic and Full Stochastic. AnyChart Stock allows adding all of these types using the same method with different parameters.</p>',
                parameters: 'Stochastic oscillator indicator has a lot of optional parameters:' +
                '<ul>' +
                '<li>a period for the %K value</li>' +
                '<li>the moving average type of the indicator for the %K value</li>' +
                '<li>a period for the smoothed %K value</li>' +
                '<li>the moving average type of he indicator for the %D value</li>' +
                '<li>a period for the %D value\nseries type of the %K value</li>' +
                '<li>series type of the %D value.</li>' +
                '</ul>' +
                'Stochastic oscillator has two series, use <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#kSeries" target="_blank">kSeries()</a> and <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#dSeries" target="_blank">dSeries()</a> methods to configure them. <br> The series are lines by default, it is possible to change the series type any time using the <a href="https://api.anychart.com/7.13.0/anychart.core.stock.series.Base#seriesType" target="_blank">seriesType()</a> method.' +
                'There are no default values for creating the Full Stochastic Oscillator. All periods used for calculation of the %K and the %D lines have to be integer values and the modifications should be EMA and SMA.'
            },
            slowStochastic: {
                title: 'Stochastic Oscillator (Slow)',
                description: '<p>Stochastic oscillator is a momentum indicator introduced by George Lane in the 1950s. Stochastic oscillator helps with comparing the closing price of a commodity to its price range over a given time span. The %K and %D lines show whether it\'s better to buy or sell: the moments when those two lines cross each other are regarded as the best for money operations.</p><p>There are three most famous modifications of Stochastic Oscillator: Fast Stochastic, Slow Stochastic and Full Stochastic. AnyChart Stock allows adding all of these types using the same method with different parameters.</p>',
                parameters: 'Stochastic oscillator indicator has a lot of optional parameters:' +
                '<ul>' +
                '<li>a period for the %K value</li>' +
                '<li>the moving average type of the indicator for the %K value</li>' +
                '<li>a period for the smoothed %K value</li>' +
                '<li>the moving average type of he indicator for the %D value</li>' +
                '<li>a period for the %D value\nseries type of the %K value</li>' +
                '<li>series type of the %D value.</li>' +
                '</ul>' +
                'Stochastic oscillator has two series, use <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#kSeries" target="_blank">kSeries()</a> and <a href="https://api.anychart.com/7.13.0/anychart.core.stock.indicators.Stochastic#dSeries" target="_blank">dSeries()</a> methods to configure them. <br> The series are lines by default, it is possible to change the series type any time using the <a href="https://api.anychart.com/7.13.0/anychart.core.stock.series.Base#seriesType" target="_blank">seriesType()</a> method.' +
                'There are no default values for creating the Full Stochastic Oscillator. All periods used for calculation of the %K and the %D lines have to be integer values and the modifications should be EMA and SMA.'
            },
            kdj: {
                title: 'KDJ',
                description: '<p>KDJ indicator is a technical indicator used to analyze and predict changes in stock trends and price patterns in a traded asset. KDJ indicator is also known as the random index. It is a very practical technical indicator which is most commonly used in market trend analysis of short-term stock.</p> <p> KDJ is a derived form of the <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Stochastic_Oscillator" target="_blank">Stochastic Oscillator Indicator</a> with the only difference of having an extra line called the J line. Values of %K and %D lines show if the security is overbought (over 80) or oversold (below 20). The moments of %K crossing %D are the moments for selling or buying. The J line represents the divergence of the %D value from the %K. The value of J can go beyond [0, 100] for %K and %D lines on the chart.</p> <p> Mathematical description: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#kdj" target="_blank">KDJ Mathematical Description</a>.</p>',
                parameters: 'KDJ indicator has a lot of optional parameters:' +
                '<ul>' +
                '<li>a period for the %K value</li>' +
                '<li>the moving average type of the indicator for the %K value</li>' +
                '<li>a period for the smoothed %K value</li>' +
                '<li>the moving average type of the indicator for the %D value</li>' +
                '<li>a period for the %D value</li>' +
                '<li>multipliers of the %K and %D values for %J value calculating</li>' +
                '<li>series types of the %K, %D and %J values.</li>' +
                '</ul>' +
                'The following code shows how to create a KDJ indicator with %K value with period of 10 and EMA smoothing and %D value with period of 20 and SMA smoothing.' +
                'There are three series that form the KDJ indicator, so there is a methods for each of them:' +
                '<ul>' +
                '<li>kSeries() for the %K series</li>' +
                '<li>dSeries() for the %D series</li>' +
                '<li>jSeries() for the %J series</li>' +
                '</ul>' +
                'It is possible to change the series type any time using the <a target="_blank" href="https://api.anychart.com/7.13.0/anychart.core.stock.series.Base#seriesType">seriesType()</a> method.'
            },
            mma: {
                title: 'Modified Moving Average (MMA)',
                description: '<p>A Modified Moving Average (MMA) (also known as Running Moving Average (RMA), or SMoothed Moving Average (SMMA)) is an indicator that shows the average value of a security\'s price over a period of time. It works very similar to the Exponential Moving Average, they are equivalent but for different periods (e.g. the MMA value for a 14-day period will be the same as EMA-value for a 27-days period).</p><p>MMA is partly calculated like SMA: the first point of the MMA is calculated the same way it is done for SMA. However, other points are calculated differently:the new price is added first and then the last average is subtracted from the resulting sum.</p><p>AnyChart Stock allows you to add MMA with desired period to any of your charts.</p><p>Find the mathematical description of the indicator on the <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#modified_moving_average" target="_blank">Modified moving average (MMA) Mathematical Description</a> page.</p>',
                parameters: 'MMA indicator needs three parameters, as SMA and EMA: mapping with value field in it, period and a type of series. It is possible to change the series type at any time using the <a target="_blank" href="https://api.anychart.com/7.13.0/anychart.core.stock.series.Base#seriesType">seriesType()</a> method.'
            },
            macd: {
                title: 'Moving Average Convergence/Divergence (MACD)',
                description: '<p>MACD, which stands for Moving Average Convergence / Divergence, is a technical analysis indicator created by Gerald Appel in the 1960s. It shows the difference between a fast and slow exponential moving average (EMA) of closing prices.</p><p>AnyChart Stock allows you to add MACD with desired fast, slow and signal periods settings to any of your charts.</p><p>Mathematical description of the indicator: <a href="Mathematical description of the indicator: Moving Average Convergence/Divergence (MACD) Mathematical Description." target="_blank">Moving Average Convergence/Divergence (MACD) Mathematical Description</a>.</p>',
                parameters: 'MACD indicator needs three parameters: mapping with value field in it, fast period 12, slow period 26 and signal period 9, and a types of series.'
            },
            roc: {
                title: 'Rate of Change (ROC)',
                description: '<p>Rate of change (ROC) is a simple technical analysis indicator showing the difference between today\'s closing price and the close N days ago.</p><p>AnyChart Stock allows you to add ROC with desired period to any of your charts.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#rate_of_change" target="_blank">Rate of change (ROC) Mathematical Description</a>.</p>',
                parameters: 'ROC indicator needs three parameters: mapping with value field in it, period and a type of series.'
            },
            rsi: {
                title: 'Relative Strength Index (RSI)',
                description: '<p>The Relative Strength Index (RSI) is a financial technical analysis momentum oscillator measuring the velocity and magnitude of directional price movement by comparing upward and downward close-to-close movements.</p><p>AnyChart Stock allows you to add RSI with desired period to any of your charts.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#relative_strength_index" target="_blank">The Relative Strength Index (RSI) Mathematical Description</a>.</p>',
                parameters: 'RSI indicator needs three parameters: mapping with value field in it, period and a type of series.'
            },
            sma: {
                title: 'Simple Moving Average (SMA)',
                description: '<p>A Simple Moving Average (SMA) is the unweighted mean of the previous n data points. In technical analysis there are various popular values for n, like 10 days, 40 days, or 200 days. The period selected depends on the kind of movement one is concentrating on, such as short, intermediate, or long term. In any case moving average levels are interpreted as support in a rising market, or resistance in a falling market.</p><p>AnyChart Stock allows you to add SMA with desired period to any of your charts.</p><p>Mathematical description of the indicator: <a href="https://docs.anychart.com/7.13.0/Stock_Charts/Technical_Indicators/Mathematical_Description#simple_moving_average" target="_blank">Simple moving average (SMA) Mathematical Description</a>.</p>',
                parameters: 'SMA indicator needs three parameters: mapping with value field in it, period and a type of series.'
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

        // To work with the data adapter you need to reference the data adapter script file from AnyChart CDN
        // (http://cdn.anychart.com/js/latest/data-adapter.min.js)
        // Load JSON data and create a chart by JSON data.
        anychart.data.loadJsonFile($chartDataSelect.val(), function (data) {
            savedSettings['data']['msft'] = data;
            // init, create chart
            app.createChart(container);
        });

        // event to set data to chart
        $chartDataSelect.on('change', function () {
            var name = $(this).find('option:selected').text().toLowerCase();

            if (!~Object.keys(savedSettings['data']).indexOf(name)) {
                // To work with the data adapter you need to reference the data adapter script file from AnyChart CDN
                // (http://cdn.anychart.com/js/latest/data-adapter.min.js)
                // Load JSON data and create a chart by JSON data.
                anychart.data.loadJsonFile($(this).val(), function (data) {
                    savedSettings['data'][name] = data;
                    dataTable.addData(data);
                    chart.plot().getSeries(0).name(name.toUpperCase());
                });
            } else {
                dataTable.addData(savedSettings['data'][name]);
                chart.plot().getSeries(0).name(name.toUpperCase());
            }
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

            if ($(this).val()) {
                if ($(this).val().length === 1) {
                    updateTextForIndicatorTypeSelect();
                }
            }

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

                app.createChart(container, true);

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
            app.createChart(container, true);
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
                // update select text/title
                updateTextForIndicatorTypeSelect();
                return false
            }

            var indexOption = $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').index();

            // unselect option
            $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').removeAttr('selected');
            // remove selected class
            $indicatorTypeSelect.prev('.dropdown-menu').find('li[data-original-index="' + indexOption + '"]').removeClass('selected');
            // update select text/title
            updateTextForIndicatorTypeSelect();
        });

        // init selectpicker to all select in indicator settings modal
        $indicatorSettingsModal.on('show.bs.modal', function () {
            $indicatorForm.find('.select').selectpicker();
        });

        // reset all settings
        $resetBtn.on('click', function (e) {
            e.preventDefault();

            app.removeChart();
            // reset saved settings
            savedSettings['indicators'] = {};
            savedSettings['scale'] = 'linear';
            savedSettings['chartType'] = 'line';

            $chartDataSelect.val('data/msft.json').selectpicker('refresh');
            $seriesTypeSelect.val('line').selectpicker('refresh');
            $indicatorTypeSelect.val('').selectpicker('refresh');
            $scaleTypeSelect.val('linear').selectpicker('refresh');

            // init, create chart
            app.createChart(container);
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

    function createChart(container, updateChart) {
        var dataName = $chartDataSelect.find('option:selected').text();
        // create data table on loaded data
        dataTable = anychart.data.table();

        var lineSeries;

        // map loaded data
        var mapping = dataTable.mapAs({'value': 1, 'open': 1, 'high': 2, 'low': 3, 'close': 4});

        // create stock chart
        chart = anychart.stock();

        // create plot on the chart
        var plot = chart.plot(0);

        dataTable.addData(savedSettings['data'][dataName.toLowerCase()]);

        if (updateChart) {
            var indicatorName;
            var indicatorPlot;
            var indicatorSettings = [];

            // create line series
            lineSeries = plot[savedSettings['chartType']](mapping);
            lineSeries.name(dataName.toUpperCase());

            plot.yScale(savedSettings['scale']);

            for (keyIndicator in savedSettings['indicators']) {
                indicatorName = keyIndicator;

                if (savedSettings['indicators'].hasOwnProperty(keyIndicator)) {
                    indicatorSettings = savedSettings['indicators'][keyIndicator]['settings'];
                    indicatorSettings[0] = mapping;
                }

                // for slow/fast stochastic
                if (~indicatorName.toLowerCase().indexOf('stochastic')) {
                    indicatorName = 'stochastic';
                }

                if (savedSettings['indicators'].hasOwnProperty(keyIndicator)) {
                    indicatorPlot = chart.plot(savedSettings['indicators'][keyIndicator]['plotIndex']);
                    indicatorPlot[indicatorName].apply(indicatorPlot, indicatorSettings);
                    indicatorPlot.yScale(savedSettings['scale']);
                }
            }

        } else {
            // create line series
            lineSeries = plot.line(mapping);
            lineSeries.name(dataName.toUpperCase());
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

    function updateTextForIndicatorTypeSelect() {
        if ($indicatorTypeSelect.val()) {
            if ($indicatorTypeSelect.val().length > 1) {
                $indicatorTypeSelect.find('option:selected').each(function () {
                    $(this).text($(this).attr('data-abbr'))
                });
            } else {
                $indicatorTypeSelect.find('option:selected').each(function () {
                    $(this).text($(this).attr('data-full-text'))
                });
            }

            $indicatorTypeSelect.selectpicker('refresh').closest('.bootstrap-select').find('.dropdown-menu.inner').find('span.text').each(function (index) {
                $(this).text($indicatorTypeSelect.find('option').eq(index).attr('data-full-text'));
            });
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
    }

    function overviewText() {
        $indicatorForm.find($("[class*='col-sm-']")).last().after('<div class="col-xs-12" id="overviewText"></div>');

        for (keyIndicator in indicator.overviewIndicator[indicator.name]) {
            if (indicator.overviewIndicator[indicator.name].hasOwnProperty(keyIndicator) && keyIndicator !== 'title') {
                $indicatorForm.find('#overviewText').append(
                    '<h5>' + keyIndicator[0].toUpperCase() + keyIndicator.substr(1) + '</h5>' +
                    '<div>' + indicator.overviewIndicator[indicator.name][keyIndicator] + '</div>'
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




