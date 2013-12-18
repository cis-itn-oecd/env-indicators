
function MakeCharts(chartKeys)
{
    var i, key;
    var $div, $survey;

    for (i = 0; i < chartKeys.length; i++)
    {
        key = chartKeys[i];
        $div = $(ChartContainersJQSelector).eq(i);

        // This to make sure div exists, otherwise it is created
        if (!$div.length)
        {
            $div = $('<div class="' + ChartContainersJQSelector.replace('.', '') + '"></div>');
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

function MakeChart(chartKey, $container)
{
    var chart, dataProxy, displayCallback;

    chart = ENVCharts.charts[chartKey];
    chart.options = chart.options || {};
    if (chart && chart.type)
    {
        // Functions are retrieved through the chart type name
        dataProxy = eval(chart.type.capitalize() + 'Data');
        displayCallback = eval(chart.type.capitalize() + 'Chart');

        if ($.isFunction(dataProxy) && $.isFunction(displayCallback))
        {
            recursGetJSON(chart.jsonFiles.slice(), function (jsonArr)
            {
                displayCallback($container, dataProxy(jsonArr, chart.options));
            });
        }
    }

    // Get JSON from several files in an array and apply callback to array
    function recursGetJSON(jsonFilesArr, callback, outputArr)
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
    }
}



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
                offset: -6.67 * (chartData.options.axisTitle || '') - 8.34,
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

function ColumnData(json, opt)
{
    var chartData;

    // Transform sdmx data
    chartData = json;
    //

    chartData.options = opt;
    chartData.getColor = function (k, selected, highlight)
    {
        switch (k)
        {
            case selected:
                return ENVCharts.globals.column.series.colors.selected;
            case highlight:
                return ENVCharts.globals.column.series.colors.highlight;
            default:
                return ENVCharts.globals.column.series.colors.default;
        }
    }
    return chartData;
}
function ColumnChart($container, chartData)
{

    var cat = [];
    var val = [];
    for (var key in chartData.Series.Data)
    {
        cat.push(key);
        var col = chartData.getColor(key, SelectedISO, 'OECD');

        var yval = chartData.Series.Data[key];
        if (yval == null)
        {
            val.push({
                y: Math.pow(10, 10),   // This value is defined as no-data
                color: 'transparent',
                shadow: false
            });
        }
        else
        {
            val.push({
                y: yval,
                color: col,
                shadow: false,
                borderRadius: 1,
                dataLabels: {
                    enabled: true,
                    inside: true,
                    verticalAlign: 'bottom',
                    style: {
                        color: '#8E896F',
                        fontSize: '8pt'
                    },
                    formatter: function ()
                    {
                        if (this.y > chartData.YAxis.Max)
                            return '▲';
                        else return '';
                    }
                }
            });
        }
    }

    var hc = {
        chart: {
            type: 'column',
            marginLeft: 35,
            events: {
                load: function ()
                {
                    this.ENVOptions = chartData.options;
                    if (chartData.YAxis.Min < 0)
                    {
                        var off = this.yAxis[0].translate(0);
                        this.xAxis[0].update({ offset: -off });
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
            categories: cat,
            lineWidth: 1,
            lineColor: '#000000',
            minorGridLineWidth: 0,
            labels: {
                enabled: false
            },
            tickPosition: 'inside',
            tickLength: 2,
            tickColor: '#000000',
        },
        yAxis: {
            title: {
                text: chartData.options.axisTitle,
                align: 'high',
                rotation: 0,
                offset: -6.67 * (chartData.options.axisTitle || '').length - 8.34,
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
                pointWidth: 7
            },
            series: {
                dataLabels: {
                    align: 'left',
                    enabled: true,
                    x: 2,
                    y: -10
                }
            }
        },
        tooltip: {
            useHTML: true,
            borderWidth: ENVCharts.globals.column.tooltip.borderWidth,
            borderColor: ENVCharts.globals.column.tooltip.borderColor,
            formatter: ENVCharts.globals.column.tooltip.formatter
        },
        series: [{
            data: val
        }]
    };

    $container.highcharts(hc);
}

function LineData(jsonArr, opt)
{
    var chartData = {};
    chartData.options = opt;
    chartData.series = [];

    var i, j, ser, json, obs, vals, categs, col, colArr, line, lineArr, serieData;

    colArr = ENVCharts.globals.line.series.colors;
    lineArr = ENVCharts.globals.line.series.lineWidths;

    for (i = 0; i < opt.series.length; i++)
    {
        ser = opt.series[i];
        json = jsonArr[ser.useJsonIndex];
        obs = sdmxGetObs(json, ser.dataCoords);
        categs = smdxGetCoords(json, obs, ser.categIndex).map(function (o) { return (o && o.name) ? o.name : null; });;
        obs = sdmxFillBlanks(obs, ser.categIndex, 0, categs.length);
        vals = sdmxGetValues(obs, [ser.categIndex]);
        
        col = (i < colArr.length) ? colArr[i] : colArr[colArr.length - 1];
        line = (i < lineArr.length) ? lineArr[i] : lineArr[lineArr.length - 1];
        serieData = [];
        for (j = 0; j < categs.length; j++)
        {
            serieData.push({
                x: Date.UTC(parseInt(categs[j]), 0, 1, 0, 0, 0),
                y: vals[j],
                color: col,
                marker: {
                    enabled: false,
                    states: {
                        hover: {
                            fillColor: col
                        }
                    }
                }
            });
        }

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
                offset: -6.67 * (chartData.options.axisTitle || '') - 8.34,
                x: -10,
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



String.prototype.capitalize = function ()
{
    return this.charAt(0).toUpperCase() + this.slice(1);
}