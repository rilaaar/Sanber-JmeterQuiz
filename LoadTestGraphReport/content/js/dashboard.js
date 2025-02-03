/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 86.34686346863468, "KoPercent": 13.653136531365314};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.8539697542533081, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9285714285714286, 500, 1500, "USERS_TR_UPDATEUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 6"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "USERS_TR_UPDATEUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 9"], "isController": true}, {"data": [0.9615384615384616, 500, 1500, "USERS_TR_DELETEUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 2"], "isController": true}, {"data": [0.6569767441860465, 500, 1500, "LOGIN"], "isController": false}, {"data": [0.6395348837209303, 500, 1500, "LOGOUT USER"], "isController": false}, {"data": [0.2857142857142857, 500, 1500, "USERS_TR_LOGINUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 10"], "isController": true}, {"data": [0.7222222222222222, 500, 1500, "USERS_TR_LOGOUTUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 3"], "isController": true}, {"data": [0.6363636363636364, 500, 1500, "USERS_TR_LOGOUTUSER - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 4"], "isController": true}, {"data": [0.6153846153846154, 500, 1500, "USERS_TR_LOGOUTUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_DELETEUSER - 9"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "USERS_TR_ADDUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 2"], "isController": true}, {"data": [0.9651162790697675, 500, 1500, "UPDATE USER"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 7"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "USERS_TR_ADDUSER - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_ADDUSER - 9"], "isController": true}, {"data": [0.9444444444444444, 500, 1500, "USERS_TR_GETUSERPROFILE - 3"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "USERS_TR_UPDATEUSER - 10"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 4"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "USERS_TR_LOGOUTUSER - 10"], "isController": true}, {"data": [0.9883720930232558, 500, 1500, "ADD USER"], "isController": false}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 1"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 2"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 7"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 8"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 6"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGINUSER - 4"], "isController": true}, {"data": [0.9883720930232558, 500, 1500, "GET USER PROFILE"], "isController": false}, {"data": [0.7222222222222222, 500, 1500, "USERS_TR_LOGINUSER - 3"], "isController": true}, {"data": [0.9285714285714286, 500, 1500, "USERS_TR_GETUSERPROFILE - 9"], "isController": true}, {"data": [0.6818181818181818, 500, 1500, "USERS_TR_LOGINUSER - 2"], "isController": true}, {"data": [0.5769230769230769, 500, 1500, "USERS_TR_LOGINUSER - 1"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "USERS_TR_LOGINUSER - 8"], "isController": true}, {"data": [0.7142857142857143, 500, 1500, "USERS_TR_LOGINUSER - 7"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "USERS_TR_LOGINUSER - 6"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "USERS_TR_LOGINUSER - 5"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "USERS_TR_LOGOUTUSER - 9"], "isController": true}, {"data": [0.42857142857142855, 500, 1500, "USERS_TR_LOGINUSER - 9"], "isController": true}, {"data": [0.2857142857142857, 500, 1500, "USERS_TR_LOGOUTUSER - 8"], "isController": true}, {"data": [0.6428571428571429, 500, 1500, "USERS_TR_LOGOUTUSER - 7"], "isController": true}, {"data": [0.8571428571428571, 500, 1500, "USERS_TR_LOGOUTUSER - 6"], "isController": true}, {"data": [0.7777777777777778, 500, 1500, "USERS_TR_LOGOUTUSER - 5"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_LOGOUTUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_GETUSERPROFILE - 10"], "isController": true}, {"data": [0.9941860465116279, 500, 1500, "DELETE USER"], "isController": false}, {"data": [0.1346153846153846, 500, 1500, "GET AUTH"], "isController": false}, {"data": [0.9444444444444444, 500, 1500, "USERS_TR_UPDATEUSER - 4"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 3"], "isController": true}, {"data": [1.0, 500, 1500, "USERS_TR_UPDATEUSER - 2"], "isController": true}, {"data": [0.9230769230769231, 500, 1500, "USERS_TR_UPDATEUSER - 1"], "isController": true}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 542, 74, 13.653136531365314, 393.522140221402, 240, 1684, 320.0, 468.09999999999997, 1137.5500000000006, 1591.14, 26.59600569213406, 23.512159422690022, 13.768290120957849], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["USERS_TR_UPDATEUSER - 8", 7, 0, 0.0, 391.7142857142857, 310, 504, 397.0, 504.0, 504.0, 504.0, 0.45398534275893376, 0.38406349309293725, 0.3282020153706466], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 7", 7, 0, 0.0, 324.7142857142857, 298, 384, 323.0, 384.0, 384.0, 384.0, 0.4988242000997648, 0.42192677527969785, 0.3608263780018528], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 6", 7, 0, 0.0, 351.57142857142856, 289, 413, 356.0, 413.0, 413.0, 413.0, 0.5116585044952854, 0.43299671990351585, 0.3700387398581975], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 5", 9, 0, 0.0, 430.5555555555556, 308, 1149, 332.0, 1149.0, 1149.0, 1149.0, 0.641254007837549, 0.5428671624510153, 0.46368453865336656], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 9", 7, 0, 0.0, 337.4285714285714, 308, 408, 316.0, 408.0, 408.0, 408.0, 0.4874651810584958, 0.41279487291086353, 0.352541782729805], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 1", 13, 0, 0.0, 356.4615384615385, 255, 914, 315.0, 707.9999999999998, 914.0, 914.0, 0.9455920861216177, 0.6091084839613035, 0.5928419133692173], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 2", 11, 0, 0.0, 317.8181818181818, 250, 408, 312.0, 406.2, 408.0, 408.0, 0.8093591347215069, 0.5205794505555147, 0.5074302387609447], "isController": true}, {"data": ["LOGIN", 86, 28, 32.55813953488372, 343.2674418604652, 244, 807, 316.0, 440.0, 493.14999999999975, 807.0, 5.036898207801336, 5.26436623301511, 2.2456247437624457], "isController": false}, {"data": ["LOGOUT USER", 86, 30, 34.883720930232556, 318.52325581395354, 240, 824, 307.0, 394.4, 447.1499999999999, 824.0, 5.063291139240507, 3.4845773844568737, 2.692288232263762], "isController": false}, {"data": ["USERS_TR_LOGINUSER - 10", 7, 5, 71.42857142857143, 317.8571428571429, 244, 432, 321.0, 432.0, 432.0, 432.0, 0.46973560595893166, 0.3850023277076903, 0.20937573396188433], "isController": true}, {"data": ["USERS_TR_ADDUSER - 10", 7, 0, 0.0, 350.2857142857143, 308, 412, 339.0, 412.0, 412.0, 412.0, 0.4646840148698885, 0.5752798476500266, 0.16686616270578863], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 3", 9, 2, 22.22222222222222, 373.0, 273, 824, 314.0, 824.0, 824.0, 824.0, 0.5411580782875354, 0.3628272315254645, 0.29588710465395945], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 3", 9, 0, 0.0, 345.3333333333333, 284, 427, 320.0, 427.0, 427.0, 427.0, 0.537987925159902, 0.3462246510550541, 0.3372932108912667], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 2", 11, 4, 36.36363636363637, 303.5454545454545, 253, 349, 307.0, 348.8, 349.0, 349.0, 0.8032715057689499, 0.5548877473711114, 0.4332987987439754], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 4", 9, 0, 0.0, 295.6666666666667, 257, 335, 307.0, 335.0, 335.0, 335.0, 0.6632277081798084, 0.425959722733972, 0.4158126842299189], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 1", 13, 5, 38.46153846153846, 300.53846153846155, 252, 376, 303.0, 368.8, 376.0, 376.0, 0.9425754060324826, 0.6550304297781323, 0.493096088312065], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 5", 9, 0, 0.0, 299.66666666666674, 263, 335, 305.0, 335.0, 335.0, 335.0, 0.6554511688879179, 0.4209652201223509, 0.4109371586191829], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 6", 7, 0, 0.0, 300.8571428571429, 249, 350, 309.0, 350.0, 350.0, 350.0, 0.5154259627420661, 0.331704794381857, 0.32314791804727194], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 10", 7, 0, 0.0, 340.14285714285717, 269, 412, 351.0, 412.0, 412.0, 412.0, 0.4692318005094517, 0.30014338802118246, 0.29418634367877733], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 7", 7, 0, 0.0, 301.7142857142857, 252, 407, 299.0, 407.0, 407.0, 407.0, 0.5083145741050032, 0.3265609115169559, 0.31868941071817586], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 8", 7, 0, 0.0, 342.0, 250, 415, 356.0, 415.0, 415.0, 415.0, 0.45977011494252873, 0.2948609400656815, 0.28825431034482757], "isController": true}, {"data": ["USERS_TR_DELETEUSER - 9", 7, 0, 0.0, 332.5714285714286, 256, 472, 299.0, 472.0, 472.0, 472.0, 0.4903677758318739, 0.31503119527145357, 0.3074376094570928], "isController": true}, {"data": ["USERS_TR_ADDUSER - 3", 9, 0, 0.0, 448.44444444444446, 307, 1147, 349.0, 1147.0, 1147.0, 1147.0, 0.5376665272716411, 0.6656073578170739, 0.19999141227074496], "isController": true}, {"data": ["USERS_TR_ADDUSER - 4", 9, 0, 0.0, 324.3333333333333, 275, 427, 317.0, 427.0, 427.0, 427.0, 0.6340260655160267, 0.7851713851708347, 0.2134059087706939], "isController": true}, {"data": ["USERS_TR_ADDUSER - 1", 13, 0, 0.0, 350.69230769230774, 277, 441, 333.0, 441.0, 441.0, 441.0, 0.9394421159127041, 1.1630818443778004, 0.33930571614395144], "isController": true}, {"data": ["USERS_TR_ADDUSER - 2", 11, 0, 0.0, 351.90909090909093, 286, 466, 334.0, 459.6, 466.0, 466.0, 0.8022755451827001, 0.9935139896798191, 0.29330350630880314], "isController": true}, {"data": ["UPDATE USER", 86, 0, 0.0, 384.0813953488371, 271, 1149, 335.0, 461.09999999999997, 715.8999999999972, 1149.0, 5.034834026110883, 4.268437426819273, 3.6402266224167206], "isController": false}, {"data": ["USERS_TR_ADDUSER - 7", 7, 0, 0.0, 338.7142857142857, 310, 412, 329.0, 412.0, 412.0, 412.0, 0.4963834917033045, 0.6139698712948518, 0.17852631718905118], "isController": true}, {"data": ["USERS_TR_ADDUSER - 8", 7, 0, 0.0, 371.42857142857144, 304, 512, 348.0, 512.0, 512.0, 512.0, 0.4526935264825713, 0.5608145249951497, 0.15226619591929122], "isController": true}, {"data": ["USERS_TR_ADDUSER - 5", 9, 0, 0.0, 359.8888888888889, 317, 470, 335.0, 470.0, 470.0, 470.0, 0.6339814032121724, 0.7853224499859115, 0.22467266307410538], "isController": true}, {"data": ["USERS_TR_ADDUSER - 6", 7, 0, 0.0, 326.7142857142857, 297, 397, 306.0, 397.0, 397.0, 397.0, 0.5106507149110009, 0.6318305232346075, 0.17183168587686024], "isController": true}, {"data": ["USERS_TR_ADDUSER - 9", 7, 0, 0.0, 355.4285714285714, 283, 421, 356.0, 421.0, 421.0, 421.0, 0.4835255923188506, 0.5979312012157215, 0.17376700973958692], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 3", 9, 0, 0.0, 386.22222222222223, 258, 931, 311.0, 931.0, 931.0, 931.0, 0.5450251317144068, 0.4611068741294737, 0.2687868081208744], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 10", 7, 0, 0.0, 381.5714285714286, 307, 504, 331.0, 504.0, 504.0, 504.0, 0.4641602015781447, 0.3927359964524899, 0.3353635161792985], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 4", 9, 0, 0.0, 332.44444444444446, 260, 412, 334.0, 412.0, 412.0, 412.0, 0.6402504090488724, 0.5416701865618553, 0.3157484927438287], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 10", 7, 5, 71.42857142857143, 366.42857142857144, 315, 458, 351.0, 458.0, 458.0, 458.0, 0.46757063656402376, 0.3426546531627814, 0.2221743287021575], "isController": true}, {"data": ["ADD USER", 86, 0, 0.0, 358.3953488372095, 275, 1147, 333.5, 436.09999999999997, 467.95, 1147.0, 5.082441936055789, 6.291934301311979, 1.8048601774422317], "isController": false}, {"data": ["USERS_TR_GETUSERPROFILE - 1", 13, 0, 0.0, 321.2307692307692, 248, 471, 311.0, 432.2, 471.0, 471.0, 0.9395100093951001, 0.7953228888126039, 0.46333257299270075], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 2", 11, 0, 0.0, 307.90909090909093, 245, 408, 307.0, 402.6, 408.0, 408.0, 0.8035062089116143, 0.6803123858655954, 0.39626038623082543], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 7", 7, 0, 0.0, 320.0, 274, 373, 301.0, 373.0, 373.0, 373.0, 0.49733570159857904, 0.4189331705150977, 0.24526809502664298], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 8", 7, 0, 0.0, 317.42857142857144, 261, 431, 287.0, 431.0, 431.0, 431.0, 0.4550773631517358, 0.38447942400208035, 0.22442780116369784], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 5", 9, 0, 0.0, 350.5555555555556, 284, 472, 316.0, 472.0, 472.0, 472.0, 0.6349206349206349, 0.5362654320987654, 0.31312003968253965], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 6", 7, 0, 0.0, 296.1428571428571, 249, 329, 301.0, 329.0, 329.0, 329.0, 0.5112474437627812, 0.43143635425796084, 0.25212886630879344], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 4", 9, 0, 0.0, 331.44444444444446, 273, 473, 312.0, 473.0, 473.0, 473.0, 0.6477616237224701, 0.7982453082265726, 0.28887806787102344], "isController": true}, {"data": ["GET USER PROFILE", 86, 0, 0.0, 334.4651162790698, 245, 931, 309.0, 409.9, 470.65, 931.0, 5.098713464160787, 4.3083503475721825, 2.514502245508982], "isController": false}, {"data": ["USERS_TR_LOGINUSER - 3", 9, 2, 22.22222222222222, 389.33333333333337, 267, 807, 332.0, 807.0, 807.0, 807.0, 0.5381487682372639, 0.5945562888663, 0.23981955199115043], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 9", 7, 0, 0.0, 379.85714285714283, 284, 795, 307.0, 795.0, 795.0, 795.0, 0.4860436050548535, 0.40928560269407027, 0.23969923882099708], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 2", 11, 3, 27.272727272727273, 347.3636363636364, 277, 504, 323.0, 484.6000000000001, 504.0, 504.0, 0.8028025105823967, 0.8650938275434243, 0.3579968937016494], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 1", 13, 5, 38.46153846153846, 347.3076923076923, 248, 505, 350.0, 466.99999999999994, 505.0, 505.0, 0.9362621534029528, 0.9492032769175369, 0.4173512333453367], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 8", 7, 4, 57.142857142857146, 381.14285714285717, 276, 772, 306.0, 772.0, 772.0, 772.0, 0.4607991573958265, 0.41554209729445063, 0.2053924815680337], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 7", 7, 2, 28.571428571428573, 319.14285714285717, 246, 471, 308.0, 471.0, 471.0, 471.0, 0.5001428979708488, 0.5337043842883681, 0.22299898185195768], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 6", 7, 1, 14.285714285714286, 335.1428571428571, 271, 420, 334.0, 420.0, 420.0, 420.0, 0.5116585044952854, 0.5883930039836269, 0.2282762133615964], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 5", 9, 2, 22.22222222222222, 336.77777777777777, 276, 472, 311.0, 472.0, 472.0, 472.0, 0.6416197333713552, 0.7082462616739146, 0.2859997683039852], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 9", 7, 4, 57.142857142857146, 272.0, 240, 323, 250.0, 323.0, 323.0, 323.0, 0.4913659974729749, 0.3524152613014179, 0.24369505036501474], "isController": true}, {"data": ["USERS_TR_LOGINUSER - 9", 7, 4, 57.142857142857146, 313.42857142857144, 247, 440, 311.0, 440.0, 440.0, 440.0, 0.49095244774863234, 0.4427339037733203, 0.21890123088792257], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 8", 7, 5, 71.42857142857143, 344.2857142857143, 252, 440, 323.0, 440.0, 440.0, 440.0, 0.46064753882600684, 0.3370670118781258, 0.22846010051987364], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 7", 7, 2, 28.571428571428573, 345.7142857142857, 244, 725, 300.0, 725.0, 725.0, 725.0, 0.5077246681656633, 0.34601492801189526, 0.27291617556393705], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 6", 7, 1, 14.285714285714286, 290.1428571428571, 250, 328, 306.0, 328.0, 328.0, 328.0, 0.5153121319199058, 0.34083354037838637, 0.28770635490282687], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 5", 9, 2, 22.22222222222222, 301.77777777777777, 248, 364, 298.0, 364.0, 364.0, 364.0, 0.6507592190889371, 0.4371582384309472, 0.35581333604483006], "isController": true}, {"data": ["USERS_TR_LOGOUTUSER - 4", 9, 0, 0.0, 304.8888888888889, 256, 408, 282.0, 408.0, 408.0, 408.0, 0.6579428320783683, 0.4239933246216829, 0.3810157220922582], "isController": true}, {"data": ["USERS_TR_GETUSERPROFILE - 10", 7, 0, 0.0, 340.5714285714286, 287, 414, 311.0, 414.0, 414.0, 414.0, 0.46657335199626737, 0.3938014480437246, 0.23009720972472172], "isController": true}, {"data": ["DELETE USER", 86, 0, 0.0, 324.6162790697675, 249, 914, 310.0, 407.3, 414.65, 914.0, 5.0433966690124326, 3.241119993255923, 3.161973302251935], "isController": false}, {"data": ["GET AUTH", 26, 16, 61.53846153846154, 1378.5, 1118, 1684, 1335.5, 1622.1000000000001, 1683.65, 1684.0, 10.412494993992793, 9.120319383259913, 2.9895249299158992], "isController": false}, {"data": ["USERS_TR_UPDATEUSER - 4", 9, 0, 0.0, 409.22222222222223, 271, 937, 335.0, 937.0, 937.0, 937.0, 0.633490532835926, 0.537807066938833, 0.4582083216020271], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 3", 9, 0, 0.0, 371.22222222222223, 277, 498, 352.0, 498.0, 498.0, 498.0, 0.5364487095428265, 0.4543166425761459, 0.3876098043452345], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 2", 11, 0, 0.0, 350.2727272727273, 277, 456, 335.0, 447.40000000000003, 456.0, 456.0, 0.7935935358199264, 0.6741740540004328, 0.5737066905345934], "isController": true}, {"data": ["USERS_TR_UPDATEUSER - 1", 13, 0, 0.0, 443.84615384615387, 305, 960, 375.0, 908.0, 960.0, 960.0, 0.9357903829542182, 0.7965325142168155, 0.6766062526993953], "isController": true}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["401/Unauthorized", 74, 100.0, 13.653136531365314], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 542, 74, "401/Unauthorized", 74, "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["LOGIN", 86, 28, "401/Unauthorized", 28, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["LOGOUT USER", 86, 30, "401/Unauthorized", 30, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["GET AUTH", 26, 16, "401/Unauthorized", 16, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
