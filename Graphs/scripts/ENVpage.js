// Retrieves query string value for a given key
function GetQueryStringParams(sKey)
{
    var sPageURL, sURLVariables, sParameterName, i;

    sPageURL = window.location.search.substring(1);
    sURLVariables = sPageURL.split('&');
    for (i = 0; i < sURLVariables.length; i++)
    {
        sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] === sKey)
        {
            return sParameterName[1];
        }
    }
}

// Initiates the page
// Language is retrieved 1. from query string or 2. from DefaultLanguage global or 3. 'en'
// Selected country ISO2 code is retrieved 1. from query string or 2. from DefaultISO or 3. first in Country array (see ENVcountriesGlobals.js)
// Builds countries combo with change event
// Sets survey title
// Then calls callback with params
function InitPage(pageTitle, callback, cbParams)
{
    var k, s;

    // Global page variables
    StartLanguage = GetQueryStringParams(QueryStringKeyForLanguage)
        || DefaultLanguage
        || 'en';
    SelectedISO = (GetQueryStringParams(QueryStringKeyForISO)
        || DefaultISO
        || (function () { var first; for (first in CtrISO2) break; return first; })())
        .toUpperCase();

    // Country combo
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
            s = (SelectedISO === k) ? ' selected="selected"' : '';
            $(CountryComboJQSelector).append('<option value="' + k + '"' + s + '>' + CtrISO2[k].Name[StartLanguage] + '</option>');
        }
    }

    // Survey title
    $(SurveyTitleJQSelector).text(pageTitle);

    // Page change calling
    setTimeout(function () { PageChange(callback, cbParams); }, 50);
}

// Changes selected ISO and country name in the CountryLabelJQSelector JQuery selections
// Then calls callback with params
function PageChange(callback, cbParams)
{
    // Global page variable country ISO
    SelectedISO = $(CountryComboJQSelector).val();

    // This is to display country JQUery selection CountryLabelJQSelector 
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

    // Callback
    if ($.isFunction(callback)) callback(cbParams);
}