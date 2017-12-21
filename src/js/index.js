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
    var $loader = $('#loader');

    var appSettingsCache = {};
    appSettingsCache['data'] = {};
    appSettingsCache['chartType'] = $seriesTypeSelect.val();
    appSettingsCache['scale'] = $scaleTypeSelect.val();
    appSettingsCache['indicators'] = {};

    var chartContainer = 'chart-container';

    var indicatorsSettings = {
        name: '',
        plotIndex: 0,
        defaultSettings: {},
        seriesType: [
            'area',
            'column',
            'jump-line',
            'line',
            'marker',
            'spline',
            'spline-area',
            'step-area',
            'step-line',
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

    // this Sample will properly work only if upload it to a server and access via http or https
    if (window.location.protocol === 'file:') {
        $loader.hide();
        $('.wrapper').hide();
        $('#warning').modal({
            backdrop: 'static',
            keyboard: false
        });
    }

    // get indicators from file indicators.xml
    $.get("indicators.xml", function (data) {
        $(data).find('indicator').each(function (index, item) {
            var indicatorName = $(this).attr('type');
            var description;
            var $option = $('<option></option>');

            // create option and append to indicator type select
            $option.attr({
                'value': indicatorName,
                'data-abbr': $(this).find('abbreviation').text(),
                'data-full-text': $(this).find('title').text()
            }).text($(this).find('title').text());

            if ($(this).find('[name="plotIndex"]').length) {
                $option.attr('data-plot-index', $(this).find('[name="plotIndex"]').attr('value'));
            }

            $indicatorTypeSelect.append($option);

            indicatorsSettings['defaultSettings'][indicatorName] = {};

            // set indicator settings to indicator object
            $(item).find('defaults').children().each(function () {
                var prop = $(this).attr('name');
                var value = $(this).attr('value');

                switch ($(this).attr('type')) {
                    case 'number':
                        value = +value;
                        break;
                    case 'array':
                        value = JSON.parse(value);
                        break;
                }

                indicatorsSettings['defaultSettings'][indicatorName][prop] = value;
            });

            // description from xml
            description = $(item).find('description').text();

            // save indicator overview
            indicatorsSettings['defaultSettings'][indicatorName]['overview'] = {};
            indicatorsSettings['defaultSettings'][indicatorName]['overview']['title'] = $(item).find('title').text();
            indicatorsSettings['defaultSettings'][indicatorName]['overview']['description'] = description;
        });

        // sort option in select 
        var options = $indicatorTypeSelect.find('option').sort(function (a, b) {
            return a.value.toUpperCase().localeCompare(b.value.toUpperCase())
        });
        $indicatorTypeSelect.append(options);

        // init selectpicker
        $indicatorTypeSelect.selectpicker();
    });

    $(window).on('resize', initHeightChart);

    anychart.onDocumentReady(function () {
        // To work with the data adapter you need to reference the data adapter script file from AnyChart CDN
        // (https://cdn.anychart.com/releases/v8/js/anychart-data-adapter.min.js)
        // Load JSON data and create a chart by JSON data.
        anychart.data.loadJsonFile($chartDataSelect.find('option:selected').data().json, function (data) {
            appSettingsCache['data'][$chartDataSelect.find('option:selected').text().toLowerCase().trim()] = data;
            // init, create chart
            app.createChart(chartContainer);
        });

        // event to set data to chart
        $chartDataSelect.on('change', function () {
            var name = $(this).find('option:selected').text().toLowerCase().trim();

            if (!~Object.keys(appSettingsCache['data']).indexOf(name)) {
                // To work with the data adapter you need to reference the data adapter script file from AnyChart CDN
                // (https://cdn.anychart.com/releases/v8/js/anychart-data-adapter.min.js)
                // Load JSON data and create a chart by JSON data.
                anychart.data.loadJsonFile($(this).find('option:selected').data().json, function (data) {
                    appSettingsCache['data'][name] = data;
                    dataTable.addData(data);
                    chart.plot().getSeries(0).name(name.toUpperCase());
                });
            } else {
                dataTable.addData(appSettingsCache['data'][name]);
                chart.plot().getSeries(0).name(name.toUpperCase());
            }
        });

        // event to set chart type
        $seriesTypeSelect.on('change', function () {
            var type = $(this).val();

            // set chart type
            chart.plot().getSeries(0).seriesType(type);
            // save chart type
            appSettingsCache['chartType'] = type;
        });

        // event to show modal indicator settings
        $indicatorTypeSelect.on('change', function () {

            if ($(this).val()) {
                if ($(this).val().length === 1) {
                    updateTextForIndicatorTypeSelect($indicatorTypeSelect);
                }
            }

            if ($(this).val() === null || $(this).val().length < Object.keys(appSettingsCache.indicators).length) {

                app.removeChart();

                if ($(this).val() !== null) {
                    for (var keyIndicator in appSettingsCache.indicators) {
                        if (!~$(this).val().indexOf(keyIndicator)) {
                            delete appSettingsCache.indicators[keyIndicator]
                        }
                    }
                } else {
                    appSettingsCache.indicators = {};
                }

                app.createChart(chartContainer, true);

                return
            }

            for (var i = 0; i < $(this).val().length; i++) {
                if (!~Object.keys(appSettingsCache.indicators).indexOf($(this).val()[i])) {
                    // set indicator name
                    indicatorsSettings.name = $(this).val()[i];
                    break;
                }
            }

            // set plot index
            indicatorsSettings.plotIndex = $(this).find('option[value="' + indicatorsSettings.name + '"]').data().plotIndex;

            if (indicatorsSettings.plotIndex !== 0) {
                indicatorsSettings.plotIndex = chart.getPlotsCount();
            }

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
            appSettingsCache['scale'] = $(this).val();
            app.createChart(chartContainer, true);
        });

        // remove selected class, if indicator not selected
        $indicatorSettingsModal.on('hidden.bs.modal', function () {
            var lastAddedIndicator;

            for (var i = 0; i < $indicatorTypeSelect.val().length; i++) {
                if (!~Object.keys(appSettingsCache.indicators).indexOf($indicatorTypeSelect.val()[i])) {
                    // set indicator name
                    lastAddedIndicator = $indicatorTypeSelect.val()[i];
                    break;
                }
            }

            if (!lastAddedIndicator) {
                // update select text/title
                updateTextForIndicatorTypeSelect($indicatorTypeSelect);
                return false
            }

            var indexOption = $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').index();

            // unselect option
            $indicatorTypeSelect.find('[value="' + lastAddedIndicator + '"]').removeAttr('selected');
            // remove selected class
            $indicatorTypeSelect.prev('.dropdown-menu').find('li[data-original-index="' + indexOption + '"]').removeClass('selected');
            // update select text/title
            updateTextForIndicatorTypeSelect($indicatorTypeSelect);
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
            appSettingsCache['indicators'] = {};
            appSettingsCache['scale'] = 'linear';
            appSettingsCache['chartType'] = 'line';

            // select msft data
            $chartDataSelect.val(1).selectpicker('refresh');
            // select series type
            $seriesTypeSelect.val('candlestick').selectpicker('refresh');
            // reset indicators select
            $indicatorTypeSelect.val('').selectpicker('refresh');
            // select chart scale
            $scaleTypeSelect.val('linear').selectpicker('refresh');

            // init, create chart
            app.createChart(chartContainer);
        });

        // event to add indicator
        $addIndicatorBtn.on('click', function () {
            var mapping = dataTable.mapAs({'value': 1, 'volume': 1, 'open': 1, 'high': 2, 'low': 3, 'close': 4});
            // var keys = Object.keys(indicatorsSettings.defaultSettings[indicatorsSettings.name]);
            var indicator = indicatorsSettings.defaultSettings[indicatorsSettings.name];
            var settings = [mapping];
            var indicatorName = indicatorsSettings.name;

            // for slow/fast stochastic
            if (~indicatorName.toLowerCase().indexOf('stochastic')) {
                indicatorName = 'stochastic';
            }

            for (key in indicator) {
                if (key !== 'overview' && key !== 'plotIndex') {
                    var val = $('#' + key).val();
                    val = val == 'true' || val == 'false' ? val == 'true' : val;
                    settings.push(val);
                }
            }

            // save settings for indicator
            appSettingsCache['indicators'][indicatorsSettings.name] = {};
            appSettingsCache['indicators'][indicatorsSettings.name]['settings'] = settings;
            appSettingsCache['indicators'][indicatorsSettings.name]['plotIndex'] = indicatorsSettings.plotIndex;

            var plot = chart.plot(indicatorsSettings.plotIndex);
            plot[indicatorName].apply(plot, settings);
            // adding extra Y axis to the right side
            plot.yAxis(1).orientation('right');
            // hide indicator settings modal
            $indicatorSettingsModal.modal('hide');
        });
    });

    function initHeightChart() {
        var creditsHeight = 10;
        $('#chart-container').height($(window).height() - $indicatorNavPanel.outerHeight() - creditsHeight);
    }

    function createChart(container, updateChart) {
        var dataName = $chartDataSelect.find('option:selected').text().trim();
        var seriesType = $seriesTypeSelect.val();

        // create data table on loaded data
        dataTable = anychart.data.table();

        var series;

        // map loaded data
        var mapping = dataTable.mapAs({'value': 1, 'volume': 1, 'open': 1, 'high': 2, 'low': 3, 'close': 4});

        // create stock chart
        chart = anychart.stock();

        // create plot on the chart
        var plot = chart.plot(0);

        dataTable.addData(appSettingsCache['data'][dataName.toLowerCase()]);

        if (updateChart) {
            var indicatorName;
            var indicatorPlot;
            var indicatorSettings = [];

            // create line series
            series = plot[appSettingsCache['chartType']](mapping);
            series.name(dataName.toUpperCase());

            plot.yScale(appSettingsCache['scale']);

            for (var keyIndicator in appSettingsCache['indicators']) {
                indicatorName = keyIndicator;

                if (appSettingsCache['indicators'].hasOwnProperty(keyIndicator)) {
                    indicatorSettings = appSettingsCache['indicators'][keyIndicator]['settings'];
                    indicatorSettings[0] = mapping;
                }

                // for slow/fast stochastic
                if (~indicatorName.toLowerCase().indexOf('stochastic')) {
                    indicatorName = 'stochastic';
                }

                if (appSettingsCache['indicators'].hasOwnProperty(keyIndicator)) {
                    indicatorPlot = chart.plot(appSettingsCache['indicators'][keyIndicator]['plotIndex']);
                    indicatorPlot[indicatorName].apply(indicatorPlot, indicatorSettings);
                    // adding extra Y axis to the right side
                    indicatorPlot.yAxis(1).orientation('right');
                }
            }

        } else {
            // create line series
            series = plot[seriesType](mapping);
            series.name(dataName.toUpperCase());
        }

        series.stroke('2px #64b5f6');

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
        var rangePicker = anychart.ui.rangePicker();
        // init range picker
        rangePicker.render(chart);

        // create range selector
        var rangeSelector = anychart.ui.rangeSelector();
        // init range selector
        rangeSelector.render(chart);

        chart.listen('chartDraw', function () {
            initHeightChart();
            setTimeout(function () {
                $loader.hide();
            }, 100);
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
        var indicatorSettings = indicatorsSettings.defaultSettings[indicatorsSettings.name];
        var $option;
        var i = 0;

        $('#indicatorSettingsModalTitle').text(indicatorsSettings.defaultSettings[indicatorsSettings.name].overview.title);

        // empty form
        $indicatorForm.empty();
        // create row
        $indicatorForm.append('<div class="row"></div>');
        var $indicatorFormRow = $indicatorForm.find('.row');

        for (var key in indicatorSettings) {
            if (indicatorSettings.hasOwnProperty(key) && key !== 'overview' && key !== 'plotIndex') {

                if (typeof indicatorSettings[key] === 'string') {
                    $indicatorFormRow.append(selectHtml);
                    $indicatorFormGroup = $('#indicatorFormGroup');
                    $indicatorFormGroup.find('select').attr('id', key);
                    $indicatorFormGroup.find('label').attr('for', key).text(getInputLabelText(key));

                    for (i = 0; i < indicatorsSettings.seriesType.length; i++) {
                        $option = $('<option></option>');
                        $option.val(indicatorsSettings.seriesType[i].toLowerCase());
                        $option.text(getInputLabelText(indicatorsSettings.seriesType[i]));
                        $indicatorFormGroup.find('select').append($option);
                    }

                    $indicatorFormGroup.removeAttr('id');

                } else if (typeof indicatorSettings[key] === 'number') {
                    $indicatorFormRow.append(inputHtml);
                    $indicatorFormGroup = $('#indicatorFormGroup');
                    $indicatorFormGroup.find('input').attr('id', key);

                    $indicatorFormGroup.removeAttr('id').find('label').attr('for', key).text(getInputLabelText(key));
                    
                } else if (typeof indicatorSettings[key] === 'object') {
                    $indicatorFormRow.append(selectHtml);
                    $indicatorFormGroup = $('#indicatorFormGroup');
                    $indicatorFormGroup.find('select').attr('id', key);
                    $indicatorFormGroup.find('label').attr('for', key).text(getInputLabelText(key));

                    for (i = 0; i < indicatorSettings[key].length; i++) {
                        $option = $('<option></option>');
                        $option.val(indicatorSettings[key][i].toLowerCase());
                        $option.text(indicatorSettings[key][i]);
                        $indicatorFormGroup.find('select').append($option);
                    }

                    $indicatorFormGroup.removeAttr('id');
                }
            }
        }

        // col class to form el
        setColClass($indicatorForm);
        // indicator overview text
        $indicatorForm.find($("[class*='col-sm-']")).last().after('<div class="col-xs-12" id="overviewText"></div>');
        $indicatorForm.find('#overviewText').append(indicatorsSettings.defaultSettings[indicatorsSettings.name].overview.description);
    }

    function setDefaultIndicatorSettings() {

        var indicatorSettings = indicatorsSettings.defaultSettings[indicatorsSettings.name];

        for (var key in indicatorSettings) {
            if (indicatorSettings.hasOwnProperty(key) && key !== 'overview' && key !== 'plotIndex') {
                $('#' + key).val(indicatorSettings[key]);
            }
        }
    }
})();




