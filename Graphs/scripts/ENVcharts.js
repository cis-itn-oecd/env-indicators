// Make all charts on page given an array
// It can be an array of json file names (strings)
//   in which case the containers are in order those selected by ChartContainersJQSelector (created if not found)
// Or it can be an array of objects where member "jsonFile" is the mandatory json file name
//   and either member "containerSelector" (full JQuery selector like "#my_div.with_class") is required
//   or member "containerId" (containerId: "my_div" is equivalent to containerSelector: "#my_div")
function MakeCharts(chartKeys)
{
    var i, key, idAttr = '';
    var $div, $survey;
    for (i = 0; i < chartKeys.length; i++)
    {
        key = chartKeys[i];

        $div = undefined;
        if ($.isPlainObject(key))
        {
            if (key.containerSelector)
            {
                $div = $(key.containerSelector);
            }
            else if (key.containerId)
            {
                $div = $('#' + key.containerId);
            }
            key = key.jsonFile;
        }
        if (!$div || !$div.length)
        {
            $div = $(ChartContainersJQSelector).eq(i);
        }
        
        // This to make sure div exists, otherwise it is created within the survey tag (SurveyTitleJQSelector)
        if (!$div.length)
        {
            if (key.containerId) idAttr = ' id="' + key.containerId + '"';
            $div = $('<div' + idAttr + ' class="' + ChartContainersJQSelector.replace('.', '') + '"></div>');
            $survey = $(SurveyTitleJQSelector);
            if (!$survey.length)
            {
                $survey = $('<div class="' + SurveyTitleJQSelector.replace('.', '') + '"></div>');
                $("body").append($survey);
            }
            $survey.append($div);
        }

        MakeChart(key, $div);
    }
}

// Makes a chart from its definition at "chartKey" key in ENVCharts global object (see ENVChartsGlobals.js)
// into $container (JQuery selection)
function MakeChart(chartKey, $container)
{
    var chart, dataProxy, displayCallback, recursGetJSON;

    chart = ENVCharts.charts[chartKey];
    chart.options = chart.options || {};
    if (chart && chart.type)
    {
        // Functions are retrieved through the chart type name :
        // data proxy function is suffixed "~Data"
        // HighCharts output function is suffixed "~Chart"
        dataProxy = eval(chart.type.capitalize() + 'Data');
        displayCallback = eval(chart.type.capitalize() + 'Chart');

        if ($.isFunction(dataProxy) && $.isFunction(displayCallback))
        {
            // Get JSON from several files in an array and apply callback to array
            (recursGetJSON = function (jsonFilesArr, callback, outputArr)
            {
                if (!outputArr) outputArr = [];
                if (!$.isArray(jsonFilesArr)) jsonFilesArr = [jsonFilesArr];
                if (jsonFilesArr.length)
                {
                    $.getJSON(JsonPath + jsonFilesArr.shift(), function (json)
                    {
                        outputArr.push(json);
                        recursGetJSON(jsonFilesArr, callback, outputArr);
                    });
                }
                else
                {
                    callback(outputArr);
                }
            })
            (
                chart.jsonFiles.slice(),
                function (jsonArr) { displayCallback($container, dataProxy(jsonArr, chart.options)); }
            );
        }
    }
}



////
// DATA PROXIES and HIGHCHARTS OUTPUTS
// by chart type
////

// Data proxy for LINE type charts
function LineData(jsonArr, opt)
{
    var chartData = {};
    chartData.options = opt;
    chartData.series = [];

    var i, j, ser, json, obs, vals, categs, col, colorArr, line, lineArr, serieData;

    colorArr = ENVCharts.globals.line.series.colors;
    lineArr = ENVCharts.globals.line.series.lineWidths;

    for (i = 0; i < opt.series.length; i++)
    {
        // Retrieve object from JSON
        ser = opt.series[i];
        json = jsonArr[ser.useJsonIndex];

        // Get categories and values (using sdmxjsonreader.js)
        obs = sdmxGetObs(json, ser.dataCoords);
        categs = smdxGetCoords(json, obs, ser.categIndex).map(function (o) { return (o && o.name) ? o.name : null; });;
        obs = sdmxFillBlanks(obs, ser.categIndex, 0, categs.length);
        vals = sdmxGetValues(obs, [ser.categIndex]);
        
        // Get line and color at index (or last) in the global definition
        col = (i < colorArr.length) ? colorArr[i] : colorArr[colArr.length - 1];
        line = (i < lineArr.length) ? lineArr[i] : lineArr[lineArr.length - 1];
        serieData = [];
        for (j = 0; j < categs.length; j++)
        {
            // Extend the predefined point with the retrieved point data
            serieData.push($.extend({
                x: Date.UTC(parseInt(categs[j]), 0, 1, 0, 0, 0),
                y: ($.isFunction(opt.series[i].valueAdjustment)) ? opt.series[i].valueAdjustment(vals[j]) : vals[j],
                color: col
            }, ENVCharts.globals.line.series.pointOptions || {}));
        }

        // Add a full series with name, data and options
        chartData.series.push({
            name: opt.series[i].name,
            color: col,
            lineColor: col,
            lineWidth: line,
            data: serieData
        });
    }

    return chartData; 
}
// HighCharts output for LINE type charts
function LineChart($container, chartData)
{
    var hc = {
        chart: {
            type: 'spline',
            marginLeft: 35,
            marginTop: 45,
            events: {
                load: function ()
                {
                    this.ENVOptions = chartData.options;
                    $container.find(".highcharts-axis-labels text").removeAttr("fill");
                }
            }
        },
        title: {
            text: chartData.options.title,
            align: 'left',
            x: 15,
            style: ENVCharts.globals.styles.title
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            type: 'datetime',
            startOnTick: true,
            minPadding: 0,
            tickmarkPlacement: 'on',
            tickInterval: chartData.options.timeLabelsAt * 365.25 * 24 * 60 * 60 * 1000,
            labels: {
                style: ENVCharts.globals.styles.axisLabels,
                y: 16
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000',
            lineColor: '#000000'
        },
        yAxis: {
            title: {
                text: chartData.options.axisTitle,
                align: 'high',
                rotation: 0,
                textAlign: 'left',
                offset: -5,
                y: 4,
                style: ENVCharts.globals.styles.axisTitle
            },
            tickPosition: 'inside',
            tickLength: 2,
            lineWidth: 1,
            tickWidth: 1,
            tickColor: '#000000',
            lineColor: '#000000',
            min: chartData.options.axisMin,
            max: chartData.options.axisMax,
            tickInterval: chartData.options.axisTicksAt,
            labels: {
                step: Math.floor(chartData.options.axisLabelsAt / chartData.options.axisTicksAt),
                style: ENVCharts.globals.styles.axisLabels,
                formatter: function ()
                {
                    return Math.round(this.value * Math.pow(10, chartData.options.axisLabelsDecimals)) / Math.pow(10, chartData.options.axisLabelsDecimals);
                }
            },
            gridLineWidth: 0
        },
        plotOptions: {
            spline: {
                shadow: false,
                marker: {
                    symbol: 'diamond',
                    radius: 2
                },
                states: {
                    hover: {
                        enabled: true,
                        lineWidth: 1
                    }
                }
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: ENVCharts.globals.line.tooltip.borderWidth,
            borderColor: ENVCharts.globals.line.tooltip.borderColor,
            formatter: ENVCharts.globals.line.tooltip.formatter
        },
        series: chartData.series
    };

    $container.highcharts(hc);
}


// Data proxy for COLUMN type charts
function ColumnData(jsonArr, opt)
{
    var chartData = {};
    chartData.options = opt;
    chartData.series = [];
    chartData.categories = [];

    var i, j, ser, json, obs, vals, categs, col, colorObj, serieData = [];
    var srtcategs = [], srtvals = [];

    colorObj = ENVCharts.globals.column.series.colors;

    // Retrieve object from JSON
    ser = opt.series[0];
    json = jsonArr[ser.useJsonIndex];

    // Get categories and values (using sdmxjsonreader.js)
    obs = sdmxGetObs(json, ser.dataCoords);
    categs = smdxGetCoords(json, obs, ser.categIndex).map(function (o) { return (o && o.id) ? o.id : null; });;
    obs = sdmxFillBlanks(obs, ser.categIndex, 0, categs.length, NoDataValue);
    vals = sdmxGetValues(obs, [ser.categIndex]);

    // Sort both arrays
    var adjVal;
    for (i = 0; i < categs.length; i++)
    {
        adjVal = ($.isFunction(opt.series[0].valueAdjustment)) ? opt.series[0].valueAdjustment(vals[i]) : vals[i];
        if (adjVal !== NoDataValue || ShowPointsWithNoData)
        {
            if (!srtcategs.length && !srtvals.length)
            {
                srtcategs.push(categs[i]);
                srtvals.push(adjVal);
            }
            else
            {
                if (srtvals[0] !== NoDataValue)
                {
                    if (adjVal < srtvals[0] || adjVal === NoDataValue)
                    {
                        srtcategs.unshift(categs[i]);
                        srtvals.unshift(adjVal);
                    }
                    else
                    {
                        j = 1;
                        while (srtvals[j] !== undefined && adjVal > srtvals[j]) j++;
                        srtcategs.splice(j, 0, categs[i]);
                        srtvals.splice(j, 0, adjVal);
                    }
                }
                else
                {
                    j = 1;
                    while (srtvals[j] === NoDataValue) j++;
                    if (adjVal !== NoDataValue)
                    {
                        while (srtvals[j] !== undefined && adjVal > srtvals[j]) j++;
                    }
                    srtcategs.splice(j, 0, categs[i]);
                    srtvals.splice(j, 0, adjVal);
                }
            }
        }
    }

    // Add unknown 
    if (ShowPointsWithNoData)
    {
        var t = [];
        for (i in CtrISO3)
        {
            if (i !== 'WLD' && $.inArray(i, srtcategs) === -1)
            {
                t.push(i);
                srtvals.unshift(NoDataValue);
            }
        }
        srtcategs = t.concat(srtcategs);
    }

    for (i = 0; i < srtcategs.length; i++)
    {
        if (srtvals[i] === NoDataValue) col = colorObj.nodata;
        else if (CtrISO3[srtcategs[i]].ISO2 === SelectedISO) col = colorObj.selected;
        else if ($.inArray(srtcategs[i], HighLightISO) > -1
            || $.inArray(CtrISO3[srtcategs[i]].ISO2, HighLightISO) > -1)
             col = colorObj.highlight;
        else col = colorObj.default;

        serieData.push($.extend({
            y: srtvals[i],
            color: col
        }, ENVCharts.globals.column.series.pointOptions || {}));

        chartData.categories.push(srtcategs[i]);
    }

    chartData.series.push({
        name: opt.series[0].name, 
        data: serieData
    });

    return chartData;
}
// HighCharts output for COLUMN type charts
function ColumnChart($container, chartData)
{
    var hc = {
        chart: {
            type: 'column',
            marginLeft: 35,
            events: {
                load: function ()
                {
                    this.ENVOptions = chartData.options;
                    if (this.yAxis[0].min < 0)
                    {
                        var off = this.yAxis[0].translate(0);
                        this.xAxis[0].update({ offset: -off + 0.7 });
                    }
                    $.each(this.series[0].data, function (i, point)
                    {
                        if (point.dataLabel.element.textContent === '▲')
                        {
                            point.dataLabel.attr({ y: -6, x: point.clientX - point.pointWidth - 1 });
                        }
                    });
                }
            }
        },
        title: {
            text: chartData.options.title,
            align: 'left',
            x: 15,
            style: ENVCharts.globals.styles.title
        },
        legend: {
            enabled: false
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: chartData.categories,
            lineWidth: 1,
            lineColor: '#000000',
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000'
        },
        yAxis: {
            title: {
                text: chartData.options.axisTitle,
                align: 'high',
                rotation: 0,
                textAlign: 'left',
                offset: -5,
                y: 4,
                style:  ENVCharts.globals.styles.axisTitle
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000',
            min: chartData.options.axisMin,
            max: chartData.options.axisMax,
            tickInterval: chartData.options.axisTicksAt,
            labels: {
                step: Math.floor(chartData.options.axisLabelsAt / chartData.options.axisTicksAt),
                style: ENVCharts.globals.styles.axisLabels,
                formatter: function ()
                {
                    return Math.round(this.value * Math.pow(10, chartData.options.axisLabelsDecimals)) / Math.pow(10, chartData.options.axisLabelsDecimals);
                }
            }, 
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#000000',
            tickWidth: 1    
        },
        plotOptions: {
            column: {
                shadow: false,
                borderWidth: 0,
                pointPadding: 0,
                pointWidth: 7,
                states: {
                    hover: {
                        enabled: false
                    }
                }
            },
            series: {
                dataLabels: {
                    align: 'left',
                    enabled: true,
                    x: 2,
                    y: -10
                },
            }
        },
        tooltip: {
            useHTML: true,
            borderWidth: ENVCharts.globals.column.tooltip.borderWidth,
            borderColor: ENVCharts.globals.column.tooltip.borderColor,
            formatter: ENVCharts.globals.column.tooltip.formatter
        },
        series: chartData.series
    };

    $container.highcharts(hc);
}

// NOT IMPLEMENTED
// Data proxy for STACKEDCOLUMN type charts       
function StackedColumnData(json, opt)
{
    var chartData;

    // Transform sdmx data
    chartData = json;
    //

    chartData.options = opt;
    chartData.getColor = function (i, k, selected, highlight)
    {
        switch (k)
        {
            case selected:
                return ENVCharts.globals.stackedColumn.series.colors.selected[i];
            case highlight:
                return ENVCharts.globals.stackedColumn.series.colors.highlight[i];
            default:
                return ENVCharts.globals.stackedColumn.series.colors.default[i];
        }
    }
    return chartData;
}
// HighCharts output for STACKEDCOLUMN type charts
function StackedColumnChart($container, chartData)
{

    var cat = [];
    var ser = [];
    var val;
    for (var i = chartData.Series.length - 1; i >= 0 ; i--)
    {
        val = [];
        for (var key in chartData.Series[i].Data)
        {
            if (i == 0) cat.push(key);

            var col = chartData.getColor(i, key, SelectedISO, 'OECD');
            val.push({
                y: chartData.Series[i].Data[key],
                color: col,
                shadow: false
            });
        }
        ser.push({
            name: chartData.Series[i].Name[StartLanguage],
            color: chartData.getColor(i, '', SelectedISO, 'OECD'),
            data: val
        });
    }

    var hc = {
        chart: {
            type: 'column',
            marginLeft: 35,
            events: {
                load: function ()
                {
                    this.ENVOptions = chartData.options;
                }
            }
        },
        title: {
            text: chartData.options.title,
            align: 'left',
            x: 15,
            style: ENVCharts.globals.styles.title
        },
        legend: {
            enabled: true,
            floating: true,
            borderWidth: 0,
            align: 'left',
            verticalAlign: 'top',
            x: 45,
            y: 25,
            symbolWidth: 12,
            itemStyle: {
                color: '#000000',
                fontSize: '7pt',
                fontWeight: 'normal'
            }
        },
        credits: {
            enabled: false
        },
        xAxis: {
            categories: cat,
            lineWidth: 1,
            lineColor: '#000000',
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000'
        },
        yAxis: {
            title: {
                text: chartData.options.axisTitle,
                align: 'high',
                rotation: 0,
                textAlign: 'left',
                offset: -5,
                y: 4,
                style: ENVCharts.globals.styles.axisTitle
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000',
            min: chartData.options.axisMin,
            max: chartData.options.axisMax,
            tickInterval: chartData.options.axisTicksAt,
            labels: {
                step: Math.floor(chartData.options.axisLabelsAt / chartData.options.axisTicksAt),
                style: ENVCharts.globals.styles.axisLabels,
                formatter: function ()
                {
                    return Math.round(this.value * Math.pow(10, chartData.options.axisLabelsDecimals)) / Math.pow(10, chartData.options.axisLabelsDecimals);
                }
            },
            gridLineWidth: 0,
            lineWidth: 1,
            lineColor: '#000000',
            tickWidth: 1
        },
        plotOptions: {
            column: {
                shadow: false,
                borderWidth: 0,
                pointPadding: 0,
                stacking: 'normal'
            }
        },
        tooltip: {
            shared: true,
            useHTML: true,
            borderWidth: ENVCharts.globals.stackedColumn.tooltip.borderWidth,
            borderColor: ENVCharts.globals.stackedColumn.tooltip.borderColor,
            formatter: ENVCharts.globals.stackedColumn.tooltip.formatter
        },
        series: ser
    };

    $container.highcharts(hc);
}



String.prototype.capitalize = function ()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}