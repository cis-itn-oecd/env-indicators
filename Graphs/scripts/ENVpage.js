function GetQueryStringParams(sParam)
{
    var sPageURL, sURLVariables, sParameterName, i;

    sPageURL = window.location.search.substring(1);
    sURLVariables = sPageURL.split('&');
    for (i = 0; i < sURLVariables.length; i++)
    {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sParam)
        {
            return sParameterName[1];
        }
    }
}

function InitPage(pageTitle, callback, cbParams)
{
    var k, s, selected;

    StartLanguage = GetQueryStringParams(QueryStringKeyForLanguage)
        || DefaultLanguage
        || 'en';
    SelectedISO = (GetQueryStringParams(QueryStringKeyForISO)
        || DefaultISO
        || (function () { var first; for (first in CtrISO2) break; return first; })())
        .toUpperCase();

    $(CountryComboJQSelector)
        .empty()
        .change(function ()
        {
            PageChange(callback, cbParams);
        });

    for (k in CtrISO2)
    {
        if (k !== '"OECD')
        {
            s = '';
            if (selected === k) s = 'selected="selected"';
            $(CountryComboJQSelector).append('<option value="' + k + '" ' + s + '>' + CtrISO2[k].Name[StartLanguage] + '</option>');
        }
    }

    $(SurveyTitleJQSelector).text(pageTitle);

    setTimeout(function () { PageChange(callback, cbParams); }, 50);
}

function PageChange(callback, cbParams)
{
    SelectedISO = $(CountryComboJQSelector).val();

    // This is to display country is JQ-selected elements
    $(CountryLabelJQSelector).text(CtrISO2[SelectedISO].Name[StartLanguage]);

    // This is for each page links to remember the country + language
    // WARNING: it replaces the whole querystring by "?c=...&l=..."
    $('a').each(function ()
    {
        $(this).attr('href',
            $(this).attr('href').split('?')[0]
            + '?' + QueryStringKeyForISO + '=' + SelectedISO
            + '&' + QueryStringKeyForLanguage + '=' + StartLanguage);
    });

    if ($.isFunction(callback)) callback(cbParams);
}