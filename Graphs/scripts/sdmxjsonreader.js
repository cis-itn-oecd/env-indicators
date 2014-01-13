
// Array to retrieve ISO2 code used for region prefix
var ISO3 = { "AUS": { "Name": { "en": "Australia", "fr": "Australie" }, "ISO2": "AU" }, "AUT": { "Name": { "en": "Austria", "fr": "Autriche" }, "ISO2": "AT" }, "BEL": { "Name": { "en": "Belgium", "fr": "Belgique" }, "ISO2": "BE" }, "CAN": { "Name": { "en": "Canada", "fr": "Canada" }, "ISO2": "CA" }, "CHL": { "Name": { "en": "Chile", "fr": "Chili" }, "ISO2": "CL" }, "CZE": { "Name": { "en": "Czech Republic", "fr": "Rép. Tchèque" }, "ISO2": "CZ" }, "DNK": { "Name": { "en": "Denmark", "fr": "Danemark" }, "ISO2": "DK" }, "EST": { "Name": { "en": "Estonia", "fr": "Estonie" }, "ISO2": "EE" }, "FIN": { "Name": { "en": "Finland", "fr": "Finlande" }, "ISO2": "FI" }, "FRA": { "Name": { "en": "France", "fr": "France" }, "ISO2": "FR" }, "DEU": { "Name": { "en": "Germany", "fr": "Allemagne" }, "ISO2": "DE" }, "GRC": { "Name": { "en": "Greece", "fr": "Grèce" }, "ISO2": "GR" }, "HUN": { "Name": { "en": "Hungary", "fr": "Hongrie" }, "ISO2": "HU" }, "ISL": { "Name": { "en": "Iceland", "fr": "Islande" }, "ISO2": "IS" }, "IRL": { "Name": { "en": "Ireland", "fr": "Irlande" }, "ISO2": "IE" }, "ISR": { "Name": { "en": "Israel", "fr": "Israël" }, "ISO2": "IL" }, "ITA": { "Name": { "en": "Italy", "fr": "Italie" }, "ISO2": "IT" }, "JPN": { "Name": { "en": "Japan", "fr": "Japon" }, "ISO2": "JP" }, "KOR": { "Name": { "en": "Korea", "fr": "Corée" }, "ISO2": "KR" }, "LUX": { "Name": { "en": "Luxembourg", "fr": "Luxembourg" }, "ISO2": "LU" }, "MEX": { "Name": { "en": "Mexico", "fr": "Mexique" }, "ISO2": "MX" }, "NLD": { "Name": { "en": "Netherlands", "fr": "Pays-Bas" }, "ISO2": "NL" }, "NZL": { "Name": { "en": "New Zealand", "fr": "N. Zélande" }, "ISO2": "NZ" }, "NOR": { "Name": { "en": "Norway", "fr": "Norvège" }, "ISO2": "NO" }, "POL": { "Name": { "en": "Poland", "fr": "Pologne" }, "ISO2": "PL" }, "PRT": { "Name": { "en": "Portugal", "fr": "Portugal" }, "ISO2": "PT" }, "SVK": { "Name": { "en": "Slovak Republic", "fr": "Rép. Slovaque" }, "ISO2": "SK" }, "SVN": { "Name": { "en": "Slovenia", "fr": "Slovénie" }, "ISO2": "SI" }, "ESP": { "Name": { "en": "Spain", "fr": "Espagne" }, "ISO2": "ES" }, "SWE": { "Name": { "en": "Sweden", "fr": "Suède" }, "ISO2": "SE" }, "CHE": { "Name": { "en": "Switzerland", "fr": "Suisse" }, "ISO2": "CH" }, "TUR": { "Name": { "en": "Turkey", "fr": "Turquie" }, "ISO2": "TR" }, "GBR": { "Name": { "en": "United Kingdom", "fr": "Royaume-Uni" }, "ISO2": "GB" }, "USA": { "Name": { "en": "United States", "fr": "États-Unis" }, "ISO2": "US" }, "OTO": { "Name": { "en": "OECD", "fr": "OCDE" }, "ISO2": "OECD" }, "OECD": { "Name": { "en": "OECD", "fr": "OCDE" }, "ISO2": "OECD" } };



// Load Json, transform data, and display
// Last param can be array of functions
function sdmxLoadJson(file, dataTreatmentCallback, dataDisplayCallbacks) {
    if (file) {
        $.getJSON(file, function (data) {
            if (dataTreatmentCallback && dataDisplayCallbacks) {
                var d = dataTreatmentCallback(data);
                if ($.isArray(dataDisplayCallbacks)) {
                    for (var i = 0; i < dataDisplayCallbacks.length; i++) {
                        if ($.isFunction(dataDisplayCallbacks[i])) dataDisplayCallbacks[i](d);
                    }
                }
                else {
                    if ($.isFunction(dataDisplayCallbacks)) dataDisplayCallbacks(d);
                }
            }
        });
    }
}


// Given raw json data, a selection of observations, the key part of the dimension to browse,
// returns an array of coordinate objects ordered accordingly to given key parts  !!Only tested ordered on one key part for the moment!!
// (options: 
// tree: if true returns arrays in arrays instead of one single array (default)  !!not tested!!
// desc: array of boolean to put to true for each key part of which order descending instead of ascending (default))   !!not tested!!
//
// Example for "REG" dim in pos 0: getCoords(sdmxjson, 
//                                           {"0:1:0:10": 1.2, "1:1:0:9": 0.8, "2:1:0:8": 0.5},
//                                           0,
//                                           [3]) 
//           returns:        [ {id: "R2", name: "Region_N°2"}, {id: "R1", name: "Region_N°1"}, {id: "R0", name: "Region_N°0"} ]
//
function smdxGetCoords(data, oObs, keyPart, orderOnKeyParts, opt) {
    var ret = [], t, last, kp, v;
    opt = opt || {};
    orderOnKeyParts = orderOnKeyParts || [keyPart];
    var dim = data.structure.dimensions.observation.filter(function (o) { return o.keyPosition == keyPart; })[0];
    for (var i = 0; i < orderOnKeyParts.length; i++) {
        t = [];
        for (var k in oObs) {
            v = parseInt(k.split(":")[keyPart]);
            kp = parseInt(k.split(":")[orderOnKeyParts[i]]);
            if ((opt.tree && !t.length)
                || (!opt.tree && !ret.length)
                || last < kp) {

                if (opt.tree) t.push(dim.values[v]);
                else ret.push(dim.values[v]);
                last = kp;
            }
            else {
                if (opt.tree) t.unshift(dim.values[v]);
                else ret.unshift(dim.values[v]);
            }
        }
        if (opt.desc === true || $.isArray(opt.desc) && opt.desc[i]) t = t.reverse();
        if (orderOnKeyParts.length > 1 && opt.tree) ret.push(t);
    }
    return ret;
}


// Given a selection of observations,
// returns an array of observations ordered accordingly to given key parts  !!Only works for one key part for the moment!!
// (options: 
// tree: if true returns arrays in arrays instead of one single array (default)   !!not tested!!
// desc: array of boolean to put to true for each key part of which order descending instead of ascending (default))   !!not tested!!
//
// Example: GetValues( {"0:1:0:10": 1.2, "1:1:0:9": 0.8, "2:1:0:8": 0.5},
//                     [3]) 
//           returns:        [ 0.5, 0.8, 1.2 ]
//
function sdmxGetValues(oObs, orderOnKeyParts, opt) {
    var ret = [], t, last, kp, v;
    opt = opt || {};
    orderOnKeyParts = orderOnKeyParts || [0];
    for (var i = 0; i < orderOnKeyParts.length; i++) {
        t = [];
        for (var k in oObs) {
            v = oObs[k];
            if ($.isArray(v)) v = v[0];
            kp = parseInt(k.split(":")[orderOnKeyParts[i]]);
            if ((opt.tree && !t.length) 
                || (!opt.tree && !ret.length)
                || last < kp) {

                if (opt.tree) t.push(v);
                else ret.push(v);
                last = kp;
            }
            else {
                if (opt.tree) t.unshift(v);
                else ret.unshift(v);
            }
        }
        if (opt.desc === true || $.isArray(opt.desc) && opt.desc[i]) t = t.reverse();
        if (orderOnKeyParts.length > 1 && opt.tree) ret.push(t);
    }

    return ret;
}


// Given raw json data and a array of boolean functions (o: current object, v: a value, i: index)
// Returns an object array of possible observations
// (option: noNull: if true, retrieves only non null values)
//
// Example: getObs(sdmxjson,
//                 [ function (o, v, i) { return $inArray(o.id, ["REG1", "REG2", "REG3"]) > -1; },  // REG is REG1, REG2 or REG3
//                   function (o, v, i) { return o.id == "GDP_AVG_GROWTH"; },                       // VAR is GDP_AVG_GROWTH
//                   function (o, v, i) { return o.id == "MIN"; },                                  // POS id MIN
//                   function (o, v, i) { return i == 0; } ],                                       // TIME_PERIOD is the first in list
//                   true)                                                                          // No null values
// returns:   { "0:1:1:0": 0.5, "1:1:1:0": 5.5, "2:1:1:0": 4.4 }
//
function sdmxGetObs(data, coordFilterFns, resultsMapFn) {
    var dim, obss = data.structure.dimensions.observation, t = [];
    // TIME_PERIOD has no keyPosition member...
    var tp = obss.filter(function (o) { return o.id === 'TIME_PERIOD'; })[0];
    if (tp) tp.keyPosition = $.inArray(tp, obss);
    for (var i = 0; i < obss.length; i++) {
        dim = obss.filter(function (o) {
            return ( o.keyPosition !== undefined && o.keyPosition === i); 
        })[0];
        t.push(sdmxGetObjIndices(dim.values, coordFilterFns[i]));
    }

    var obs = {}, tobs, val;
    // Cross all key parts arrays to make all possible keys
    var keys = (cross = function (arr) {
        if (arr.length === 0) {
            return [];
        }
        else if (arr.length === 1) {
            return arr[0];
        }
        else {
            var ret = [];
            var rest = cross(arr.slice(1));  
            for (var c in rest) {
                for (var i = 0; i < arr[0].length; i++) {
                    ret.push(arr[0][i] + ":" + rest[c]);
                }
            }
            return ret;
        }

    })(t);

    resultsMapFn = resultsMapFn || function (o, k, v) { return v; };
    for (i = 0; i < keys.length; i++) {
        key = keys[i];
        tobs = data.dataSets[0].observations[key];
        var val = resultsMapFn(obs, key, tobs)
        if (tobs && (val || val === 0 || val === null)) {
            obs[key] = val;
        }
    }
    return obs;
}


// Fill missing observations in obj for keyPart from index to index with val 
function sdmxFillBlanks(obj, keyPart, fromIndex, toIndex, val) {
    if (val === undefined) val = null;

    var i, j, kp, flag, nk;
    for (i = fromIndex; i < toIndex; i++) {
        flag = false;
        for (var k in obj) {
            if (parseInt(k.split(":")[keyPart]) == i) {
                flag = true;
                break;
            }
        }
        if (!flag) {
            nk = "";
            for (j = 0; j < keyPart; j++) {
                nk += ":";
            }
            obj[nk + i.toString()] = val;
        }
    } 
    return obj;
}

// Given raw json data, a dimension ID, returns all values objects of the dimension;
// given a key, returns an array of the given key value for each object;
// given a key and a value, returns corresponding the dimension coordinate
function sdmxDimMembers(data, dimid, prop, val) {
    var l = data.structure.dimensions.observation.filter(function (o) { return o.id == dimid; })[0].values;
    if (!prop && !val) return l;
    else if (!val) return smdxGetPropArray(l, prop);
    else return l.filter(function (o) { return o[prop] === val; })[0];
}


// Given an array of objects and a common property name
// returns an array of this property values for each object
function smdxGetPropArray(arr, prop) {
    var i, l = [];
    for (i = 0; i < arr.length; i++)
    {
        if (arr[i][prop]) l.push(arr[i][prop]);
    }
    return l;
}

// Given an array of objects, a property and a value, returns the indices of possible objects
// Given an array of objects and a boolean function with the object, a value and the index as parameters, returns the indices of possible objects
function sdmxGetObjIndices(arr, prop, val)
{
    var i, t = [];
    if (arr && prop)
    {
        if ($.isFunction(prop))
        {
            for (i = 0; i < arr.length; i++)
            {
                if (prop(arr[i], i, val)) t.push(i);
            }
        }
        else if (val)
        {
            for (i = 0; i < arr.length; i++)
            {
                if (arr[i][prop] === val) t.push(i);
            }
        }
    }
    return t;
}


// Given a raw json file, a country id (and optionally a dimid, default "REG")
// returns all regions as dimension coordinates objects array
function getCtryRegions(data, id, dimid) {
    dimid = dimid || 'REG';
    var m = sdmxDimMembers(data, dimid).filter(function (o)
    {
        var id2 = ISO3[id].ISO2;
        return o.id !== id && o.id.indexOf(id2) === 0;
    });
    // Sometimes, ISO2 is wrong... take first 2 letters of ISO3 instead...
    if (m.length == 0) {
        m = sdmxDimMembers(data, dimid).filter(function (o)
        {
            var id2 = id.substr(0, 2);
            return o.id !== id && o.id.indexOf(id2) === 0;
        });
    }
    return m;
}

