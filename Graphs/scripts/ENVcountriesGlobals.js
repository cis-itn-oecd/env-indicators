$(function ()
{

    if ("undefined" === typeof Countries) $.globalEval('var Countries = {};');
    if ("undefined" === typeof CtrISO2) $.globalEval('var CtrISO2 = {};');
    if ("undefined" === typeof CtrISO3) $.globalEval('var CtrISO3 = {};');

    Countries = {
        "ISO2": {
            "AU": {
                "Name": {
                    "en": "Australia",
                    "fr": "Australie"
                },
                "ISO3": "AUS"
            },
            "AT": {
                "Name": {
                    "en": "Austria",
                    "fr": "Autriche"
                },
                "ISO3": "AUT"
            },
            "BE": {
                "Name": {
                    "en": "Belgium",
                    "fr": "Belgique"
                },
                "ISO3": "BEL"
            },
            "CA": {
                "Name": {
                    "en": "Canada",
                    "fr": "Canada"
                },
                "ISO3": "CAN"
            },
            "CL": {
                "Name": {
                    "en": "Chile",
                    "fr": "Chili"
                },
                "ISO3": "CHL"
            },
            "CZ": {
                "Name": {
                    "en": "Czech Republic",
                    "fr": "Rép. Tchèque"
                },
                "ISO3": "CZE"
            },
            "DK": {
                "Name": {
                    "en": "Denmark",
                    "fr": "Danemark"
                },
                "ISO3": "DNK"
            },
            "EE": {
                "Name": {
                    "en": "Estonia",
                    "fr": "Estonie"
                },
                "ISO3": "EST"
            },
            "FI": {
                "Name": {
                    "en": "Finland",
                    "fr": "Finlande"
                },
                "ISO3": "FIN"
            },
            "FR": {
                "Name": {
                    "en": "France",
                    "fr": "France"
                },
                "ISO3": "FRA"
            },
            "DE": {
                "Name": {
                    "en": "Germany",
                    "fr": "Allemagne"
                },
                "ISO3": "DEU"
            },
            "GR": {
                "Name": {
                    "en": "Greece",
                    "fr": "Grèce"
                },
                "ISO3": "GRC"
            },
            "HU": {
                "Name": {
                    "en": "Hungary",
                    "fr": "Hongrie"
                },
                "ISO3": "HUN"
            },
            "IS": {
                "Name": {
                    "en": "Iceland",
                    "fr": "Islande"
                },
                "ISO3": "ISL"
            },
            "IE": {
                "Name": {
                    "en": "Ireland",
                    "fr": "Irlande"
                },
                "ISO3": "IRL"
            },
            "IL": {
                "Name": {
                    "en": "Israel",
                    "fr": "Israël"
                },
                "ISO3": "ISR"
            },
            "IT": {
                "Name": {
                    "en": "Italy",
                    "fr": "Italie"
                },
                "ISO3": "ITA"
            },
            "JP": {
                "Name": {
                    "en": "Japan",
                    "fr": "Japon"
                },
                "ISO3": "JPN"
            },
            "KR": {
                "Name": {
                    "en": "Korea",
                    "fr": "Corée"
                },
                "ISO3": "KOR"
            },
            "LU": {
                "Name": {
                    "en": "Luxembourg",
                    "fr": "Luxembourg"
                },
                "ISO3": "LUX"
            },
            "MX": {
                "Name": {
                    "en": "Mexico",
                    "fr": "Mexique"
                },
                "ISO3": "MEX"
            },
            "NL": {
                "Name": {
                    "en": "Netherlands",
                    "fr": "Pays-Bas"
                },
                "ISO3": "NLD"
            },
            "NZ": {
                "Name": {
                    "en": "New Zealand",
                    "fr": "N. Zélande"
                },
                "ISO3": "NZL"
            },
            "NO": {
                "Name": {
                    "en": "Norway",
                    "fr": "Norvège"
                },
                "ISO3": "NOR"
            },
            "PL": {
                "Name": {
                    "en": "Poland",
                    "fr": "Pologne"
                },
                "ISO3": "POL"
            },
            "PT": {
                "Name": {
                    "en": "Portugal",
                    "fr": "Portugal"
                },
                "ISO3": "PRT"
            },
            "SK": {
                "Name": {
                    "en": "Slovak Republic",
                    "fr": "Rép. Slovaque"
                },
                "ISO3": "SVK"
            },
            "SI": {
                "Name": {
                    "en": "Slovenia",
                    "fr": "Slovénie"
                },
                "ISO3": "SVN"
            },
            "ES": {
                "Name": {
                    "en": "Spain",
                    "fr": "Espagne"
                },
                "ISO3": "ESP"
            },
            "SE": {
                "Name": {
                    "en": "Sweden",
                    "fr": "Suède"
                },
                "ISO3": "SWE"
            },
            "CH": {
                "Name": {
                    "en": "Switzerland",
                    "fr": "Suisse"
                },
                "ISO3": "CHE"
            },
            "TR": {
                "Name": {
                    "en": "Turkey",
                    "fr": "Turquie"
                },
                "ISO3": "TUR"
            },
            "GB": {
                "Name": {
                    "en": "United Kingdom",
                    "fr": "Royaume-Uni"
                },
                "ISO3": "GBR"
            },
            "US": {
                "Name": {
                    "en": "United States",
                    "fr": "États-Unis"
                },
                "ISO3": "USA"
            },
            "OECD": {
                "Name": {
                    "en": "OECD",
                    "fr": "OCDE"
                },
                "ISO3": "OTO"
            }
        },
        "ISO3": {
            "AUS": {
                "Name": {
                    "en": "Australia",
                    "fr": "Australie"
                },
                "ISO2": "AU"
            },
            "AUT": {
                "Name": {
                    "en": "Austria",
                    "fr": "Autriche"
                },
                "ISO2": "AT"
            },
            "BEL": {
                "Name": {
                    "en": "Belgium",
                    "fr": "Belgique"
                },
                "ISO2": "BE"
            },
            "CAN": {
                "Name": {
                    "en": "Canada",
                    "fr": "Canada"
                },
                "ISO2": "CA"
            },
            "CHL": {
                "Name": {
                    "en": "Chile",
                    "fr": "Chili"
                },
                "ISO2": "CL"
            },
            "CZE": {
                "Name": {
                    "en": "Czech Republic",
                    "fr": "Rép. Tchèque"
                },
                "ISO2": "CZ"
            },
            "DNK": {
                "Name": {
                    "en": "Denmark",
                    "fr": "Danemark"
                },
                "ISO2": "DK"
            },
            "EST": {
                "Name": {
                    "en": "Estonia",
                    "fr": "Estonie"
                },
                "ISO2": "EE"
            },
            "FIN": {
                "Name": {
                    "en": "Finland",
                    "fr": "Finlande"
                },
                "ISO2": "FI"
            },
            "FRA": {
                "Name": {
                    "en": "France",
                    "fr": "France"
                },
                "ISO2": "FR"
            },
            "DEU": {
                "Name": {
                    "en": "Germany",
                    "fr": "Allemagne"
                },
                "ISO2": "DE"
            },
            "GRC": {
                "Name": {
                    "en": "Greece",
                    "fr": "Grèce"
                },
                "ISO2": "GR"
            },
            "HUN": {
                "Name": {
                    "en": "Hungary",
                    "fr": "Hongrie"
                },
                "ISO2": "HU"
            },
            "ISL": {
                "Name": {
                    "en": "Iceland",
                    "fr": "Islande"
                },
                "ISO2": "IS"
            },
            "IRL": {
                "Name": {
                    "en": "Ireland",
                    "fr": "Irlande"
                },
                "ISO2": "IE"
            },
            "ISR": {
                "Name": {
                    "en": "Israel",
                    "fr": "Israël"
                },
                "ISO2": "IL"
            },
            "ITA": {
                "Name": {
                    "en": "Italy",
                    "fr": "Italie"
                },
                "ISO2": "IT"
            },
            "JPN": {
                "Name": {
                    "en": "Japan",
                    "fr": "Japon"
                },
                "ISO2": "JP"
            },
            "KOR": {
                "Name": {
                    "en": "Korea",
                    "fr": "Corée"
                },
                "ISO2": "KR"
            },
            "LUX": {
                "Name": {
                    "en": "Luxembourg",
                    "fr": "Luxembourg"
                },
                "ISO2": "LU"
            },
            "MEX": {
                "Name": {
                    "en": "Mexico",
                    "fr": "Mexique"
                },
                "ISO2": "MX"
            },
            "NLD": {
                "Name": {
                    "en": "Netherlands",
                    "fr": "Pays-Bas"
                },
                "ISO2": "NL"
            },
            "NZL": {
                "Name": {
                    "en": "New Zealand",
                    "fr": "N. Zélande"
                },
                "ISO2": "NZ"
            },
            "NOR": {
                "Name": {
                    "en": "Norway",
                    "fr": "Norvège"
                },
                "ISO2": "NO"
            },
            "POL": {
                "Name": {
                    "en": "Poland",
                    "fr": "Pologne"
                },
                "ISO2": "PL"
            },
            "PRT": {
                "Name": {
                    "en": "Portugal",
                    "fr": "Portugal"
                },
                "ISO2": "PT"
            },
            "SVK": {
                "Name": {
                    "en": "Slovak Republic",
                    "fr": "Rép. Slovaque"
                },
                "ISO2": "SK"
            },
            "SVN": {
                "Name": {
                    "en": "Slovenia",
                    "fr": "Slovénie"
                },
                "ISO2": "SI"
            },
            "ESP": {
                "Name": {
                    "en": "Spain",
                    "fr": "Espagne"
                },
                "ISO2": "ES"
            },
            "SWE": {
                "Name": {
                    "en": "Sweden",
                    "fr": "Suède"
                },
                "ISO2": "SE"
            },
            "CHE": {
                "Name": {
                    "en": "Switzerland",
                    "fr": "Suisse"
                },
                "ISO2": "CH"
            },
            "TUR": {
                "Name": {
                    "en": "Turkey",
                    "fr": "Turquie"
                },
                "ISO2": "TR"
            },
            "GBR": {
                "Name": {
                    "en": "United Kingdom",
                    "fr": "Royaume-Uni"
                },
                "ISO2": "GB"
            },
            "USA": {
                "Name": {
                    "en": "United States",
                    "fr": "États-Unis"
                },
                "ISO2": "US"
            },
            "OTO": {
                "Name": {
                    "en": "OECD",
                    "fr": "OCDE"
                },
                "ISO2": "OECD"
            }
        }
    };


    CtrISO2 = Countries.ISO2;
    CtrISO3 = Countries.ISO3;

});