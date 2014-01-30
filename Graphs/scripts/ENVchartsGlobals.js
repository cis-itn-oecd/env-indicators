$(function ()
{
    // Globals
    $.globalEval('var JsonPath = "data/";');  // General prefix to JSON files path

    $.globalEval('var HighLightISO = ["OECD", "WORLD"];');  // Highlighted ISO codes

    // Absence of data management
    $.globalEval('var ShowPointsWithNoData = true;');   // Change this to false to hide the points with no data on column charts
    $.globalEval('var NoDataValue = Math.pow(10, 10);'); // Because null or undefined point values will not generate any tooltips on HighCharts (no point=no tooltips): 
                                                         // 10^10 is defined as "no value" and generates a transparent column with a "No Data" tooltip
    $.globalEval('var NoDataMessage = { en: "no data", fr: "pas de données" };');
    //

    $.globalEval('var ENVCharts;');

    // SDMX coordinates selection pre-defined boolean callback functions
    var sdmxAll = function () { return true; };
    var sdmxFirst = function (o, i) { return i === 0; };
    var sdmxAtSelectedISO = function (o, i) { return o.id === CtrISO2[SelectedISO].ISO3; };
    function sdmxIdIs(dimId)
    {
        return function (o, i) { return o.id === dimId; };
    }

    var Charts = {
         
        // AIR QUALITY
        'AirQuality_1': {
            type: 'Line',
            jsonFiles: ['air-quality/gdp.json', 'air-quality/sox.json'],
            options: {
                title: 'SOx emission trends',
                axisTitle: 'Index (1990=100)',
                axisMin: 0,
                axisMax: 200,
                axisTicksAt: 25,
                axisLabelsAt: 50,
                axisLabelsDecimals: 0,
                timeLabelsAt: 5,
                series: [
                    { 
                        name: 'GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 1
                    },
                    {
                        name: 'SOx',
                        useJsonIndex: 1,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 3
                    }
                ]
            }
        },
        'AirQuality_2': {
            type: 'Line',
            jsonFiles: ['air-quality/gdp.json', 'air-quality/nox.json'],
            options: {
                title: 'NOx emission trends',
                axisTitle: 'Index (1990=100)',
                axisMin: 0,
                axisMax: 200,
                axisTicksAt: 25,
                axisLabelsAt: 50,
                axisLabelsDecimals: 0,
                timeLabelsAt: 5,
                series: [
                    { 
                        name: 'GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 1
                    },
                    {
                        name: 'NOx',
                        useJsonIndex: 1,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 3
                    }
                ]
            }
        },
        'AirQuality_3': {
            type: 'Column',
            jsonFiles: ['air-quality/sox-per-gdp.json'],
            options: {
                title: 'SOx intensities per GDP',
                axisTitle: 'kg/1000 USD',
                tooltipHeader: 'SOx/GDP',
                valueDecimals: 2,
                valueSuffix: 'kg',
                axisMin: 0,
                axisMax: 4,
                axisTicksAt: 1,
                axisLabelsAt: 1,
                axisLabelsDecimals: 2,
                series: [
                    {
                        name: 'kg/1000 USD',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst 
                        ],
                        categIndex: 0
                    }
                ]
            }
        },
        'AirQuality_4': {
            type: 'Column',
            jsonFiles: ['air-quality/nox-per-gdp.json'],
            options: {
                title: 'NOx intensities per GDP',
                axisTitle: 'kg/1000 USD',
                tooltipHeader: 'NOx/GDP',
                valueDecimals: 2,
                valueSuffix: 'kg',
                axisMin: 0,
                axisMax: 3,
                axisTicksAt: 1,
                axisLabelsAt: 1,
                axisLabelsDecimals: 2,
                series: [
                    {
                        name: 'kg/1000 USD',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // BIODIVERSITY
        'Biodiversity_1': {
            type: 'Column',
            jsonFiles: ['biodiversity/mammals.json'],
            options: {
                title: 'Threatened species: mammals',
                axisTitle: '%',
                tooltipHeader: '% of species known',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 2
                    }
                ]
            }
        },
        'Biodiversity_2': {
            type: 'Column',
            jsonFiles: ['biodiversity/birds.json'],
            options: {
                title: 'Threatened species: birds',
                axisTitle: '%',
                tooltipHeader: '% of species known',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 2
                    }
                ]
            }
        },
        'Biodiversity_3': {
            type: 'Column',
            jsonFiles: ['biodiversity/vascular-plants.json'],
            options: {
                title: 'Threatened species: vascular plants',
                axisTitle: '%',
                tooltipHeader: '% of species known',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 2
                    }
                ]
            }
        },

        // CLIMATE CHANGE
        'ClimateChange_1': {
            type: 'Line',
            jsonFiles: ['climate-change/gdp-co2.json', 'climate-change/ghg.json'],
            options: {
                title: 'GHG emissions trends',
                axisTitle: 'Index (1990=100)',
                axisMin: 0,
                axisMax: 200,
                axisTicksAt: 25,
                axisLabelsAt: 50,
                axisLabelsDecimals: 0,
                timeLabelsAt: 5,
                series: [
                    { 
                        name: 'GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxAll,
                            sdmxIdIs('GG_A11')
                        ],
                        categIndex: 1
                    },
                    {
                        name: 'CO2',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxAll,
                            sdmxIdIs('GG_B11')
                        ],
                        categIndex: 1
                    },
                    {
                        name: 'GHG',
                        useJsonIndex: 1,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxFirst,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 3
                    }
                ]
            }
        },
        'ClimateChange_2': {
            type: 'Column',
            jsonFiles: ['climate-change/co2-per-gdp.json'],
            options: {
                title: 'CO2 emission intensities per GDP',
                axisTitle: 'tonnes/1000 USD',
                tooltipHeader: 'CO2 per GDP',
                valueDecimals: 2,
                valueSuffix: ' tonnes',
                axisMin: 0,
                axisMax: 1,
                axisTicksAt: 0.2,
                axisLabelsAt: 0.2,
                axisLabelsDecimals: 1,
                series: [
                    {
                        name: 'CO2 per GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // ENERGY RESOURCES
        'EnergyResources_1': {
            type: 'Column',
            jsonFiles: ['energy-resources/energy-intensity.json'],
            options: {
                title: 'Energy intensity',
                axisTitle: '%',
                valueDecimals: 2,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 0.6,
                axisTicksAt: 0.1,
                axisLabelsAt: 0.1,
                axisLabelsDecimals: 1,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },
        'EnergyResources_2': {
            type: 'Column',
            jsonFiles: ['energy-resources/share-fossil.json'],
            options: {
                title: 'Share of fossil fuels',
                axisTitle: '%',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // ENVIRONMENTALLY RELATED TAXES
        'EnvironmentallyRelatedTaxes_1': {
            type: 'Column',
            jsonFiles: ['environementally-related-taxes/share-gdp.json'],
            options: {
                title: 'Share in GDP',
                axisTitle: '%',
                valueSuffix: '%',
                valueDecimals: 2,
                axisMin: -1,
                axisMax: 5,
                axisTicksAt: 1,
                axisLabelsAt: 1,
                axisLabelsDecimals: 0,
                series: [
                    { 
                        name: '% GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]        
            }
        },
        'EnvironmentallyRelatedTaxes_2': {
            type: 'Column',
            jsonFiles: ['environementally-related-taxes/share-total-tax.json'],
            options: {
                title: 'Share in total tax revenues',
                axisTitle: '%',
                valueSuffix: '%',
                valueDecimals: 2,
                axisMin: -5,
                axisMax: 20,
                axisTicksAt: 5,
                axisLabelsAt: 5,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // FOREST RESOURCES
        'ForestResources_1': {
            type: 'Column',
            jsonFiles: ['forest-resources/forest-intensity.json'],
            options: {
                title: 'Intensity of use of forest resources',
                axisTitle: '%',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst,
                            sdmxFirst
                        ],
                        categIndex: 0,
                        valueAdjustment: function (val) { return ((val === NoDataValue) ? val : val * 100); }
                    }
                ]
            }
        },
        'ForestResources_2': {
            type: 'Column',
            jsonFiles: ['forest-resources/forest-area.json'],
            options: {
                title: 'Forest area',
                axisTitle: '%',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 80,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // FRESH WATER QUALITY
        'FreshwaterQuality_1': {
            type: 'Column',
            jsonFiles: ['fresh-water-quality/pop-connected.json'],
            options: {
                title: 'Population connected to a sewage treatment plant',
                axisTitle: '%',
                tooltipHeader: 'Public total treatment',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // FRESH WATER RESOURCES
        'FreshwaterResources_1': {
            type: 'Column',
            jsonFiles: ['fresh-water-resources/abstractions-resources.json'],
            options: {
                title: 'Freshwater abstractions compared to available freshwater resources',
                axisTitle: '%',
                valueDecimals: 1,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 40,
                axisTicksAt: 10,
                axisLabelsAt: 10,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },
        'FreshwaterResources_2': {
            type: 'Column',
            jsonFiles: ['fresh-water-resources/abstractions-pub-supply.json'],
            options: {
                title: 'Freshwater abstractions for public supply per capita',
                axisTitle: 'm³/capita',
                valueDecimals: 1,
                valueSuffix: 'm³',
                axisMin: 0,
                axisMax: 200,
                axisTicksAt: 25,
                axisLabelsAt: 50,
                axisLabelsDecimals: 1,
                series: [
                    {
                        name: '%',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },

        // WASTE GENERATION
        'WasteGeneration_1': {
            type: 'Line',
            jsonFiles: ['municipal-waste/gdp.json', 'municipal-waste/municipal-waste.json'],
            options: {
                title: 'Municipal waste generation trends',
                axisTitle: 'Index (1990=100)',
                axisMin: 0,
                axisMax: 200,
                axisTicksAt: 25,
                axisLabelsAt: 50,
                axisLabelsDecimals: 0,
                timeLabelsAt: 5,
                series: [
                    {
                        name: 'GDP',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 1
                    },
                    {
                        name: 'Mun. waste',
                        useJsonIndex: 1,
                        dataCoords: [
                            sdmxAtSelectedISO,
                            sdmxFirst,
                            sdmxAll
                        ],
                        categIndex: 2
                    }
                ]
            }
        },
        'WasteGeneration_2': {
            type: 'Column',
            jsonFiles: ['municipal-waste/waste-per-capita.json'],
            options: {
                title: 'Municipal waste per capita',
                tooltipHeader: 'Waste per capita',
                valueSuffix: ' tonnes',
                axisMin: 0,
                axisMax: 800,
                axisTicksAt: 200,
                axisLabelsAt: 200,
                axisLabelsDecimals: 0,
                series: [
                    {
                        name: 'tonnes',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxFirst
                        ],
                        categIndex: 0
                    }
                ]
            }
        },
        'WasteGeneration_3': {
            type: 'StackedColumn',
            jsonFiles: ['municipal-waste/waste-recovery-rates.json'],
            options: {
                title: 'Municipal waste recovery rates',
                axisTitle: '%',
                valueDecimals: 2,
                valueSuffix: '%',
                axisMin: 0,
                axisMax: 100,
                axisTicksAt: 20,
                axisLabelsAt: 20,
                axisLabelsDecimals: 2,
                series: [
                    {
                        name: 'Material recovery (recycling + composting)',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxIdIs('MUNW_PERCENT')
                        ],
                        categIndex: 0
                    },
                    {
                        name: 'Incineration with energy recovery',
                        useJsonIndex: 0,
                        dataCoords: [
                            sdmxAll,
                            sdmxIdIs('MUNW_INC')
                        ],
                        categIndex: 0
                    }
                ]
            }
        }
    };

    ENVCharts = new (function (oCharts)
    {
        var self = this;

        // Options by chart, defined above
        this.charts = oCharts;

        // Global options and styles (overridable)
        this.globals = {

            line: {
                tooltip: {
                    color: '#4F81BD',
                    borderColor: '#4F81BD',
                    borderWidth: 1.2,
                    borderRadius: 3,
                    decimals: 0,
                    formatter: function ()
                    {
                        var i, p, ret, dec, sorted;
                        ret = (this.points[0].series.chart.ENVOptions.tooltipHeader) ? '<span style="color:' + self.globals.line.tooltip.color + '">' + this.points[0].series.chart.ENVOptions.tooltipHeader + '</span><br/>' : '';
                        ret += '<span style="color:' + self.globals.line.tooltip.color + '">' + new Date(this.points[0].x).getUTCFullYear() + '</span><br/>';
                        ret += '<table cellspacing="0" cellpadding="0" style="font-weight:normal">';
                        sorted = this.points.sort(function (a, b) { return b.y - a.y; });
                        for (i = 0; i < sorted.length; i++)
                        {
                            p = sorted[i];
                            if (dec === undefined) dec = (isNaN(p.series.chart.ENVOptions.valueDecimals)) ? self.globals.line.tooltip.decimals : p.series.chart.ENVOptions.valueDecimals;
                            ret += '<tr><td style="font-weight:bold;min-width:30px;color:' + p.series.color + '">' + p.series.name + ':</td>';
                            ret += '<td style="padding-left:8px;color:#000">' + Math.round(p.y * Math.pow(10, dec)) / Math.pow(10, dec) + (p.series.chart.ENVOptions.valueSuffix || '') + '</td></tr>';
                        }
                        return ret + '</table>';
                    }
                },
                series: {
                    colors: ['#000000', '#FF0000', '#FF7C80'],
                    lineWidths: [1, 2],
                    pointOptions: {
                        marker: {
                            enabled: false 
                        }
                    }
                }
            },



            column: {
                tooltip: {
                    color: '#4F81BD',
                    borderColor: '#4F81BD',
                    borderWidth: 1.2,
                    borderRadius: 3,
                    decimals: 0,
                    formatter: function ()
                    {
                        var ret = '';
                        if (this.y === NoDataValue)   
                        {
                            ret += CtrISO3[this.key].Name[StartLanguage] + ": " + (NoDataMessage[StartLanguage] || NoDataMessage['en']);
                        }
                        else
                        {
                            var dec = (isNaN(this.series.chart.ENVOptions.valueDecimals)) ? self.globals.column.tooltip.decimals : this.series.chart.ENVOptions.valueDecimals;
                            ret += (this.series.chart.ENVOptions.tooltipHeader) ? '<span style="color:' + self.globals.column.tooltip.color + '">' + this.series.chart.ENVOptions.tooltipHeader + '</span><br/>' : '';
                            ret += '<span style="color:' + this.point.color + '">' + CtrISO3[this.key].Name[StartLanguage] + ': </span>';
                            ret += '<span style="color:#000;font-weight:normal">' + (Math.round(this.y * Math.pow(10, dec)) / Math.pow(10, dec)).toString() + (this.series.chart.ENVOptions.valueSuffix || '') + '</span>';
                        }
                        return ret;
                    }
                },
                series: {
                    colors: {
                        'default': '#C4BD97',
                        selected: '#FF0000',
                        highlight: '#66FF66',
                        nodata: 'transparent'
                    },
                    pointOptions: {
                        shadow: false,
                        borderRadius: 1,
                        borderWidth: 0,
                        
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
                                if (this.y !== NoDataValue && this.y > this.series.chart.yAxis[0].max)
                                    return '▲';
                                else return '';
                            }
                        }
                    }
                }
            },



            stackedColumn: {
                tooltip: {
                    color: '#4F81BD',
                    borderColor: '#4F81BD',
                    borderWidth: 1.2,
                    borderRadius: 3,
                    decimals: 1,
                    formatter: function ()
                    {
                        var i, p, ret, dec, tot = 0, ic;
                        ic = (this.x === 'OECD') ? 'highlight' : (this.x === SelectedISO) ? 'selected' : 'default';
                        ret = (this.points[0].series.chart.ENVOptions.tooltipHeader) ? '<span style="color:' + self.globals.stackedColumn.tooltip.color + '">' + this.points[0].series.chart.ENVOptions.tooltipHeader + '</span><br/>' : '';
                        ret += '<span style="color:' + self.globals.stackedColumn.series.colors[ic][0] + '">' + CtrISO3[this.x].Name[StartLanguage] + '</span><br/>';
                        ret += '<table cellspacing="0" cellpadding="0" style="font-weight:normal">';
                        for (i = 0; i < this.points.length; i++)
                        {
                            p = this.points[i];
                            if (dec === undefined) dec = (isNaN(p.series.chart.ENVOptions.valueDecimals)) ? self.globals.stackedColumn.tooltip.decimals : p.series.chart.ENVOptions.valueDecimals;
                            ret += '<tr><td style="min-width:30px;color:' + p.series.color + '">' + p.series.name + ':</td>';
                            tot += p.y;
                            ret += '<td style="padding-left:8px;color:#000">' + Math.round(p.y * Math.pow(10, dec)) / Math.pow(10, dec) + (p.series.chart.ENVOptions.valueSuffix || '') + '</td></tr>';
                        }
                        if (this.points.length > 1)
                        {
                            ret += '<tr><td style="font-weight:bold;border-top:1px solid ' + self.globals.stackedColumn.tooltip.color + ';min-width:30px;color:' + self.globals.stackedColumn.tooltip.color + '">Total:</td>';
                            ret += '<td style="font-weight:bold;border-top:1px solid ' + self.globals.stackedColumn.tooltip.color + ';padding-left:8px;color:' + self.globals.stackedColumn.tooltip.color + '">' + Math.round(tot * Math.pow(10, dec)) / Math.pow(10, dec) + (p.series.chart.ENVOptions.valueSuffix || '') + '</td></tr>';
                        }
                        return ret + '</table>';
                    }
                },
                series: {
                    colors: {
                        'default': ['#4A452A', '#C4BD97'],
                        selected: ['#FF0000', '#FFCDCD'],
                        highlight: ['#66FF66', '#CCFFCC'],
                        nodata: 'transparent'
                    }
                }
            },



            styles: {
                title: {
                    color: '#4E81D4',
                    fontSize: '10pt',
                    fontWeight: 'bold'
                },

                axisTitle: {
                    color: '#000000',
                    fontWeight: 'normal',
                    fontSize: '11px'
                },

                axisLabels: {
                    color: '#000000',
                    fontWeight: 'normal'
                }
            }
        };
    })(Charts);


});
