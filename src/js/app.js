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

    var savedSettings = {};
    savedSettings['data'] = {};
    savedSettings['chartType'] = $seriesTypeSelect.val();
    savedSettings['scale'] = $scaleTypeSelect.val();
    savedSettings['indicators'] = {};

    var container = 'chart-container';

    var indicator = {
        name: '',
        plotIndex: 0,
        defaultSettings: {},
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

    var location = window.location;

    // cross origin requests are only supported for protocol schemes
    if (location.protocol === 'file:') {
        $loader.hide();
        $('.wrapper').hide();
        $('#warning').modal('show').on('hidden.bs.modal', function () {
            $('.img-ok').fadeIn();
        });
    }

    // get overview indicators from overview.xml
    $.get("indicators.xml", function (data) {
        $(data).children().children().each(function (index, item) {
            var indicatorName = $(item).context.tagName;
            var description;
            var $option = $('<option></option>');

            // create option and append to indicator type select
            $option.attr({
                'value': indicatorName,
                'data-abbr': $(this).find('abbreviation').text(),
                'data-full-text': $(this).find('title').text()
            }).text($(this).find('title').text());

            if ($(this).find('plot_index').length) {
                $option.attr('data-plot-index', +$(this).find('plot_index').text());
            }

            $indicatorTypeSelect.append($option);

            indicator['defaultSettings'][indicatorName] = {};

            // set indicator settings to indicator object
            $(item).find('defaults').children().each(function () {
                var prop = camelCaseToUpperCase($(this)[0].tagName);
                var value = $(this).text();

                if (!isNaN(+value)) {
                    value = Number(value);
                } else {
                    try {
                        value = JSON.parse(value);
                    }
                    catch (err) {
                    }
                }

                indicator['defaultSettings'][indicatorName][prop] = value;
            });

            // description from xml
            description = $(item).find('description')[0].outerHTML;

            // replace xml tags to html tags
            description = description.replace(/<description>/g, '').replace(/<\/description>/g, '');
            description = description.replace(/<caption>/g, '<b>').replace(/<\/caption>/g, '</b>');
            description = description.replace(/<text>/g, '<p>').replace(/<\/text>/g, '</p>');
            description = description.replace(/<list>/g, '<ul>').replace(/<\/list>/g, '</ul>');
            description = description.replace(/<listItem>/g, '<li>').replace(/<\/listItem>/g, '</li>');

            // save indicator overview
            indicator['defaultSettings'][indicatorName]['overview'] = {};
            indicator['defaultSettings'][indicatorName]['overview']['title'] = $(item).find('title').text();
            indicator['defaultSettings'][indicatorName]['overview']['description'] = description;
        });

        $indicatorTypeSelect.selectpicker();
    });

    $(window).on('resize', initHeightChart);

    anychart.onDocumentReady(function () {
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

            if (indicator.plotIndex !== 0) {
                indicator.plotIndex = chart.getPlotsCount();
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

    function camelCaseToUpperCase(text) {
        var result = [];

        text.split('_').filter(function (item, index) {
            if (index == 0) {
                result.push(item.toLowerCase());
            } else {
                result.push(item[0].toUpperCase() + item.substr(1).toLowerCase());
            }
        });

        return result.join('');
    }

    function initHeightChart() {
        // debugger;
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
            initHeightChart();
            setTimeout(function(){
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

        $('#indicatorSettingsModalTitle').text(indicator.defaultSettings[indicator.name].overview.title);

        // empty form
        $indicatorForm.empty();
        // create row
        $indicatorForm.append('<div class="row"></div>');
        var $indicatorFormRow = $indicatorForm.find('.row');

        for (key in indicatorSettings) {
            if (indicatorSettings.hasOwnProperty(key) && key !== 'overview' && key !== 'plotIndex') {

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
        $indicatorForm.find($("[class*='col-sm-']")).last().after('<div class="col-xs-12" id="overviewText"></div>');
        $indicatorForm.find('#overviewText').append(indicator.defaultSettings[indicator.name].overview.description);
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
            if (indicatorSettings.hasOwnProperty(key) && key !== 'overview' && key !== 'plotIndex') {
                $('#' + key).val(indicatorSettings[key]);
            }
        }
    }
})();




